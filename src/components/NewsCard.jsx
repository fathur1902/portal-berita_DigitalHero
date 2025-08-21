import React from "react";

const NewsCard = ({ article }) => {
  const { title, url, publishedAt, image } = article;
  const date = new Date(publishedAt).toLocaleString();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-5">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-2">
          {title}
        </h2>
        <p className="text-gray-500 mb-4 text-sm">Dipublikasikan: {date}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition duration-200"
        >
          Baca Selengkapnya
        </a>
      </div>
    </div>
  );
};

export default NewsCard;
