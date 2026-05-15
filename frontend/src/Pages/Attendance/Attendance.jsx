import { useState } from "react";
import "./Attendance.css";

function Attendance() {
  const user = localStorage.getItem("user");

  const today = new Date().toISOString().split("T")[0];
  const [marked, setMarked] = useState(false);

  const markPresent = () => {
    const old = JSON.parse(localStorage.getItem("attendance")) || [];

    const already = old.find((a) => a.student === user && a.date === today);

    if (already) {
      alert("Already marked today");
      return;
    }

    const updated = [
      ...old,
      {
        student: user,
        date: today,
        status: "present",
      },
    ];

    localStorage.setItem("attendance", JSON.stringify(updated));
    setMarked(true);
  };

  return (
    <div className="attendance-box">
      <h2>📅 Today: {today}</h2>

      {!marked ? (
        <button className="mark-btn" onClick={markPresent}>
          Mark Present
        </button>
      ) : (
        <p className="done">✔ Attendance Marked</p>
      )}
    </div>
  );
}

export default Attendance;
