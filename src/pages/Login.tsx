/*
 * REFACTOR: Applied Pixel Game World theme from Landing.tsx.
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import "@/PixelLanding.css"; // <-- Import the styles

const API_BASE_URL = "http://localhost:5000";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API call to backend /login route
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.message ||
          data.error ||
          "An unexpected error occurred during login.";
        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      // Store data
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      if (data.user) {
        localStorage.setItem("userData", JSON.stringify(data.user));
      }

      // Successful login
      toast({
        title: "Welcome back!",
        description: `Successfully logged in as ${data.user.username}`,
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Login network error:", error);
      toast({
        title: "Network Error",
        description:
          "Could not connect to the server. Please ensure the backend is running on port 5000.",
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

        {/* Login Card - Changed to pixel-box */}
        <div className="pixel-box p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-pink-500">Welcome Back</h1>
            <p className="text-gray-300">Sign in to continue your training</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="flex items-center gap-2 text-cyan-300"
              >
                <Mail className="w-4 h-4" />
                Email
              </Label>
              {/* Input styling updated for pixel theme */}
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 text-white border-gray-600"
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  disabled={loading}
                  className="border-gray-400 data-[state=checked]:bg-pink-500 data-[state=checked]:text-white"
                />
                <Label
                  htmlFor="rememberMe"
                  className="font-normal text-gray-400"
                >
                  Remember me
                </Label>
              </div>
              
            </div>

            {/* Button styling replaced with pixel classes */}
            <Button
              type="submit"
              className="btn-pixel-main w-full text-xl py-6"
              size="lg"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
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
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-pink-500 font-medium hover:text-cyan-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;