/*
 * REFACTOR: Applied Pixel Game World theme from Landing.tsx.
 */
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ChatBot } from "@/components/ChatBot";
import { Play, Clock, Trophy, Star, Lock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "@/PixelLanding.css"; // <-- Import the styles

const Games = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", name: "All Games", count: 45 },
    { id: "phishing", name: "Phishing Detection", count: 12 },
    { id: "websites", name: "Fake Websites", count: 10 },
    { id: "social", name: "Social Engineering", count: 8 },
    { id: "payments", name: "Payment Fraud", count: 9 },
    { id: "identity", name: "Identity Theft", count: 6 },
  ];

  const games = [
    {
      id: 1,
      title: "Email Phishing Detective",
      description:
        "Identify suspicious emails and phishing attempts in your inbox",
      category: "phishing",
      difficulty: "easy",
      duration: 5,
      xp: 100,
      players: 15234,
      rating: 4.8,
      locked: false,
      icon: "🎣",
      path: "/games/story",
    },
    {
      id: 2,
      title: "SMS Fraud Detector",
      description: "Analyze urgent text messages (smishing) to spot red flags",
      category: "social",
      difficulty: "medium",
      duration: 8,
      xp: 200,
      players: 12456,
      rating: 4.7,
      locked: false,
      icon: "📞",
      path: "/games/SMS",
    },
    {
      id: 6,
      title: "QR Code Safety Scanner",
      description:
        "Learn to identify malicious QR codes in real-world scenarios",
      category: "payments",
      difficulty: "easy",
      duration: 7,
      xp: 150,
      players: 14523,
      rating: 4.5,
      locked: true,
      icon: "📷",
      path: null,
    },
    {
      id: 7,
      title: "Identity Theft Prevention Master",
      description:
        "Protect personal information across various digital platforms",
      category: "identity",
      difficulty: "hard",
      duration: 15,
      xp: 350,
      players: 6543,
      rating: 4.9,
      locked: true,
      icon: "🔐",
      unlockRequirement: "Reach Level 15",
      path: null,
    },
    {
      id: 8,
      title: "Crypto Scam Detector",
      description: "Identify fake cryptocurrency investment schemes",
      category: "payments",
      difficulty: "medium",
      duration: 9,
      xp: 250,
      players: 11234,
      rating: 4.7,
      locked: true,
      icon: "₿",
      path: null,
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-400 bg-green-900/50 border-green-400/50";
      case "medium":
        return "text-yellow-400 bg-yellow-900/50 border-yellow-400/50";
      case "hard":
        return "text-pink-500 bg-pink-900/50 border-pink-500/50";
      default:
        return "text-gray-400 bg-gray-700/50";
    }
  };

  // Filter games based on category and search query (implementation simplified for refactoring)
  const filteredGames = games.filter((game) => {
    const matchesCategory =
      selectedCategory === "all" || game.category === selectedCategory;
    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePlayClick = (path: string | null, isLocked: boolean) => {
    if (isLocked) {
      // No action, rely on disabled button state
      return;
    }
    if (path) {
      navigate(path);
    }
  };

  return (
    // Apply pixel theme root styles
    <div className="min-h-screen font-pixel scanline-bg text-white">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-pink-500">
            Quest Library
          </h1>
          <p className="text-gray-400 text-lg">
            Master fraud detection through interactive scenarios
          </p>
        </div>

        {/* Filters - Changed card-glass to pixel-box */}
        <div className="pixel-box p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                placeholder="Search quests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 text-white border-gray-600"
              />
            </div>
            {/* Select styling adjustments (same as Dashboard.tsx) */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-64 bg-gray-800 text-white border-gray-600">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name} ({cat.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue="popular">
              <SelectTrigger className="w-full md:w-48 bg-gray-800 text-white border-gray-600">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className={`pixel-box p-6 hover:translate-y-0 hover:shadow-none transition-all cursor-pointer group ${
                game.locked ? "opacity-60" : ""
              }`}
            >
              {/* Game Icon */}
              <div className="relative mb-4">
                <div className="w-20 h-20 bg-cyan-300/20 rounded-2xl flex items-center justify-center text-4xl mx-auto border-4 border-cyan-300/50">
                  {game.icon}
                </div>
                {game.locked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Game Info */}
              <h3 className="text-xl font-bold mb-2 text-center text-cyan-300">
                {game.title}
              </h3>
              <p className="text-sm text-gray-400 mb-4 text-center line-clamp-2">
                {game.description}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center gap-4 mb-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-pink-500" />
                  <span>{game.duration} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-pink-500" />
                  <span className="text-pink-500">+{game.xp} XP</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>{game.rating}</span>
                </div>
              </div>

              {/* Difficulty Badge */}
              <div className="flex justify-center mb-4">
                <Badge className={getDifficultyColor(game.difficulty)}>
                  {game.difficulty.toUpperCase()}
                </Badge>
              </div>

              {/* Players */}
              <p className="text-xs text-center text-gray-500 mb-4">
                {game.players.toLocaleString()} participants
              </p>

              {/* Action Button */}
              {game.locked ? (
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-2">
                    {game.unlockRequirement}
                  </p>
                  <Button className="btn-pixel-alt w-full" disabled>
                    <Lock className="w-4 h-4 mr-2" />
                    ACCESS DENIED
                  </Button>
                </div>
              ) : (
                <Button
                  className="btn-pixel-main w-full text-lg"
                  onClick={() => handlePlayClick(game.path, game.locked)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  START MISSION
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Daily Challenge Banner - Changed card-glass to pixel-box */}
       
      </div>

      <ChatBot />
    </div>
  );
};

export default Games;
