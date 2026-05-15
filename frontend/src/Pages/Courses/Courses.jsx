import { useEffect, useState } from "react";
import "./Courses.css";
import { FaPlus } from "react-icons/fa";

function Courses() {
  const user = localStorage.getItem("user");
  const role = localStorage.getItem("role");

  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [showPopup, setShowPopup] = useState(false);

  const fetchCourses = () => {
    fetch("https://educonnect-q5og.onrender.com/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    if (editId) {
      await fetch(
        `https://educonnect-q5og.onrender.com/api/courses/${editId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description }),
        },
      );
    } else {
      await fetch("https://educonnect-q5og.onrender.com/api/courses/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          createdBy: user,
          image: `https://picsum.photos/400/200?random=${Date.now()}`,
        }),
      });
    }

    setTitle("");
    setDescription("");
    setEditId(null);
    setShowForm(false);

    fetchCourses();
  };

  const handleDelete = async (id) => {
    await fetch(`https://educonnect-q5og.onrender.com/api/courses/${id}`, {
      method: "DELETE",
    });

    fetchCourses();
  };

  const handleEdit = (c) => {
    setShowForm(true);
    setEditId(c._id);
    setTitle(c.title);
    setDescription(c.description);
  };

  const handleEnroll = async (courseId) => {
    const updatedCourses = courses.map((c) => {
      if (c._id === courseId) {
        return {
          ...c,
          students: [...(c.students || []), user],
        };
      }

      return c;
    });

    setCourses(updatedCourses);
  };

  return (
    <div className="courses-page">
      <div className="course-header">
        <h2>Courses</h2>

        {role === "teacher" && (
          <button
            className="course-create-btn"
            onClick={() => setShowForm(true)}
          >
            <FaPlus />
            Add Course
          </button>
        )}
      </div>

      {showForm && (
        <div className="form-box">
          <form onSubmit={handleCreate}>
            <h2>{editId ? "Edit Course" : "Add Course"}</h2>

            <input
              type="text"
              placeholder="Course title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="btn-group">
              <button type="submit" className="post-btn">
                {editId ? "Update" : "Create"}
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
            <h3>Content Coming Soon 🚀</h3>

            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}

      <div className="course-list">
        {courses.map((c) => {
          const isEnrolled = c.students?.includes(user);

          return (
            <div key={c._id} className="course-card">
              {c.image && (
                <img
                  src={c.image}
                  alt=""
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "10px",
                  }}
                />
              )}

              <h3>{c.title}</h3>
              <p>{c.description}</p>

              {/* STUDENT */}
              {role === "student" && (
                <div className="admin-buttons">
                  <button
                    onClick={() => handleEnroll(c._id)}
                    style={{
                      background: isEnrolled ? "#22c55e" : "",
                    }}
                  >
                    {isEnrolled ? "Enrolled" : "Enroll"}
                  </button>

                  <button onClick={() => setShowPopup(true)}>Know More</button>
                </div>
              )}

              {/* TEACHER */}
              {role === "teacher" && (
                <div className="admin-buttons">
                  <button onClick={() => handleEdit(c)}>✏ Edit</button>

                  <button onClick={() => handleDelete(c._id)}>🗑 Delete</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Courses;
