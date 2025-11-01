/*
 * REFACTOR: Applied Pixel Game World theme from Landing.tsx.
 */
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
import "@/PixelLanding.css"; // <-- Import the styles

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

  // Mock XP calculation (re-added for progress bar placeholders)
  const currentLevel = profile?.currentLevel || 1;
  const xp = currentLevel * 8400;
  const xpToNext = (currentLevel + 1) * 10000;
  const percentage = (xp / xpToNext) * 100;

  if (loading) {
    return (
      <div className="min-h-screen font-pixel scanline-bg text-white">
        <Navbar />
        <div className="container mx-auto px-6 py-8 flex justify-center items-center h-[50vh]">
          <p className="text-xl text-gray-400">Loading user profile...</p>
        </div>
        <ChatBot />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen font-pixel scanline-bg text-white">
        <Navbar />
        <div className="container mx-auto px-6 py-8 text-center max-w-xl">
          <div className="pixel-box p-8">
            {" "}
            {/* Changed card-glass to pixel-box */}
            <AlertTriangle className="w-12 h-12 mx-auto text-pink-500 mb-4" />
            <h1 className="text-3xl font-bold mb-2 text-pink-500">
              Profile Error
            </h1>
            <p className="text-gray-400 mb-4">
              {error ||
                "Profile data could not be loaded. Please ensure you are logged in."}
            </p>
            <Button
              className="btn-pixel-alt"
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
    // Apply pixel theme root styles
    <div className="min-h-screen font-pixel scanline-bg text-white">
      <Navbar />

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Profile Header - Changed card-glass to pixel-box */}
        <div className="pixel-box p-8 mb-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-cyan-300/50 border-4 border-cyan-300 rounded-2xl flex items-center justify-center text-5xl font-bold text-gray-900 shadow-glow">
                {getAvatarInitials(profile.username)}
              </div>
              <div className="absolute -bottom-2 -right-2 pixel-box-inset border-2 border-pink-500/80 px-3 py-1 font-bold text-sm text-pink-500">
                Lvl {profile.currentLevel}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2 text-pink-500">
                {profile.username}
              </h1>
              <div className="flex items-center gap-4 text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4 text-cyan-300" />
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
                  <span className="font-bold text-cyan-300">
                    Level {profile.currentLevel}
                  </span>
                  <span className="text-gray-400">
                    {xp} / {xpToNext} XP
                  </span>
                </div>
                <Progress value={percentage} className="h-3 bg-gray-700">
                  <div
                    style={{ width: `${percentage}%` }}
                    className="h-full bg-pink-500"
                  ></div>{" "}
                  {/* Customizing Progress bar for pixel theme */}
                </Progress>
                <p className="text-xs text-gray-500">
                  {xpToNext - xp} XP until next promotion (
                  {profile.currentLevel + 1})
                </p>
              </div>
            </div>

            {/* Actions (Kept for completeness) - Replaced with pixel buttons */}
            <div className="space-y-2">
              <Button className="btn-pixel-main">Edit Profile</Button>
              <Button className="btn-pixel-alt w-full">Share Profile</Button>
            </div>
          </div>
        </div>

        {/* --- STATS SUMMARY --- */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Summary - Changed card-glass to pixel-box */}
            <div className="pixel-box p-6">
              <h2 className="text-2xl font-bold mb-6 text-cyan-300">
                Player Data Overview
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 pixel-box-inset">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-pink-500" />
                    <span className="text-sm text-gray-300">Shield Coins</span>
                  </div>
                  <span className="font-bold text-pink-500">
                    {profile.shieldCoins.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 pixel-box-inset">
                  <div className="flex items-center gap-3">
                    <Flame className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm text-gray-300">
                      Current Streak
                    </span>
                  </div>
                  <span className="font-bold text-yellow-400">
                    {profile.currentStreak} days
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 pixel-box-inset">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-gray-300">Current Level</span>
                  </div>
                  <span className="font-bold text-green-400">
                    {profile.currentLevel}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 pixel-box-inset">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-cyan-300" />
                    <span className="text-sm text-gray-300">Registry Date</span>
                  </div>
                  <span className="font-bold text-cyan-300">
                    {formatJoinedDate(profile.registered)}
                  </span>
                </div>
              </div>
            </div>

            {/* Placeholder - Changed card-glass to pixel-box */}
            <div className="pixel-box p-6">
              <h2 className="text-2xl font-bold mb-4 text-pink-500">
                Combat Log Analysis
              </h2>
              <p className="text-gray-400">
                Detailed performance metrics (Accuracy, Category Mastery, Recent
                Activity) will be displayed here once game data integration is
                complete.
              </p>
            </div>
          </div>

          {/* Right Column - 1/3 (Kept for layout structure) - Changed card-glass to pixel-box */}
          <div className="space-y-6 lg:col-span-1">
            <div className="pixel-box p-6 border-pink-500/50 shadow-[0_0_10px_rgba(236,72,153,0.5)]">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-pink-500" />
                <h3 className="font-bold text-cyan-300">Daily Challenge Log</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Complete today's challenge for bonus XP!
              </p>
              <Button className="btn-pixel-main w-full">Start Challenge</Button>
            </div>
          </div>
        </div>
      </div>

      <ChatBot />
    </div>
  );
};

export default Profile;

// Kept dummy functions (X and Gamepad2)
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
