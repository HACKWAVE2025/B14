import { useState, useEffect } from "react"; // <-- FIX: Added useEffect here
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Trophy,
  Star,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/Navbar";
import { ChatBot } from "@/components/ChatBot";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input"; // Added missing Input import for MobileSmsDisplay
import { Send } from "lucide-react"; // Added missing Send import for MobileSmsDisplay
import { Badge } from "@/components/ui/badge"; // Added missing Badge import
import { AlertTriangle } from "lucide-react"; // Added missing AlertTriangle import

import { toast } from "@/hooks/use-toast";

// --- GAME CONFIG ---
const API_BASE_URL = "http://localhost:5000";
const SMISHING_GAME_ID = "SMISHING_ANALYSIS_1";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  flag: string; // The specific part of the SMS this question targets
}

const analysisQuestions: Question[] = [
  {
    id: 1,
    question: "What is the primary red flag concerning the SENDER's identity?",
    options: [
      "The use of all capital letters in the sender name.",
      "The number is not from a mobile phone number.",
      "It uses generic, urgent-sounding 'National' and 'Unit' names.",
      "The message contains a reference number (#5893-CZ).",
    ],
    correctAnswerIndex: 2,
    explanation:
      "Legitimate government bodies or police typically contact you via verified methods, not generic, high-pressure SMS from an unknown sender using vague, official-sounding names. They would use official letterheads or phone lines.",
    flag: "Sender Name",
  },
  {
    id: 2,
    question:
      "What is suspicious about the instruction 'Do NOT contact police'?",
    options: [
      "It attempts to isolate the victim and prevent verification.",
      "It is grammatically incorrect, indicating a non-native speaker.",
      "It proves the sender is a legitimate authority figure.",
      "It is a legal warning required in all emergency messages.",
    ],
    correctAnswerIndex: 0,
    explanation:
      "Scammers often use *isolation tactics* (e.g., 'don't tell anyone,' 'act immediately') to ensure the victim cannot verify the story with a trusted source like a spouse, police, or bank.",
    flag: "Isolation Tactic",
  },
  {
    id: 3,
    question:
      "What is the key danger in the hyperlink: 'hxxp://safe-reunion.co/verify-payment'?",
    options: [
      "The link uses 'http' instead of 'https', indicating it's insecure.",
      "The domain '.co' is never used by official entities.",
      "The domain is a low-quality, non-official, misspelled/random URL.",
      "The link mentions 'payment', which is normal for a fine.",
    ],
    correctAnswerIndex: 2,
    explanation:
      "The URL uses a highly suspicious domain designed to look related to the emergency ('safe-reunion.co') but is clearly not an official government or financial domain, marking it as a *phishing link*.",
    flag: "Suspicious Link",
  },
  {
    id: 4,
    question:
      "What psychological tactic does the overall message rely on to succeed?",
    options: [
      "The use of complex legal jargon.",
      "Appealing to financial gain (a reward).",
      "Emotional manipulation and creating an urgent sense of panic.",
      "Offering multiple contact methods for verification.",
    ],
    correctAnswerIndex: 2,
    explanation:
      "This is an *emotional manipulation scam*. By leveraging fear and parental instinct, the scammer bypasses logical thinking, forcing the victim to act immediately without critical analysis.",
    flag: "Emotional Tactic",
  },
];

