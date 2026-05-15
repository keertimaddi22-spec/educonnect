import { useEffect, useState } from "react";
import "./Home.css";
import CourseCard from "../../Components/CourseCard/CourseCard";

function Home() {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editId, setEditId] = useState(null); // 🔥 NEW

  const role = localStorage.getItem("role");
  // 🔥 LOAD COURSES (NO DUPLICATE FIX)
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("courses"));

    if (!stored || stored.length === 0) {
      const defaultCourses = [
        {
          id: "react-" + Date.now(),
          title: "React for Beginners",
          description: "Learn React step by step",
          image: "https://picsum.photos/300/200?1",
        },
        {
          id: "js-" + (Date.now() + 1),
          title: "JavaScript Mastery",
          description: "Deep dive into JS",
          image: "https://picsum.photos/300/200?2",
        },
      ];

      localStorage.setItem("courses", JSON.stringify(defaultCourses));
      setCourses(defaultCourses);
    } else {
      setCourses(stored);
    }
  }, []);

  // 🔥 SUBMIT (ADD + EDIT)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Fill all fields");
      return;
    }

    // 👉 EDIT MODE
    if (editId) {
      const updated = courses.map((c) =>
        c.id === editId ? { ...c, title, description } : c,
      );

      setCourses(updated);
      localStorage.setItem("courses", JSON.stringify(updated));
    } else {
      // 👉 ADD MODE
      const newCourse = {
        id: Date.now().toString(),
        title,
        description,
        image: "https://picsum.photos/300/200?random=" + Math.random(),
      };

      const updated = [...courses, newCourse];

      setCourses(updated);
      localStorage.setItem("courses", JSON.stringify(updated));
    }

    // 🔥 RESET
    setTitle("");
    setDescription("");
    setEditId(null);
    setShowForm(false);
  };

  // 🔥 DELETE
  const handleDelete = (id) => {
    const updated = courses.filter((c) => c.id !== id);
    setCourses(updated);
    localStorage.setItem("courses", JSON.stringify(updated));
  };

  // 🔥 EDIT CLICK
  const handleEdit = (course) => {
    setShowForm(true);
    setEditId(course.id);
    setTitle(course.title);
    setDescription(course.description);
  };

  return (
    <div className="home">
<h1>
  Welcome {role === "teacher" ? "Teacher 👩‍🏫" : "Student 🎓"}
</h1>
      {/* ADD BUTTON */}
      {role === "teacher" && (
        <button className="add-btn" onClick={() => setShowForm(true)}>
          ➕ Add Course
        </button>
      )}

      {/* FORM */}
      {showForm && (
        <div className="form-box">
          <form onSubmit={handleSubmit}>
            <h2>{editId ? "Edit Course" : "Add Course"}</h2>

            <input
              type="text"
              placeholder="Course Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button type="submit">
              {editId ? "Make Changes" : "Post Course"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditId(null);
              }}
              style={{ marginTop: "10px", background: "gray" }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* COURSES */}
      <div className="course-list">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
