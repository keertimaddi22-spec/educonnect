import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";

import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";

import CourseDetail from "./Pages/CourseDetail/CourseDetail";
import MyCourses from "./Pages/MyCourses/MyCourses";
import Courses from "./Pages/Courses/Courses";

import StudentDashboard from "./Pages/StudentDashboard/StudentDashboard";
import TeacherDashboard from "./Pages/TeacherDashboard/TeacherDashboard";

import StudentAssignments from "./Pages/StudentDashboard/StudentAssignments";
import TeacherAssignments from "./Pages/TeacherDashboard/TeacherAssignments";

import Attendance from "./Pages/Attendance/Attendance";

import Sidebar from "./Components/Sidebar/Sidebar.jsx";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

import Channels from "./Pages/Channels/Channels";
import ChannelChat from "./Pages/Channels/ChannelChat";

import "./App.css";

function Layout() {
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  const user = localStorage.getItem("user");
  const role = localStorage.getItem("role");

  const hideSidebar =
    !user || location.pathname === "/" || location.pathname === "/register";

  return (
    <div className="app-layout">
      {!hideSidebar && (
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      )}

      <div
        className={`main 
        ${hideSidebar ? "full" : ""} 
        ${collapsed ? "collapsed-main" : ""}`}
      >
        <Routes>
          {/* AUTH */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {role === "teacher" ? (
                  <TeacherDashboard />
                ) : (
                  <StudentDashboard />
                )}
              </ProtectedRoute>
            }
          />

          {/* COURSES */}
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-courses"
            element={
              <ProtectedRoute>
                <MyCourses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/course/:id"
            element={
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            }
          />

          {/* ASSIGNMENTS */}
          <Route
            path="/assignments"
            element={
              <ProtectedRoute>
                {role === "teacher" ? (
                  <TeacherAssignments />
                ) : (
                  <StudentAssignments />
                )}
              </ProtectedRoute>
            }
          />

          {/* CHANNELS */}
          <Route
            path="/channels"
            element={
              <ProtectedRoute>
                <Channels />
              </ProtectedRoute>
            }
          />

          <Route
            path="/channel/:id"
            element={
              <ProtectedRoute>
                <ChannelChat />
              </ProtectedRoute>
            }
          />

          {/* ATTENDANCE */}
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <Attendance />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
