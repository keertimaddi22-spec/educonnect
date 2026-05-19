import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./TeacherDashboard.css";

function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [channels, setChannels] = useState([]);

  const name = localStorage.getItem("name");

  // FETCH CHANNELS
  const fetchChannels = () => {
    fetch("https://educonnect-q5og.onrender.com/api/channels")
      .then((res) => res.json())
      .then((data) => setChannels(data))
      .catch(() => setChannels([]));
  };

  useEffect(() => {
    fetch("https://educonnect-q5og.onrender.com/api/attendance")
      .then((res) => res.json())
      .then((data) => setAttendance(data || []))
      .catch(() => setAttendance([]));
  }, []);

  useEffect(() => {
    setCourses(JSON.parse(localStorage.getItem("courses")) || []);
    setAssignments(JSON.parse(localStorage.getItem("assignments")) || []);
    setSubmissions(JSON.parse(localStorage.getItem("submissions")) || []);

    fetchChannels();
  }, []);

  const students = [
    ...new Set((submissions || []).map((s) => s.student || "")),
  ];

  // CHART DATA SAFE
  const chartData = (assignments || []).map((a) => {
    const count = (submissions || []).filter(
      (s) => s.assignmentId === a._id,
    ).length;

    return {
      name: a?.title || "Untitled",
      submissions: count,
    };
  });

  const today = new Date().toLocaleDateString("en-CA");

  const todayAttendance = (attendance || []).filter((a) => a?.date === today);

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="header">
        <h1>Welcome back, {name} 👋</h1>
        <p>Here’s your teaching overview</p>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="card">
          <p>Courses</p>
          <h2>{courses.length}</h2>
        </div>

        <div className="card">
          <p>Students</p>
          <h2>{students.length}</h2>
        </div>

        <div className="card">
          <p>Assignments</p>
          <h2>{assignments.length}</h2>
        </div>

        <div className="card">
          <p>Submissions</p>
          <h2>{submissions.length}</h2>
        </div>
      </div>

      {/* GRID */}
      <div className="grid">
        {/* CHART */}
        <div className="box full">
          <h2>Submissions Chart 📊</h2>

          {chartData.length === 0 ? (
            <p className="empty">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="submissions" fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* CHANNEL REQUESTS */}
        <div className="box full">
          <h2>Channel Requests 🔔</h2>

          {channels?.length === 0 ? (
            <p className="empty">No pending requests</p>
          ) : (
            channels.map((ch, chIndex) =>
              ch?.requests
                ?.filter((r) => r?.status === "pending")
                .map((r, idx) => (
                  <div key={`${chIndex}-${idx}`} className="request-item">
                    <div>
                      <strong>{r.student}</strong>
                      <p style={{ fontSize: "12px", color: "#94a3b8" }}>
                        wants to join <b>{ch.name}</b>
                      </p>
                    </div>

                    <div className="request-actions">
                      <button className="accept-btn">Accept</button>
                      <button className="reject-btn">Reject</button>
                    </div>
                  </div>
                )),
            )
          )}
        </div>

        {/* ATTENDANCE */}
        <div className="box full">
          <h2>Today's Attendance 📋</h2>

          {todayAttendance.length === 0 ? (
            <p className="empty">No attendance marked today</p>
          ) : (
            todayAttendance.map((a, i) => (
              <div key={i} className="request-item">
                <div className="attendance-left">
                  <div className="attendance-avatar">
                    {a.student?.[0]?.toUpperCase() || "?"}
                  </div>

                  <div className="attendance-text">
                    <strong>{a.student}</strong>
                    <p>{a.date}</p>
                  </div>
                </div>

                <span>{a.status}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;
