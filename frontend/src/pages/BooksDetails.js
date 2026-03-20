import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/Books.css";

function BooksDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  // 🔥 FETCH BOOK DETAILS
  useEffect(() => {
    axios
      .get(`https://librarymanagementdeploy.onrender.com/api/books/${id}`)
      .then((res) => {
        setBook(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [id]);

  // 🔥 CHECK IF BOOK IS ALREADY BORROWED BY THIS STUDENT
  useEffect(() => {
    if (!userId) return;

    axios
      .get(`https://librarymanagementdeploy.onrender.com/api/transactions/student/${userId}`)
      .then((res) => {
        const active = res.data.find(
          (t) => t.book._id === id && t.status === "issued"
        );
        if (active) {
          setTransaction(active);
        }
      })
      .catch((err) => console.log(err));
  }, [id, userId]);

  // 🔥 CHECK WISHLIST STATUS
  useEffect(() => {
    if (!userId || !id) return;
    axios.get(`https://librarymanagementdeploy.onrender.com/api/wishlist/student/${userId}`)
      .then((res) => {
        const inWishlist = res.data.some((w) => w.book._id === id || w.book === id);
        setIsWishlisted(inWishlist);
      })
      .catch((err) => console.log(err));
  }, [id, userId]);

  // 🔥 BORROW BOOK
  const borrowBook = async () => {
    try {
      if (!userId) {
        alert("Please login first.");
        return;
      }

      await axios.post(
        "https://librarymanagementdeploy.onrender.com/api/transactions/borrow",
        {
          studentId: userId,
          bookId: id,
        }
      );

      alert("Book borrowed successfully!");
      window.location.reload();

    } catch (err) {
      alert(err.response?.data?.message || "Error borrowing book");
    }
  };



  // 🔥 ADD OR REMOVE WISHLIST
  const handleWishlist = async () => {
    try {
      const studentId = localStorage.getItem("userId");

      if (isWishlisted) {
        await axios.post("https://librarymanagementdeploy.onrender.com/api/wishlist/remove", {
          studentId,
          bookId: book._id
        });
        setIsWishlisted(false);
      } else {
        await axios.post("https://librarymanagementdeploy.onrender.com/api/wishlist/add", {
          studentId,
          bookId: book._id
        });
        setIsWishlisted(true);
      }
    } catch (err) {
      console.log("Wishlist error:", err.response);
      alert(err.response?.data?.message || "Error updating wishlist");
    }
  };

  if (loading) return <p>Loading book details...</p>;
  if (!book) return <p>Book not found.</p>;

  return (
    <div className="books-page">
      <div className="details-layout">

        {/* LEFT CARD */}
        <div className="detail-card">

  {/* ❤️ Wishlist Heart */}
  {role === "Student" && (
    <button
      className={`heart-btn ${isWishlisted ? 'wishlisted' : ''}`}
      onClick={handleWishlist}
      title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      <i className={`bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'}`} style={isWishlisted ? {color: 'red'} : {}}></i>
    </button>
  )}

  <img src={book.cover} alt={book.title} />
  <h2>{book.title}</h2>
  <p>{book.author}</p>

  <p className="status">
    Status:{" "}
    <span className={book.available ? "avail" : "not-avail"}>
      {book.available ? "Available" : "Not Available"}
    </span>
  </p>

</div>

        {/* RIGHT PANEL */}
        <div className="book-info-panel">
          <div className="info-block">
            <h3>About the Book</h3>
            <p>{book.about}</p>
          </div>

          <div className="info-block">
            <h3>About the Author</h3>
            <p>{book.authorInfo}</p>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="action-buttons">

  <button className="borrow-btn" onClick={borrowBook}>
    Borrow Book
  </button>

  <button className="wishlist-btn" onClick={handleWishlist}>
    {isWishlisted ? "❤️ Wishlisted" : "🤍 Add to Wishlist"}
  </button>

  <button className="back-btn" onClick={() => navigate(-1)}>
    ← Back to Library
  </button>

</div>
    </div>
  );
}

export default BooksDetails;