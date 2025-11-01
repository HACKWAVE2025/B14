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
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/Navbar";
import { ChatBot } from "@/components/ChatBot";
import { useState, useEffect } from "react";

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
  const navigate = useNavigate(); // Added for navigation
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
        // Map stored data to UserStats structure, providing mock data for missing fields
        // XP is mocked for the progress bar since the backend only provides level
        const currentLevel = storedUser.currentLevel || 1;
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
          rank: 0, // Placeholder, updated after fetching leaderboard
        });
      } catch (e) {
        console.error("Error parsing user data from localStorage", e);
      }
    }
  }, []);

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
        const response = await fetch(`${API_BASE_URL}/leaderboard`, {
          method: "GET",
          headers: {
            // Include the token for authentication as required by the backend
            Authorization: authToken,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch leaderboard.");
        }

        const fetchedLeaderboard: LeaderboardEntry[] = data.leaderboard;
        setLeaderboard(fetchedLeaderboard);

        // Find the user's rank in the fetched data
        if (userStats) {
          const userRankIndex = fetchedLeaderboard.findIndex(
            (entry) => entry.username === userStats.username
          );
          // Rank is index + 1
          const userRank = userRankIndex !== -1 ? userRankIndex + 1 : 0;
          // Update userStats with the actual rank
          setUserStats((prev) => (prev ? { ...prev, rank: userRank } : null));
        }
      } catch (err: any) {
        console.error("Leaderboard fetch error:", err.message);
        setLeaderboardError(err.message || "Could not retrieve leaderboard.");
      } finally {
        setLeaderboardLoading(false);
      }
    };

    // Only fetch leaderboard if we have user stats to find the rank for
    if (userStats?.username) {
        fetchLeaderboard();
    }
  }, [userStats?.username]); // Re-fetch only when the username loads

  // --- MOCK/STATIC DATA (Kept for content not covered by the API) ---

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
      color: "bg-primary/20",
      path: "/games/story", // Added path for redirection
    },
    {
      id: "game-2",
      title: "Fake Website Spotter",
      difficulty: "Medium",
      xp: 200,
      icon: "🌐",
      color: "bg-secondary/20",
      path: null, // No path yet
    },
    {
      id: "game-3",
      title: "Social Engineering Defense",
      difficulty: "Hard",
      xp: 300,
      icon: "🎭",
      color: "bg-destructive/20",
      path: null, // No path yet
    },
  ];

  // --- RENDER HELPERS ---

  // Added navigation handler
  const handleGameClick = (path: string | null) => {
    if (path) {
      navigate(path);
    }
    // Optionally, you could show a toast or alert if path is null
    // else {
    //   console.log("This game is not available yet.");
    // }
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
    // Generates initials (e.g., "Alex Rivera" -> "AR")
    return (
      username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase() || "AR"
    );
  };

  // --------------------------------------------------------------------------------

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        
        {/* Simplified Welcome */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {currentStats.username}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Select a game to start learning or check out the latest news.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content - 75% */}
          <div className="flex-1 space-y-6">
            
            {/* Quick Play Games (MOVED TO TOP) */}
            <div className="card-glass p-6 rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Quick Play</h2>
                <Link to="/games">
                  <Button variant="outline" size="sm">
                    View All Games
                  </Button>
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {quickGames.map((game) => (
                  <div
                    key={game.id}
                    className="card-glass p-6 rounded-lg hover:scale-105 transition-transform cursor-pointer group flex flex-col"
                    onClick={() => handleGameClick(game.path)} // Added onClick handler
                  >
                    <div
                      className={`w-16 h-16 ${game.color} rounded-full flex items-center justify-center text-3xl mb-4 mx-auto group-hover:shadow-glow transition-shadow`}
                    >
                      {game.icon}
                    </div>
                    <h3 className="font-bold text-center mb-2">{game.title}</h3>
                    <div className="flex justify-between text-sm text-muted-foreground mb-4">
                      <span>{game.difficulty}</span>
                      <span className="text-primary font-medium">
                        +{game.xp} XP
                      </span>
                    </div>
                    <Button variant="hero" size="sm" className="w-full mt-auto">
                      <Play className="w-4 h-4 mr-2" />
                      Play Now
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Fun Facts */}
            <div className="card-glass p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-6">
                <Lightbulb className="w-6 h-6 text-warning" />
                <h2 className="text-2xl font-bold">Did You Know?</h2>
                <span className="ml-auto text-xs text-muted-foreground">
                  Fraud Facts
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {funFacts.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-muted/20 p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{item.icon}</div>
                      <div className="flex-1">
                        <div className="text-xs text-primary font-medium mb-1">
                          {item.category}
                        </div>
                        <p className="text-sm">{item.fact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard - Populated from API */}
            <div className="card-glass p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-6">
                <Crown className="w-6 h-6 text-warning" />
                <h2 className="text-2xl font-bold">Top Players</h2>
              </div>

              {leaderboardLoading ? (
                <p className="text-center text-muted-foreground">
                  Loading leaderboard...
                </p>
              ) : leaderboardError ? (
                <p className="text-center text-destructive">
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
                        className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                          idx < 3
                            ? "bg-gradient-primary/10 border border-primary/30"
                            : isCurrentUser
                            ? "bg-primary/10 border border-primary/30"
                            : "bg-muted/30"
                        }`}
                      >
                        <div className="text-2xl font-bold w-8 text-center">
                          {idx === 0 && "🥇"}
                          {idx === 1 && "🥈"}
                          {idx === 2 && "🥉"}
                          {idx > 2 && `#${idx + 1}`}
                        </div>
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            isCurrentUser
                              ? "bg-gradient-secondary/80"
                              : "bg-gradient-primary"
                          }`}
                        >
                          {avatarInitials}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold">{player.username}</div>
                          <div className="text-sm text-muted-foreground">
                            Level {player.currentLevel}
                          </div>
                        </div>
                        <div className="text-primary font-bold">
                          {player.shieldCoins.toLocaleString()} pts
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <Button variant="outline" className="w-full mt-4">
                View Full Leaderboard
              </Button>
            </div>
          </div>

          {/* Scam News Sidebar - 25% */}
          <div className="w-full lg:w-80 space-y-6">
            <div className="card-glass p-6 rounded-xl sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <AlertTriangle className="w-6 h-6 text-destructive" />
                <h2 className="text-xl font-bold">Latest Scam Alerts</h2>
              </div>

              <div className="space-y-4">
                {scamNews.map((news, idx) => (
                  <div
                    key={idx}
                    className="border-l-2 border-destructive pl-4 py-2 hover:bg-muted/20 transition-colors cursor-pointer rounded-r"
                  >
                    <div
                      className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${
                        news.severity === "high"
                          ? "bg-destructive/20 text-destructive"
                          : "bg-warning/20 text-warning"
                      }`}
                    >
                      {news.severity.toUpperCase()}
                    </div>
                    <h3 className="font-bold text-sm mb-2 line-clamp-2">
                      {news.title}
                    </h3>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{news.source}</span>
                      <span>{news.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/news">
                <Button variant="outline" size="sm" className="w-full mt-4">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View All News
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ChatBot />
    </div>
  );
};

export default Dashboard;