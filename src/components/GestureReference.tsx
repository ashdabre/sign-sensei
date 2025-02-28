
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { aslAlphabet } from "@/lib/handpose";
import { Info } from "lucide-react";

const gestureImagePaths: Record<string, string> = {
  'A': '/images/asl/A.png',
  'B': '/images/asl/B.png',
  'C': '/images/asl/C.png',
  'D': '/images/asl/D.png',
  'E': '/images/asl/E.png',
  'F': '/images/asl/F.png',
  'G': '/images/asl/G.png',
  'H': '/images/asl/H.png',
  'I': '/images/asl/I.png',
  'J': '/images/asl/J.png',
  'K': '/images/asl/K.png',
  'L': '/images/asl/L.png',
  'M': '/images/asl/M.png',
  'N': '/images/asl/N.png',
  'O': '/images/asl/O.png',
  'P': '/images/asl/P.png',
  'Q': '/images/asl/Q.png',
  'R': '/images/asl/R.png',
  'S': '/images/asl/S.png',
  'T': '/images/asl/T.png',
  'U': '/images/asl/U.png',
  'V': '/images/asl/V.png',
  'W': '/images/asl/W.png',
  'X': '/images/asl/X.png',
  'Y': '/images/asl/Y.png',
  'Z': '/images/asl/Z.png',
  'Space': '/images/asl/space.png',
  'Delete': '/images/asl/delete.png'
};

// Fallback image URL
const fallbackImageUrl = "/placeholder.svg";

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
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Info className="w-5 h-5 mr-2 text-accent" />
          ASL Gesture Reference
        </CardTitle>
      </CardHeader>
      <CardContent>
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
                  <Card key={letter} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative aspect-square bg-muted/20">
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
                      <div className="p-3">
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
