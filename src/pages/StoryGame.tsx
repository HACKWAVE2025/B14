import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ChatBot } from "@/components/ChatBot";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Trophy,
  Star,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// --- NEW GAME CONFIG ---
const API_BASE_URL = "http://localhost:5000";
const STORY_GAME_ID = "PHISHING_STORY_1"; // Unique ID for this specific game

// --- INTERFACES (Existing & Updated) ---
interface Choice {
  text: string;
  next: number;
  isCorrect?: boolean;
}

interface Frame {
  image: string;
  dialogue: string;
  speaker?: string;
  imagePrompt: string;
}

interface Scene {
  id: number;
  title: string;
  frames: Frame[];
  choices: Choice[];
  feedback?: string;
  isEnd?: boolean;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
// ------------------------------------

const StoryGame = () => {
  const navigate = useNavigate();
  const [gamePhase, setGamePhase] = useState<"story" | "quiz" | "results">(
    "story"
  );
  const [currentScene, setCurrentScene] = useState(0);
  const [storyScore, setStoryScore] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [storyChoices, setStoryChoices] = useState<number[]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [showChoices, setShowChoices] = useState(false);

  // NEW STATE: For handling score submission and API reward response
  const [rewardData, setRewardData] = useState<{
    reward: number | null;
    xpEarned: number | null;
    success: boolean;
    message: string;
  } | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "submitting" | "complete" | "error"
  >("idle");

  // Preload all story images
  const storyImages = import.meta.glob("@/assets/story/*.png", {
    eager: true,
    as: "url",
  });

  // Navigation handlers
  const handleNextFrame = () => {
    const scene = scenes[currentScene];
    if (currentFrameIndex < scene.frames.length - 1) {
      setCurrentFrameIndex(currentFrameIndex + 1);
    } else {
      // All frames shown, show choices
      setShowChoices(true);
    }
  };

  const handlePrevFrame = () => {
    if (currentFrameIndex > 0) {
      setCurrentFrameIndex(currentFrameIndex - 1);
      setShowChoices(false);
    }
  };

  // ... (rest of scenes and quizQuestions arrays remain unchanged)
  const scenes: Scene[] = [
    // ... (scenes content from original file)
    {
      id: 0,
      title: "The Unexpected Email",
      frames: [
        {
          image: "📧",
          speaker: "Narrator",
          dialogue:
            "It's a regular Tuesday morning. You're having coffee and checking your emails...",
          imagePrompt:
            "Comic style: A person sitting at a desk with a laptop, holding a coffee mug, morning sunlight coming through window, relaxed atmosphere, warm colors",
        },
        {
          image: "⚠️",
          speaker: "Email Alert",
          dialogue:
            "URGENT: Account Security Alert - Action Required Immediately!",
          imagePrompt:
            "Comic style: Close-up of laptop screen showing an alarming email with red warning symbols, urgent text, dramatic lighting, tension-filled composition",
        },
        {
          image: "😰",
          speaker: "You",
          dialogue:
            "What?! Suspicious activity? My account will be suspended in 24 hours?!",
          imagePrompt:
            "Comic style: Person looking shocked and worried at their laptop screen, hand on face in concern, sweat drops, dramatic expression, concerned body language",
        },
        {
          image: "🤔",
          speaker: "Narrator",
          dialogue:
            "The email claims to be from your bank. It has their logo and looks professional. What will you do?",
          imagePrompt:
            "Comic style: Split panel showing the official-looking email with bank logo on one side and the person thinking deeply with question marks around their head on the other side",
        },
      ],
      choices: [
        {
          text: "Click the link in the email to verify my account",
          next: 1,
          isCorrect: false,
        },
        {
          text: "Call the bank using the number on their official website",
          next: 2,
          isCorrect: true,
        },
        {
          text: "Reply to the email asking for more details",
          next: 3,
          isCorrect: false,
        },
      ],
    },
    {
      id: 1,
      title: "The Fake Website",
      frames: [
        {
          image: "👆",
          speaker: "You",
          dialogue:
            "I better click this link quickly before my account gets suspended!",
          imagePrompt:
            "Comic style: Close-up of finger clicking a mouse button, urgent action, motion lines showing speed, dramatic angle",
        },
        {
          image: "🌐",
          speaker: "Narrator",
          dialogue:
            "The page loads. It looks exactly like your bank's website... but wait...",
          imagePrompt:
            "Comic style: Browser window showing a banking website that looks professional but the URL bar shows 'bankofindia-secure.com' with a subtle red glow around it",
        },
        {
          image: "🔍",
          speaker: "You",
          dialogue:
            "Hmm... the URL says 'bankofindia-secure.com' instead of 'bankofindia.com'...",
          imagePrompt:
            "Comic style: Person squinting at screen, examining the URL bar closely, suspicious expression, detective-like pose with hand on chin",
        },
        {
          image: "🔑",
          speaker: "Website",
          dialogue:
            "Please enter your Username, Password, and OTP to verify your identity.",
          imagePrompt:
            "Comic style: Login form on screen with three input fields glowing ominously, asking for sensitive information, dark shadows creating suspicious atmosphere",
        },
      ],
      feedback:
        "Warning! This was a phishing attempt. The link led to a fake website designed to steal your credentials.",
      choices: [
        {
          text: "Enter my credentials - the site looks legitimate",
          next: 4,
          isCorrect: false,
        },
        {
          text: "Close the browser and report this to my bank",
          next: 5,
          isCorrect: true,
        },
        {
          text: "Enter fake credentials to test if it's real",
          next: 6,
          isCorrect: false,
        },
      ],
    },
    {
      id: 2,
      title: "The Verification Call",
      frames: [
        {
          image: "📱",
          speaker: "You",
          dialogue:
            "Let me call the bank directly using the number from their official website, not from this email.",
          imagePrompt:
            "Comic style: Person holding smartphone, looking at bank's official website on laptop, careful and methodical approach, bright thoughtful expression",
        },
        {
          image: "☎️",
          speaker: "Bank Representative",
          dialogue:
            "Hello! Thank you for calling. Let me check your account... I can confirm there is NO suspicious activity.",
          imagePrompt:
            "Comic style: Split screen showing friendly bank representative with headset on one side and relieved customer on phone on the other side, professional office setting",
        },
        {
          image: "✅",
          speaker: "Bank Representative",
          dialogue:
            "We did NOT send any email about account suspension. This was a phishing attempt. Your account is completely safe.",
          imagePrompt:
            "Comic style: Bank representative looking at computer screen showing secure account status with green checkmarks, reassuring professional atmosphere",
        },
        {
          image: "😌",
          speaker: "Bank Representative",
          dialogue:
            "Thank you for being vigilant and verifying with us directly! You did exactly the right thing.",
          imagePrompt:
            "Comic style: Customer looking relieved and proud, thumbs up gesture, positive energy, bright colors showing success and safety",
        },
      ],
      feedback:
        "Excellent decision! You successfully avoided a phishing scam by verifying through official channels.",
      choices: [
        {
          text: "Report the phishing email to the bank",
          next: 7,
          isCorrect: true,
        },
        { text: "Delete the email and move on", next: 8, isCorrect: false },
      ],
    },
    {
      id: 3,
      title: "The Scammer's Response",
      frames: [
        {
          image: "✉️",
          speaker: "You",
          dialogue:
            "I'll reply asking if this is really from the bank. That seems safe enough...",
          imagePrompt:
            "Comic style: Person typing a reply email with concerned expression, questioning look, sitting at desk with laptop",
        },
        {
          image: "📨",
          speaker: "Narrator",
          dialogue:
            "Just 3 minutes later, another email arrives. The response is instant... too instant.",
          imagePrompt:
            "Comic style: Email notification popping up with dramatic speed lines, clock showing only 3 minutes passed, fast-paced action feel",
        },
        {
          image: "⚠️",
          speaker: "Scammer Email",
          dialogue:
            "FINAL WARNING! Only 2 HOURS remaining! Click HERE IMMEDIATELY or your account will be permanently closed!",
          imagePrompt:
            "Comic style: Aggressive email with red text, multiple exclamation marks, urgent warning symbols, pressure tactics visible, threatening tone",
        },
        {
          image: "😟",
          speaker: "Narrator",
          dialogue:
            "By replying, you've confirmed your email is active. The scammer now knows you're engaging...",
          imagePrompt:
            "Comic style: Dark figure at computer with evil grin, seeing reply notification, adding email to active targets list, sinister atmosphere",
        },
      ],
      feedback:
        "Replying to suspicious emails can confirm your email address is active, leading to more scam attempts.",
      choices: [
        {
          text: "Ignore and delete all emails from this sender",
          next: 7,
          isCorrect: true,
        },
        {
          text: "Click the link to get it over with",
          next: 4,
          isCorrect: false,
        },
      ],
    },
    {
      id: 4,
      title: "Account Compromised!",
      frames: [
        {
          image: "💻",
          speaker: "You",
          dialogue:
            "Okay, I'll just enter my details quickly to get this sorted out...",
          imagePrompt:
            "Comic style: Person typing credentials into fake website, unsuspecting expression, normal lighting before disaster strikes",
        },
        {
          image: "⚡",
          speaker: "Narrator",
          dialogue:
            "The moment you hit enter, your information is instantly captured by the scammers...",
          imagePrompt:
            "Comic style: Data streaming from screen through internet cables to dark hooded figure, digital theft in action, electric blue data streams",
        },
        {
          image: "📱",
          speaker: "Phone Notification",
          dialogue:
            "*PING* Transaction: -₹45,000. *PING* Transaction: -₹15,000. *PING* Transaction: -₹30,000...",
          imagePrompt:
            "Comic style: Phone screen showing multiple transaction notifications in red, money flying away, shocked person's face reflected in screen",
        },
        {
          image: "🚨",
          speaker: "Narrator",
          dialogue:
            "Within hours, ₹45,000 has been stolen. The scammers have your username, password, OTP, and more...",
          imagePrompt:
            "Comic style: Bank account screen showing negative balance, red alerts everywhere, person with head in hands in despair, dramatic dark lighting",
        },
      ],
      feedback:
        "This was the worst possible outcome. Never enter credentials on suspicious websites!",
      isEnd: true,
      choices: [],
    },
    {
      id: 5,
      title: "Crisis Averted",
      frames: [
        {
          image: "❌",
          speaker: "You",
          dialogue:
            "This doesn't feel right. That URL is wrong. I'm closing this immediately!",
          imagePrompt:
            "Comic style: Hand clicking X button to close browser window, decisive action, determined expression, taking control",
        },
        {
          image: "📞",
          speaker: "You",
          dialogue: "I need to report this to my bank right away!",
          imagePrompt:
            "Comic style: Person dialing phone urgently but calmly, responsible action, good citizenship, bright determined look",
        },
        {
          image: "🛡️",
          speaker: "Bank Security",
          dialogue:
            "Thank you for reporting this! We've added extra security monitoring to your account. You're completely safe.",
          imagePrompt:
            "Comic style: Security shield icon on screen with green checkmarks, protected account interface, safe and secure atmosphere with blue protective glow",
        },
        {
          image: "🏆",
          speaker: "Bank Security",
          dialogue:
            "Your report helps us alert other customers. You potentially saved many others from this scam!",
          imagePrompt:
            "Comic style: Multiple people being protected by a digital shield, community safety, hero moment, bright triumphant colors and grateful expressions",
        },
      ],
      feedback: "Perfect! You took all the right steps to protect yourself.",
      isEnd: true,
      choices: [],
    },
    {
      id: 6,
      title: "Tracked by Scammers",
      frames: [
        {
          image: "😏",
          speaker: "You",
          dialogue:
            "I'll be clever and enter fake information. That'll show them!",
          imagePrompt:
            "Comic style: Person with smug expression typing fake credentials, thinking they're outsmarting scammers, false confidence",
        },
        {
          image: "📊",
          speaker: "Narrator",
          dialogue:
            "But the scammers don't care if the credentials are fake. They now know your email is active and you engage with scams...",
          imagePrompt:
            "Comic style: Scammer's screen showing email marked as 'ACTIVE TARGET' added to list, analytics showing user engagement, sinister glow",
        },
        {
          image: "📨",
          speaker: "Narrator",
          dialogue: "Over the next few days...",
          imagePrompt:
            "Comic style: Calendar pages flipping rapidly, time passing, building suspense",
        },
        {
          image: "😫",
          speaker: "You",
          dialogue:
            "Why am I getting 20+ scam emails every day now? Lottery wins, crypto investments, urgent packages...",
          imagePrompt:
            "Comic style: Inbox flooded with dozens of scam emails, person overwhelmed looking at screen, email notifications everywhere, chaos and frustration",
        },
      ],
      feedback:
        "Never engage with phishing sites, even to test them. This marks you as a potential target.",
      isEnd: true,
      choices: [],
    },
    {
      id: 7,
      title: "Cyber Hero",
      frames: [
        {
          image: "📧",
          speaker: "You",
          dialogue:
            "I should forward this phishing email to my bank's security team.",
          imagePrompt:
            "Comic style: Person forwarding email to bank security, responsible action, civic duty, focused determined expression",
        },
        {
          image: "🔍",
          speaker: "Bank Security Team",
          dialogue:
            "Thank you! We're analyzing this scam and will alert all our customers immediately.",
          imagePrompt:
            "Comic style: Security team examining the phishing email on large monitors, professional security operations center, serious focused work",
        },
        {
          image: "📢",
          speaker: "Narrator",
          dialogue:
            "Within hours, the bank sends alerts to all 2 million customers warning them about this exact scam.",
          imagePrompt:
            "Comic style: Alert messages being sent out to thousands of phones and computers, broadcast waves spreading across city, mass communication",
        },
        {
          image: "🏆",
          speaker: "Narrator",
          dialogue:
            "Your quick action potentially saved thousands of people from losing their money. You're a cyber hero!",
          imagePrompt:
            "Comic style: Hero pose silhouette with cape made of digital shield, protecting crowd of grateful people below, triumphant heroic colors, inspirational scene",
        },
      ],
      feedback:
        "Outstanding! Reporting scams helps protect the entire community.",
      isEnd: true,
      choices: [],
    },
    {
      id: 8,
      title: "Missed Opportunity",
      frames: [
        {
          image: "🗑️",
          speaker: "You",
          dialogue:
            "Well, I'm safe now. I'll just delete this email and move on with my day.",
          imagePrompt:
            "Comic style: Person clicking delete button, casual dismissive attitude, moving on quickly, neutral colors",
        },
        {
          image: "📱",
          speaker: "Narrator",
          dialogue:
            "Meanwhile, the same scam email is being sent to thousands of other people...",
          imagePrompt:
            "Comic style: Thousands of identical phishing emails flying through digital space like a swarm, spreading across the internet, ominous view",
        },
        {
          image: "😰",
          speaker: "Narrator",
          dialogue:
            "Without reports, the bank doesn't know about this scam. Some of those people will fall victim...",
          imagePrompt:
            "Comic style: Split screen showing different people receiving the email - some looking worried, some about to click, vulnerable unaware expressions",
        },
        {
          image: "⚡",
          speaker: "Narrator",
          dialogue:
            "A simple report could have warned everyone and shut down the operation. Always report scams!",
          imagePrompt:
            "Comic style: Ghosted/faded image of what could have been - warning alerts protecting people, contrast between reality and missed opportunity",
        },
      ],
      feedback:
        "Always report phishing attempts - you could help save others from becoming victims.",
      isEnd: true,
      choices: [],
    },
  ];

  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question:
        "What is the FIRST thing you should do when receiving an urgent email from your bank?",
      options: [
        "Click the link immediately to protect your account",
        "Verify by contacting the bank through their official channels",
        "Forward the email to friends to ask their opinion",
        "Reply to the email asking if it's legitimate",
      ],
      correctAnswer: 1,
      explanation:
        "Always verify suspicious emails by contacting the organization directly through official channels (phone number on their website, official app, etc.). Never use contact information provided in the suspicious email.",
    },
    {
      id: 2,
      question: "What is a common red flag in phishing emails?",
      options: [
        "Personalized greeting with your name",
        "Links to the official website",
        "Urgent language and threats of account closure",
        "Professional email formatting",
      ],
      correctAnswer: 2,
      explanation:
        "Phishing emails often use urgent language, threats, and time pressure to make you act without thinking. Legitimate organizations rarely threaten immediate account closure.",
    },
    {
      id: 3,
      question: "How can you identify a fake website URL?",
      options: [
        "By checking if it has HTTPS",
        "By looking for slight misspellings or extra characters in the domain",
        "By seeing if it has a professional design",
        "By checking if it asks for a password",
      ],
      correctAnswer: 1,
      explanation:
        "Scammers often create URLs that look similar to legitimate ones but with slight variations (e.g., 'bankofindia-secure.com' instead of 'bankofindia.com'). Always check the domain name carefully.",
    },
    {
      id: 4,
      question:
        "What should you do if you accidentally entered your credentials on a phishing site?",
      options: [
        "Wait and see if anything happens",
        "Delete your browser history",
        "Immediately change your password and contact your bank",
        "Install antivirus software",
      ],
      correctAnswer: 2,
      explanation:
        "If you've entered credentials on a phishing site, act immediately: change your passwords, contact your bank/organization, enable 2FA if available, and monitor your accounts closely.",
    },
    {
      id: 5,
      question: "Why is it important to report phishing attempts?",
      options: [
        "To get a reward from the bank",
        "It's not important, just delete them",
        "To help authorities shut down scams and protect others",
        "To receive security updates",
      ],
      correctAnswer: 2,
      explanation:
        "Reporting phishing attempts helps organizations alert other customers, track scam patterns, and work with authorities to shut down these operations. Your report could save many others from becoming victims.",
    },
  ];

  const handleChoice = (choice: Choice) => {
    setShowFeedback(true);
    setShowChoices(false);
    setStoryChoices([...storyChoices, currentScene]);

    if (choice.isCorrect) {
      setStoryScore(storyScore + 20);
      toast({
        title: "Good Choice!",
        description: "You made a smart decision.",
      });
    } else {
      toast({
        title: "Be Careful!",
        description: "That wasn't the best choice. Learn from this!",
        variant: "destructive",
      });
    }

    setTimeout(() => {
      setShowFeedback(false);
      setCurrentFrameIndex(0);
      if (scenes[choice.next].isEnd) {
        setTimeout(() => {
          setGamePhase("quiz");
        }, 2000);
      }
      setCurrentScene(choice.next);
    }, 2000);
  };

  const handleQuizAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    const isCorrect =
      answerIndex === quizQuestions[currentQuizQuestion].correctAnswer;
    if (isCorrect) {
      setQuizScore(quizScore + 20);
      toast({
        title: "Correct!",
        description: "+20 points",
      });
    } else {
      toast({
        title: "Incorrect",
        description: "Review the explanation below",
        variant: "destructive",
      });
    }

    setTimeout(() => {
      if (currentQuizQuestion < quizQuestions.length - 1) {
        setCurrentQuizQuestion(currentQuizQuestion + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        setGamePhase("results");
      }
    }, 3000);
  };

  const totalScore = storyScore + quizScore;
  const maxScore = 200;
  const percentage = (totalScore / maxScore) * 100;

  // --- NEW LOGIC: Submit Score to Backend ---
  useEffect(() => {
    // Only run this logic once when the game transitions to the 'results' phase
    if (gamePhase === "results" && submissionStatus === "idle") {
      const submitScore = async () => {
        setSubmissionStatus("submitting");
        const authToken = localStorage.getItem("authToken");

        if (!authToken) {
          setSubmissionStatus("error");
          setRewardData({
            reward: null,
            xpEarned: null,
            success: false,
            message: "Authentication required to save score.",
          });
          toast({
            title: "Score Not Saved",
            description: "Please log in to save your progress.",
            variant: "destructive",
          });
          return;
        }

        try {
          const response = await fetch(`${API_BASE_URL}/game/complete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: authToken,
            },
            body: JSON.stringify({
              gameId: STORY_GAME_ID,
              score: totalScore,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.message || "Failed to submit score to the server."
            );
          }

          // Success: Set reward data from the backend response
          setRewardData({
            reward: data.reward,
            xpEarned: data.xpEarned,
            success: true,
            message: data.message,
          });
          setSubmissionStatus("complete");

          // Optional: Update localStorage with new coin count (requires fetching new user data or calculating locally)
          // For now, we rely on the next refresh to Dashboard/Profile to pick up the changes.

          toast({
            title: "Success!",
            description: `You earned ${data.reward} Shield Coins!`,
          });
        } catch (error: any) {
          console.error("Score submission error:", error);
          setSubmissionStatus("error");
          setRewardData({
            reward: null,
            xpEarned: null,
            success: false,
            message:
              error.message ||
              "Server connection failed. Could not save score.",
          });
          toast({
            title: "Score Not Saved",
            description: "Server connection failed.",
            variant: "destructive",
          });
        }
      };

      submitScore();
    }
  }, [gamePhase, submissionStatus, totalScore]); // Dependencies for useEffect

  const getGrade = () => {
    if (percentage >= 90)
      return {
        grade: "A+",
        message: "Fraud Detection Expert!",
        color: "text-success",
      };
    if (percentage >= 80)
      return {
        grade: "A",
        message: "Excellent Awareness!",
        color: "text-success",
      };
    if (percentage >= 70)
      return { grade: "B", message: "Good Knowledge!", color: "text-primary" };
    if (percentage >= 60)
      return { grade: "C", message: "Keep Learning!", color: "text-warning" };
    return {
      grade: "D",
      message: "More Practice Needed",
      color: "text-destructive",
    };
  };

  // --- Game Reset Function ---
  const resetGame = () => {
    setGamePhase("story");
    setCurrentScene(0);
    setCurrentFrameIndex(0);
    setShowChoices(false);
    setStoryScore(0);
    setQuizScore(0);
    setCurrentQuizQuestion(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setStoryChoices([]);
    setRewardData(null);
    setSubmissionStatus("idle");
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/games")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </Button>
          {gamePhase !== "results" && (
            <Badge variant="outline" className="text-lg px-4 py-2">
              Score: {totalScore} / {maxScore}
            </Badge>
          )}
        </div>

        {/* Story Phase */}
        {gamePhase === "story" && (
          <div className="max-w-3xl mx-auto">
            <div className="card-glass p-8 rounded-2xl">
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    Story Progress
                  </span>
                  <span className="text-sm font-semibold">
                    {Math.round((currentScene / scenes.length) * 100)}%
                  </span>
                </div>
                <Progress
                  value={(currentScene / scenes.length) * 100}
                  className="h-2"
                />
              </div>

              {/* Comic Strip Frame */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6 text-center">
                  {scenes[currentScene].title}
                </h2>

                {/* Current Frame */}
                <div className="card-glass rounded-2xl overflow-hidden border-2 border-primary/30 mb-4">
                  {/* Frame Image */}
                  <div className="relative bg-gradient-primary/5">
                    {(() => {
                      const imagePath = `/src/assets/story/scene${currentScene}-frame${currentFrameIndex}.png`;
                      const imageUrl = storyImages[imagePath];
                      const currentFrame =
                        scenes[currentScene].frames[currentFrameIndex];

                      return imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={currentFrame?.dialogue || ""}
                          className="w-full aspect-video object-cover"
                        />
                      ) : (
                        <div className="w-full aspect-video flex items-center justify-center text-7xl bg-muted/20">
                          {currentFrame?.image}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Dialogue Box */}
                  <div className="p-6 bg-background/95 border-t-2 border-primary/20">
                    {scenes[currentScene].frames[currentFrameIndex]
                      ?.speaker && (
                      <p className="text-sm font-bold text-primary mb-2">
                        {scenes[currentScene].frames[currentFrameIndex].speaker}
                        :
                      </p>
                    )}
                    <p className="text-lg leading-relaxed">
                      {scenes[currentScene].frames[currentFrameIndex]?.dialogue}
                    </p>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-border/50">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevFrame}
                        disabled={currentFrameIndex === 0}
                        className="gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </Button>

                      <span className="text-sm text-muted-foreground">
                        Frame {currentFrameIndex + 1} /{" "}
                        {scenes[currentScene].frames.length}
                      </span>

                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleNextFrame}
                        disabled={showChoices}
                        className="gap-2"
                      >
                        {currentFrameIndex <
                        scenes[currentScene].frames.length - 1
                          ? "Next"
                          : "Continue"}
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Frame Progress */}
                <div className="flex justify-center gap-2 mb-6">
                  {scenes[currentScene].frames.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentFrameIndex
                          ? "w-8 bg-primary"
                          : idx < currentFrameIndex
                          ? "w-2 bg-primary/50"
                          : "w-2 bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Feedback */}
              {showFeedback && scenes[currentScene].feedback && (
                <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/30 animate-fade-in">
                  <p className="text-sm">{scenes[currentScene].feedback}</p>
                </div>
              )}

              {/* Choices - Only show after all frames */}
              {!showFeedback && showChoices && !scenes[currentScene].isEnd && (
                <div className="space-y-3 animate-fade-in">
                  <p className="text-center text-muted-foreground mb-4">
                    What will you do?
                  </p>
                  {scenes[currentScene].choices.map((choice, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full h-auto py-4 text-left justify-start hover:bg-primary/20 transition-all"
                      onClick={() => handleChoice(choice)}
                    >
                      <span className="text-base">{choice.text}</span>
                    </Button>
                  ))}
                </div>
              )}

              {/* End Scene */}
              {scenes[currentScene].isEnd && !showFeedback && (
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Proceeding to quiz section...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quiz Phase */}
        {gamePhase === "quiz" && (
          <div className="max-w-3xl mx-auto">
            <div className="card-glass p-8 rounded-2xl">
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    Question {currentQuizQuestion + 1} of {quizQuestions.length}
                  </span>
                  <span className="text-sm font-semibold">
                    Quiz Score: {quizScore}
                  </span>
                </div>
                <Progress
                  value={
                    ((currentQuizQuestion + 1) / quizQuestions.length) * 100
                  }
                  className="h-2"
                />
              </div>

              {/* Question */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6">
                  {quizQuestions[currentQuizQuestion].question}
                </h2>

                {/* Options */}
                <div className="space-y-3">
                  {quizQuestions[currentQuizQuestion].options.map(
                    (option, index) => {
                      const isSelected = selectedAnswer === index;
                      const isCorrect =
                        index ===
                        quizQuestions[currentQuizQuestion].correctAnswer;
                      const showResult = showFeedback;

                      return (
                        <Button
                          key={index}
                          variant="outline"
                          className={`w-full h-auto py-4 text-left justify-start transition-all ${
                            showResult
                              ? isCorrect
                                ? "bg-success/20 border-success"
                                : isSelected
                                ? "bg-destructive/20 border-destructive"
                                : ""
                              : "hover:bg-primary/20"
                          }`}
                          onClick={() =>
                            !showFeedback && handleQuizAnswer(index)
                          }
                          disabled={showFeedback}
                        >
                          <span className="flex items-center gap-3 w-full">
                            <span className="flex-1 text-base">{option}</span>
                            {showResult && isCorrect && (
                              <CheckCircle className="w-5 h-5 text-success" />
                            )}
                            {showResult && isSelected && !isCorrect && (
                              <XCircle className="w-5 h-5 text-destructive" />
                            )}
                          </span>
                        </Button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Explanation */}
              {showFeedback && (
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 animate-fade-in">
                  <p className="text-sm font-semibold mb-2">Explanation:</p>
                  <p className="text-sm">
                    {quizQuestions[currentQuizQuestion].explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Phase */}
        {gamePhase === "results" && (
          <div className="max-w-3xl mx-auto">
            <div className="card-glass p-8 rounded-2xl text-center">
              {/* Trophy Icon */}
              <div className="mb-6">
                <Trophy className="w-24 h-24 mx-auto text-primary animate-scale-in" />
              </div>

              {/* Grade */}
              <div className="mb-8">
                <h2 className="text-5xl font-bold mb-2 glow-effect">
                  {getGrade().grade}
                </h2>
                <p className={`text-2xl font-semibold ${getGrade().color}`}>
                  {getGrade().message}
                </p>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="card-glass p-4 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">
                    Story Score
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {storyScore}
                  </p>
                </div>
                <div className="card-glass p-4 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">
                    Quiz Score
                  </p>
                  <p className="text-3xl font-bold text-primary">{quizScore}</p>
                </div>
                <div className="card-glass p-4 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Score
                  </p>
                  <p className="text-3xl font-bold text-success">
                    {totalScore}
                  </p>
                </div>
              </div>

              {/* Performance Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    Performance
                  </span>
                  <span className="text-sm font-semibold">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
                <Progress value={percentage} className="h-3" />
              </div>

              {/* Reward Status / XP Reward */}
              <div className="card-glass p-6 rounded-xl mb-8 bg-gradient-primary/10 border border-primary/30">
                {submissionStatus === "submitting" && (
                  <p className="text-xl font-semibold text-primary">
                    Saving score and calculating reward...
                  </p>
                )}
                {rewardData?.success && submissionStatus === "complete" && (
                  <div className="flex items-center justify-center gap-3">
                    <Star className="w-6 h-6 text-warning fill-warning" />
                    <p className="text-xl font-semibold">
                      You earned{" "}
                      <span className="text-primary">
                        +{rewardData.reward} Shield Coins
                      </span>
                      !
                    </p>
                  </div>
                )}
                {rewardData?.success === false &&
                  submissionStatus === "error" && (
                    <div className="flex items-center justify-center gap-3 text-destructive">
                      <AlertTriangle className="w-6 h-6" />
                      <p className="text-xl font-semibold">
                        {rewardData.message}
                      </p>
                    </div>
                  )}
                {submissionStatus === "idle" && (
                  <p className="text-xl font-semibold text-muted-foreground">
                    Finalizing results...
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={resetGame}
                >
                  Play Again
                </Button>
                <Button
                  variant="hero"
                  className="flex-1"
                  onClick={() => navigate("/games")}
                >
                  More Games
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ChatBot />
    </div>
  );
};

export default StoryGame;
