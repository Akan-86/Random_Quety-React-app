export interface Quote {
  id: string;
  text: string;
  author: string;
  likeCount: number;
  likedBy?: string[]; // List of user UIDs who liked this quote
  createdBy?: string; // UID of the user who created this quote
}

const rawQuotes = [
  {
    quote: "Be yourself; everyone else is already taken.",
    author: "Oscar Wilde",
    likeCount: 0,
  },
  {
    quote: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    likeCount: 0,
  },
  {
    quote: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    likeCount: 0,
  },
  {
    quote: "What you do today can improve all your tomorrows.",
    author: "Ralph Marston",
    likeCount: 0,
  },
  {
    quote: "It always seems impossible until it’s done.",
    author: "Nelson Mandela",
    likeCount: 0,
  },
  {
    quote: "If you can dream it, you can do it.",
    author: "Walt Disney",
    likeCount: 0,
  },
  {
    quote: "Stay hungry. Stay foolish.",
    author: "Steve Jobs",
    likeCount: 0,
  },
  {
    quote: "Whatever you are, be a good one.",
    author: "Abraham Lincoln",
    likeCount: 0,
  },
  {
    quote: "Strive not to be a success, but rather to be of value.",
    author: "Albert Einstein",
    likeCount: 0,
  },
  {
    quote: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci",
    likeCount: 0,
  },
];

export const quotes: Quote[] = rawQuotes.map((q, idx) => ({
  id: (idx + 1).toString(),
  text: q.quote,
  author: q.author,
  likeCount: q.likeCount,
  likedBy: [],
  createdBy: "",
}));
