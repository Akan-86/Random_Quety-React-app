// src/QuoteContext.js
import React, { createContext, useState } from "react";
import { quotes as initialQuotes } from "./quotes";

export const QuoteContext = createContext();

export function QuoteProvider({ children }) {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [currentIndex, setCurrentIndex] = useState(0);

  function handleNextQuoteClick() {
    if (quotes.length < 2) return;
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * quotes.length);
    } while (randomIndex === currentIndex);
    setCurrentIndex(randomIndex);
  }

  function handleLikeQuoteClick() {
    setQuotes((prev) =>
      prev.map((q, i) =>
        i === currentIndex ? { ...q, likeCount: q.likeCount + 1 } : q
      )
    );
  }

  const value = {
    quotes,
    currentIndex,
    handleNextQuoteClick,
    handleLikeQuoteClick,
  };

  return (
    <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>
  );
}
