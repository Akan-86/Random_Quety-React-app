// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { QuoteProvider } from "./context/QuoteContext";
import QuotePage from "./components/QuotePage";
import FavoritesPage from "./components/FavoritesPage";

export default function App(): JSX.Element {
  return (
    <QuoteProvider>
      <Router>
        <nav className="bg-white shadow-md p-4 flex space-x-4">
          <Link to="/" className="text-blue-600 hover:underline">
            Home
          </Link>
          <Link to="/favorites" className="text-blue-600 hover:underline">
            Favorites
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<QuotePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </Router>
    </QuoteProvider>
  );
}
