import { useQuote } from "../context/QuoteContext";
import { QuoteCard } from "./QuoteCard";

export default function QuotePage(): JSX.Element {
  const {
    quotes,
    currentIndex,
    handleNext,
    likeQuote,
    toggleFavorite,
    favorites,
  } = useQuote();
  const currentQuote = quotes[currentIndex];
  if (!currentQuote) return <p>Loading...</p>;

  const isFavorite = favorites.includes(currentQuote.id);

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col justify-center items-center p-5">
      <QuoteCard
        quote={currentQuote}
        onNext={handleNext}
        onLike={likeQuote}
        onToggleFav={toggleFavorite}
        isFavorite={isFavorite}
      />
    </div>
  );
}
