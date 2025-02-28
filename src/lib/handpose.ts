
import * as tf from '@tensorflow/tfjs';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

// ASL alphabet mappings for hand poses - complete alphabet
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

// Finger joint indexes from MediaPipe Hand landmarks
// Each hand has 21 landmarks, indexed 0-20
const WRIST = 0;
const THUMB_CMC = 1;
const THUMB_MCP = 2;
const THUMB_IP = 3;
const THUMB_TIP = 4;
const INDEX_MCP = 5;
const INDEX_PIP = 6;
const INDEX_DIP = 7;
const INDEX_TIP = 8;
const MIDDLE_MCP = 9;
const MIDDLE_PIP = 10;
const MIDDLE_DIP = 11;
const MIDDLE_TIP = 12;
const RING_MCP = 13;
const RING_PIP = 14;
const RING_DIP = 15;
const RING_TIP = 16;
const PINKY_MCP = 17;
const PINKY_PIP = 18;
const PINKY_DIP = 19;
const PINKY_TIP = 20;

// Singleton to manage the hand landmarker instance
class HandPoseDetector {
  private static instance: HandPoseDetector;
  private handLandmarker: HandLandmarker | null = null;
  private isInitializing = false;
  private initializationPromise: Promise<void> | null = null;
  private gestureBuffer: { gesture: string | null, timestamp: number }[] = [];
  private phraseBuffer: string[] = [];
  private lastPhraseTime = 0;
  private lastPrediction: string | null = null;
  private confidenceThreshold = 0.65; // Minimum confidence for a stable prediction

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
        // Set up TensorFlow.js with WebGL backend for faster processing
        await tf.setBackend('webgl');
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

  // Enhanced gesture recognition function
  public predictGesture(landmarks: any): string | null {
    if (!landmarks || !landmarks.landmarks || landmarks.landmarks.length === 0) {
      // No hands detected - clear recent gesture buffer after a delay
      const currentTime = Date.now();
      // Clean old gestures from buffer (older than 2 seconds)
      this.gestureBuffer = this.gestureBuffer.filter(
        item => currentTime - item.timestamp < 2000
      );
      
      this.lastPrediction = null;
      return null;
    }

    const hand = landmarks.landmarks[0]; // Get the first detected hand
    
    // Calculate features for gesture recognition
    const features = this.extractHandFeatures(hand);
    const predictions: { gesture: string, confidence: number }[] = [];
    
    // Check for gesture A - Fist with thumb pointing up
    if (features.isThumbUp && features.areFingersClosed && !features.isPinkyExtended) {
      predictions.push({ gesture: 'A', confidence: 0.8 * features.thumbExtension });
    }
    
    // Check for gesture B - Flat hand with fingers extended upward
    if (features.areAllFingersExtended && features.fingersClose) {
      predictions.push({ gesture: 'B', confidence: 0.8 * features.fingerExtension });
    }
    
    // Check for gesture C - Curved hand
    if (features.isCurvedHand && !features.areAllFingersExtended) {
      predictions.push({ gesture: 'C', confidence: 0.8 * features.handCurvature });
    }
    
    // Check for gesture D - Index finger up, others curled
    if (features.isIndexExtended && !features.isMiddleExtended && 
        !features.isRingExtended && !features.isPinkyExtended) {
      predictions.push({ gesture: 'D', confidence: 0.8 * features.indexExtension });
    }
    
    // Check for gesture E - Fingers curled, thumb tucked
    if (features.areFingersClosed && !features.isThumbUp) {
      predictions.push({ gesture: 'E', confidence: 0.7 });
    }
    
    // Check for gesture F - Index and thumb connecting, others up
    if (features.isThumbIndexClose && features.isMiddleExtended && 
        features.isRingExtended && features.isPinkyExtended) {
      predictions.push({ gesture: 'F', confidence: 0.75 });
    }
    
    // Check for gesture G - Index pointing forward/sideways, thumb sideways
    if (features.isIndexExtended && !features.isMiddleExtended && features.isThumbSideways) {
      predictions.push({ gesture: 'G', confidence: 0.7 * features.indexExtension });
    }
    
    // Check for gesture H - Index and middle fingers extended together
    if (features.isIndexExtended && features.isMiddleExtended && 
        !features.isRingExtended && !features.isPinkyExtended && features.indexMiddleClose) {
      predictions.push({ gesture: 'H', confidence: 0.75 });
    }
    
    // Check for gesture I - Pinky extended, others closed
    if (features.isPinkyExtended && !features.isIndexExtended && 
        !features.isMiddleExtended && !features.isRingExtended) {
      predictions.push({ gesture: 'I', confidence: 0.8 * features.pinkyExtension });
    }
    
    // Check for gesture J - Like I but with motion (traced J)
    // For static detection, we'll look for pinky extended and some wrist rotation
    if (features.isPinkyExtended && !features.isIndexExtended && 
        !features.isMiddleExtended && !features.isRingExtended && features.isWristRotated) {
      predictions.push({ gesture: 'J', confidence: 0.65 });
    }
    
    // Check for gesture K - Index and middle extended in V, thumb touches middle
    if (features.isIndexExtended && features.isMiddleExtended && 
        !features.isRingExtended && !features.isPinkyExtended && !features.indexMiddleClose) {
      predictions.push({ gesture: 'K', confidence: 0.7 });
    }
    
    // Check for gesture L - Thumb and index form L shape
    if (features.isIndexExtended && !features.isMiddleExtended && 
        !features.isRingExtended && !features.isPinkyExtended && features.isThumbSideways) {
      const lShape = this.isLShape(hand);
      if (lShape) {
        predictions.push({ gesture: 'L', confidence: 0.8 });
      }
    }
    
    // Check for other letters (simplified for this implementation)
    // Add more gesture detections for other letters...
    
    // Find the most confident prediction
    let bestPrediction: { gesture: string, confidence: number } | null = null;
    for (const pred of predictions) {
      if (!bestPrediction || pred.confidence > bestPrediction.confidence) {
        bestPrediction = pred;
      }
    }
    
    // Apply stability filtering - only update prediction if confidence is good
    if (bestPrediction && bestPrediction.confidence > this.confidenceThreshold) {
      this.lastPrediction = bestPrediction.gesture;
      
      // Add to gesture buffer
      this.gestureBuffer.push({
        gesture: bestPrediction.gesture,
        timestamp: Date.now()
      });
      
      // Only keep last 10 gestures
      if (this.gestureBuffer.length > 10) {
        this.gestureBuffer.shift();
      }
      
      return bestPrediction.gesture;
    }
    
    // Return the last stable prediction if no confident new prediction
    return this.lastPrediction;
  }
  
