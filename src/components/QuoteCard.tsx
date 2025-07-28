import React, { useContext } from "react";
import { QuoteContext } from "../QuoteContext";

export function QuoteCard() {
  const { quotes, currentIndex } = useContext(QuoteContext);
  const currentQuote = quotes[currentIndex];

  return (
    <div className="max-w-xl bg-white rounded-lg shadow-lg p-6 text-center">
      <p className="text-2xl font-semibold text-gray-800 italic">
        "{currentQuote.quote}"
      </p>
      <p className="mt-4 text-lg text-gray-600">- {currentQuote.author}</p>
      <p className="mt-2 text-sm text-gray-500">
        Likes: {currentQuote.likeCount}
      </p>
    </div>
  );
}
