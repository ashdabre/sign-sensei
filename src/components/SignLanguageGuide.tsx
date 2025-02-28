
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, AlignLeft, MessageSquare } from "lucide-react";

const AlphabetGuide = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {[
        { letter: 'A', description: 'Fist with thumb pointing up' },
        { letter: 'B', description: 'Flat hand with fingers together, thumb across palm' },
        { letter: 'C', description: 'Curved hand forming a C shape' },
        { letter: 'D', description: 'Index finger pointing up, thumb touching other fingers' },
        { letter: 'E', description: 'Fingers curled, thumb tucked under fingers' },
        { letter: 'F', description: 'Index & thumb touching, other fingers up' },
        { letter: 'G', description: 'Index pointing forward, thumb to side' },
        { letter: 'H', description: 'Index & middle finger extended together, thumb to side' },
        { letter: 'I', description: 'Pinky finger up, others closed' },
        { letter: 'J', description: 'Like I, but draw J in air with pinky' },
        { letter: 'K', description: 'Index, middle finger & thumb up forming a K' },
        { letter: 'L', description: 'L shape with thumb and index finger' },
      ].map(item => (
        <Card key={item.letter} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="text-center mb-2">
              <span className="text-3xl font-bold">{item.letter}</span>
            </div>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const CommonPhrasesGuide = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { phrase: 'Hello', signs: 'Flat hand, fingers together, wave at wrist' },
          { phrase: 'Thank you', signs: 'Touch lips with flat hand, move away and down' },
          { phrase: 'Please', signs: 'Rub flat hand on chest in circular motion' },
          { phrase: 'Yes', signs: 'Make a fist and nod it like a head nodding' },
          { phrase: 'No', signs: 'Thumb, index, middle fingers out, tap together' },
          { phrase: 'Help', signs: 'Closed fist on one hand, other palm lifting it up' },
          { phrase: 'Sorry', signs: 'Make fist with thumb up, rub in circular motion on chest' },
          { phrase: 'Love', signs: 'Cross arms over chest, hands in fists' },
          { phrase: 'Want', signs: 'Hands open, palms up, pull toward body' },
          { phrase: 'Need', signs: 'Bent hands, one over the other, pulling down twice' },
        ].map(item => (
          <Card key={item.phrase} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="font-semibold text-lg mb-1">{item.phrase}</div>
              <p className="text-sm text-muted-foreground">{item.signs}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const LearningResources = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Online Learning</h3>
        <ul className="space-y-2">
          <li>
            <a 
              href="https://www.lifeprint.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              ASL University (Lifeprint)
            </a>
            <p className="text-sm text-muted-foreground">Free ASL resource for beginners</p>
          </li>
          <li>
            <a 
              href="https://www.handspeak.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Handspeak
            </a>
            <p className="text-sm text-muted-foreground">Visual dictionary of ASL signs</p>
          </li>
          <li>
            <a 
              href="https://www.signingtime.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Signing Time
            </a>
            <p className="text-sm text-muted-foreground">Great resources for teaching children</p>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Mobile Apps</h3>
        <ul className="space-y-2">
          <li>
            <span className="font-medium">The ASL App</span>
            <p className="text-sm text-muted-foreground">Dictionary of signs with video tutorials</p>
          </li>
          <li>
            <span className="font-medium">SignSchool</span>
            <p className="text-sm text-muted-foreground">Interactive ASL learning tools</p>
          </li>
          <li>
            <span className="font-medium">ASL Dictionary</span>
            <p className="text-sm text-muted-foreground">Comprehensive sign language reference</p>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Practice Tips</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li>Practice fingerspelling daily to build muscle memory</li>
          <li>Watch videos with ASL interpretation to learn natural signing flow</li>
          <li>Find a practice partner or join an ASL meetup group</li>
          <li>Record yourself signing and compare with reference videos</li>
          <li>Focus on facial expressions - they're a crucial part of ASL grammar</li>
        </ul>
      </div>
    </div>
  );
};

const SignLanguageGuide = () => {
  const [activeTab, setActiveTab] = useState("alphabet");
  
  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-accent" />
          Sign Language Guide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="alphabet" className="flex items-center">
              <AlignLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Alphabet</span>
              <span className="sm:hidden">ABC</span>
            </TabsTrigger>
            <TabsTrigger value="phrases" className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Common Phrases</span>
              <span className="sm:hidden">Phrases</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Learning Resources</span>
              <span className="sm:hidden">Learn</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="alphabet">
            <AlphabetGuide />
          </TabsContent>
          
          <TabsContent value="phrases">
            <CommonPhrasesGuide />
          </TabsContent>
          
          <TabsContent value="resources">
            <LearningResources />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SignLanguageGuide;
