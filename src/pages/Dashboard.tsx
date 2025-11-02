/*
 * REFACTOR: Applied Pixel Game World theme from Landing.tsx.
 */
import { Link, useNavigate } from "react-router-dom";
import {
  Trophy,
  Target,
  Flame,
  Crown,
  AlertTriangle,
  ExternalLink,
  Play,
  Lightbulb,
  // Shield, // NOTE: Shield is imported but unused, keeping it for completeness if used elsewhere
  // Home,   // NOTE: Home is imported but unused, keeping it for completeness if used elsewhere
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/Navbar";
import { ChatBot } from "@/components/ChatBot";
import { useState, useEffect } from "react";
import "@/PixelLanding.css"; // <-- Import the styles

const API_BASE_URL = "http://localhost:5000";

// --- INTERFACES ---

interface UserStats {
  username: string;
  email: string;
  currentLevel: number;
  shieldCoins: number;
  currentStreak: number;
  xp: number;
  xpToNext: number;
  rank: number;
}

interface LeaderboardEntry {
  username: string;
  shieldCoins: number;
  currentLevel: number;
}

// --- COMPONENT ---

const Dashboard = () => {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);

  // 1. Load User Data from Local Storage
  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      try {
        const storedUser = JSON.parse(userDataString);
        // It's safer to use optional chaining if userData can be null/undefined
        const currentLevel = storedUser?.currentLevel || 1;
        const calculatedXP = currentLevel * 8400;
        const xpToNext = (currentLevel + 1) * 10000;

        setUserStats({
          username: storedUser.username || "Player",
          email: storedUser.email || "",
          currentLevel: currentLevel,
          shieldCoins: storedUser.shieldCoins || 0,
          currentStreak: storedUser.currentStreak || 0,
          xp: calculatedXP,
          xpToNext: xpToNext,
          rank: 0,
        });
      } catch (e) {
        console.error("Error parsing user data from localStorage", e);
      }
    }
  }, []); // Empty dependency array means this runs once on mount

  // 2. Fetch Leaderboard Data
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setLeaderboardError("Authentication token missing. Please log in.");
      setLeaderboardLoading(false);
      return;
    }

    const fetchLeaderboard = async () => {
      setLeaderboardLoading(true);
      setLeaderboardError(null);
      try {
        // ERROR FIX 1: Template literal missing backticks (`...`) instead of double quotes (")
        const response = await fetch(`${API_BASE_URL}/leaderboard`, {
          method: "GET",
          headers: {
            // FIX: Ensure 'Authorization' value is prefixed correctly (e.g., 'Bearer ') if needed
            // For now, assuming authToken is the complete header value required by the backend
            Authorization: `Bearer ${authToken}`, // Added 'Bearer ' which is common practice
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch leaderboard.");
        }

        const fetchedLeaderboard: LeaderboardEntry[] = data.leaderboard;
        setLeaderboard(fetchedLeaderboard);

        if (userStats) {
          const userRankIndex = fetchedLeaderboard.findIndex(
            (entry) => entry.username === userStats.username
          );
          const userRank = userRankIndex !== -1 ? userRankIndex + 1 : 0;
          // Using a functional update to ensure we use the latest userStats
          setUserStats((prev) => (prev ? { ...prev, rank: userRank } : null));
        }
      } catch (err: any) {
        console.error("Leaderboard fetch error:", err.message);
        setLeaderboardError(err.message || "Could not retrieve leaderboard.");
      } finally {
        setLeaderboardLoading(false);
      }
    };

    // Only fetch if userStats (and specifically username) is available
    if (userStats?.username) {
      fetchLeaderboard();
    }
  }, [userStats?.username]); // Dependency array includes userStats.username

  // --- MOCK/STATIC DATA (Updated with correct paths and pixel colors) ---

  const scamNews = [
    {
      title: "New Phishing Campaign Targets Mobile Banking",
      source: "CyberSecurity Today",
      time: "2 hours ago",
      severity: "high",
    },
    {
      title: "Fake Crypto Investment Apps on Rise",
      source: "Fraud Alert Network",
      time: "5 hours ago",
      severity: "high",
    },
    {
      title: "QR Code Scams in Restaurant Payments",
      source: "Payment Safety News",
      time: "1 day ago",
      severity: "medium",
    },
  ];

  const funFacts = [
    {
      icon: "💰",
      fact: "Global losses to cybercrime exceeded $8 trillion in 2023",
      category: "Impact",
    },
    {
      icon: "📧",
      fact: "90% of data breaches start with a phishing email",
      category: "Phishing",
    },
    {
      icon: "⏰",
      fact: "A cyber attack happens every 39 seconds on average",
      category: "Frequency",
    },
    {
      icon: "🔒",
      fact: "81% of hacking-related breaches used stolen or weak passwords",
      category: "Security",
    },
  ];

  const quickGames = [
    {
      id: "game-1",
      title: "Phishing Email Detective",
      difficulty: "Easy",
      xp: 100,
      icon: "🎣",
      color: "bg-cyan-300/20",
      path: "/games/story",
    },
    {
      id: "game-2",
      title: "SMS fraud Spotter",
      difficulty: "Medium",
      xp: 200,
      icon: "🌐",
      color: "bg-pink-500/20",
      path: "/games/SMS",
    },
    {
      id: "game-3",
      title: "Social Engineering Defense",
      difficulty: "Hard",
      xp: 300,
      icon: "🎭",
      color: "bg-red-500/20",
      path: null,
    },
  ];

  // --- RENDER HELPERS ---

  const handleGameClick = (path: string | null) => {
    if (path) {
      navigate(path);
    }
  };

  const currentStats = userStats || {
    username: "Loading...",
    currentLevel: 0,
    shieldCoins: 0,
    currentStreak: 0,
    xp: 0,
    xpToNext: 10000,
    rank: 0,
  };

  const getAvatarInitials = (username: string) => {
    return (
      username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase() || "AR"
    );
  };

  const progressBarValue = (currentStats.xp / currentStats.xpToNext) * 100;

  // --------------------------------------------------------------------------------

  return (
    // MODIFIED: Removed 'scanline-bg'
    <div className="min-h-screen font-pixel text-white">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        {/* Welcome & Stats Header */}
        <div className="mb-8 p-6 pixel-box">
          <h1 className="text-4xl font-bold text-pink-500 mb-2">
            Welcome back, {currentStats.username}!
          </h1>
          <p className="text-lg text-gray-400">
            Select a game to start learning or check out the latest news.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content - 75% */}
          <div className="flex-1 space-y-6">
            {/* Quick Play Games */}
            <div className="pixel-box p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-cyan-300">Quick Play</h2>
                <Link to="/games">
                  <Button className="btn-pixel-alt" size="sm">
                    View All Quests
                  </Button>
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {quickGames.map((game) => (
                  <div
                    key={game.id}
                    className="pixel-box-inset p-6 hover:translate-y-0 hover:shadow-none transition-transform cursor-pointer group flex flex-col"
                    onClick={() => handleGameClick(game.path)}
                  >
                    <div
                      // ERROR FIX 2: Template literal missing backticks (`...`) instead of double quotes (")
                      className={`w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-3xl mb-4 mx-auto`}
                    >
                      {game.icon}
                    </div>
                    <h3 className="font-bold text-center mb-2 text-pink-500">
                      {game.title}
                    </h3>
                    <div className="flex justify-between text-sm text-gray-400 mb-4">
                      <span>{game.difficulty}</span>
                      <span className="text-cyan-300 font-medium">
                        +{game.xp} XP
                      </span>
                    </div>
                    <Button className="btn-pixel-main w-full mt-auto" size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      Execute Quest
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* User Stats */}
            <div className="pixel-box p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-cyan-300">
                    Player Stats
                  </h2>
                  <p className="text-sm text-gray-400">
                    Your current progress and standing.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Global Rank</div>
                  <div className="text-3xl font-bold text-pink-500">
                    {/* ERROR FIX 3: Template literal for rank missing backticks (`...`) */}
                    {currentStats.rank === 0 ? "#..." : `#${currentStats.rank}`}
                  </div>
                </div>
              </div>

              {/* Level Progress */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-cyan-300">
                    Level {currentStats.currentLevel}
                  </span>
                  <span className="text-gray-400">
                    {currentStats.xp} / {currentStats.xpToNext} XP
                  </span>
                </div>
                <Progress value={progressBarValue} className="h-3 bg-gray-700">
                  <div
                    // ERROR FIX 4: `style` attribute uses an object, and value should be a string. Using an object.
                    style={{ width: `${progressBarValue}%` }}
                    className="h-full bg-pink-500"
                  ></div>
                </Progress>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="pixel-box-inset p-4 text-center border-cyan-300/50">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-cyan-300" />
                  <div className="text-2xl font-bold text-cyan-300">
                    {currentStats.shieldCoins.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Shield Coins</div>
                </div>
                <div className="pixel-box-inset p-4 text-center border-pink-500/50">
                  <Flame className="w-8 h-8 mx-auto mb-2 text-pink-500" />
                  <div className="text-2xl font-bold text-pink-500">
                    {currentStats.currentStreak} Days
                  </div>
                  <div className="text-sm text-gray-400">Streak</div>
                </div>
                <div className="pixel-box-inset p-4 text-center border-green-400/50">
                  <Target className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <div className="text-2xl font-bold text-green-400">
                    Level {currentStats.currentLevel}
                  </div>
                  <div className="text-sm text-gray-400">Current Level</div>
                </div>
              </div>
            </div>

            {/* Fun Facts */}
            <div className="pixel-box p-6">
              <div className="flex items-center gap-2 mb-6">
                {/* Note: lightbulb is text-warning, assumed to be a custom color/utility */}
                <Lightbulb className="w-6 h-6 text-warning" />
                <h2 className="text-2xl font-bold text-cyan-300">Data Logs</h2>
                <span className="ml-auto text-xs text-gray-400">
                  Fraud Facts
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {funFacts.map((item, idx) => (
                  <div key={idx} className="pixel-box-inset p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{item.icon}</div>
                      <div className="flex-1">
                        <div className="text-xs text-pink-500 font-bold mb-1">
                          {item.category}
                        </div>
                        <p className="text-sm text-gray-300">{item.fact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard - Populated from API */}
            <div className="pixel-box p-6">
              <div className="flex items-center gap-2 mb-6">
                <Crown className="w-6 h-6 text-warning" />
                <h2 className="text-2xl font-bold text-cyan-300">
                  Top Players
                </h2>
              </div>

              {leaderboardLoading ? (
                <p className="text-center text-gray-400">
                  Loading leaderboard data file...
                </p>
              ) : leaderboardError ? (
                <p className="text-center text-red-500">
                  Error: {leaderboardError}
                </p>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((player, idx) => {
                    const isCurrentUser =
                      userStats?.username === player.username;
                    const avatarInitials = getAvatarInitials(player.username);

                    return (
                      <div
                        key={idx}
                        // ERROR FIX 5: Template literal for className missing backticks (`...`)
                        className={`flex items-center gap-4 p-4 pixel-box-inset transition-all ${
                          idx < 3
                            ? "border-pink-500"
                            : isCurrentUser
                            ? "border-cyan-300"
                            : "border-gray-600"
                        }`}
                      >
                        <div className="text-2xl font-bold w-8 text-center text-pink-500">
                          {idx === 0 && "🥇"}
                          {idx === 1 && "🥈"}
                          {idx === 2 && "🥉"}
                          {/* ERROR FIX 6: Template literal missing backticks (`...`) */}
                          {idx > 2 && `#${idx + 1}`}
                        </div>
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            isCurrentUser
                              ? "bg-cyan-300 text-gray-900"
                              : "bg-pink-500 text-white"
                          }`}
                        >
                          {avatarInitials}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-cyan-300">
                            {player.username}
                          </div>
                          <div className="text-sm text-gray-400">
                            Level {player.currentLevel}
                          </div>
                        </div>
                        <div className="text-pink-500 font-bold">
                          {player.shieldCoins.toLocaleString()} pts
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <Button className="btn-pixel-alt w-full mt-4">
                View Full Leaderboard
              </Button>
            </div>
          </div>

          {/* Scam News Sidebar - 25% */}
          
        </div>
      </div>

      <ChatBot />
    </div>
  );
};

export default Dashboard;
