import React, { useContext } from "react";
import "./QuoteCard.css";
import { QuoteContext } from "../QuoteContext";

export function QuoteCard() {
  const { quotes, currentIndex } = useContext(QuoteContext);
  const { quote, author, likeCount } = quotes[currentIndex];

  return (
    <div className="quote-card">
      {}
      <blockquote className="quote-text">"{quote}"</blockquote>
      {}
      <p className="quote-author">- {author}</p>
      {}
      <p className="quote-likes">Likes: {likeCount}</p>
    </div>
  );
}
