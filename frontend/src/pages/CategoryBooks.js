import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function CategoryBooks() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(`https://librarymanagementdeploy.onrender.com/api/books/category/${category}`)
      .then((res) => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to load books.");
        setLoading(false);
      });
  }, [category]);

  return (
    <div className="books-page">
      <h1>{category} Books</h1>
      
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
        <input 
          type="text" 
          placeholder="Search by title or author..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "100%", maxWidth: "400px", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", outline: "none" }}
        />
      </div>

      {loading && <p>Fetching books from the archive...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && books.length === 0 && (
        <p>No books found in this category.</p>
      )}

      <div className="books-grid">
        {!loading &&
          books.filter((book) => 
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            book.author.toLowerCase().includes(searchQuery.toLowerCase())
          ).map((book) => (
            <div
              key={book._id}
              className="book-card"
              onClick={() => navigate(`/book/${book._id}`)}
              style={{ cursor: "pointer" }}
            >
              <img src={book.cover} alt={book.title} />
              <h3>{book.title}</h3>
              <p>{book.author}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default CategoryBooks;