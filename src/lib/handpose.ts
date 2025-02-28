import * as tf from '@tensorflow/tfjs';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

// ASL alphabet mappings for hand poses
export const aslAlphabet = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z', 'Space', 'Delete'
];

// Common ASL words and phrases
export const aslPhrases = {
  'HELLO': 'Hello',
  'GOODBYE': 'Goodbye',
  'THANK': 'Thank you',
  'PLEASE': 'Please',
  'YES': 'Yes',
  'NO': 'No',
  'HELP': 'Help',
  'SORRY': 'Sorry',
  'LOVE': 'Love',
  'WANT': 'Want',
  'NEED': 'Need',
  'HOW': 'How are you?',
  'NAME': 'What is your name?',
  'MY NAME': 'My name is',
  'NICE MEET': 'Nice to meet you',
  'LEARN': 'I am learning sign language',
  'UNDERSTAND': 'I understand',
  'NOT UNDERSTAND': 'I don\'t understand',
  'AGAIN': 'Please repeat'
};

// Singleton to manage the hand landmarker instance
class HandPoseDetector {
  private static instance: HandPoseDetector;
  private handLandmarker: HandLandmarker | null = null;
  private isInitializing = false;
  private initializationPromise: Promise<void> | null = null;
  private lastDetectedGestures: string[] = [];
  private gestureBuffer: { gesture: string | null, timestamp: number }[] = [];
  private phraseBuffer: string[] = [];
  private lastPhraseTime = 0;

  private constructor() {}

  public static getInstance(): HandPoseDetector {
    if (!HandPoseDetector.instance) {
      HandPoseDetector.instance = new HandPoseDetector();
    }
    return HandPoseDetector.instance;
  }

  public async initialize(): Promise<void> {
    if (this.handLandmarker) {
      return Promise.resolve();
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.isInitializing = true;
    
    this.initializationPromise = new Promise<void>(async (resolve, reject) => {
      try {
        // Initialize TensorFlow.js
        await tf.ready();
        
        // Initialize MediaPipe HandLandmarker
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        
        this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1,
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5
        });
        
        this.isInitializing = false;
        resolve();
      } catch (error) {
        this.isInitializing = false;
        this.initializationPromise = null;
        reject(error);
      }
    });
    
