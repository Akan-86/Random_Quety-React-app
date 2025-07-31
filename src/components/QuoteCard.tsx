// src/QuoteCard.tsx
import React from "react";
import { Quote } from "../quotes";

interface Props {
  quote: Quote;
  onNext: () => void;
  onToggleFav: () => void;
  isFavorite: boolean;
}

export function QuoteCard({ quote, onNext, onToggleFav, isFavorite }: Props) {
  return (
    <div className="max-w-xl bg-white rounded-lg shadow-lg p-6 text-center">
      <p className="text-2xl font-semibold italic">“{quote.text}”</p>
      <p className="mt-4 text-lg">— {quote.author}</p>
      <p className="mt-2 text-sm text-gray-500">Likes: {quote.likeCount}</p>
      <div className="mt-4 space-x-4">
        <button
          onClick={onNext}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
        <button
          onClick={onToggleFav}
          className={`px-4 py-2 rounded ${
            isFavorite ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {isFavorite ? "Unfavorite" : "Favorite"}
        </button>
      </div>
    </div>
  );
}
