import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import "./Assignments.css";

function Assignments() {
  const role = localStorage.getItem("role");
  const user = localStorage.getItem("user");

  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const [activeTab, setActiveTab] = useState("pending");

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [answer, setAnswer] = useState("");

  const fetchAssignments = () => {
    fetch("https://educonnect-q5og.onrender.com/api/assignments")
      .then((res) => res.json())
      .then((data) => setAssignments(data));
  };

  useEffect(() => {
    fetchAssignments();
    setSubmissions(JSON.parse(localStorage.getItem("submissions")) || []);
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!title || !dueDate) return alert("Fill all fields");

    await fetch("https://educonnect-q5og.onrender.com/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, dueDate }),
    });

    setTitle("");
    setDueDate("");
    setShowForm(false);

    fetchAssignments();
  };

  const handleDelete = async (id) => {
    await fetch(`https://educonnect-q5og.onrender.com/api/assignments/${id}`, {
      method: "DELETE",
    });

    fetchAssignments();
  };

  const handleSubmit = () => {
    if (!answer.trim()) return alert("Write answer");

    const newSubmission = {
      assignmentId: selectedAssignment._id,
      student: user,
      answer,
    };

    const updated = [...submissions, newSubmission];

    setSubmissions(updated);

    localStorage.setItem("submissions", JSON.stringify(updated));

    setSelectedAssignment(null);
    setAnswer("");
  };

  const filteredAssignments = assignments.filter((a) => {
    if (role === "teacher") return true;

    const submitted = submissions.find(
      (s) => s.assignmentId === a._id && s.student === user,
    );

    if (activeTab === "completed") return submitted;
    if (activeTab === "pending") return !submitted;
  });

  return (
    <div className="assignments">
      <div className="page-header">
        <h1>Assignments 📝</h1>

        {role === "teacher" && (
          <button
            className="add-assignment-btn"
            onClick={() => setShowForm(true)}
          >
            <FaPlus /> Add Assignment
          </button>
        )}
      </div>

      {role === "student" && (
        <div className="tabs">
          <button
            className={activeTab === "pending" ? "active" : ""}
            onClick={() => setActiveTab("pending")}
          >
            Pending
          </button>

          <button
            className={activeTab === "completed" ? "active" : ""}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
        </div>
      )}

      {showForm && role === "teacher" && (
        <div className="form-box">
          <form onSubmit={handleAdd}>
            <h2>Add Assignment</h2>

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <div className="btn-group">
              <button type="submit" className="post-btn">
                Post
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedAssignment && role === "student" && (
        <div className="form-box">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <h2>{selectedAssignment.title}</h2>

            <input
              type="text"
              placeholder="Your Answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />

            <div className="btn-group">
              <button type="submit" className="post-btn">
                Submit
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={() => setSelectedAssignment(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {filteredAssignments.map((a) => (
        <div key={a._id} className="assignment-card">
          <div className="card-top">
            <h3>{a.title}</h3>
            <span className="due-date">Due: {a.dueDate}</span>
          </div>

          {role === "student" &&
            !submissions.some(
              (s) => s.assignmentId === a._id && s.student === user,
            ) && (
              <button
                className="open-btn"
                onClick={() => setSelectedAssignment(a)}
              >
                Open Assignment
              </button>
            )}

          {role === "student" &&
            submissions.some(
              (s) => s.assignmentId === a._id && s.student === user,
            ) && <p className="submitted">✅ Submitted</p>}

          {role === "teacher" && (
            <button className="delete-btn" onClick={() => handleDelete(a._id)}>
              🗑 Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Assignments;
