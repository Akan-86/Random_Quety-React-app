import {
  createContext,
  useReducer,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

export interface User {
  uid: string;
  email: string | null;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

type AuthAction =
  | { type: "AUTH_REQUEST" }
  | { type: "AUTH_SUCCESS"; payload: { user: User | null; message?: string } }
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
  logout: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  loading: true, // başlangıçta true
  error: null,
  message: null,
};

export const AuthContext = createContext<AuthContextProps>({
  ...initialState,
  register: async () => {},
  login: async () => {},
  logout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

function getFriendlyErrorMessage(code: string) {
  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already registered.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email or password.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          dispatch({
            type: "AUTH_SUCCESS",
            payload: {
              user: { uid: firebaseUser.uid, email: firebaseUser.email },
            },
          });
        } else {
          dispatch({ type: "AUTH_LOGOUT" });
        }
      }
    );
    return () => unsubscribe();
  }, []);

  async function register({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    dispatch({ type: "AUTH_REQUEST" });
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      dispatch({
        type: "AUTH_SUCCESS",
        payload: {
          user: { uid: auth.currentUser!.uid, email: auth.currentUser!.email },
          message: "Account created!",
        },
      });
    } catch (err: any) {
      dispatch({
        type: "AUTH_ERROR",
        payload: getFriendlyErrorMessage(err.code || ""),
      });
    }
  }

  async function login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    dispatch({ type: "AUTH_REQUEST" });
    try {
      await signInWithEmailAndPassword(auth, email, password);
      dispatch({
        type: "AUTH_SUCCESS",
        payload: {
          user: { uid: auth.currentUser!.uid, email: auth.currentUser!.email },
          message: "Login successful!",
        },
      });
    } catch (err: any) {
      dispatch({
        type: "AUTH_ERROR",
        payload: getFriendlyErrorMessage(err.code || ""),
      });
    }
  }

  async function logout() {
    await signOut(auth);
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
