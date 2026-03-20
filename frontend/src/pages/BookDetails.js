import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./styles/BookDetails.css";

function BookDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const book = location.state?.book;

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTransaction, setActiveTransaction] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (!userId || !book) return;

    axios
      .get(`https://librarymanagementdeploy.onrender.com/api/transactions/student/${userId}`)
      .then((res) => {
        const active = res.data.find(
          (t) => t.book._id === book._id && t.status === "issued"
        );
        setActiveTransaction(active || null);
      })
      .catch((err) => console.log(err));
  }, [userId, book]);

  // 🔥 CHECK WISHLIST STATUS
  useEffect(() => {
    if (!userId || !book) return;
    axios.get(`https://librarymanagementdeploy.onrender.com/api/wishlist/student/${userId}`)
      .then((res) => {
        const inWishlist = res.data.some((w) => w.book._id === book._id || w.book === book._id);
        setIsWishlisted(inWishlist);
      })
      .catch((err) => console.log(err));
  }, [book, userId]);

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
          bookId: book._id,
        }
      );

      setSuccessMessage("Book borrowed successfully!");
      setTimeout(() => {
        navigate("/mybooks");
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.message || "Error borrowing book");
    }
  };

  const returnBook = async () => {
    try {
      const res = await axios.post(
        "https://librarymanagementdeploy.onrender.com/api/transactions/return",
        {
          transactionId: activeTransaction._id,
        }
      );

      setSuccessMessage(
        res.data.fine > 0
          ? `Returned. Fine: ₹${res.data.fine}`
          : "Book returned successfully!"
      );

      setTimeout(() => {
        navigate("/mybooks");
      }, 1500);

    } catch (err) {
      alert("Error returning book");
    }
  };

  // 🔥 ADD OR REMOVE WISHLIST
  const handleWishlist = async () => {
    try {
      if (!userId) {
        alert("Please login first.");
        return;
      }

      if (isWishlisted) {
        await axios.post("https://librarymanagementdeploy.onrender.com/api/wishlist/remove", {
          studentId: userId,
          bookId: book._id
        });
        setIsWishlisted(false);
      } else {
        await axios.post("https://librarymanagementdeploy.onrender.com/api/wishlist/add", {
          studentId: userId,
          bookId: book._id
        });
        setIsWishlisted(true);
      }
    } catch (err) {
      console.log("Wishlist error:", err.response);
      alert(err.response?.data?.message || "Error updating wishlist");
    }
  };

  if (!book) {
    return (
      <div className="book-detail-page">
        <div className="detail-card">
          <h2>Book not found</h2>
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="book-detail-page">
      <div className="detail-layout-container">
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
          <p className="author">{book.author}</p>

          <p className="status">Status: <span className="avail">Available</span></p>

          {successMessage && <div className="success-toast">{successMessage}</div>}

          <div className="action-buttons">
            {activeTransaction ? (
              <button className="borrow-btn return-btn" onClick={returnBook}>
                Return Book
              </button>
            ) : (
              <button className="borrow-btn" onClick={borrowBook}>
                Borrow Book
              </button>
            )}
            {role === "Student" && (
              <button className="wishlist-btn" onClick={handleWishlist}>
                {isWishlisted ? "❤️ Wishlisted" : "🤍 Add to Wishlist"}
              </button>
            )}
            <button className="back-btn" onClick={() => navigate(-1)}>
              ← Back
            </button>
          </div>
        </div>

        {(book.about || book.authorInfo) && (
          <div className="book-extra-section">
            {book.about && (
              <div className="extra-info-block">
                <h3>About the Book</h3>
                <p>{book.about}</p>
              </div>
            )}
            {book.authorInfo && (
              <div className="extra-info-block">
                <h3>About the Author</h3>
                <p>{book.authorInfo}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookDetails;
