import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { QuoteProvider } from "./context/QuoteContext";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import QuotePage from "./components/QuotePage";
import FavoritesPage from "./components/FavoritesPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

export default function App(): JSX.Element {
  return (
    <AuthProvider>
      <QuoteProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/"
              element={
                <Protected>
                  <QuotePage />
                </Protected>
              }
            />

            <Route
              path="/favorites"
              element={
                <Protected>
                  <FavoritesPage />
                </Protected>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </QuoteProvider>
    </AuthProvider>
  );
}

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-md p-4 flex space-x-4 items-center">
      {user ? (
        <>
          <Link to="/" className="text-blue-600 hover:underline">
            Home
          </Link>
          <Link to="/favorites" className="text-blue-600 hover:underline">
            Favorites
          </Link>
          <button
            onClick={logout}
            className="ml-auto text-red-600 hover:underline"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </>
      )}
    </nav>
  );
}

function Protected({ children }: { children: JSX.Element }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
}
