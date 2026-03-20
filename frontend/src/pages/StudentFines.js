import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/Fines.css";

function StudentFines() {
  const [transactions, setTransactions] = useState([]);
  const [totalFine, setTotalFine] = useState(0);

  const studentId = localStorage.getItem("userId");

  useEffect(() => {
    if (!studentId) return;

    axios
      .get(`https://librarymanagementdeploy.onrender.com/api/transactions/student/${studentId}`)
      .then((res) => {
        const returned = res.data.filter(
          (t) => t.status === "returned" && t.fine > 0
        );

        setTransactions(returned);

        const total = returned.reduce(
          (sum, t) => sum + (t.fine || 0),
          0
        );

        setTotalFine(total);
      })
      .catch((err) => console.log(err));
  }, [studentId]);

  return (
    <div className="fines-page">
      <h1 className="fines-title">💰 My Fine History</h1>

      {transactions.length === 0 ? (
        <p>No fines yet. Good student 😌</p>
      ) : (
        <>
          <div className="fines-grid">
            {transactions.map((t) => (
              <div key={t._id} className="fine-card">
                <h3>{t.book.title}</h3>
                <p>{t.book.author}</p>
                <p>Fine: ₹{t.fine}</p>
              </div>
            ))}
          </div>

          <h2 className="total-fine">
            Total Fine: ₹{totalFine}
          </h2>
        </>
      )}
    </div>
  );
}

export default StudentFines;