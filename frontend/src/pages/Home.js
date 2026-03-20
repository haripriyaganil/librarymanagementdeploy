import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const [dbBooks, setDbBooks] = useState([]);

  useEffect(() => {
    axios
      .get("https://librarymanagementdeploy.onrender.com/api/books")
      .then((res) => setDbBooks(res.data))
      .catch((err) => console.log("Failed to fetch books: ", err));
  }, []);

  const trendingBooks = [
    {
      id: 1,
      title: "Harry Potter",
      author: "J.K. Rowling",
      cover: "/images/covers/trending-1.jpg",
      about: "A young wizard discovers his magical heritage, battling the dark arts and forging lifelong friendships at Hogwarts School of Witchcraft and Wizardry.",
      authorInfo: "J.K. Rowling is a British author and philanthropist, best known for writing the Harry Potter fantasy series."
    },
    {
      id: 2,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      cover: "/images/covers/trending-2.jpg",
      about: "Bilbo Baggins, a respectable, well-to-do hobbit, lives comfortably in his hobbit-hole until he is swept away by Gandalf the wizard and a company of thirteen dwarves to reclaim their treasure from the dragon Smaug.",
      authorInfo: "J.R.R. Tolkien was an English writer, poet, philologist, and academic, best known as the author of the high fantasy works The Hobbit and The Lord of the Rings."
    },
    {
      id: 3,
      title: "The Alchemist",
      author: "Paulo Coelho",
      cover: "/images/covers/trending-3.jpg",
      about: "The Alchemist follows the journey of an Andalusian shepherd boy named Santiago, who dreams of discovering a worldly treasure as fabulous as any ever found.",
      authorInfo: "Paulo Coelho is a Brazilian lyricist and novelist, best known for his international bestselling novel The Alchemist."
    },
    {
      id: 4,
      title: "Atomic Habits",
      author: "James Clear",
      cover: "/images/covers/trending-4.jpg",
      about: "Atomic Habits offers a proven framework for improving every day, teaching you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
      authorInfo: "James Clear is an author and speaker focused on habits, decision making, and continuous improvement."
    },
    {
      id: 5,
      title: "Clean Code",
      author: "Robert C. Martin",
      cover: "/images/covers/trending-5.jpg",
      about: "Clean Code is a classic handbook for software engineering that breaks down the principles, patterns, and practices of writing clean, maintainable code.",
      authorInfo: "Robert C. Martin, also known as Uncle Bob, is an American software engineer, instructor, and best-selling author."
    },
    {
      id: 6,
      title: "Rich Dad Poor Dad",
      author: "Robert Kiyosaki",
      cover: "/images/covers/trending-6.jpg",
      about: "Rich Dad Poor Dad tells the story of a boy with two fathers, one rich, one poor, to help you develop the mindset and financial knowledge you need to build a life of wealth and freedom.",
      authorInfo: "Robert Kiyosaki is an American entrepreneur, businessman and author, well-known for his educational board game Cashflow."
    }
  ];

  const trendingBooksData = trendingBooks.map((book) => {
    const dbBookMatch = dbBooks.find((dbB) => dbB.title === book.title);
    if (dbBookMatch) {
      return {
        ...book,
        _id: dbBookMatch._id,
        about: dbBookMatch.about || book.about,
        authorInfo: dbBookMatch.authorInfo || book.authorInfo,
      };
    }
    return book;
  });

  // Duplicate the array to create a seamless continuous CSS loop
  const loopingBooks = [...trendingBooksData, ...trendingBooksData];

  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="home-container">
      {/* 🔮 HERO SECTION */}
      <section className="hero">
        <div className="hero-content reveal">
          <h1 className="hero-title">
            Where knowledge <span className="hero-accent">illuminates</span> the dark.
          </h1>
          <p className="hero-subtitle">
            An elegant sanctuary for scholars and bibliophiles. Discover curated
            collections and manage your reading journey with clarity.
          </p>
          <div className="hero-actions">
            <button className="btn-primary glow-effect" onClick={() => navigate("/auth")}>
              Unlock the Archives
            </button>
            <button className="btn-secondary" onClick={() => document.getElementById('explore').scrollIntoView({ behavior: 'smooth' })}>
              Explore Collections
            </button>
          </div>
        </div>
      </section>

      {/* 📚 CONTINUOUS TRENDING LOOP */}
      <section id="explore" className="trending-section reveal">
        <div className="section-header">
          <h2>Trending Tomes</h2>
          <div className="header-divider"></div>
          <p>The most sought-after knowledge in our current archives.</p>
        </div>

        <div className="marquee-wrapper">
          <div className="marquee-content">
            {loopingBooks.map((book, index) => (
              <div
                key={`${book.id}-${index}`}
                className="book-card glass-panel"
                onClick={() =>
                  navigate("/trending-book", { state: { book } })
                }
              >
                <div className="book-cover-wrapper">
                  <img src={book.cover} alt={book.title} className="book-cover" />
                  <div className="book-overlay">
                    <span>View Details</span>
                  </div>
                </div>
                <div className="book-info">
                  <h4 className="book-title">{book.title}</h4>
                  <p className="book-author">{book.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏛️ ABOUT SECTION */}
      <section className="about-section reveal">
        <div className="about-grid">
          <div className="about-image-wrapper">
            <img
              src="/images/backgrounds/home-about-bg.jpg"
              alt="Classic dark library"
              className="about-image"
            />
            <div className="image-glow"></div>
          </div>
          
          <div className="about-text glass-panel">
            <h2>Crafted for the Modern Scholar</h2>
            <div className="header-divider left"></div>
            <p>
              BookSphere bridges the gap between ancient library aesthetics and modern
              digital utility. Experience a calm, focused environment to track your
              literary adventures.
            </p>
            
            <ul className="features-list">
              <li>
                <span className="bullet">✦</span>
                <strong>Curated Collections:</strong> Discover books tailored to your academic and personal interests.
              </li>
              <li>
                <span className="bullet">✦</span>
                <strong>Student Tools:</strong> Track borrowed items and calculate fines instantly.
              </li>
              <li>
                <span className="bullet">✦</span>
                <strong>Librarian Analytics:</strong> Manage physical inventory with deep oversight.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 📜 FOOTER */}
      <footer className="footer glass-panel">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="brand-logo">BookSphere</span>
          </div>
          <p className="footer-copyright">
            © {new Date().getFullYear()} • Crafted for the pursuit of wisdom.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;