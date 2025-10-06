import { useQuote } from "../context/QuoteContext";
import QuoteCard from "../components/QuoteCard";

export default function QuotePage() {
  const { quotes, currentIndex, handleNext } = useQuote();

  // Yüklenme veya hiç alıntı yoksa
  if (!quotes || quotes.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <p className="text-gray-600">Loading quotes...</p>
      </div>
    );
  }

  // Güvenli erişim
  const currentQuote = quotes[currentIndex] ?? quotes[0];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Random Quote</h1>

      <QuoteCard quote={currentQuote} />

      {quotes.length > 1 && (
        <div className="flex justify-center">
          <button
            onClick={handleNext}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Next Quote
          </button>
        </div>
      )}
    </div>
  );
}
