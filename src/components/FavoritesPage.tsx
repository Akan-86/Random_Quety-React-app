// src/FavoritesPage.tsx
import React from "react";
import { useQuote } from "../context/QuoteContext";
import { Quote } from "../quotes";

export default function FavoritesPage(): JSX.Element {
  const { favorites, handleLike } = useQuote();

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No favorites yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5">
      <h1 className="text-3xl font-bold mb-4">My Favorite Quotes</h1>
      <ul className="space-y-4">
        {favorites.map((quote: Quote) => (
          <li
            key={quote.id}
            className="p-4 bg-white rounded-md shadow-sm flex justify-between"
          >
            <div>
              <p className="italic">"{quote.text}"</p>
              <p className="mt-2 text-right font-semibold">— {quote.author}</p>
            </div>
            <button
              onClick={() => handleLike()}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
