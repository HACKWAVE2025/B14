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
        // Filter out articles missing essential data and set state
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

  // Helper to categorize/tag an article based on content keywords
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

  // Simple severity logic based on keywords
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

  // Helper function for consistent severity badge colors
  const getSeverityColor = (severity: string) => {
    return severity === "high"
      ? "bg-destructive/20 text-destructive border-destructive/30"
      : "bg-warning/20 text-warning border-warning/30";
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
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-10 h-10 text-destructive" />
            <h1 className="text-4xl font-bold">Scam News & Alerts</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Stay updated with the latest fraud alerts and security threats
          </p>
        </div>

        {/* Stats - Keeping the mock stats structure */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card-glass p-6 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-destructive/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <div className="text-2xl font-bold">+34%</div>
                <div className="text-sm text-muted-foreground">
                  Scams this month
                </div>
              </div>
            </div>
          </div>
          <div className="card-glass p-6 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-muted-foreground">
                  Active threats
                </div>
              </div>
            </div>
          </div>
          <div className="card-glass p-6 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">Today</div>
                <div className="text-sm text-muted-foreground">
                  Last updated
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card-glass p-6 rounded-xl mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search news articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue="recent">
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="severity">Highest Severity</SelectItem>
                <SelectItem value="popular">Most Read</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <p className="text-center text-muted-foreground mt-10">
            Fetching the latest fraud news...
          </p>
        )}

        {error && !loading && (
          <div className="text-center text-destructive p-8 card-glass rounded-xl mt-10">
            <AlertTriangle className="w-8 h-8 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2">Error</h3>
            <p>{error}</p>
          </div>
        )}

        {/* News Grid */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredArticles.map((article, index) => {
              const category = categorizeArticle(article);
              const severity = getArticleSeverity(article);
              // Simple calculation for read time
              const readTime =
                Math.ceil((article.description?.length || 500) / 1000) * 2;
              const date = new Date(article.publishedAt);
              const timeAgo = formatDistanceToNow(date, { addSuffix: true });

              // Fallback for missing image
              const imageUrl =
                article.urlToImage ||
                "https://via.placeholder.com/400x200?text=FraudGuard+News";

              return (
                <a
                  key={index}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-glass p-6 rounded-xl hover:scale-[1.01] transition-transform cursor-pointer group"
                >
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-muted/20 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover transition-opacity group-hover:opacity-80"
                        onError={(e) => {
                          // Fallback to placeholder emoji if image fails
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
                        <Badge variant="outline" className="text-xs">
                          {category.toUpperCase()}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {article.description || "No description available."}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm border-t border-border pt-4">
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span>{article.source.name}</span>
                      <span>•</span>
                      <span>{timeAgo}</span>
                      <span>•</span>
                      <span>{readTime} min read</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              );
            })}

            {/* No Results Message */}
            {filteredArticles.length === 0 && searchQuery.length > 0 && (
              <div className="text-center md:col-span-2 text-muted-foreground p-8 card-glass rounded-xl">
                <Search className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-bold text-xl mb-2">No Results Found</h3>
                <p>Try adjusting your search query or filters.</p>
              </div>
            )}

            {filteredArticles.length === 0 &&
              !loading &&
              !error &&
              searchQuery.length === 0 &&
              newsArticles.length > 0 &&
              selectedCategory !== "all" && (
                <div className="text-center md:col-span-2 text-muted-foreground p-8 card-glass rounded-xl">
                  <h3 className="font-bold text-xl mb-2">
                    No Articles in This Category
                  </h3>
                  <p>Try selecting "All News" to see more articles.</p>
                </div>
              )}

            {filteredArticles.length === 0 &&
              !loading &&
              !error &&
              newsArticles.length === 0 &&
              searchQuery.length === 0 &&
              selectedCategory === "all" && (
                <div className="text-center md:col-span-2 text-muted-foreground p-8 card-glass rounded-xl">
                  <h3 className="font-bold text-xl mb-2">No Articles Found</h3>
                  <p>
                    The news source did not return any articles for the current
                    query on your server.
                  </p>
                </div>
              )}
          </div>
        )}

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="text-primary hover:underline font-medium">
            Load More Articles →
          </button>
        </div>
      </div>

      <ChatBot />
    </div>
  );
};

export default News;