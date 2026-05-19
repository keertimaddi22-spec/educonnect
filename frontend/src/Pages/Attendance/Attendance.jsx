import { useEffect, useState } from "react";
import "./Attendance.css";

const API = "https://educonnect-q5og.onrender.com";

function Attendance() {
  const user = localStorage.getItem("user");

  // ✅ MOBILE SAFE DATE
  const today = new Date().toLocaleDateString("en-CA");

  const [marked, setMarked] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ CHECK IF ALREADY MARKED
  useEffect(() => {
    const checkAttendance = async () => {
      try {
        const res = await fetch(`${API}/api/attendance`);

        const data = await res.json();

        const alreadyMarked = data.find(
          (a) => a.student === user && a.date === today,
        );

        if (alreadyMarked) {
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
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(`${API}/api/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student: user,
          date: today,
          status: "present",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Attendance failed");
        setLoading(false);
        return;
      }

      setMarked(true);
    } catch (err) {
      console.log(err);
      alert("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="attendance-box">
      <h2>📅 Today: {today}</h2>

      {!marked ? (
        <button className="mark-btn" onClick={markPresent}>
          {loading ? "Marking..." : "Mark Present"}
        </button>
      ) : (
        <p className="done">✔ Attendance Marked</p>
      )}
    </div>
  );
}

export default Attendance;
