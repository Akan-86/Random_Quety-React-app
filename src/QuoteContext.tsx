import React, { createContext, useState, ReactNode } from "react";
import { quotes as initialQuotes, Quote } from "./quotes";

interface QuoteContextType {
  quotes: Quote[];
  currentIndex: number;
  handleNextQuoteClick: () => void;
  handleLikeQuoteClick: () => void;
}

const defaultContext: QuoteContextType = {
  quotes: [],
  currentIndex: 0,
  handleNextQuoteClick: () => {},
  handleLikeQuoteClick: () => {},
};

export const QuoteContext = createContext<QuoteContextType>(defaultContext);

interface QuoteProviderProps {
  children: ReactNode;
}

export function QuoteProvider({ children }: QuoteProviderProps) {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  function handleNextQuoteClick() {
    if (quotes.length < 2) return;
    let randomIndex: number;
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

  const value: QuoteContextType = {
    quotes,
    currentIndex,
    handleNextQuoteClick,
    handleLikeQuoteClick,
  };

  return (
    <QuoteContext.Provider value={value}>
      {children}
    </QuoteContext.Provider>
  );
}
