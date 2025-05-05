// App.js
import { quotes as initialQuotes } from "./quotes";
import "./App.css";
import { QuoteCard } from "./components/QuoteCard";
import { useState } from "react";

function App() {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [currentIndex, setCurrentIndex] = useState(0);

  function handleNextQuoteClick() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentIndex(randomIndex);
  }

  function handleLikeQuoteClick() {
    const updatedQuotes = quotes.map((quote, index) => {
      if (index === currentIndex) {
        return { ...quote, likeCount: quote.likeCount + 1 };
      }
      return quote;
    });
    setQuotes(updatedQuotes);
  }

  return (
    <div className="App">
      <QuoteCard
        quote={quotes[currentIndex].quote}
        author={quotes[currentIndex].author}
        likeCount={quotes[currentIndex].likeCount}
      />
      <button onClick={handleNextQuoteClick}>Next quote</button>
      <button onClick={handleLikeQuoteClick}>Like</button>
    </div>
  );
}

export default App;
