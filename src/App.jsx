import { QuoteCard } from "./components/QuoteCard";
import { useContext } from "react";
import { QuoteContext } from "./QuoteContext";

function App() {
  const { handleNextQuoteClick, handleLikeQuoteClick } =
    useContext(QuoteContext);

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col justify-center items-center p-5">
      <QuoteCard />
      <div className="mt-4">
        <button
          onClick={handleNextQuoteClick}
          className="m-2 px-6 py-3 text-xl font-bold text-white bg-gradient-to-r from-[#ff006a] to-[#e60073] rounded-md shadow-md transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none"
        >
          Next quote
        </button>
        <button
          onClick={handleLikeQuoteClick}
          className="m-2 px-6 py-3 text-xl font-bold text-white bg-gradient-to-r from-[#ff006a] to-[#e60073] rounded-md shadow-md transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none"
        >
          Like
        </button>
      </div>
    </div>
  );
}

export default App;
