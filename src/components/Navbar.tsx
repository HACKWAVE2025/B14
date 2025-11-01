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

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isActive = (path: string) => location.pathname === path;

  // Function to load and parse user data from localStorage
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

  // Function to handle the actual logout process
  const handleLogout = () => {
    // 1. Clear authentication data from local storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");

    // 2. Display success message
    toast({
      title: "Logged out!",
      description: "You have been successfully signed out.",
    });

    // 3. Redirect to the landing page
    navigate("/");
  };

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold gradient-text">Scamurai</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-2">
          <Link to="/dashboard">
            <Button
              variant={isActive("/dashboard") ? "default" : "ghost"}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Button>
          </Link>
          <Link to="/games">
            <Button
              variant={isActive("/games") ? "default" : "ghost"}
              className="gap-2"
            >
              <Gamepad2 className="w-4 h-4" />
              Games
            </Button>
          </Link>
          <Link to="/news">
            <Button
              variant={isActive("/news") ? "default" : "ghost"}
              className="gap-2"
            >
              <Newspaper className="w-4 h-4" />
              News
            </Button>
          </Link>
          <Link to="/profile">
            <Button
              variant={isActive("/profile") ? "default" : "ghost"}
              className="gap-2"
            >
              <User className="w-4 h-4" />
              Profile
            </Button>
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center font-bold text-sm">
                  {/* Display user initials in avatar */}
                  {initials}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account ({username})</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-destructive"
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