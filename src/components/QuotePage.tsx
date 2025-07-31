// src/QuotePage.tsx
import React from "react";
import { useQuote } from "../context/QuoteContext";
import { QuoteCard } from "./QuoteCard";

export default function QuotePage(): JSX.Element {
  const { quotes, currentIndex, handleNext, handleLike, favorites } =
    useQuote();
  const currentQuote = quotes[currentIndex];
  if (!currentQuote) return <p>Loading...</p>;

  const isFavorite = favorites.some((q) => q.id === currentQuote.id);

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col justify-center items-center p-5">
      <QuoteCard
        quote={currentQuote}
        onNext={handleNext}
        onToggleFav={handleLike}
        isFavorite={isFavorite}
      />
    </div>
  );
}
