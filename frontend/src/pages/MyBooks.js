import "./styles/MyBooks.css";
import { useEffect, useState } from "react";
import axios from "axios";

function MyBooks() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`https://librarymanagementdeploy.onrender.com/api/transactions/student/${userId}`)
      .then((res) => {
        setTransactions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [userId]);

  const handleReturn = async (transactionId) => {
    try {
      const res = await axios.post(
        "https://librarymanagementdeploy.onrender.com/api/transactions/return",
        { transactionId }
      );

      alert(
        res.data.fine > 0
          ? `Returned. Fine: ₹${res.data.fine}`
          : "Book returned successfully!"
      );

      window.location.reload();

    } catch (err) {
      alert("Error returning book");
    }
  };

  if (loading) return <p>Loading your books...</p>;

  return (
    <div className="mybooks-page">
      <h1 className="mybooks-title">📚 My Borrowed Books</h1>

      <div className="mybooks-grid">
        {transactions.length === 0 && (
          <p>You have not borrowed any books yet.</p>
        )}

        {transactions.map((t) => (
          <div key={t._id} className="mybook-card">
            <img src={t.book.cover} alt={t.book.title} />

            <h3>{t.book.title}</h3>
            <p>{t.book.author}</p>

            <span className="due">
              Due: {new Date(t.dueDate).toLocaleDateString()}
            </span>

            <span className="status">
              Status: {t.status}
            </span>

            {t.status === "issued" && (
              <button onClick={() => handleReturn(t._id)}>
                Return Book
              </button>
            )}

            {t.status === "returned" && (
              <span className="fine">
                Fine: ₹{t.fine}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBooks;