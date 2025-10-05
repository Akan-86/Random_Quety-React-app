import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";
import { QuoteProvider } from "./context/QuoteContext";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import QuotePage from "./components/QuotePage";
import FavoritesPage from "./components/FavoritesPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import NewQuotePage from "./pages/NewQuotePage";
import EditQuotePage from "./pages/EditQuotePage";
import { seedQuotes } from "./seed/seedQuotes";
export default function App() {
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

            <Route
              path="/quotes/new"
              element={
                <Protected>
                  <NewQuotePage />
                </Protected>
              }
            />

            <Route
              path="/quotes/:id/edit"
              element={
                <Protected>
                  <EditQuotePage />
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

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `hover:underline ${
      isActive ? "text-blue-800 font-semibold" : "text-blue-600"
    }`;

  return (
    <nav className="bg-white shadow-md p-4 flex space-x-4 items-center">
      {user ? (
        <>
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/favorites" className={linkClass}>
            Favorites
          </NavLink>
          <NavLink to="/quotes/new" className={linkClass}>
            Add Quote
          </NavLink>
          <button
            onClick={seedQuotes}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Seed Quotes
          </button>
          <button
            onClick={logout}
            className="ml-auto text-red-600 hover:underline"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>
          <NavLink to="/register" className={linkClass}>
            Register
          </NavLink>
        </>
      )}
    </nav>
  );
}

function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-600 animate-pulse">
        Loading...
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
}
