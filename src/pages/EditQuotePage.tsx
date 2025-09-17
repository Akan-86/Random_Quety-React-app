import { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useQuote } from "../context/QuoteContext";

export default function EditQuotePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { quotes, updateQuote } = useQuote();
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");

  const quote = quotes.find((q) => q.id === id);

  useEffect(() => {
    if (quote) {
      setText(quote.text);
      setAuthor(quote.author);
    }
  }, [quote]);

  // 1. Giriş yapmamış kullanıcıyı login sayfasına yönlendir
  if (!user) return <Navigate to="/login" replace />;

  // 2. Alıntı bulunamadıysa mesaj göster
  if (!quote) {
    return <div className="p-4 text-center text-red-600">Quote not found</div>;
  }

  // 3. Kullanıcı sahibi değilse ana sayfaya yönlendir
  if (quote.createdBy !== user.uid) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return; // Güvenli kontrol
    await updateQuote(id, { text, author });
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Edit Quote</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Quote Text</label>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Author</label>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Update Quote
        </button>
      </form>
    </div>
  );
}
