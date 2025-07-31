// src/QuoteContext.tsx
import React, { createContext, useReducer, ReactNode, useContext } from "react";
import { quotes as initialQuotes, Quote } from "../quotes";

interface State {
  quotes: Quote[];
  currentIndex: number;
  favorites: Quote[];
}

type Action = { type: "NEXT_QUOTE" } | { type: "LIKE_QUOTE" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "NEXT_QUOTE": {
      if (state.quotes.length < 2) return state;
      let idx: number;
      do {
        idx = Math.floor(Math.random() * state.quotes.length);
      } while (idx === state.currentIndex);
      return { ...state, currentIndex: idx };
    }
    case "LIKE_QUOTE": {
      const q = state.quotes[state.currentIndex];
      const isFav = state.favorites.find((x) => x.id === q.id);
      const favs = isFav
        ? state.favorites.filter((x) => x.id !== q.id)
        : [...state.favorites, q];
      return { ...state, favorites: favs };
    }
    default:
      return state;
  }
}

interface ContextType extends State {
  handleNext: () => void;
  handleLike: () => void;
}

const QuoteContext = createContext<ContextType | undefined>(undefined);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    quotes: initialQuotes,
    currentIndex: 0,
    favorites: [],
  });

  const handleNext = () => dispatch({ type: "NEXT_QUOTE" });
  const handleLike = () => dispatch({ type: "LIKE_QUOTE" });

  return (
    <QuoteContext.Provider value={{ ...state, handleNext, handleLike }}>
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote(): ContextType {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used within QuoteProvider");
  return ctx;
}
