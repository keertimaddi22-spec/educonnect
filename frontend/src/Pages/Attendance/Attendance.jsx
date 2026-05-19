import { useEffect, useState } from "react";
import "./Attendance.css";

function Attendance() {
  const user = localStorage.getItem("user");

  const today = new Date().toISOString().split("T")[0];

  const [marked, setMarked] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ CHECK ATTENDANCE
  const checkAttendance = async () => {
    try {
      const res = await fetch(
        "https://educonnect-q5og.onrender.com/api/attendance",
      );

      const data = await res.json();

      const alreadyMarked = data.find(
        (a) => a.student === user && a.date === today,
      );

      if (alreadyMarked) {
        setMarked(true);
      } else {
        setMarked(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkAttendance();
  }, []);

  // ✅ MARK PRESENT
  const markPresent = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://educonnect-q5og.onrender.com/api/attendance/mark",
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

      await res.json();

      setMarked(true);

      // ✅ refresh check
      checkAttendance();
    } catch (err) {
      console.log(err);
    } finally {
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
        <p className="done">✅ Attendance Marked</p>
      )}
    </div>
  );
}

export default Attendance;
