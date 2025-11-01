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
      description: "Identify suspicious emails and phishing attempts in your inbox",
      category: "phishing",
      difficulty: "easy",
      duration: 5,
      xp: 100,
      players: 15234,
      rating: 4.8,
      locked: false,
      icon: "🎣",
    },
    {
      id: 2,
      title: "Fake Banking Website Spotter",
      description: "Spot the differences between real and fake banking websites",
      category: "websites",
      difficulty: "medium",
      duration: 8,
      xp: 200,
      players: 12456,
      rating: 4.7,
      locked: false,
      icon: "🏦",
    },
    {
      id: 3,
      title: "Social Media Scam Alert",
      description: "Navigate social media scenarios and identify scam posts",
      category: "social",
      difficulty: "easy",
      duration: 6,
      xp: 120,
      players: 18932,
      rating: 4.9,
      locked: false,
      icon: "📱",
    },
    {
      id: 4,
      title: "Payment Gateway Security",
      description: "Learn to verify secure payment gateways and avoid fraud",
      category: "payments",
      difficulty: "hard",
      duration: 12,
      xp: 300,
      players: 8234,
      rating: 4.6,
      locked: false,
      icon: "💳",
    },
    {
      id: 5,
      title: "Voice Phishing Simulator",
      description: "Experience realistic vishing calls and learn to recognize them",
      category: "social",
      difficulty: "medium",
      duration: 10,
      xp: 220,
      players: 9876,
      rating: 4.8,
      locked: false,
      icon: "📞",
    },
    {
      id: 6,
      title: "QR Code Safety Scanner",
      description: "Learn to identify malicious QR codes in real-world scenarios",
      category: "payments",
      difficulty: "easy",
      duration: 7,
      xp: 150,
      players: 14523,
      rating: 4.5,
      locked: false,
      icon: "📷",
    },
    {
      id: 7,
      title: "Identity Theft Prevention Master",
      description: "Protect personal information across various digital platforms",
      category: "identity",
      difficulty: "hard",
      duration: 15,
      xp: 350,
      players: 6543,
      rating: 4.9,
      locked: true,
      icon: "🔐",
      unlockRequirement: "Reach Level 15",
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
      locked: false,
      icon: "₿",
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-success/20 text-success border-success/30";
      case "medium":
        return "bg-warning/20 text-warning border-warning/30";
      case "hard":
        return "bg-destructive/20 text-destructive border-destructive/30";
      default:
        return "bg-muted/20 text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Game Library</h1>
          <p className="text-muted-foreground text-lg">
            Master fraud detection through interactive scenarios
          </p>
        </div>

        {/* Filters */}
        <div className="card-glass p-6 rounded-xl mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name} ({cat.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue="popular">
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
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
          {games.map((game) => (
            <div
              key={game.id}
              className={`card-glass p-6 rounded-xl hover:scale-105 transition-all cursor-pointer group ${
                game.locked ? "opacity-60" : ""
              }`}
            >
              {/* Game Icon */}
              <div className="relative mb-4">
                <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center text-4xl mx-auto group-hover:shadow-glow transition-shadow">
                  {game.icon}
                </div>
                {game.locked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Game Info */}
              <h3 className="text-xl font-bold mb-2 text-center">{game.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 text-center line-clamp-2">
                {game.description}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{game.duration} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="text-primary">+{game.xp} XP</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-warning fill-warning" />
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
              <p className="text-xs text-center text-muted-foreground mb-4">
                {game.players.toLocaleString()} players
              </p>

              {/* Action Button */}
              {game.locked ? (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">{game.unlockRequirement}</p>
                  <Button variant="outline" disabled className="w-full">
                    <Lock className="w-4 h-4 mr-2" />
                    Locked
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="hero" 
                  className="w-full"
                  onClick={() => game.id === 1 ? navigate("/games/story") : null}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Play Now
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Daily Challenge Banner */}
        <div className="card-glass p-8 rounded-2xl mt-8 bg-gradient-primary/10 border border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center text-3xl shadow-glow">
                🎯
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1">Daily Challenge</h3>
                <p className="text-muted-foreground">
                  Complete today's special scenario for 2x XP!
                </p>
              </div>
            </div>
            <Button variant="hero" size="lg" className="px-8">
              Start Challenge
            </Button>
          </div>
        </div>
      </div>

      <ChatBot />
    </div>
  );
};

export default Games;
