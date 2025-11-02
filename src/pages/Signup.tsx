/*
 * REFACTOR: Applied Pixel Game World theme from Landing.tsx.
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import "@/PixelLanding.css"; // <-- Import the styles

const API_BASE_URL = "http://localhost:5000";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name, // Mapping frontend 'name' to backend 'username'
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.message ||
          data.error ||
          "An unexpected error occurred during signup.";
        toast({
          title: "Signup Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      // Successful signup
      toast({
        title: "Account created!",
        description: "Welcome to Scamurai! Please log in.",
      });

      // Navigate to login page after successful signup
      navigate("/login");
    } catch (error) {
      console.error("Signup network error:", error);
      toast({
        title: "Network Error",
        description:
          "Could not connect to the server. Please ensure the backend is running.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    // MODIFIED: Removed 'scanline-bg'
    <div className="min-h-screen font-pixel text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo - Updated to match landing page pixel styling */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-10">
          <Shield className="w-10 h-10 text-cyan-300" />
          <span className="text-3xl font-bold text-cyan-300 [text-shadow:_0_0_8px_theme(colors.cyan.300)]">
            Scamurai
          </span>
        </Link>

        {/* Signup Card - Changed to pixel-box */}
        <div className="pixel-box p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-pink-500">Create Account</h1>
            <p className="text-gray-300">Start your fraud prevention journey</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="flex items-center gap-2 text-cyan-300"
              >
                <User className="w-4 h-4" />
                Username
              </Label>
              {/* Input styling updated for pixel theme */}
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-gray-800 text-white border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="flex items-center gap-2 text-cyan-300"
              >
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 text-white border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="flex items-center gap-2 text-cyan-300"
              >
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-800 text-white border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="flex items-center gap-2 text-cyan-300"
              >
                <Lock className="w-4 h-4" />
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-gray-800 text-white border-gray-600"
              />
            </div>

            {/* Button styling replaced with pixel classes */}
            <Button
              type="submit"
              className="btn-pixel-main w-full text-xl py-6"
              size="lg"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Separator replaced with pixel style equivalent */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-900 px-4 text-gray-400">OR</span>
            </div>
          </div>

          {/* Google Button - Replaced with pixel alt button */}
          

          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-pink-500 font-medium hover:text-cyan-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;