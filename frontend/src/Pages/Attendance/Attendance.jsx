import { useEffect, useState } from "react";
import "./Attendance.css";

function Attendance() {
  const user = localStorage.getItem("user");

  const today = new Date().toISOString().split("T")[0];

  const [marked, setMarked] = useState(false);

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
        console.log(err);
      }
    };

    checkAttendance();
  }, [today, user]);

  // ✅ MARK PRESENT
  const markPresent = async () => {
    try {
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
        alert(data.message);
        return;
      }

      setMarked(true);
    } catch (err) {
      console.log(err);
      alert("Server error ❌");
    }
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
