import { Quote } from "../quotes";
import { useAuth } from "../context/AuthContext";
import { useQuote } from "../context/QuoteContext";
import { toast } from "react-hot-toast";

interface Props {
  quote: Quote;
  onNext: () => void;
  onToggleFav: (id: string) => void;
  onLike: (id: string) => void;
  isFavorite: boolean;
}

export function QuoteCard({
  quote,
  onNext,
  onToggleFav,
  onLike,
  isFavorite,
}: Props) {
  const { user } = useAuth();
  const { deleteQuote } = useQuote();

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quote?"
    );
    if (!confirmDelete) return;

    try {
      await deleteQuote(quote.id);
      toast.success("Quote deleted");
    } catch {
      toast.error("Failed to delete quote");
    }
  };

  return (
    <div className="max-w-xl bg-white rounded-lg shadow-lg p-6 text-center">
      <p className="text-2xl font-semibold italic">“{quote.text}”</p>
      <p className="mt-4 text-lg">— {quote.author}</p>

      <div className="mt-2 flex items-center justify-center space-x-4">
        <button
          onClick={() => onLike(quote.id)}
          type="button"
          aria-label={`Like, current like count ${quote.likeCount}`}
          className="px-3 py-1 bg-yellow-400 text-white rounded"
        >
          👍 {quote.likeCount}
        </button>

        <button
          onClick={() => onToggleFav(quote.id)}
          type="button"
          aria-pressed={isFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className={`px-3 py-1 rounded ${
            isFavorite ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {isFavorite ? "Unfavorite" : "Favorite"}
        </button>

        {}
        {user?.uid === quote.createdBy && (
          <button
            onClick={handleDelete}
            type="button"
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        )}
      </div>

      <div className="mt-4">
        <button
          onClick={onNext}
          type="button"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
