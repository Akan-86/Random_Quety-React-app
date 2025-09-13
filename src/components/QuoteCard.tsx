import { useState } from "react";
import { Link } from "react-router-dom";
import { Quote } from "../quotes";
import { useAuth } from "../context/AuthContext";
import { useQuote } from "../context/QuoteContext";

interface QuoteCardProps {
  quote: Quote;
}

export default function QuoteCard({ quote }: QuoteCardProps) {
  const { user } = useAuth();
  const { deleteQuote, toggleLike, toggleFavorite, favorites } = useQuote();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isOwner = user && quote.createdBy === user.uid;
  const isFavorite = favorites.includes(quote.id);
  const hasLiked = user && quote.likedBy?.includes(user.uid);

  const handleDelete = async () => {
    await deleteQuote(quote.id);
    setShowDeleteModal(false);
  };

  return (
    <div className="border rounded p-4 shadow-sm bg-white">
      <p className="text-lg italic mb-2">"{quote.text}"</p>
      <p className="text-sm text-gray-600 mb-4">— {quote.author}</p>

      <div className="flex items-center space-x-4">
        <button
          onClick={() => toggleLike(quote.id)}
          className={`px-3 py-1 rounded ${
            hasLiked ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          👍 {quote.likeCount ?? 0}
        </button>

        <button
          onClick={() => toggleFavorite(quote.id)}
          className={`px-3 py-1 rounded ${
            isFavorite ? "bg-yellow-400 text-white" : "bg-gray-200"
          }`}
        >
          ★
        </button>

        {isOwner && (
          <>
            <Link
              to={`/quotes/${quote.id}/edit`}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Edit
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </>
        )}
      </div>

      {}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4">
              Are you sure you want to delete this quote? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
