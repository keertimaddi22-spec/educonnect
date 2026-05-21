import { useNavigate } from "react-router-dom";
import "./CourseCard.css";

function CourseCard({ course, onDelete, onEdit, onView, isMyCourse }) {
  const navigate = useNavigate();

  const user = localStorage.getItem("user");
  const role = localStorage.getItem("role");

  const isEnrolled = course.students?.includes(user);

  return (
    <div className="course-card">
      <div className="image-wrapper">
        <img src={course.image} alt="" />
        {isEnrolled && <span className="badge">Enrolled</span>}
      </div>

      <div className="course-content">
        <h3>{course.title}</h3>
        <p>{course.description}</p>

      
        {role === "student" && (
          <button
            onClick={() => {
              if (isMyCourse) {
                onView(course); 
              } else {
                navigate(`/course/${course._id}`); 
              }
            }}
          >
            View Course
          </button>
        )}

       
        {role === "teacher" && (
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button onClick={() => onEdit(course)}>✏ Edit</button>
            <button onClick={() => onDelete(course._id)}>🗑 Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseCard;
