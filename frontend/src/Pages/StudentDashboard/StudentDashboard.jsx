import "./StudentDashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Notification from "../../Components/Notification/Notification";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

function StudentDashboard() {
  const name = localStorage.getItem("name");
  const user = localStorage.getItem("user");

  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [channels, setChannels] = useState([]);

  const [notification, setNotification] = useState("");
  const [marked, setMarked] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const markPresent = async () => {
    if (marked) return;

    try {
      const res = await fetch(
        "https://educonnect-q5og.onrender.com/api/attendance/mark",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student: user,
            date: today,
            status: "present",
          }),
        },
      );

      if (res.ok) {
        setMarked(true);

        const newAttendance = {
          student: user,
          date: today,
          status: "present",
        };

        const updated = [...attendance, newAttendance];
        setAttendance(updated);
        localStorage.setItem("attendance", JSON.stringify(updated));

        setNotification("✅ Attendance marked successfully");

        setTimeout(() => setNotification(""), 3000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const storedAttendance =
      JSON.parse(localStorage.getItem("attendance")) || [];

    const storedSubmissions =
      JSON.parse(localStorage.getItem("submissions")) || [];

    setAttendance(storedAttendance);
    setSubmissions(storedSubmissions);

    fetch("https://educonnect-q5og.onrender.com/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data));

    fetch("https://educonnect-q5og.onrender.com/api/assignments")
      .then((res) => res.json())
      .then((data) => setAssignments(data));

    fetch("https://educonnect-q5og.onrender.com/api/channels")
      .then((res) => res.json())
      .then((data) => setChannels(data));

    const todayMarked = storedAttendance.some(
      (a) => a.student === user && a.date === today,
    );

    setMarked(todayMarked);
  }, []);

  const totalCourses = courses.length;

  const enrolledCourses = courses.filter((c) =>
    c.students?.includes(user),
  ).length;

  const myAttendance = attendance.filter((a) => a.student === user);

  const present = myAttendance.filter((a) => a.status === "present").length;

  const percent =
    myAttendance.length > 0
      ? Math.round((present / myAttendance.length) * 100)
      : 0;

  const mySubmissions = submissions.filter((s) => s.student === user);

  const pendingAssignments = assignments.filter(
    (a) => !mySubmissions.some((s) => s.assignmentId === a._id),
  ).length;

  const joinedChannels = channels.filter((ch) =>
    ch.members?.some((m) => m.student === user),
  ).length;

  const progressData = [
    { name: "Completed", completed: enrolledCourses },
    { name: "Remaining", completed: totalCourses - enrolledCourses },
  ];

  return (
    <div className="main-content">
      <div className="page">
        {notification && <Notification message={notification} />}

        <h2>Hey {name} 👋</h2>

        <p style={{ color: "#94a3b8" }}>
          Here’s what’s happening with your learning today
        </p>

        <div className="card attendance-box">
          <div className="attendance-top">
            <h3>📅 Today: {today}</h3>
          </div>

          {!marked ? (
            <button className="mark-btn" onClick={markPresent}>
              Mark Present
            </button>
          ) : (
            <div className="marked-box">✅ Attendance Marked</div>
          )}
        </div>

        <div className="stats">
          <div className="card">
            <h3>Total Courses</h3>
            <p>{totalCourses}</p>
          </div>

          <div className="card">
            <h3>Enrolled</h3>
            <p>{enrolledCourses}</p>
          </div>

          <div className="card">
            <h3>Attendance</h3>
            <p>{percent}%</p>
          </div>

          <div className="card">
            <h3>Pending Assignments</h3>
            <p>{pendingAssignments}</p>
          </div>
        </div>

        <div className="stats">
          <div className="card clickable" onClick={() => navigate("/channels")}>
            <h3>Channels</h3>
            <p>{joinedChannels} Joined</p>
          </div>

          <div
            className="card clickable"
            onClick={() => navigate("/assignments")}
          >
            <h3>Assignments</h3>
            <p>View All</p>
          </div>
        </div>

        <div className="charts">
          <div className="chart-box">
            <h3>Course Progress</h3>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={progressData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
