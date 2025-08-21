import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import NewsCard from "./components/NewsCard";

function App() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        // API 1: Mediastack (menggantikan NewsAPI.org)
        const mediastackRes = await fetch(
          `http://api.mediastack.com/v1/news?access_key=a296f6272490544af7a67159490949d5&keywords=artificial+intelligence&sort=published_desc&limit=10`
        );
        const mediastackData = await mediastackRes.json();
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
          `https://gnews.io/api/v4/search?q=AI&lang=en&max=10&apikey=a0564a9699535983cfa70a84cf151d2c`
        );
        const gnewsData = await gnewsRes.json();
        const gnewsArticles = gnewsData.articles.map((article) => ({
          title: article.title,
          url: article.url,
          publishedAt: article.publishedAt,
          image: article.image || "https://placehold.co/400x200?text=AI+News",
        }));

        // API 3: NewsData.io
        const newsDataRes = await fetch(
          `https://newsdata.io/api/1/news?apikey=pub_47a9e5dd919c4f338b94da0142080d52&q=AI&language=en`
        );
        const newsDataData = await newsDataRes.json();
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
      } catch (error) {
        console.error("Error fetching news:", error);
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
