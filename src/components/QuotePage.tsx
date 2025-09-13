import { useQuote } from "../context/QuoteContext";
import QuoteCard from "../components/QuoteCard";

export default function QuotePage() {
  const { quotes, currentIndex, handleNext } = useQuote();

  if (quotes.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <p>Loading quotes...</p>
      </div>
    );
  }

  const currentQuote = quotes[currentIndex];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Random Quote</h1>
      <QuoteCard quote={currentQuote} />
      {quotes.length > 1 && (
        <button
          onClick={handleNext}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Next Quote
        </button>
      )}
    </div>
  );
}
