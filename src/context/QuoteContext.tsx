import React, {
  createContext,
  useReducer,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { Quote } from "../quotes";
import {
  fetchQuotes,
  createQuote as createQuoteDb,
  updateQuote as updateQuoteDb,
  deleteQuote as deleteQuoteDb,
} from "../services/firestore";
import { useAuth } from "./AuthContext";
import { toast } from "react-hot-toast";

interface State {
  quotes: Quote[];
  currentIndex: number;
  favorites: string[];
}

type Action =
  | { type: "SET_QUOTES"; payload: Quote[] }
  | { type: "ADD_QUOTE"; payload: Quote }
  | { type: "UPDATE_QUOTE"; payload: Partial<Quote> & { id: string } }
  | { type: "DELETE_QUOTE"; payload: string }
  | { type: "NEXT_QUOTE" }
  | { type: "TOGGLE_FAVORITE"; payload: string }
  | { type: "INCREMENT_LIKE"; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_QUOTES":
      return { ...state, quotes: action.payload };
    case "ADD_QUOTE":
      return { ...state, quotes: [...state.quotes, action.payload] };
    case "UPDATE_QUOTE":
      return {
        ...state,
        quotes: state.quotes.map((q) =>
          q.id === action.payload.id ? { ...q, ...action.payload } : q
        ),
      };
    case "DELETE_QUOTE":
      return {
        ...state,
        quotes: state.quotes.filter((q) => q.id !== action.payload),
      };
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
      const favorites = state.favorites.includes(id)
        ? state.favorites.filter((x) => x !== id)
        : [...state.favorites, id];
      return { ...state, favorites };
    }
    case "INCREMENT_LIKE": {
      const id = action.payload;
      return {
        ...state,
        quotes: state.quotes.map((q) =>
          q.id === id ? { ...q, likeCount: q.likeCount + 1 } : q
        ),
      };
    }
    default:
      return state;
  }
}

interface ContextType extends State {
  loadQuotes: () => Promise<void>;
  addQuote: (data: { text: string; author: string }) => Promise<void>;
  updateQuote: (
    id: string,
    data: Partial<{ text: string; author: string }>
  ) => Promise<void>;
  deleteQuote: (id: string) => Promise<void>;
  handleNext: () => void;
  toggleFavorite: (id: string) => void;
  likeQuote: (id: string) => void;
}

const QuoteContext = createContext<ContextType | undefined>(undefined);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(reducer, {
    quotes: [],
    currentIndex: 0,
    favorites: [],
  });

  const loadQuotes = async () => {
    try {
      const docs = await fetchQuotes();
      dispatch({ type: "SET_QUOTES", payload: docs as Quote[] });
    } catch {
      toast.error("Quotes could not be loaded");
    }
  };

  const addQuote = async (data: { text: string; author: string }) => {
    if (!user) {
      toast.error("You must log in");
      return;
    }
    try {
      const created = await createQuoteDb({
        ...data,
        createdBy: user.uid,
      });
      dispatch({ type: "ADD_QUOTE", payload: created });
      toast.success("Quote added");
    } catch {
      toast.error("Could not add quote");
    }
  };

  const updateQuote = async (
    id: string,
    data: Partial<{ text: string; author: string }>
  ) => {
    const quote = state.quotes.find((q) => q.id === id);
    if (!user || quote?.createdBy !== user.uid) {
      toast.error("You do not have permission to update this quote.");
      return;
    }
    try {
      await updateQuoteDb(id, data);
      dispatch({ type: "UPDATE_QUOTE", payload: { id, ...data } });
      toast.success("Quote updated");
    } catch {
      toast.error("Update failed");
    }
  };

  const deleteQuote = async (id: string) => {
    const quote = state.quotes.find((q) => q.id === id);
    if (!user || quote?.createdBy !== user.uid) {
      toast.error("You do not have permission to delete this quote.");
      return;
    }
    try {
      await deleteQuoteDb(id);
      dispatch({ type: "DELETE_QUOTE", payload: id });
      toast.success("Quote deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleNext = () => dispatch({ type: "NEXT_QUOTE" });
  const toggleFavorite = (id: string) =>
    dispatch({ type: "TOGGLE_FAVORITE", payload: id });
  const likeQuote = (id: string) =>
    dispatch({ type: "INCREMENT_LIKE", payload: id });

  useEffect(() => {
    loadQuotes();
  }, []);

  return (
    <QuoteContext.Provider
      value={{
        ...state,
        loadQuotes,
        addQuote,
        updateQuote,
        deleteQuote,
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
