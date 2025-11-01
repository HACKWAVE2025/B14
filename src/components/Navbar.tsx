import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Shield,
  Home,
  Gamepad2,
  User,
  LogOut,
  Bell,
  Newspaper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast"; // Import useToast
import "@/PixelLanding.css"; // <-- Import the styles

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Helper function to render pixel buttons based on active state
  const PixelNavButton = ({
    to,
    icon: Icon,
    label,
  }: {
    to: string;
    icon: React.ElementType;
    label: string;
  }) => {
    const isActive = location.pathname === to;
    return (
      <Link to={to}>
        <Button
          className={isActive ? "btn-pixel-main gap-2" : "btn-pixel-alt gap-2"}
        >
          <Icon className="w-4 h-4" />
          {label}
        </Button>
      </Link>
    );
  };

  const getUserData = () => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      try {
        return JSON.parse(userDataString);
      } catch (e) {
        console.error("Error parsing user data from localStorage:", e);
        return null;
      }
    }
    return null;
  };

  const user = getUserData();
  const username = user?.username || "Guest";
  const initials =
    username
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "AR";

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    toast({
      title: "Logged out!",
      description: "You have been successfully signed out.",
    });
    navigate("/");
  };

  return (
    // Updated navbar styling to match pixel theme
    <nav className="pixel-box sticky top-4 left-4 right-4 z-50 mx-4">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo - Updated to match landing page pixel styling */}
        <Link to="/dashboard" className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-cyan-300" />
          <span className="text-2xl font-bold text-cyan-300 [text-shadow:_0_0_8px_theme(colors.cyan.300)]">
            Scamurai
          </span>
        </Link>

        {/* Navigation Links - Using PixelNavButton */}
        <div className="flex items-center gap-2">
          <PixelNavButton to="/dashboard" icon={Home} label="Dashboard" />
          <PixelNavButton to="/games" icon={Gamepad2} label="Games" />
          <PixelNavButton to="/news" icon={Newspaper} label="News" />
          <PixelNavButton to="/profile" icon={User} label="Profile" />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-white hover:text-cyan-300"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* Custom Button for Dropdown trigger */}
              <button className="btn-pixel-alt w-16 h-10 flex items-center justify-center gap-2">
                <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center font-bold text-xs text-white">
                  {initials}
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 pixel-box">
              {" "}
              {/* Applied pixel-box to dropdown */}
              <DropdownMenuLabel className="text-white">
                My Account ({username})
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-600" />
              <DropdownMenuItem asChild>
                <Link
                  to="/profile"
                  className="cursor-pointer text-gray-200 hover:bg-gray-700/50"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-600" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-pink-500 hover:bg-gray-700/50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};
