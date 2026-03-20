import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const studentId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`https://librarymanagementdeploy.onrender.com/api/notifications/user/${studentId}`);
        setNotifications(res.data);
      } catch (err) {
        console.log("Error fetching notifications", err);
      }
    };

    fetchNotifications();
  }, [studentId]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`https://librarymanagementdeploy.onrender.com/api/notifications/mark-read/${id}`);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
    } catch (err) {
      console.log("Error marking as read", err);
    }
  };

  return (
    <div className="notifications-page">
      <h1>🔔 Notifications</h1>

      {notifications.length === 0 ? (
        <div className="no-notifications">
          No new notifications. You're all caught up!
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((n) => (
            <div key={n._id} className={`notification-card ${!n.isRead ? 'unread' : ''}`}>
              <div className="notification-content">
                <p>{n.message}</p>
                <span className="notification-time">
                  {new Date(n.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="notification-actions">
                {!n.isRead && (
                  <button onClick={() => markAsRead(n._id)} className="mark-read-btn">
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
