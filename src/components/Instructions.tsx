
import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Instructions = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="w-full shadow-sm mb-6 animate-fade-in">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl flex items-center">
            <HelpCircle className="w-5 h-5 mr-2 text-accent" />
            How to Use Sign Sensei
          </CardTitle>
          <CardDescription>
            Learn how to interact with the sign language detector
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 px-2"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      {isExpanded && (
        <CardContent className="animate-slide-up pt-0">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm">Step 1: Enable Camera</h4>
              <p className="text-sm text-muted-foreground">
                Click the "Start Camera" button to activate your device's camera.
                You'll need to grant permission when prompted.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm">
                Step 2: Position Your Hand
              </h4>
              <p className="text-sm text-muted-foreground">
                Place your hand in the center of the frame with good lighting.
                Make sure your hand is clearly visible against the background.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm">Step 3: Make Gestures</h4>
              <p className="text-sm text-muted-foreground">
                Form ASL alphabet signs with your hand. Hold each sign steady
                for a moment for better recognition.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm">Tips for Better Results</h4>
              <ul className="text-sm text-muted-foreground list-disc pl-5">
                <li>Use good lighting - avoid shadows on your hand</li>
                <li>
                  Keep your hand in the center of the frame at a comfortable
                  distance
                </li>
                <li>
                  Make deliberate, clear gestures and hold them for a second
                </li>
                <li>
                  Try different angles if a particular sign isn't being
                  recognized
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default Instructions;
