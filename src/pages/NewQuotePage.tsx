import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useQuote } from "../context/QuoteContext";

export default function NewQuotePage() {
  const { user } = useAuth();
  const { addQuote } = useQuote();
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");

  if (!user) return <Navigate to="/login" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addQuote({ text, author });
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Add New Quote</h1>
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
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Quote
        </button>
      </form>
    </div>
  );
}
