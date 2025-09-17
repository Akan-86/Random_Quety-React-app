import {
  createContext,
  useReducer,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import {
  fetchQuotes,
  createQuote as createQuoteDb,
  updateQuote as updateQuoteDb,
  deleteQuote as deleteQuoteDb,
  toggleLikeInDb,
} from "../services/firestore";
import { useAuth } from "./AuthContext";
import { toast } from "react-hot-toast";

export interface Quote {
  id: string;
  text: string;
  author: string;
  createdAt?: number;
  createdBy: string;
  likedBy: string[];
  likeCount?: number;
}

interface State {
  quotes: Quote[];
  currentIndex: number;
  favorites: Quote[];
}

type Action =
  | { type: "SET_QUOTES"; payload: Quote[] }
  | { type: "ADD_QUOTE"; payload: Quote }
  | { type: "UPDATE_QUOTE"; payload: Partial<Quote> & { id: string } }
  | { type: "DELETE_QUOTE"; payload: string }
  | { type: "NEXT_QUOTE" };

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
  toggleLike: (id: string) => Promise<void>;
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
      const normalized: Quote[] = (docs as Quote[]).map((q) => ({
        ...q,
        likedBy: Array.isArray(q.likedBy) ? q.likedBy : [],
        likeCount: q.likedBy ? q.likedBy.length : 0,
      }));
      dispatch({ type: "SET_QUOTES", payload: normalized });
    } catch {
      toast.error("Quotes could not be loaded");
    }
  };

  const addQuote = async (data: { text: string; author: string }) => {
    if (!user) {
      toast.error("You must be logged in");
      return;
    }
    try {
      const created = await createQuoteDb({
        ...data,
        createdBy: user.uid,
        likedBy: [],
        likeCount: 0,
      });
      dispatch({ type: "ADD_QUOTE", payload: created as Quote });
      toast.success("Quote added");
    } catch {
      toast.error("Failed to add quote");
    }
  };

  const updateQuote = async (
    id: string,
    data: Partial<{ text: string; author: string }>
  ) => {
    const quote = state.quotes.find((q) => q.id === id);
    if (!user || quote?.createdBy !== user.uid) {
      toast.error("You don't have permission to update this quote");
      return;
    }
    try {
      await updateQuoteDb(id, data);
      dispatch({ type: "UPDATE_QUOTE", payload: { id, ...data } });
      toast.success("Quote updated");
    } catch {
      toast.error("Failed to update quote");
    }
  };

  const deleteQuote = async (id: string) => {
    const quote = state.quotes.find((q) => q.id === id);
    if (!user || quote?.createdBy !== user.uid) {
      toast.error("You don't have permission to delete this quote");
      return;
    }
    try {
      await deleteQuoteDb(id);
      dispatch({ type: "DELETE_QUOTE", payload: id });
      toast.success("Quote deleted");
    } catch {
      toast.error("Failed to delete quote");
    }
  };

  const toggleLike = async (id: string) => {
    if (!user) {
      toast.error("You must be logged in");
      return;
    }
    const quote = state.quotes.find((q) => q.id === id);
    if (!quote) return;

    const uid = user.uid;
    const current = Array.isArray(quote.likedBy) ? quote.likedBy : [];
    const hasLiked = current.includes(uid);

    try {
      const updatedLikedBy = await toggleLikeInDb(id, uid, hasLiked);
      dispatch({
        type: "UPDATE_QUOTE",
        payload: {
          id,
          likedBy: updatedLikedBy,
          likeCount: updatedLikedBy.length,
        },
      });
    } catch {
      toast.error("Failed to toggle like");
    }
  };

  useEffect(() => {
    void loadQuotes();
  }, []);

  return (
    <QuoteContext.Provider
      value={{
        ...state,
        loadQuotes,
        addQuote,
        updateQuote,
        deleteQuote,
        handleNext: () => dispatch({ type: "NEXT_QUOTE" }),
        toggleLike,
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
