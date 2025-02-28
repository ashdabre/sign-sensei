
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { aslAlphabet } from "@/lib/handpose";
import { Info } from "lucide-react";

const gestureImagePaths: Record<string, string> = {
  'A': 'https://www.handspeak.com/word/a/asl-alphabet/a.png',
  'B': 'https://www.handspeak.com/word/b/asl-alphabet/b.png',
  'C': 'https://www.handspeak.com/word/c/asl-alphabet/c.png',
  'D': 'https://www.handspeak.com/word/d/asl-alphabet/d.png',
  'E': 'https://www.handspeak.com/word/e/asl-alphabet/e.png',
  'F': 'https://www.handspeak.com/word/f/asl-alphabet/f.png',
  'G': 'https://www.handspeak.com/word/g/asl-alphabet/g.png',
  'H': 'https://www.handspeak.com/word/h/asl-alphabet/h.png',
  'I': 'https://www.handspeak.com/word/i/asl-alphabet/i.png',
  'J': 'https://www.handspeak.com/word/j/asl-alphabet/j.png',
  'K': 'https://www.handspeak.com/word/k/asl-alphabet/k.png',
  'L': 'https://www.handspeak.com/word/l/asl-alphabet/l.png',
  'M': 'https://www.handspeak.com/word/m/asl-alphabet/m.png',
  'N': 'https://www.handspeak.com/word/n/asl-alphabet/n.png',
  'O': 'https://www.handspeak.com/word/o/asl-alphabet/o.png',
  'P': 'https://www.handspeak.com/word/p/asl-alphabet/p.png',
  'Q': 'https://www.handspeak.com/word/q/asl-alphabet/q.png',
  'R': 'https://www.handspeak.com/word/r/asl-alphabet/r.png',
  'S': 'https://www.handspeak.com/word/s/asl-alphabet/s.png',
  'T': 'https://www.handspeak.com/word/t/asl-alphabet/t.png',
  'U': 'https://www.handspeak.com/word/u/asl-alphabet/u.png',
  'V': 'https://www.handspeak.com/word/v/asl-alphabet/v.png',
  'W': 'https://www.handspeak.com/word/w/asl-alphabet/w.png',
  'X': 'https://www.handspeak.com/word/x/asl-alphabet/x.png',
  'Y': 'https://www.handspeak.com/word/y/asl-alphabet/y.png',
  'Z': 'https://www.handspeak.com/word/z/asl-alphabet/z.png',
  'Space': 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=150&h=150&fit=crop',
  'Delete': 'https://images.unsplash.com/photo-1616628188506-4a13c4d04cb9?w=150&h=150&fit=crop'
};

// Fallback image URL
const fallbackImageUrl = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=150&h=150&fit=crop";

const gestureDescriptions: Record<string, string> = {
  'A': 'Fist with thumb pointing up',
  'B': 'Flat hand with fingers together, thumb tucked',
  'C': 'Hand curved in C shape',
  'D': 'Index finger pointing up, thumb and other fingers form circle',
  'E': 'Fingers curled in, thumb tucked against palm',
  'F': 'Index finger and thumb connected, other fingers up',
  'G': 'Index finger pointing forward, thumb to side',
  'H': 'Index and middle fingers extended together',
  'I': 'Pinky finger extended, others curled',
  'J': 'Pinky extended, trace J in the air',
  'K': 'Index finger and middle finger form V, thumb touches middle finger',
  'L': 'L shape with thumb and index finger',
  'M': 'Three fingers folded over thumb',
  'N': 'Two fingers folded over thumb',
  'O': 'Fingertips and thumb form circle',
  'P': 'Index finger pointing down, thumb to side',
  'Q': 'Index finger and thumb pointing down',
  'R': 'Index and middle fingers crossed',
  'S': 'Fist with thumb over fingers',
  'T': 'Index finger tucked between thumb and index',
  'U': 'Index and middle finger extended together',
  'V': 'Index and middle finger in V shape',
  'W': 'Three fingers extended',
  'X': 'Index finger bent at middle joint',
  'Y': 'Thumb and pinky extended, other fingers curled',
  'Z': 'Index finger traces Z in air',
  'Space': 'Flat hand moving horizontally',
  'Delete': 'Hand brushing backward'
};

const GestureReference = () => {
  const [activeTab, setActiveTab] = useState("letters-a-g");
  
  // Group letters for tabs
  const letterGroups = [
    { id: "letters-a-g", label: "A-G", letters: aslAlphabet.slice(0, 7) },
    { id: "letters-h-n", label: "H-N", letters: aslAlphabet.slice(7, 14) },
    { id: "letters-o-u", label: "O-U", letters: aslAlphabet.slice(14, 21) },
    { id: "letters-v-z", label: "V-Z+", letters: aslAlphabet.slice(21) }
  ];

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-md border-accent/20 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
        <CardTitle className="flex items-center">
          <Info className="w-5 h-5 mr-2 text-accent" />
          ASL Gesture Reference
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            {letterGroups.map(group => (
              <TabsTrigger key={group.id} value={group.id}>
                {group.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {letterGroups.map(group => (
            <TabsContent key={group.id} value={group.id}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {group.letters.map(letter => (
                  <Card key={letter} className="overflow-hidden hover:shadow-md transition-shadow duration-300 border-accent/10">
                    <CardContent className="p-0">
                      <div className="relative aspect-square bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
                        <img 
                          src={gestureImagePaths[letter] || fallbackImageUrl} 
                          alt={`ASL sign for ${letter}`}
                          className="object-contain w-full h-full p-2"
                          onError={(e) => {
                            // Fallback if image fails to load
                            (e.target as HTMLImageElement).src = fallbackImageUrl;
                          }}
                        />
                      </div>
                      <div className="p-3 bg-white">
                        <h3 className="text-lg font-semibold text-center mb-1">{letter}</h3>
                        <p className="text-sm text-muted-foreground">{gestureDescriptions[letter]}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GestureReference;
