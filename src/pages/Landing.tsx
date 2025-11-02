/*
 * REPLACED FILE: src/pages/Landing.tsx
 * The new "Pixel Game World" theme!
 */
import { Link } from "react-router-dom";
import {
  Shield,
  Target,
  Trophy,
  Users,
  Zap,
  Lock,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import "@/PixelLanding.css"; // <-- Import the styles

const Landing = () => {
  return (
    <div className="min-h-screen font-pixel scanline-bg text-white">
      {/* Navigation - Aligned extreme left (Logo) and extreme right (Buttons) */}
      <nav className="pixel-box sticky top-4 left-4 right-4 z-50 mx-4">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo/Name: Left */}
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-cyan-300" />
            <span className="text-2xl font-bold text-cyan-300 [text-shadow:_0_0_8px_theme(colors.cyan.300)]">
              Scamurai
            </span>
          </div>
          {/* Buttons: Right */}
          <div className="flex gap-4 items-center">
            <Link to="/login">
              <Button className="btn-pixel-alt">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="btn-pixel-main text-sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Title spread horizontally on large screens */}
      <div className="container mx-auto px-6 py-32 text-center">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* FIX: Decreased font size and added line breaks for better alignment */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            MASTER DIGITAL SECURITY
            <br />
            THROUGH THE
            <span className="text-pink-500 [text-shadow:_0_0_12px_theme(colors.pink.500)]">
              &nbsp;GAME
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Learn to identify scams, make safe choices, and protect yourself
            online through interactive pixel-art scenarios.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
            <Link to="/signup">
              <Button className="btn-pixel-main text-2xl px-10 py-6">
                PRESS START
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="btn-pixel-alt text-xl px-10 py-5">
                TUTORIAL
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats - Like a Character Sheet */}
        <div className="grid grid-cols-3 gap-6 pt-16 max-w-3xl mx-auto">
          <div className="pixel-box-inset p-6 space-y-2">
            <div className="text-4xl font-bold text-pink-500">50K+</div>
            <div className="text-sm text-gray-400">PLAYERS ONLINE</div>
          </div>
          <div className="pixel-box-inset p-6 space-y-2">
            <div className="text-4xl font-bold text-cyan-300">100+</div>
            <div className="text-sm text-gray-400">QUESTS</div>
          </div>
          <div className="pixel-box-inset p-6 space-y-2">
            <div className="text-4xl font-bold text-green-400">95%</div>
            <div className="text-sm text-gray-400">SUCCESS RATE</div>
          </div>
        </div>
      </div>

      {/* Features Section - Skill Tree */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">LEVEL UP YOUR SKILLS</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Learn essential security skills through gameplay.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Target,
              title: "Real-World Scenarios",
              description:
                "Face authentic fraud attempts and learn to spot red flags.",
            },
            {
              icon: Trophy,
              title: "Compete & Learn",
              description: "Earn XP, unlock items, and climb the leaderboard.",
            },
            {
              icon: Zap,
              title: "Instant Feedback",
              description:
                "Get detailed explanations after each choice to learn fast.",
            },
            {
              icon: Users,
              title: "Community Driven",
              description:
                "Join thousands learning together and challenge friends.",
            },
            {
              icon: Lock,
              title: "Expert Validated",
              description:
                "All quests reviewed by real cybersecurity professionals.",
            },
            {
              icon: MessageSquare,
              title: "AI Sidekick",
              description: "Get instant answers from our intelligent chatbot.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="pixel-box p-6 transition-all duration-150 hover:-translate-y-2 hover:shadow-[10px_10px_0px_rgba(0,0,0,0.4)]"
            >
              <div className="pixel-box-inset w-16 h-16 flex items-center justify-center mb-4">
                <feature.icon className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-cyan-300">
                {feature.title}
              </h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works - The Game Path */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">HOW TO PLAY</h2>
          <p className="text-lg text-gray-400">Your adventure starts here.</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="pixel-box p-6 text-center space-y-3">
            <div className="pixel-box-inset w-16 h-16 flex items-center justify-center mx-auto">
              <span className="text-3xl font-bold text-pink-500">1</span>
            </div>
            <h3 className="text-xl font-bold">Sign Up Free</h3>
            <p className="text-gray-400">Create your character</p>
          </div>

          <div className="text-3xl text-cyan-300 animate-pulse">» » »</div>

          <div className="pixel-box p-6 text-center space-y-3">
            <div className="pixel-box-inset w-16 h-16 flex items-center justify-center mx-auto">
              <span className="text-3xl font-bold text-pink-500">2</span>
            </div>
            <h3 className="text-xl font-bold">Choose Quest</h3>
            <p className="text-gray-400">Pick a scenario</p>
          </div>

          <div className="text-3xl text-cyan-300 animate-pulse">» » »</div>

          <div className="pixel-box p-6 text-center space-y-3">
            <div className="pixel-box-inset w-16 h-16 flex items-center justify-center mx-auto">
              <span className="text-3xl font-bold text-pink-500">3</span>
            </div>
            <h3 className="text-xl font-bold">Make Decisions</h3>
            <p className="text-gray-400">Identify the scam</p>
          </div>

          <div className="text-3xl text-cyan-300 animate-pulse">» » »</div>

          <div className="pixel-box p-6 text-center space-y-3">
            <div className="pixel-box-inset w-16 h-16 flex items-center justify-center mx-auto">
              <span className="text-3xl font-bold text-pink-500">4</span>
            </div>
            <h3 className="text-xl font-bold">Earn & Learn</h3>
            <p className="text-gray-400">Get XP and level up</p>
          </div>
        </div>
      </section>

      {/* CTA Section - The Final Level */}
      <section className="container mx-auto px-6 py-24">
        <div className="pixel-box p-12 text-center space-y-6 border-pink-500 shadow-[0_0_20px_theme(colors.pink.500)]">
          <h2 className="text-5xl font-bold">Ready for the Next Level?</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of players learning to protect themselves from
            digital payment fraud.
          </p>
          <Link to="/signup">
            <Button className="btn-pixel-main text-2xl px-12 py-6">
              Start Adventure
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer - Aligned extreme left and extreme right */}
      <footer className="pixel-box mt-20 mx-4 mb-4">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Left Content */}
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-cyan-300" />
              <span className="font-bold">Scamurai</span>
            </div>
            {/* Right Content */}
            <p className="text-sm text-gray-500">
              © 2025 Scamurai. Making digital payments safer.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
