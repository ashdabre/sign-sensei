
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Copy, Type, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface LanguageDisplayProps {
  currentGesture: string | null;
  currentPhrase: string | null;
}

const LanguageDisplay = ({ currentGesture, currentPhrase }: LanguageDisplayProps) => {
  const [text, setText] = useState<string>("");
  const [phraseText, setPhraseText] = useState<string>("");
  const [isComposing, setIsComposing] = useState<boolean>(false);
  
  // Handle individual gestures (letters)
  useEffect(() => {
    if (!currentGesture) {
      setIsComposing(false);
      return;
    }
    
    setIsComposing(true);
    
    // Simple logic - in a real app you'd have more sophisticated gesture-to-text conversion
    const timer = setTimeout(() => {
      setIsComposing(false);
      
      if (currentGesture === "Space") {
        setText(prev => prev + " ");
      } else if (currentGesture === "Delete") {
        setText(prev => prev.slice(0, -1));
      } else {
        setText(prev => prev + currentGesture);
      }
    }, 800); // Short delay to avoid rapid text changes
    
    return () => clearTimeout(timer);
  }, [currentGesture]);
  
  // Handle phrases
  useEffect(() => {
    if (currentPhrase) {
      // Add the phrase to the phrase text
      setPhraseText(prev => {
        // Check if the phrase is already at the end of the text to avoid duplicates
        if (prev.trim().endsWith(currentPhrase.trim())) {
          return prev;
        }
        return prev ? `${prev} ${currentPhrase}` : currentPhrase;
      });
      
      // Show a toast when a phrase is detected
      toast.success(`Phrase detected: ${currentPhrase}`, {
        icon: <Sparkles className="h-4 w-4" />
      });
    }
  }, [currentPhrase]);
  
  const clearText = () => {
    setText("");
    setPhraseText("");
    toast.success("Text cleared");
  };
  
  const copyText = () => {
    const combinedText = `${text}\n\n${phraseText}`.trim();
    
    if (!combinedText) {
      toast.info("No text to copy");
      return;
    }
    
    navigator.clipboard.writeText(combinedText)
      .then(() => toast.success("Text copied to clipboard"))
      .catch(() => toast.error("Failed to copy text"));
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl">
          <Type className="w-5 h-5 mr-2 text-accent" />
          Translated Text
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-h-[100px] bg-muted/20 rounded-md p-4 text-left relative">
          {text ? (
            <div>
              <p className="text-lg break-words">
                <span className="text-sm text-muted-foreground">Individual letters:</span><br />
                {text}
                {isComposing && (
                  <span className="inline-block w-1 h-5 bg-accent ml-1 animate-pulse-subtle"></span>
                )}
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              Individual letters will appear here...
            </p>
          )}
          
          {phraseText && (
            <div className="mt-4 pt-4 border-t border-muted">
              <p className="text-sm text-muted-foreground mb-1">Detected phrases:</p>
              <p className="text-lg font-medium break-words">
                {phraseText}
              </p>
            </div>
          )}
          
          {!text && !phraseText && (
            <p className="text-muted-foreground italic">
              Detected text will appear here...
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={clearText}
          disabled={!text && !phraseText}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={copyText}
          disabled={!text && !phraseText}
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Text
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LanguageDisplay;
