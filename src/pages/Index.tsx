
import { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Camera from "@/components/Camera";
import GestureDetector from "@/components/GestureDetector";
import LanguageDisplay from "@/components/LanguageDisplay";
import Instructions from "@/components/Instructions";
import SignLanguageGuide from "@/components/SignLanguageGuide";
import GestureReference from "@/components/GestureReference";

// Define processFrame on Window interface to fix TypeScript error
declare global {
  interface Window {
    processFrame?: (video: HTMLVideoElement) => void;
  }
}

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
    <div className="min-h-screen bg-gradient-to-br from-[#f6f7f9] to-[#e6e9f0] flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-7xl mx-auto">
      <header className="text-center mb-8 animate-fade-in">
  <div className="mb-2">
    <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium uppercase tracking-wider">
      Assistive Technology
    </span>
  </div>
  <h1 className="text-4xl font-bold tracking-tight mb-2 sm:text-5xl bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent flex items-center justify-center gap-4">
    <img 
      src="/logo.png" 
      alt="Sign Sensei logo" 
      className="w-24 h-24 sm:w-28 sm:h-28 rounded mt-2"

    />
    Sign Sensei
  </h1>
  <p className="text-muted-foreground max-w-2xl mx-auto">
    Real-time sign language detection and translation using computer vision. 
    Make gestures in front of your camera to communicate through sign language.
  </p>
</header>

        
        <Instructions />
        
        {/* Increased camera size by adjusting the flex layout and container size */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="w-full lg:w-3/4">
            <Card className="shadow-lg rounded-xl overflow-hidden h-full border-accent/20">
              <CardContent className="p-0">
                <div className="p-4">
                  <Camera onFrame={handleFrame} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full lg:w-1/4">
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
          <GestureReference />
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
