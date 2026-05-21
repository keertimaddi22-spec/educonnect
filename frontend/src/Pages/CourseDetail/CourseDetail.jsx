import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./CourseDetail.css";

function CourseDetail() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const user = localStorage.getItem("user");

  useEffect(() => {
    fetch(`http://localhost:5000/api/courses/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCourse(data);

        if (data.students?.includes(user)) {
          setIsEnrolled(true);
        }
      });
  }, [id, user]);

  if (!course) return <h2 style={{ color: "white" }}>Loading...</h2>;

  const handleEnroll = async () => {
    await fetch(`http://localhost:5000/api/courses/enroll/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user }),
    });

    setIsEnrolled(true);
  };

  return (
    <div className="detail">
      <div className="detail-card">
        <img src={course.image} alt="" />

        <div className="detail-content">
          <h1>{course.title}</h1>
          <p>{course.description}</p>

          {isEnrolled ? (
            <button className="enrolled-btn">Enrolled ✅</button>
          ) : (
            <button onClick={handleEnroll}>Enroll Now</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
