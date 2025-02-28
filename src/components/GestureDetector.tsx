
import { useState, useEffect, useCallback } from "react";
import HandPoseDetector, { aslAlphabet } from "@/lib/handpose";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radar } from "lucide-react";
import { toast } from "sonner";

interface GestureDetectorProps {
  onGestureDetected: (gesture: string | null) => void;
  isActive: boolean;
}

const GestureDetector = ({ onGestureDetected, isActive }: GestureDetectorProps) => {
  const [initializationStatus, setInitializationStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [detectedGesture, setDetectedGesture] = useState<string | null>(null);

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
  }, [detectedGesture, initializationStatus, onGestureDetected]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Radar className="h-5 w-5 text-accent" />
          <h3 className="text-lg font-medium">Gesture Detection</h3>
          <StatusBadge status={initializationStatus} isActive={isActive} />
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {aslAlphabet.slice(0, 7).map((letter) => (
            <GestureCard
              key={letter}
              letter={letter}
              isActive={detectedGesture === letter}
            />
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
