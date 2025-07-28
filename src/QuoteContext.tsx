
import React, {
  createContext,
  useReducer,
  ReactNode
} from "react";
import { quotes as initialQuotes, Quote } from "./quotes";


interface QuoteState {
  quotes: Quote[];
  currentIndex: number;
}


type Action =
  | { type: "NEXT_QUOTE" }
  | { type: "LIKE_QUOTE" };


function quoteReducer(state: QuoteState, action: Action): QuoteState {
  switch (action.type) {
    case "NEXT_QUOTE": {
      if (state.quotes.length < 2) return state;
      let randomIndex: number;
      do {
        randomIndex = Math.floor(Math.random() * state.quotes.length);
      } while (randomIndex === state.currentIndex);
      return { ...state, currentIndex: randomIndex };
    }
    case "LIKE_QUOTE": {
      const updated = state.quotes.map((q, i) =>
        i === state.currentIndex
          ? { ...q, likeCount: q.likeCount + 1 }
          : q
      );
      return { ...state, quotes: updated };
    }
    default:
      return state;
  }
}


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
  const [state, dispatch] = useReducer(quoteReducer, {
    quotes: initialQuotes,
    currentIndex: 0,
  });

  
  const handleNextQuoteClick = () => dispatch({ type: "NEXT_QUOTE" });
  const handleLikeQuoteClick = () => dispatch({ type: "LIKE_QUOTE" });

  const value: QuoteContextType = {
    quotes: state.quotes,
    currentIndex: state.currentIndex,
    handleNextQuoteClick,
    handleLikeQuoteClick,
  };

  return (
    <QuoteContext.Provider value={value}>
      {children}
    </QuoteContext.Provider>
  );
}
