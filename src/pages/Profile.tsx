import { Navbar } from "@/components/Navbar";
import { ChatBot } from "@/components/ChatBot";
import {
  Trophy,
  Flame,
  Target,
  Calendar,
  Shield,
  User,
  Mail,
  AlertTriangle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:5000";

// Interface reflecting the data structure from the /profile endpoint
interface UserProfile {
  id: string;
  username: string;
  email: string;
  currentLevel: number;
  shieldCoins: number;
  currentStreak: number;
  registered: string;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile data
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setError("Authentication token missing. Please log in.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
          method: "GET",
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch profile data.");
        } 

        setProfile(data.user);
      } catch (err: any) {
        console.error("Profile fetch error:", err.message);
        setError(err.message || "Could not retrieve profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Helper functions for UI representation
  const getAvatarInitials = (username: string) => {
    return (
      username
        .split(/\s+/)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2) || "AR"
    );
  };

  const formatJoinedDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // Mock XP calculation based on currentLevel (Aligning with Dashboard logic for UX)
  const currentLevel = profile?.currentLevel || 1;
  const xp = currentLevel * 8400;
  const xpToNext = (currentLevel + 1) * 10000;
  const percentage = (xp / xpToNext) * 100;

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-6 py-8 flex justify-center items-center h-[50vh]">
          <p className="text-xl text-muted-foreground">
            Loading user profile...
          </p>
        </div>
        <ChatBot />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-6 py-8 text-center max-w-xl">
          <div className="card-glass p-8 rounded-2xl">
            <AlertTriangle className="w-12 h-12 mx-auto text-destructive mb-4" />
            <h1 className="text-3xl font-bold mb-2 text-destructive">
              Profile Error
            </h1>
            <p className="text-muted-foreground mb-4">
              {error ||
                "Profile data could not be loaded. Please ensure you are logged in."}
            </p>
            <Button
              variant="outline"
              onClick={() =>
                localStorage.clear() || window.location.replace("/login")
              }
            >
              Go to Login
            </Button>
          </div>
        </div>
        <ChatBot />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Profile Header */}
        <div className="card-glass p-8 rounded-2xl mb-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-primary rounded-2xl flex items-center justify-center text-5xl font-bold shadow-glow">
                {getAvatarInitials(profile.username)}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-card border-4 border-background rounded-full px-3 py-1 font-bold text-sm">
                Lvl {profile.currentLevel}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{profile.username}</h1>
              <div className="flex items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <p className="text-sm">{profile.email}</p>
                </div>
                <span>•</span>
                <p className="text-sm">
                  Joined {formatJoinedDate(profile.registered)}
                </p>
              </div>

              {/* Level Progress */}
              <div className="space-y-2 mb-6 max-w-md">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">
                    Level {profile.currentLevel}
                  </span>
                  <span className="text-muted-foreground">
                    {xp} / {xpToNext} XP
                  </span>
                </div>
                <Progress value={percentage} className="h-3" />
                <p className="text-xs text-muted-foreground">
                  {xpToNext - xp} XP to level {profile.currentLevel + 1}
                </p>
              </div>
            </div>

            {/* Actions (Kept for completeness) */}
            <div className="space-y-2">
              <Button variant="hero">Edit Profile</Button>
              <Button variant="outline" className="w-full">
                Share Profile
              </Button>
            </div>
          </div>
        </div>

        {/* --- STATS SUMMARY (LEFT COLUMN REMOVED, STATS MOVED TO FILL SPACE) --- */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Summary - Based on live data */}
            <div className="card-glass p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-6">Personal Statistics</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-primary" />
                    <span className="text-sm">Shield Coins</span>
                  </div>
                  <span className="font-bold text-primary">
                    {profile.shieldCoins.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Flame className="w-5 h-5 text-warning" />
                    <span className="text-sm">Current Streak</span>
                  </div>
                  <span className="font-bold text-warning">
                    {profile.currentStreak} days
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-success" />
                    <span className="text-sm">Current Level</span>
                  </div>
                  <span className="font-bold text-success">
                    {profile.currentLevel}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-secondary" />
                    <span className="text-sm">Member Since</span>
                  </div>
                  <span className="font-bold">
                    {formatJoinedDate(profile.registered)}
                  </span>
                </div>
              </div>
            </div>

            {/* Placeholder for future growth or complex statistics */}
            <div className="card-glass p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">
                Mastery and Performance
              </h2>
              <p className="text-muted-foreground">
                Detailed performance metrics (Accuracy, Category Mastery, Recent
                Activity) will be displayed here once game data integration is
                complete.
              </p>
            </div>
          </div>

          {/* Right Column - 1/3 (Kept for layout structure) */}
          <div className="space-y-6 lg:col-span-1">
            <div className="card-glass p-6 rounded-xl bg-gradient-primary/10 border border-primary/30">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-bold">Daily Challenge</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Complete today's challenge for bonus XP!
              </p>
              <Button variant="hero" className="w-full">
                Start Challenge
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ChatBot />
    </div>
  );
};

export default Profile;

// Kept dummy functions to avoid import errors if they are used elsewhere (they aren't here, but good practice)
function X(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function Gamepad2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="6" x2="10" y1="11" y2="11" />
      <line x1="8" x2="8" y1="9" y2="13" />
      <line x1="15" x2="15.01" y1="12" y2="12" />
      <line x1="18" x2="18.01" y1="10" y2="10" />
      <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
    </svg>
  );
}
