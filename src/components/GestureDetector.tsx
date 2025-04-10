
import { useState, useEffect, useCallback } from "react";
import HandPoseDetector, { aslAlphabet } from "@/lib/handpose";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radar } from "lucide-react";
import { toast } from "sonner";

interface GestureDetectorProps {
  onGestureDetected: (gesture: string | null) => void;
  onPhraseDetected: (phrase: string | null) => void;
  isActive: boolean;
}

const GestureDetector = ({ onGestureDetected, onPhraseDetected, isActive }: GestureDetectorProps) => {
  const [initializationStatus, setInitializationStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [detectedGesture, setDetectedGesture] = useState<string | null>(null);
  const [detectionCount, setDetectionCount] = useState(0);

  // Initialize the hand pose detector
  useEffect(() => {
    if (isActive && initializationStatus === 'idle') {
      setInitializationStatus('loading');
      const detector = HandPoseDetector.getInstance();
      
      detector.initialize()
        .then(() => {
          setInitializationStatus('ready');
          toast.success("Hand detection model loaded");
        })
        .catch((error) => {
          console.error("Failed to initialize hand detector:", error);
          setInitializationStatus('error');
          toast.error("Failed to load hand detection model");
        });
    }
  }, [isActive, initializationStatus]);

  // Process video frames for hand detection
  const processFrame = useCallback((video: HTMLVideoElement) => {
    if (initializationStatus !== 'ready') return;

    try {
      const detector = HandPoseDetector.getInstance();
      const hands = detector.detectHands(video);
      
      if (hands && hands.landmarks && hands.landmarks.length > 0) {
        const gesture = detector.predictGesture(hands);
        
        if (gesture !== detectedGesture) {
          setDetectedGesture(gesture);
          onGestureDetected(gesture);
          
          // Increment detection count for debugging
          setDetectionCount(prev => prev + 1);
        }
        
        // Check for phrases after each successful gesture detection
        const phrase = detector.checkForPhrases();
        if (phrase) {
          onPhraseDetected(phrase);
        }
      } else {
        // No hands detected
        if (detectedGesture !== null) {
          setDetectedGesture(null);
          onGestureDetected(null);
        }
      }
    } catch (error) {
      console.error("Error in hand detection:", error);
    }
  }, [detectedGesture, initializationStatus, onGestureDetected, onPhraseDetected]);

  // Expose the processFrame function to window for access from Index.tsx
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).processFrame = processFrame;
    }
    
    // Cleanup function
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).processFrame;
      }
    };
  }, [processFrame]);

  // Split the alphabet into rows for better UI display
  const alphabetRows = [
    aslAlphabet.slice(0, 7),  // A-G
    aslAlphabet.slice(7, 14), // H-N
    aslAlphabet.slice(14, 21), // O-U
    aslAlphabet.slice(21, 28)  // V-Z and special signs
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Radar className="h-5 w-5 text-accent" />
            <h3 className="text-lg font-medium">Gesture Detection</h3>
            <StatusBadge status={initializationStatus} isActive={isActive} />
          </div>
          <div>
            <Badge variant="outline" className="bg-accent/10 text-accent">
              Detections: {detectionCount}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2">
          {alphabetRows.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-7 gap-2">
              {row.map((letter) => (
                <GestureCard
                  key={letter}
                  letter={letter}
                  isActive={detectedGesture === letter}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {isActive && (
        <Card className={`mt-4 ${initializationStatus === 'ready' ? '' : 'opacity-50'}`}>
          <CardContent className="p-4">
            <div className="text-center">
              {initializationStatus === 'loading' ? (
                <p className="text-muted-foreground flex items-center justify-center">
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  Loading detection model...
                </p>
              ) : initializationStatus === 'error' ? (
                <p className="text-destructive">Failed to load hand detection model</p>
              ) : initializationStatus === 'ready' && !detectedGesture ? (
                <p className="text-muted-foreground">Make a gesture with your hand...</p>
              ) : (
                <p className="text-2xl font-semibold">{detectedGesture || ""}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const StatusBadge = ({ status, isActive }: { status: string; isActive: boolean }) => {
  if (!isActive) {
    return <Badge variant="outline" className="bg-muted/30">Inactive</Badge>;
  }

  switch (status) {
    case 'loading':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 animate-pulse">Loading</Badge>;
    case 'ready':
      return <Badge variant="outline" className="bg-green-50 text-green-600">Active</Badge>;
    case 'error':
      return <Badge variant="outline" className="bg-red-50 text-red-600">Error</Badge>;
    default:
      return <Badge variant="outline" className="bg-muted/30">Idle</Badge>;
  }
};

const GestureCard = ({ letter, isActive }: { letter: string; isActive: boolean }) => {
  return (
    <Card className={`gesture-card ${isActive ? 'gesture-active' : ''}`}>
      <CardContent className="p-3 text-center">
        <p className="text-lg font-semibold">{letter}</p>
      </CardContent>
    </Card>
  );
};

export default GestureDetector;
