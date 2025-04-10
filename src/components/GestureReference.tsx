import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ASL fingerspelling alphabet gestures with descriptive details and image URLs
const gestureImages = [
  { letter: "A", description: "Fist with thumb on the side", image: "https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/a.gif" },
  { letter: "B", description: "Flat hand with fingers together, thumb tucked", image: "https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/b.gif" },
  { letter: "C", description: "Curved hand forming a C shape", image: "https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/c.gif" },
  { letter: "D", description: "Index finger pointing up, thumb touching middle finger", image: "https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/d.gif" },
  { letter: "E", description: "Fingers curled, thumb touching tips of fingers", image: "https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/e.gif" },
  { letter: "F", description: "Index and thumb touching to form a circle, other fingers extended", image: "https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/f.gif" },
  { letter: "G", description: "Index and thumb extended parallel, other fingers folded", image: "https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/g.gif" },
  { letter: "H", description: "Index and middle fingers extended together, other fingers folded", image: "https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/h.gif" },
  { letter: "I", description: "Pinky finger extended, other fingers folded", image: "https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/i.gif" },
  { letter: "J", description: "Pinky finger extended, drawing a 'J' shape", image: "https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/j.gif" },
  { letter: "K", description: "Index and middle fingers extended in a 'V' shape, thumb between them", image: "https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/k.gif" },
  { letter: "L", description: "Thumb and index finger extended to form an 'L'", image: "https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/l.gif" },
  { letter: "M", description: "Thumb under three fingers", image: "https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/m.gif" },
  { letter: "N", description: "Thumb under two fingers", image: "https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/n.gif" },
  { letter: "O", description: "All fingers and thumb touching to form an 'O'", image: "https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/o.gif" },
  { letter: "P", description: "Like 'K' but pointing downward", image: "https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/p.gif" },
  { letter: "Q", description: "Like 'G' but pointing downward", image: "https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/q.gif" },
  { letter: "R", description: "Index and middle fingers crossed", image: "https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/r.gif" },
  { letter: "S", description: "Fist with thumb across fingers", image: "https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/s.gif" },
  { letter: "T", description: "Thumb between index and middle fingers", image: "https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/t.gif" },
  { letter: "U", description: "Index and middle fingers together and extended", image: "https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/u.gif" },
  { letter: "V", description: "Index and middle fingers extended to form a 'V'", image: "https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/v.gif" },
  { letter: "W", description: "Index, middle, and ring fingers extended", image: "https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/w.gif" },
  { letter: "X", description: "Index finger bent", image: "https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/x.gif" },
  { letter: "Y", description: "Thumb and pinky extended", image: "https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/y.gif" },
  { letter: "Z", description: "Index finger drawing a 'Z' shape", image: "https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/z.gif" },
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
              <div key={gesture.letter} className="gesture-card rounded-lg border p-2 hover:shadow-md transition-all">
                <div className="aspect-square rounded-md overflow-hidden bg-accent/5 flex items-center justify-center mb-2">
                  <img 
                    src={gesture.image} 
                    alt={`ASL sign for letter ${gesture.letter}`} 
                    className="h-full w-full object-contain p-2"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{gesture.letter}</h3>
                  <p className="text::contentReference[oaicite:0]{index=0}"></p>
 
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
