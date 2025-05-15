import "./App.css";
import { QuoteCard } from "./components/QuoteCard";
import { useContext } from "react";
import { QuoteContext } from "./QuoteContext";

function App() {
  const { handleNextQuoteClick, handleLikeQuoteClick } =
    useContext(QuoteContext);

  return (
    <div className="App">
      {}
      <QuoteCard />
      <button onClick={handleNextQuoteClick}>Next quote</button>
      <button onClick={handleLikeQuoteClick}>Like</button>
    </div>
  );
}

export default App;
