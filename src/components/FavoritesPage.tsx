import { useQuote } from "../context/QuoteContext";
import QuoteCard from "../components/QuoteCard";

export default function FavoritesPage() {
  const { quotes, favorites } = useQuote();

  const favoriteQuotes = quotes.filter((q) => favorites.includes(q.id));

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Favorite Quotes</h1>
      {favoriteQuotes.length === 0 ? (
        <p>You have no favorite quotes yet.</p>
      ) : (
        <div className="space-y-4">
          {favoriteQuotes.map((quote) => (
            <QuoteCard key={quote.id} quote={quote} />
          ))}
        </div>
      )}
    </div>
  );
}
