
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Copy, Type } from "lucide-react";
import { toast } from "sonner";

interface LanguageDisplayProps {
  currentGesture: string | null;
}

const LanguageDisplay = ({ currentGesture }: LanguageDisplayProps) => {
  const [text, setText] = useState<string>("");
  const [isComposing, setIsComposing] = useState<boolean>(false);
  
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
  
  const clearText = () => {
    setText("");
    toast.success("Text cleared");
  };
  
  const copyText = () => {
    if (!text) {
      toast.info("No text to copy");
      return;
    }
    
    navigator.clipboard.writeText(text)
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
            <p className="text-lg break-words">
              {text}
              {isComposing && (
                <span className="inline-block w-1 h-5 bg-accent ml-1 animate-pulse-subtle"></span>
              )}
            </p>
          ) : (
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
          disabled={!text}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={copyText}
          disabled={!text}
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Text
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LanguageDisplay;
