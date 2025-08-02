import React, { createContext, useReducer, ReactNode, useContext } from "react";
import { quotes as initialQuotes, Quote } from "../quotes";

interface State {
  quotes: Quote[];
  currentIndex: number;
  favorites: string[]; // sadece id tutalım
}

type Action =
  | { type: "NEXT_QUOTE" }
  | { type: "TOGGLE_FAVORITE"; payload: string }
  | { type: "INCREMENT_LIKE"; payload: string };

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

    case "TOGGLE_FAVORITE": {
      const id = action.payload;
      const isFav = state.favorites.includes(id);
      const favorites = isFav
        ? state.favorites.filter((x) => x !== id)
        : [...state.favorites, id];
      return { ...state, favorites };
    }

    case "INCREMENT_LIKE": {
      const id = action.payload;
      const quotes = state.quotes.map((q) =>
        q.id === id ? { ...q, likeCount: q.likeCount + 1 } : q
      );
      return { ...state, quotes };
    }

    default:
      return state;
  }
}

interface ContextType extends State {
  handleNext: () => void;
  toggleFavorite: (id: string) => void;
  likeQuote: (id: string) => void;
}

const QuoteContext = createContext<ContextType | undefined>(undefined);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    quotes: initialQuotes,
    currentIndex: 0,
    favorites: [],
  });

  const handleNext = () => dispatch({ type: "NEXT_QUOTE" });
  const toggleFavorite = (id: string) =>
    dispatch({ type: "TOGGLE_FAVORITE", payload: id });
  const likeQuote = (id: string) =>
    dispatch({ type: "INCREMENT_LIKE", payload: id });

  return (
    <QuoteContext.Provider
      value={{
        ...state,
        handleNext,
        toggleFavorite,
        likeQuote,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote(): ContextType {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used within QuoteProvider");
  return ctx;
}