const SmishingGame = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gamePhase, setGamePhase] = useState<"quiz" | "results">("quiz");

  // NEW: State for score submission and reward
  const [rewardData, setRewardData] = useState<{
    reward: number | null;
    xpEarned: number | null;
    success: boolean;
    message: string;
  } | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "submitting" | "complete" | "error"
  >("idle");

  const totalQuestions = analysisQuestions.length;
  const maxScore = totalQuestions * 20;
  const percentage = (quizScore / maxScore) * 100;

  const currentQuestion = analysisQuestions[currentQuestionIndex];

  // --- Core Game Logic: Answer Handling ---
  const handleAnswer = (answerIndex: number) => {
    if (showFeedback) return;

    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    const isCorrect = answerIndex === currentQuestion.correctAnswerIndex;
    if (isCorrect) {
      setQuizScore(quizScore + 20);
      toast({
        title: "Correct!",
        description: `+20 points. Red Flag Identified!`,
        variant: "sucess",
      });
    } else {
      toast({
        title: "Incorrect",
        description: "Review the correct explanation below.",
        variant: "destructive",
      });
    }

    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        // Next Question
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        // Go to Results
        setGamePhase("results");
        // Trigger score submission on next render cycle
        setSubmissionStatus("idle");
      }
    }, 4000);
  };

  // --- Score Submission Logic (from StoryGame.tsx) ---
  const submitScore = async () => {
    setSubmissionStatus("submitting");
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      setSubmissionStatus("error");
      setRewardData({
        reward: 0,
        xpEarned: 0,
        success: false,
        message: "Authentication required to save score.",
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/game/complete`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify({
          gameId: SMISHING_GAME_ID,
          score: quizScore,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit score to the server."
        );
      }

      setRewardData({
        reward: data.reward,
        xpEarned: data.xpEarned,
        success: true,
        message: data.message,
      });
      setSubmissionStatus("complete");
    } catch (error: any) {
      console.error("Score submission error:", error);
      setSubmissionStatus("error");
      setRewardData({
        reward: null,
        xpEarned: null,
        success: false,
        message:
          error.message || "Server connection failed. Could not save score.",
      });
    }
  };

  useEffect(() => {
    if (gamePhase === "results" && submissionStatus === "idle") {
      submitScore();
    }
  }, [gamePhase]);
  // ----------------------------------------------------

  const getGrade = () => {
    if (percentage >= 90)
      return {
        grade: "A+",
        message: "Master Smishing Analyst!",
        color: "text-success",
      };
    if (percentage >= 80)
      return {
        grade: "A",
        message: "Sharp Detection Skills!",
        color: "text-success",
      };
    if (percentage >= 70)
      return { grade: "B", message: "Good Awareness!", color: "text-primary" };
    if (percentage >= 60)
      return { grade: "C", message: "Keep Practicing!", color: "text-warning" };
    return {
      grade: "D",
      message: "Immediate Review Needed",
      color: "text-destructive",
    };
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setGamePhase("quiz");
    setRewardData(null);
    setSubmissionStatus("idle");
  };

  // --- SMS Content Component ---
  const MobileSmsDisplay = () => (
    <div className="flex justify-center p-4">
      {/* Mock Mobile Frame */}
      <div className="relative w-full max-w-sm h-[650px] bg-gray-900 rounded-[3rem] shadow-2xl border-8 border-gray-800 flex flex-col overflow-hidden">
        {/* Header notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-b-xl z-10"></div>
        {/* Status bar */}
        <div className="h-10 flex items-center justify-between px-4 text-white text-sm bg-black">
          <span>10:30 AM</span>
          <div className="flex items-center gap-1">
            <span className="font-semibold">5G</span>
            <MessageSquare className="w-4 h-4" />
          </div>
        </div>

        {/* Messaging app interface */}
        <div className="flex-1 bg-black p-3 space-y-3 overflow-y-auto">
          {/* Sender Name */}
          <div className="text-center mb-4 border-b border-gray-700 pb-2">
            <p className="text-sm font-medium text-gray-400">Today, 10:28 AM</p>
            <p className="text-lg font-bold text-red-500">
              NATIONAL KIDNAP RESPONSE UNIT
            </p>
          </div>

          {/* Message Bubble (Scam) */}
          <div className="flex justify-start">
            <div className="bg-red-900/50 text-white p-4 rounded-xl rounded-tl-none border border-red-700/50 shadow-lg">
              <p className="text-base font-semibold mb-2">
                🚨 URGENT ALERT - CASE #5893-CZ
              </p>
              <p className="mb-3">
                This is the *National Kidnap Response Unit*. Your
                son/daughter, John/Jane, has been detained following an
                incident. *Immediate action is REQUIRED.*
              </p>
              <p className="mb-3 text-lg font-bold">
                To secure their safe return and process the immediate release
                fee, you MUST click the link below NOW.
              </p>
              <p className="text-yellow-400 font-medium mb-3">
                *Do NOT contact police or authorities.* Failure to comply will
                result in consequences.
              </p>

              {/* Phishing Link */}
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="text-primary underline cursor-pointer break-all transition-colors hover:text-red-300"
                    >
                      hxxp://safe-reunion.co/verify-payment
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="bg-destructive text-destructive-foreground">
                    <p className="text-xs">
                      Phishing Link: hxxp://safe-reunion.co/verify-payment
                    </p>
                    <p className="text-xs font-bold">DO NOT CLICK</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Warning about the interaction type */}
          <div className="text-center text-xs text-gray-500 pt-10">
            <p>Tap a red flag in the quiz area to proceed with analysis.</p>
          </div>
        </div>
        {/* Input area - disabled */}
        <div className="p-3 border-t border-gray-700 flex items-center bg-gray-900">
          <Input
            placeholder="Type your reply..."
            disabled
            className="bg-gray-800 text-gray-500"
          />
          <Button size="icon" variant="ghost" disabled className="ml-2">
            <Send className="w-4 h-4 text-gray-600" />
          </Button>
        </div>
      </div>
    </div>
  );
  // ------------------------------------

  return (
    <>
      <div className="min-h-screen">
        <Navbar />

        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="outline"
              onClick={() => navigate("/games")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Games
            </Button>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-lg px-4 py-2">
                Score: {quizScore} / {maxScore}
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                Question: {currentQuestionIndex + 1} / {totalQuestions}
              </Badge>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-8 text-center text-primary">
            VISHING SCENARIO: URGENT KIDNAP ALERT
          </h1>

          {gamePhase === "quiz" && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Side: MCQ Interface */}
              <div className="card-glass p-8 rounded-2xl order-2 md:order-1">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                      Analysis Progress
                    </span>
                    <span className="text-sm font-semibold">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>

                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-warning">
                  <MessageSquare className="w-5 h-5" /> Red Flag:{" "}
                  {currentQuestion.flag}
                </h2>

                <h3 className="text-2xl font-semibold mb-6">
                  {currentQuestion.question}
                </h3>

                {/* Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect =
                      index === currentQuestion.correctAnswerIndex;
                    const showResult = showFeedback;

                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className={`w-full h-auto py-4 text-left justify-start transition-all ${
                          showResult
                            ? isCorrect
                              ? "bg-success/20 border-success hover:bg-success/30"
                              : isSelected
                              ? "bg-destructive/20 border-destructive hover:bg-destructive/30"
                              : ""
                            : "hover:bg-primary/20"
                        } ${showResult ? "cursor-default" : "cursor-pointer"}`}
                        onClick={() => handleAnswer(index)}
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
                  })}
                </div>

                {/* Explanation */}
                {showFeedback && (
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 animate-fade-in mt-6">
                    <p className="text-sm font-semibold mb-2 text-primary">
                      Explanation:
                    </p>
                    <p className="text-sm">{currentQuestion.explanation}</p>
                  </div>
                )}
              </div>

              {/* Right Side: Mobile Phone Display */}
              <div className="order-1 md:order-2">
                <MobileSmsDisplay />
              </div>
            </div>
          )}

          {/* Results Phase */}
          {gamePhase === "results" && (
            <div className="max-w-3xl mx-auto">
              <div className="card-glass p-8 rounded-2xl text-center">
                <div className="mb-6">
                  <Trophy className="w-24 h-24 mx-auto text-primary animate-scale-in" />
                </div>

                <div className="mb-8">
                  <h2 className="text-5xl font-bold mb-2 glow-effect">
                    {getGrade().grade}
                  </h2>
                  <p className={`text-2xl font-semibold ${getGrade().color}`}>
                    {getGrade().message}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="card-glass p-4 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">Score</p>
                    <p className="text-3xl font-bold text-primary">{quizScore}</p>
                  </div>
                  <div className="card-glass p-4 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">
                      Max Score
                    </p>
                    <p className="text-3xl font-bold text-success">{maxScore}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                      Detection Accuracy
                    </span>
                    <span className="text-sm font-semibold">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={percentage} className="h-3" />
                </div>

                {/* Reward Status */}
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
    </>
  );
};

export default SmishingGame;