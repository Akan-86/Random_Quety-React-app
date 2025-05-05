import React from "react";
import "./QuoteCard.css";
export function QuoteCard({ quote, author, likeCount }) {
  return (
    <div className="quote-card">
      <p className="quote-text">"{quote}"</p>
      <p className="quote-author">- {author}</p>
      <p className="quote-likes">Likes: {likeCount}</p>
    </div>
  );
}
