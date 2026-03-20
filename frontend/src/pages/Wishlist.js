import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./styles/Wishlist.css";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  const studentId = localStorage.getItem("userId");

  const fetchWishlist = useCallback(() => {
    axios
      .get(`https://librarymanagementdeploy.onrender.com/api/wishlist/student/${studentId}`)
      .then((res) => setWishlist(res.data))
      .catch((err) => console.log(err));
  }, [studentId]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const removeWishlist = async (bookId) => {
    try {
      await axios.post("https://librarymanagementdeploy.onrender.com/api/wishlist/remove", {
        studentId,
        bookId
      });
      // Refresh the list
      fetchWishlist();
    } catch (err) {
      console.log("Error removing from wishlist", err);
    }
  };

  return (
    <div className="books-page">
      <h1>❤️ My Wishlist</h1>

      <div className="books-grid">
        {wishlist.length === 0 && <p>No wishlist items yet.</p>}

        {wishlist.map((w) => (
          <div key={w._id} className="book-card">
            <img src={w.book.cover} alt={w.book.title} />
            <h3>{w.book.title}</h3>
            <p>{w.book.author}</p>
            <button 
              onClick={() => removeWishlist(w.book._id)} 
              style={{marginTop: '10px', width: '100%', padding: '8px', background: 'transparent', color: '#ff4d4f', border: '1px solid #ff4d4f', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;