import { useState, useEffect } from "react";
import axios from "axios";
import "./styles/Reports.css";

function Reports() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    issuedBooks: 0,
    overdueBooks: 0,
    availableBooks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [booksRes] = await Promise.all([
          axios.get("https://librarymanagementdeploy.onrender.com/api/books"),
          axios.get("https://librarymanagementdeploy.onrender.com/api/transactions") // Note: create this route if needed, or query all transactions
        ]);

        const books = booksRes.data;
        // Mocking transactions for now until an Admin-wide transaction route is verified
        // Ideally the backend provides a /stats endpoint to simplify this.
        // Let's rely on books array data:
        let total = 0;
        let available = 0;

        books.forEach(b => {
          total += b.totalCopies || 1;
          available += b.availableCopies !== undefined ? b.availableCopies : (b.available ? 1 : 0);
        });

        const issued = total - available;
        const overdue = 0; // Requires full transaction scan. Set placeholder or 0 for now until actual scan is performed.

        setStats({
          totalBooks: total,
          issuedBooks: issued,
          overdueBooks: overdue,
          availableBooks: available
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching report stats", err);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="reports-page">
      <h1 className="reports-title">Library Reports</h1>

      {loading ? (
        <p style={{ color: "white", textAlign: "center" }}>Loading Statistics...</p>
      ) : (
        <div className="reports-grid">
          <div className="report-card">
            <div className="report-icon"><i className="bi bi-book-half"></i></div>
            <div className="report-value">{stats.totalBooks}</div>
            <div className="report-label">Total Books</div>
          </div>

          <div className="report-card">
            <div className="report-icon"><i className="bi bi-journal-arrow-up"></i></div>
            <div className="report-value">{stats.issuedBooks}</div>
            <div className="report-label">Issued Books</div>
          </div>

          <div className="report-card">
            <div className="report-icon"><i className="bi bi-exclamation-triangle" style={{color: '#ff4d4f'}}></i></div>
            <div className="report-value">{stats.overdueBooks}</div>
            <div className="report-label">Overdue Books</div>
          </div>

          <div className="report-card">
            <div className="report-icon"><i className="bi bi-check-circle" style={{color: '#4caf50'}}></i></div>
            <div className="report-value">{stats.availableBooks}</div>
            <div className="report-label">Available Books</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;
