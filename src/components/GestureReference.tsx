
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ASL fingerspelling alphabet gestures with descriptive details
const gestureImages = [
  { id: "a", letter: "A", description: "Fist with thumb on the side" },
  { id: "b", letter: "B", description: "Flat hand with fingers together, thumb tucked" },
  { id: "c", letter: "C", description: "Curved hand forming a C shape" },
  { id: "d", letter: "D", description: "Curved index finger with thumb and other fingers together" },
  { id: "e", letter: "E", description: "Curled fingers, thumb tucked in" },
  { id: "f", letter: "F", description: "Index and thumb in circle, other fingers up" },
  { id: "g", letter: "G", description: "Index and thumb in L, pointing forward" },
  { id: "h", letter: "H", description: "Index and middle finger extended together" },
  { id: "i", letter: "I", description: "Pinky extended, other fingers closed" },
  { id: "j", letter: "J", description: "Pinky extended, drawn in a 'J' motion" },
  { id: "k", letter: "K", description: "Index finger, middle finger and thumb up" },
  { id: "l", letter: "L", description: "Index finger and thumb extended forming an L" },
  { id: "m", letter: "M", description: "Three fingers folded over thumb" },
  { id: "n", letter: "N", description: "Two fingers folded over thumb" },
  { id: "o", letter: "O", description: "Fingers and thumb forming an O shape" },
  { id: "p", letter: "P", description: "Index finger extended downward from a K shape" },
  { id: "q", letter: "Q", description: "Index finger and thumb downward" },
  { id: "r", letter: "R", description: "Crossed index and middle fingers" },
  { id: "s", letter: "S", description: "Fist with thumb over fingers" },
  { id: "t", letter: "T", description: "Index finger between thumb and index" },
  { id: "u", letter: "U", description: "Index and middle finger extended together" },
  { id: "v", letter: "V", description: "Index and middle finger in V shape" },
  { id: "w", letter: "W", description: "Index, middle, and ring finger extended" },
  { id: "x", letter: "X", description: "Index finger bent at the first joint" },
  { id: "y", letter: "Y", description: "Thumb and pinky extended, other fingers closed" },
  { id: "z", letter: "Z", description: "Index finger drawing a Z shape" },
];

const GestureReference = () => {
  return (
    <div>
      <Card className="border-accent/10 shadow-md mb-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <span className="bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">
              ASL Gesture Reference
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Reference guide for American Sign Language (ASL) fingerspelling alphabet gestures recognized by the system.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {gestureImages.map((gesture) => (
              <div key={gesture.id} className="gesture-card rounded-lg border p-2 hover:shadow-md transition-all">
                <div className="aspect-square rounded-md overflow-hidden bg-accent/5 flex items-center justify-center mb-2">
                  <img 
                    src={`/images/asl/${gesture.id}.svg`} 
                    alt={`ASL sign for letter ${gesture.letter}`} 
                    className="h-full w-full object-contain p-2"
                    onError={(e) => {
                      // Fallback if image doesn't load
                      const target = e.target as HTMLImageElement;
                      target.src = `/placeholder.svg`;
                      target.alt = `Placeholder for letter ${gesture.letter}`;
                    }}
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{gesture.letter}</h3>
                  <p className="text-xs text-muted-foreground">{gesture.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GestureReference;
