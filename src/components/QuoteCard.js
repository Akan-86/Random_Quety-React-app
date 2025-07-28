// src/components/QuoteCard.js
import React, { useContext } from "react";
import { QuoteContext } from "../QuoteContext";

export const QuoteCard = () => {
  const { quotes, currentIndex } = useContext(QuoteContext);
  const { quote, author, likeCount } = quotes[currentIndex];

  return (
    <div className="max-w-2xl w-full bg-white border-2 border-primary rounded-xl p-6 m-4 shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <p className="text-primary text-2xl font-semibold leading-relaxed text-center mb-4 transition-colors duration-200 hover:text-primary-dark">
        "{quote}"
      </p>
      <p className="text-primary-dark text-lg italic text-right mb-4">
        - {author}
      </p>
      <p className="text-gray-500 text-base text-center">Likes: {likeCount}</p>
    </div>
  );
};
