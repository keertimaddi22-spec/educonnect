import { useEffect, useState } from "react";
import "./Attendance.css";

function Attendance() {
  const user = localStorage.getItem("user");

  const today = new Date().toISOString().split("T")[0];

  const [marked, setMarked] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ CHECK IF ALREADY MARKED
  useEffect(() => {
    const checkAttendance = async () => {
      try {
        const res = await fetch(
          "https://educonnect-q5og.onrender.com/api/attendance",
        );

        const data = await res.json();

        const already = data.find(
          (a) => a.student === user && a.date === today,
        );

        if (already) {
          setMarked(true);
        }
      } catch (err) {
        console.log("CHECK ERROR 👉", err);
      }
    };

    checkAttendance();
  }, [today, user]);

  // ✅ MARK PRESENT
  const markPresent = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://educonnect-q5og.onrender.com/api/attendance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student: user,
            date: today,
            status: "present",
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed ❌");
        setLoading(false);
        return;
      }

      setMarked(true);
      setLoading(false);
    } catch (err) {
      console.log("MARK ERROR 👉", err);
      alert("Server error ❌");
      setLoading(false);
    }
  };

  return (
    <div className="attendance-box">
      <h2>📅 Today: {today}</h2>

      {!marked ? (
        <button className="mark-btn" onClick={markPresent} disabled={loading}>
          {loading ? "Marking..." : "Mark Present"}
        </button>
      ) : (
        <p className="done">✔ Attendance Marked</p>
      )}
    </div>
  );
}

export default Attendance;
