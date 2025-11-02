// REPLACED FILE: src/pages/Landing.tsx
/*
 * REPLACED FILE: src/pages/Landing.tsx
 * The new "Pixel Game World" theme!
 */
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import "@/PixelLanding.css"; // <-- Import the styles

// Inline SVG icon components
const Shield = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path
      d="M12 2L3 5v6c0 5 3.8 9.7 9 11 5.2-1.3 9-6 9-11V5l-9-3z"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Target = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <circle cx="12" cy="12" r="8" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="4" strokeWidth="1.5" />
    <path d="M21 12h-2" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M5 12H3" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const Trophy = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M8 21h8" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 17v4" strokeWidth="1.5" strokeLinecap="round" />
    <path
      d="M17 3H7v4a5 5 0 0 0 5 5 5 5 0 0 0 5-5V3z"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 7h3v3a4 4 0 0 1-3-3V7zM21 7h-3v3a4 4 0 0 0 3-3V7z"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Users = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path
      d="M16 11a4 4 0 1 0-8 0"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 21v-1a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v1"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Zap = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path
      d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Lock = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" strokeWidth="1.5" />
    <path
      d="M7 11V8a5 5 0 0 1 10 0v3"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MessageSquare = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path
      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRight = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <polyline
      points="9 18 15 12 9 6"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Landing = () => {
  return (
    // CHANGE: Removed 'scanline-bg' class.
    <div className="min-h-screen font-pixel text-white">
      {/* Navigation - Looks like a game's top bar */}
      <nav className="pixel-box sticky top-4 left-4 right-4 z-50 mx-4">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-cyan-300" />
            <span className="text-2xl font-bold text-cyan-300 [text-shadow:_0_0_8px_theme(colors.cyan.300)]">
              Scamurai
            </span>
          </div>
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

      {/* Hero Section - The Title Screen */}
      <div className="container mx-auto px-6 py-32 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-6xl md:text-8xl font-bold leading-none">
            MASTER DIGITAL
            <br />
            SECURITY
            <br />
            THROUGH THE
            <br />
            <span className="text-pink-500 [text-shadow:_0_0_12px_theme(colors.pink.500)]">
              GAME
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
            <Link to="/">
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

      {/* Footer */}
      <footer className="pixel-box mt-20 mx-4 mb-4">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-cyan-300" />
              <span className="font-bold">Scamurai</span>
            </div>
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
