import { useEffect, useState } from "react";
import "./MyCourses.css";
import CourseCard from "../../Components/CourseCard/CourseCard";

function MyCourses() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const user = localStorage.getItem("user");

  useEffect(() => {
    fetch("https://educonnect-q5og.onrender.com/api/courses")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((course) =>
          course.students?.includes(user),
        );
        setEnrolledCourses(filtered);
      });
  }, [user]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Courses 🎓</h1>
      </div>

      <div className="course-grid">
        {enrolledCourses.length > 0 ? (
          enrolledCourses.map((course) => (
            <div key={course._id}>
              <CourseCard
                key={course._id}
                course={course}
                onView={() => setSelectedCourse(course)}
                isMyCourse={true}
              />
            </div>
          ))
        ) : (
          <p className="empty">No enrolled courses 😢</p>
        )}
      </div>

      {/* 🔥 MODAL */}
      {selectedCourse && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{selectedCourse.title}</h2>
            <p>Content coming soon 🚀</p>

            <button onClick={() => setSelectedCourse(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyCourses;