  // Extract hand features for gesture recognition
  private extractHandFeatures(hand: any[]): any {
    const wrist = hand[WRIST];
    const thumbTip = hand[THUMB_TIP];
    const indexTip = hand[INDEX_TIP];
    const middleTip = hand[MIDDLE_TIP];
    const ringTip = hand[RING_TIP];
    const pinkyTip = hand[PINKY_TIP];
    
    // Calculate distances between key points
    const thumbIndexDistance = this.distance(thumbTip, indexTip);
    const indexMiddleDistance = this.distance(indexTip, middleTip);
    const middleRingDistance = this.distance(middleTip, ringTip);
    const ringPinkyDistance = this.distance(ringTip, pinkyTip);
    
    // Calculate finger extensions
    const indexExtension = this.fingerExtension(hand, INDEX_MCP, INDEX_TIP);
    const middleExtension = this.fingerExtension(hand, MIDDLE_MCP, MIDDLE_TIP);
    const ringExtension = this.fingerExtension(hand, RING_MCP, RING_TIP);
    const pinkyExtension = this.fingerExtension(hand, PINKY_MCP, PINKY_TIP);
    const thumbExtension = this.fingerExtension(hand, THUMB_CMC, THUMB_TIP);
    
    // Check if fingers are extended
    const isIndexExtended = indexExtension > 0.6;
    const isMiddleExtended = middleExtension > 0.6;
    const isRingExtended = ringExtension > 0.6;
    const isPinkyExtended = pinkyExtension > 0.6;
    const isThumbUp = thumbTip.y < wrist.y - 0.1 && thumbExtension > 0.5;
    const isThumbSideways = Math.abs(thumbTip.x - wrist.x) > 0.1 && thumbExtension > 0.5;
    
    // Check finger positions relative to each other
    const indexMiddleClose = indexMiddleDistance < 0.06;
    const isThumbIndexClose = thumbIndexDistance < 0.05;
    
    // Check hand shapes
    const areFingersClosed = this.areFingersClosed(hand);
    const areAllFingersExtended = isIndexExtended && isMiddleExtended && 
                                  isRingExtended && isPinkyExtended;
    const fingersClose = indexMiddleDistance < 0.07 && 
                        middleRingDistance < 0.07 && 
                        ringPinkyDistance < 0.07;
    
    const isCurvedHand = this.isCurved(hand);
    const handCurvature = this.calculateHandCurvature(hand);
    const isWristRotated = this.isWristRotated(hand);
    
    return {
      isIndexExtended,
      isMiddleExtended,
      isRingExtended,
      isPinkyExtended,
      isThumbUp,
      isThumbSideways,
      indexMiddleClose,
      isThumbIndexClose,
      areFingersClosed,
      areAllFingersExtended,
      fingersClose,
      isCurvedHand,
      handCurvature,
      isWristRotated,
      indexExtension,
      middleExtension,
      ringExtension,
      pinkyExtension,
      thumbExtension,
      fingerExtension: (indexExtension + middleExtension + ringExtension + pinkyExtension) / 4
    };
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
  
  private fingerExtension(hand: any[], base: number, tip: number): number {
    const basePoint = hand[base];
    const tipPoint = hand[tip];
    const dist = this.distance(basePoint, tipPoint);
    // Normalize by hand size
    const handSize = this.distance(hand[WRIST], hand[MIDDLE_MCP]);
    return dist / handSize;
  }
  
  private areFingersClosed(hand: any[]): boolean {
    const wrist = hand[WRIST];
    const fingertips = [hand[INDEX_TIP], hand[MIDDLE_TIP], hand[RING_TIP], hand[PINKY_TIP]];
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
    const indexKnuckle = hand[INDEX_MCP];
    const middleKnuckle = hand[MIDDLE_MCP];
    const ringKnuckle = hand[RING_MCP];
    const pinkyKnuckle = hand[PINKY_MCP];
    
    // Calculate average y-position of knuckles
    const avgKnuckleY = (indexKnuckle.y + middleKnuckle.y + ringKnuckle.y + pinkyKnuckle.y) / 4;
    
    // Check if fingertips form a curve above the knuckles
    const indexTip = hand[INDEX_TIP];
    const middleTip = hand[MIDDLE_TIP];
    const ringTip = hand[RING_TIP];
    const pinkyTip = hand[PINKY_TIP];
    
    // Ensure tips are above knuckles and form a curve pattern
    return indexTip.y < avgKnuckleY && 
           middleTip.y < avgKnuckleY && 
           ringTip.y < avgKnuckleY && 
           pinkyTip.y < avgKnuckleY &&
           // Check for curved shape (not straight)
           Math.abs(indexTip.y - pinkyTip.y) > 0.05;
  }
  
  private calculateHandCurvature(hand: any[]): number {
    // Calculate a measure of hand curvature for C-shape
    const indexTip = hand[INDEX_TIP];
    const middleTip = hand[MIDDLE_TIP];
    const ringTip = hand[RING_TIP];
    const pinkyTip = hand[PINKY_TIP];
    
    // Calculate variance in y position of fingertips
    const tipYPositions = [indexTip.y, middleTip.y, ringTip.y, pinkyTip.y];
    const avgY = tipYPositions.reduce((a, b) => a + b, 0) / 4;
    const variance = tipYPositions.reduce((acc, y) => acc + Math.pow(y - avgY, 2), 0) / 4;
    
    // Return normalized variance as curvature measure
    return Math.min(variance * 100, 1); // Normalize to 0-1 range
  }
  
  private isWristRotated(hand: any[]): boolean {
    // A simple check for wrist rotation - useful for distinguishing similar gestures
    const wrist = hand[WRIST];
    const middle = hand[MIDDLE_MCP];
    
    return Math.abs(wrist.z - middle.z) > 0.05;
  }
  
  private isLShape(hand: any[]): boolean {
    // Specific check for L shape (thumb and index perpendicular)
    const wrist = hand[WRIST];
    const thumbBase = hand[THUMB_CMC];
    const thumbTip = hand[THUMB_TIP];
    const indexTip = hand[INDEX_TIP];
    
    // Check if thumb is extending horizontally and index vertically
    const isThumbHorizontal = Math.abs(thumbTip.y - thumbBase.y) < 0.05;
    const isIndexVertical = indexTip.y < wrist.y - 0.1;
    
    return isThumbHorizontal && isIndexVertical;
  }
}

export default HandPoseDetector;
