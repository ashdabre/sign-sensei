
import { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Camera from "@/components/Camera";
import GestureDetector from "@/components/GestureDetector";
import LanguageDisplay from "@/components/LanguageDisplay";
import Instructions from "@/components/Instructions";
import SignLanguageGuide from "@/components/SignLanguageGuide";

const Index = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [currentGesture, setCurrentGesture] = useState<string | null>(null);
  const [currentPhrase, setCurrentPhrase] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  const handleFrame = useCallback((video: HTMLVideoElement) => {
    // Store the video reference for gesture detection
    videoRef.current = video;
    setIsCameraActive(true);
    
    // Call the processFrame function exported by GestureDetector
    // @ts-ignore - Using window for function access
    if (window.processFrame) {
      window.processFrame(video);
    }
  }, []);
  
  const handleGestureDetected = useCallback((gesture: string | null) => {
    setCurrentGesture(gesture);
  }, []);
  
  const handlePhraseDetected = useCallback((phrase: string | null) => {
    if (phrase) {
      setCurrentPhrase(phrase);
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8 animate-fade-in">
          <div className="mb-2">
            <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium uppercase tracking-wider">
              Assistive Technology
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 sm:text-5xl">
            Sign Sensei
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time sign language detection and translation using computer vision. 
            Make gestures in front of your camera to communicate through sign language.
          </p>
        </header>
        
        <Instructions />
        
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-1-cols md:flex-1">
            <Card className="shadow-md overflow-hidden h-full">
              <CardContent className="p-0">
                <div className="p-6">
                  <Camera onFrame={handleFrame} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex-1-cols md:flex-1">
            <GestureDetector 
              onGestureDetected={handleGestureDetected}
              onPhraseDetected={handlePhraseDetected}
              isActive={isCameraActive}
            />
          </div>
        </div>
        
        <div className="mb-8">
          <LanguageDisplay 
            currentGesture={currentGesture} 
            currentPhrase={currentPhrase} 
          />
        </div>
        
        <div className="mb-8">
          <SignLanguageGuide />
        </div>
        
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Sign Sensei © {new Date().getFullYear()}</p>
          <p className="mt-1">
            A real-time sign language translation tool. Position your hand in front of the camera to begin detecting gestures.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
