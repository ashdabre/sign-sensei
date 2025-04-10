
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Camera as CameraIcon, Video, VideoOff } from "lucide-react";

interface CameraProps {
  onFrame: (video: HTMLVideoElement) => void;
}

const Camera = ({ onFrame }: CameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      streamRef.current = stream;
      
      // Set the video element's source to the camera stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsActive(true);
        
        // Start the animation frame loop for hand detection
        startDetection();
        
        toast.success("Camera started successfully");
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Failed to access camera. Please check permissions.");
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    // Stop the animation frame
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // Stop all tracks in the stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Clear the video element's source
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsActive(false);
    toast.success("Camera stopped");
  };

  const startDetection = () => {
    const detectFrame = () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        onFrame(videoRef.current);
      }
      animationRef.current = requestAnimationFrame(detectFrame);
    };
    
    animationRef.current = requestAnimationFrame(detectFrame);
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <Card className={`relative overflow-hidden w-full aspect-video camera-container max-w-full ${isActive ? 'detection-active' : ''}`}>
        <CardContent className="p-0">
          <video
            ref={videoRef}
            className="w-full h-full object-cover bg-gradient-to-br from-[#89f7fe] to-[#66a6ff]"
            playsInline
            muted
          />
          {!isActive && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
              <CameraIcon className="w-20 h-20 text-white/80" />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        {!isActive ? (
          <Button
            onClick={startCamera}
            disabled={isLoading}
            size="lg"
            className="px-6 bg-gradient-to-r from-accent to-purple-500 hover:from-accent/90 hover:to-purple-600 shadow-md"
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Connecting...
              </>
            ) : (
              <>
                <Video className="mr-2 h-4 w-4" />
                Start Camera
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={stopCamera}
            variant="destructive"
            size="lg"
            className="px-6 shadow-md"
          >
            <VideoOff className="mr-2 h-4 w-4" />
            Stop Camera
          </Button>
        )}
      </div>
    </div>
  );
};

export default Camera;
