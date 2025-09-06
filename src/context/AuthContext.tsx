import {
  createContext,
  useReducer,
  useEffect,
  ReactNode,
  useContext,
} from "react";

export interface User {
  email: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

type AuthAction =
  | { type: "AUTH_REQUEST" }
  | { type: "AUTH_SUCCESS"; payload: { user: User; message?: string } }
  | { type: "AUTH_ERROR"; payload: string }
  | { type: "AUTH_LOGOUT" };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_REQUEST":
      return { ...state, loading: true, error: null, message: null };
    case "AUTH_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        message: action.payload.message ?? null,
      };
    case "AUTH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "AUTH_LOGOUT":
      return { user: null, loading: false, error: null, message: null };
    default:
      return state;
  }
}

interface AuthContextProps extends AuthState {
  register: (data: { email: string; password: string }) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  message: null,
};

export const AuthContext = createContext<AuthContextProps>({
  ...initialState,
  register: async () => {},
  login: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user: User = JSON.parse(stored);
      dispatch({ type: "AUTH_SUCCESS", payload: { user } });
    }
  }, []);

  async function register(data: { email: string; password: string }) {
    dispatch({ type: "AUTH_REQUEST" });
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Registration failed");

      localStorage.setItem("user", JSON.stringify(json.user));
      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user: json.user, message: "Account successfully created!" },
      });
    } catch (err: any) {
      dispatch({ type: "AUTH_ERROR", payload: err.message });
    }
  }

  async function login(data: { email: string; password: string }) {
    dispatch({ type: "AUTH_REQUEST" });
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Login failed");

      localStorage.setItem("user", JSON.stringify(json.user));
      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user: json.user, message: "Login successful!" },
      });
    } catch (err: any) {
      dispatch({ type: "AUTH_ERROR", payload: err.message });
    }
  }

  function logout() {
    localStorage.removeItem("user");
    dispatch({ type: "AUTH_LOGOUT" });
  }

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        message: state.message,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
