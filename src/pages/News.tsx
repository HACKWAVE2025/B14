/*
 * REFACTOR: Applied Pixel Game World theme from Landing.tsx.
 */
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ChatBot } from "@/components/ChatBot";
import {
  AlertTriangle,
  ExternalLink,
  Search,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import "@/PixelLanding.css"; // <-- Import the styles

// Interface for the fetched news article structure
interface NewsArticle {
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  source: {
    name: string;
  };
  publishedAt: string;
}

// Mock categories for filter UI (keeping the filter UI structure)
const categories = [
  { id: "all", name: "All News" },
  { id: "phishing", name: "Phishing" },
  { id: "crypto", name: "Cryptocurrency" },
  { id: "payment", name: "Payment Fraud" },
  { id: "social", name: "Social Engineering" },
  { id: "malware", name: "Malware" },
  { id: "business", name: "Business Fraud" },
];

const News = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch news data on component mount
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/news")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch news data from the server.");
        }
        return res.json();
      })
      .then((data: NewsArticle[]) => {
        setNewsArticles(data.filter((article) => article.title && article.url));
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
        setError(
          err.message ||
            "Failed to fetch news. Please check your network or server."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Helper functions
  const categorizeArticle = (article: NewsArticle) => {
    const text = (
      article.title +
      " " +
      (article.description || "")
    ).toLowerCase();
    if (text.includes("phishing") || text.includes("email")) return "phishing";
    if (text.includes("crypto") || text.includes("bitcoin")) return "crypto";
    if (
      text.includes("payment") ||
      text.includes("card") ||
      text.includes("upi") ||
      text.includes("qr code")
    )
      return "payment";
    if (
      text.includes("social engineering") ||
      text.includes("voice") ||
      text.includes("romance") ||
      text.includes("scam")
    )
      return "social";
    if (text.includes("malware") || text.includes("virus")) return "malware";
    if (
      text.includes("business") ||
      text.includes("invoice") ||
      text.includes("compromise")
    )
      return "business";
    return "all";
  };

  const getArticleSeverity = (article: NewsArticle) => {
    const text = (
      article.title +
      " " +
      (article.description || "")
    ).toLowerCase();
    if (
      text.includes("new campaign") ||
      text.includes("critical") ||
      text.includes("warning") ||
      text.includes("high")
    )
      return "high";
    return "medium";
  };

  const getSeverityColor = (severity: string) => {
    return severity === "high"
      ? "text-red-500 bg-red-900/50 border-red-500/50"
      : "text-yellow-400 bg-yellow-900/50 border-yellow-400/50";
  };

  const filteredArticles = newsArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.description &&
        article.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const articleCategory = categorizeArticle(article);
    const matchesCategory =
      selectedCategory === "all" || selectedCategory === articleCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    // Apply pixel theme root styles
    <div className="min-h-screen font-pixel scanline-bg text-white">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-10 h-10 text-pink-500" />
            <h1 className="text-4xl font-bold text-cyan-300">
              System Alerts & News
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Stay updated with the latest fraud alerts and security threats
          </p>
        </div>

        {/* Stats - Changed card-glass to pixel-box-inset */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="pixel-box p-6">
            <div className="flex items-center gap-4">
              <div className="pixel-box-inset w-12 h-12 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-pink-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-500">+34%</div>
                <div className="text-sm text-gray-400">Threat Activity</div>
              </div>
            </div>
          </div>
          <div className="pixel-box p-6">
            <div className="flex items-center gap-4">
              <div className="pixel-box-inset w-12 h-12 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">12</div>
                <div className="text-sm text-gray-400">Active Threats</div>
              </div>
            </div>
          </div>
          <div className="pixel-box p-6">
            <div className="flex items-center gap-4">
              <div className="pixel-box-inset w-12 h-12 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-cyan-300" />
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-300">Today</div>
                <div className="text-sm text-gray-400">Last updated</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters - Changed card-glass to pixel-box */}
        <div className="pixel-box p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                placeholder="Search articles..."
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
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue="recent">
              <SelectTrigger className="w-full md:w-48 bg-gray-800 text-white border-gray-600">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="severity">Highest Severity</SelectItem>
                <SelectItem value="popular">Most Read</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading and Error States - Changed card-glass to pixel-box */}
        {loading && (
          <p className="text-center text-gray-400 mt-10">
            Fetching the latest fraud intelligence...
          </p>
        )}

        {error && !loading && (
          <div className="text-center text-red-500 p-8 pixel-box mt-10">
            <AlertTriangle className="w-8 h-8 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2">ACCESS DENIED</h3>
            <p className="text-gray-400">{error}</p>
          </div>
        )}

        {/* News Grid */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredArticles.map((article, index) => {
              const category = categorizeArticle(article);
              const severity = getArticleSeverity(article);
              const readTime =
                Math.ceil((article.description?.length || 500) / 1000) * 2;
              const date = new Date(article.publishedAt);
              const timeAgo = formatDistanceToNow(date, { addSuffix: true });

              const imageUrl =
                article.urlToImage ||
                "https://via.placeholder.com/400x200?text=System+Log";

              return (
                <a
                  key={index}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  // Changed card-glass to pixel-box
                  className="pixel-box p-6 hover:translate-y-0 hover:shadow-none transition-all cursor-pointer group"
                >
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 pixel-box-inset flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover transition-opacity group-hover:opacity-80"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/64x64?text=📰";
                          e.currentTarget.onerror = null;
                          e.currentTarget.className =
                            "w-full h-full object-contain p-2";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex gap-2 mb-2 flex-wrap">
                        <Badge className={getSeverityColor(severity)}>
                          {severity.toUpperCase()} ALERT
                        </Badge>
                        <Badge className="text-cyan-300 bg-cyan-900/50 border-cyan-300/50 text-xs">
                          {category.toUpperCase()}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-pink-500 transition-colors line-clamp-2 text-cyan-300">
                        {article.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 mb-4 line-clamp-3">
                    {article.description ||
                      "No description available. Accessing direct log entry..."}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm border-t border-gray-600 pt-4">
                    <div className="flex items-center gap-4 text-gray-500">
                      <span>{article.source.name}</span>
                      <span>•</span>
                      <span>{timeAgo}</span>
                      <span>•</span>
                      <span>{readTime} min read</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-pink-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              );
            })}

            {/* No Results Message - Changed card-glass to pixel-box */}
            {filteredArticles.length === 0 && searchQuery.length > 0 && (
              <div className="text-center md:col-span-2 text-gray-400 p-8 pixel-box">
                <Search className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-bold text-xl mb-2 text-pink-500">
                  No Data Logs Found
                </h3>
                <p>Try adjusting your search query or filters.</p>
              </div>
            )}

            {/* Catch-all no article message */}
            {filteredArticles.length === 0 &&
              !loading &&
              !error &&
              newsArticles.length === 0 && (
                <div className="text-center md:col-span-2 text-gray-400 p-8 pixel-box">
                  <h3 className="font-bold text-xl mb-2 text-pink-500">
                    No New Articles Available
                  </h3>
                  <p>System awaits new threat intelligence reports.</p>
                </div>
              )}
          </div>
        )}

        {/* Load More Button - Changed to pixel alt button */}
        <div className="text-center mt-8">
          <button className="btn-pixel-alt px-8 py-2 font-bold">
            LOAD MORE DATA →
          </button>
        </div>
      </div>

      <ChatBot />
    </div>
  );
};

export default News;
