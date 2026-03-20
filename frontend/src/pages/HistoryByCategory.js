import "./styles/History.css";
import { useEffect, useState } from "react";

function HistoryByCategory() {
  const [history, setHistory] = useState({});

  useEffect(() => {
    const studentId = localStorage.getItem("userId");
    if (!studentId) return;

    const fetchHistory = async () => {
      try {
        const [transRes, wishRes] = await Promise.all([
          fetch(`https://librarymanagementdeploy.onrender.com/api/transactions/student/${studentId}`).then(res => res.json()),
          fetch(`https://librarymanagementdeploy.onrender.com/api/wishlist/student/${studentId}`).then(res => res.json())
        ]);

        const result = {};

        // Process borrowed books 
        transRes.forEach((t) => {
          const g = t.book?.genre || t.book?.category;
          if (!g) return;
          if (!result[g]) result[g] = { borrowed: 0, wishlisted: 0 };
          result[g].borrowed += 1;
        });

        // Process wishlisted books
        wishRes.forEach((w) => {
          const g = w.book?.genre || w.book?.category;
          if (!g) return;
          if (!result[g]) result[g] = { borrowed: 0, wishlisted: 0 };
          result[g].wishlisted += 1;
        });

        setHistory(result);
      } catch (err) {
        console.log("Failed to load history data", err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="books-page">
      <h1 className="books-title">History by Category</h1>

      {Object.keys(history).length === 0 ? (
        <p>No activity yet.</p>
      ) : (
        <div className="history-grid">
          {Object.entries(history).map(([genre, data]) => (
            <div key={genre} className="history-card">
              <h3>{genre}</h3>
              <p>📚 Borrowed: {data.borrowed}</p>
              <p>❤️ Wishlisted: {data.wishlisted}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoryByCategory;