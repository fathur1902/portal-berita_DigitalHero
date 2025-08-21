import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import NewsCard from "./components/NewsCard";

function App() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState("Initializing...");

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      setError(null);
      setDebugInfo("Fetching news...");
      try {
        // API 1: Mediastack
        const mediastackRes = await fetch(
          `https://api.mediastack.com/v1/news?access_key=${import.meta.env.VITE_MEDIASTACK_KEY}&keywords=artificial+intelligence&sort=published_desc&limit=10`
        );
        setDebugInfo(`Mediastack status: ${mediastackRes.status}`);
        if (!mediastackRes.ok) {
          throw new Error(
            `Mediastack error: ${mediastackRes.status} ${mediastackRes.statusText}`
          );
        }
        const mediastackData = await mediastackRes.json();
        // console.log("Mediastack data:", mediastackData); // Debug
        const mediastackArticles = (mediastackData.data || []).map(
          (article) => ({
            title: article.title,
            url: article.url,
            publishedAt: article.published_at,
            image: article.image || "https://placehold.co/400x200?text=AI+News",
          })
        );

        // API 2: GNews.io
        const gnewsRes = await fetch(
          `https://gnews.io/api/v4/search?q=AI&lang=en&max=10&apikey=${import.meta.env.VITE_GNEWS_KEY}`
        );
        setDebugInfo(`GNews status: ${gnewsRes.status}`);
        if (!gnewsRes.ok) {
          throw new Error(
            `GNews error: ${gnewsRes.status} ${gnewsRes.statusText}`
          );
        }
        const gnewsData = await gnewsRes.json();
        // console.log("GNews data:", gnewsData); // Debug
        const gnewsArticles = gnewsData.articles.map((article) => ({
          title: article.title,
          url: article.url,
          publishedAt: article.publishedAt,
          image: article.image || "https://placehold.co/400x200?text=AI+News",
        }));

        // API 3: NewsData.io
        const newsDataRes = await fetch(
          `https://newsdata.io/api/1/news?apikey=${import.meta.env.VITE_NEWSDATA_KEY}&q=AI&language=en`
        );
        setDebugInfo(`NewsData status: ${newsDataRes.status}`);
        if (!newsDataRes.ok) {
          throw new Error(
            `NewsData error: ${newsDataRes.status} ${newsDataRes.statusText}`
          );
        }
        const newsDataData = await newsDataRes.json();
        // console.log("NewsData data:", newsDataData); // Debug
        const newsDataArticles = (newsDataData.results || []).map(
          (article) => ({
            title: article.title,
            url: article.link,
            publishedAt: article.pubDate,
            image:
              article.image_url || "https://placehold.co/400x200?text=AI+News",
          })
        );

        const allNews = [
          ...mediastackArticles,
          ...gnewsArticles,
          ...newsDataArticles,
        ];
        const uniqueNews = allNews.filter(
          (article, index, self) =>
            index === self.findIndex((t) => t.title === article.title)
        );
        const sortedNews = uniqueNews.sort(
          (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
        );

        setNews(sortedNews);
        setFilteredNews(sortedNews);
        setDebugInfo(`Fetched ${sortedNews.length} articles`);
      } catch (error) {
        console.error("Error fetching news:", error);
        setError(`Gagal mengambil berita: ${error.message}`);
        setDebugInfo(`Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = news.filter((article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNews(filtered);
    } else {
      setFilteredNews(news);
    }
  }, [searchQuery, news]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-800 drop-shadow-md">
          Berita Utama AI Terbaru
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <p className="text-center text-gray-600 mb-4">Debug: {debugInfo}</p>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((article, index) => (
                <NewsCard key={index} article={article} />
              ))}
            </div>
            {filteredNews.length === 0 && (
              <p className="text-center text-gray-600 text-lg mt-8">
                Tidak ada berita yang cocok dengan pencarian Anda. Coba kata
                kunci lain!
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
