import React, { useContext } from "react";
import { QuoteContext } from "../QuoteContext";

export const QuoteCard = () => {
  const { quotes, currentIndex } = useContext(QuoteContext);
  const currentQuote = quotes[currentIndex];

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <p className="text-gray-800 text-xl font-serif">"{currentQuote.quote}"</p>
      <p className="text-gray-500 mt-4 text-lg">- {currentQuote.author}</p>
      <p className="text-gray-600 mt-2">Likes: {currentQuote.likeCount}</p>
    </div>
  );
};