    return this.initializationPromise;
  }

  public detectHands(video: HTMLVideoElement): any {
    if (!this.handLandmarker) {
      return null;
    }
    
    // Get the hand landmarks from the video frame
    const result = this.handLandmarker.detectForVideo(video, performance.now());
    return result;
  }

  // Improved gesture recognition function
  public predictGesture(landmarks: any): string | null {
    if (!landmarks || !landmarks.landmarks || landmarks.landmarks.length === 0) {
      // No hands detected - clear recent gesture buffer after a delay
      const currentTime = Date.now();
      // Clean old gestures from buffer (older than 2 seconds)
      this.gestureBuffer = this.gestureBuffer.filter(
        item => currentTime - item.timestamp < 2000
      );
      
      return null;
    }

    const hand = landmarks.landmarks[0]; // Get the first detected hand
    
    // Extract key landmark points
    const wrist = hand[0];
    const thumbTip = hand[4];
    const indexTip = hand[8];
    const middleTip = hand[12];
    const ringTip = hand[16];
    const pinkyTip = hand[20];
    
    // Calculate distances between key points
    const thumbIndexDistance = this.distance(thumbTip, indexTip);
    const indexMiddleDistance = this.distance(indexTip, middleTip);
    const middleRingDistance = this.distance(middleTip, ringTip);
    const ringPinkyDistance = this.distance(ringTip, pinkyTip);
    
    // Improved gesture detection logic
    let detectedGesture: string | null = null;
    
    // A - Fist with thumb pointing up
    if (thumbTip.y < wrist.y - 0.1 && 
        this.areFingersClosed(hand) &&
        indexTip.y > wrist.y - 0.05) {
      detectedGesture = 'A';
    }
    // B - All fingers extended upward, close together
    else if (indexTip.y < wrist.y - 0.15 && 
             middleTip.y < wrist.y - 0.15 && 
             ringTip.y < wrist.y - 0.15 && 
             pinkyTip.y < wrist.y - 0.15 &&
             indexMiddleDistance < 0.06 &&
             middleRingDistance < 0.06 &&
             ringPinkyDistance < 0.06) {
      detectedGesture = 'B';
    }
    // C - Curved hand forming C shape
    else if (this.distance(thumbTip, pinkyTip) < 0.2 &&
             thumbTip.x < pinkyTip.x &&
             this.isCurved(hand)) {
      detectedGesture = 'C';
    }
    // More gesture detections can be added here
    
    // Add current gesture to buffer with timestamp
    if (detectedGesture) {
      this.gestureBuffer.push({
        gesture: detectedGesture,
        timestamp: Date.now()
      });
      
      // Only keep last 10 gestures
      if (this.gestureBuffer.length > 10) {
        this.gestureBuffer.shift();
      }
    }
    
    return detectedGesture;
  }
  
  // Check if gestures form a word/phrase
  public checkForPhrases(): string | null {
    // Only check for phrases every 3 seconds
    const currentTime = Date.now();
    if (currentTime - this.lastPhraseTime < 3000) {
      return null;
    }
    
    // Get last 5 gestures in order
    const recentGestures = this.gestureBuffer
      .slice(-5)
      .map(item => item.gesture)
      .filter(gesture => gesture !== null) as string[];
    
    if (recentGestures.length === 0) return null;
    
    // Convert gestures to a string to check against phrases
    const gestureSequence = recentGestures.join('');
    
    // Check if the sequence matches or contains any phrase keys
    for (const [key, value] of Object.entries(aslPhrases)) {
      // Simple check: if the key is contained in our sequence
      if (gestureSequence.includes(key)) {
        this.lastPhraseTime = currentTime;
        this.phraseBuffer.push(value);
        // Only keep last 5 phrases
        if (this.phraseBuffer.length > 5) {
          this.phraseBuffer.shift();
        }
        return value;
      }
    }
    
    return null;
  }
  
  // Get the latest detected phrases as a sentence
  public getCurrentSentence(): string {
    return this.phraseBuffer.join(' ');
  }
  
  // Utility functions
  private distance(a: {x: number, y: number}, b: {x: number, y: number}): number {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }
  
  private areFingersClosed(hand: any[]): boolean {
    const wrist = hand[0];
    const fingertips = [hand[8], hand[12], hand[16], hand[20]];
    let closedFingers = 0;
    
    // Check if fingertips are close to palm
    fingertips.forEach(tip => {
      const distToWrist = this.distance(tip, wrist);
      if (distToWrist < 0.2) closedFingers++;
    });
    
    return closedFingers >= 3; // Consider fingers closed if at least 3 are close to palm
  }
  
  private isCurved(hand: any[]): boolean {
    // Check if the hand is forming a curve (C shape)
    const indexKnuckle = hand[5];
    const middleKnuckle = hand[9];
    const ringKnuckle = hand[13];
    const pinkyKnuckle = hand[17];
    
    // Calculate average y-position of knuckles
    const avgKnuckleY = (indexKnuckle.y + middleKnuckle.y + ringKnuckle.y + pinkyKnuckle.y) / 4;
    
    // Check if fingertips form a curve above the knuckles
    const indexTip = hand[8];
    const middleTip = hand[12];
    const ringTip = hand[16];
    const pinkyTip = hand[20];
    
    // Ensure tips are above knuckles and form a curve pattern
    return indexTip.y < avgKnuckleY && 
           middleTip.y < avgKnuckleY && 
           ringTip.y < avgKnuckleY && 
           pinkyTip.y < avgKnuckleY &&
           // Check for curved shape (not straight)
           Math.abs(indexTip.y - pinkyTip.y) > 0.05;
  }
}

export default HandPoseDetector;
