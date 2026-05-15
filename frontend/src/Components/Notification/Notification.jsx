import { useEffect } from "react";
import "./Notification.css";

function Notification({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="notification">
      <span>{message}</span>
      <div className="neon-line"></div>
    </div>
  );
}

export default Notification;
