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

  
  const fetchAssignments = async () => {
    try {
      const res = await fetch(
        "https://educonnect-q5og.onrender.com/api/assignments",
      );

      const data = await res.json();

      setAssignments(data || []);
    } catch (err) {
      console.log(err);
      setAssignments([]);
    }
  };

  useEffect(() => {
    fetchAssignments();

    const saved = JSON.parse(localStorage.getItem("submissions")) || [];

    setSubmissions(saved);
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!title.trim() || !dueDate) return;

    try {
      const res = await fetch(
        "https://educonnect-q5og.onrender.com/api/assignments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            dueDate,
          }),
        },
      );

      if (!res.ok) {
        alert("Failed to create assignment");
        return;
      }

      setTitle("");
      setDueDate("");
      setShowForm(false);

      fetchAssignments();
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

 
  const handleDelete = async (id) => {
    try {
      await fetch(
        `https://educonnect-q5og.onrender.com/api/assignments/${id}`,
        {
          method: "DELETE",
        },
      );

      fetchAssignments();
    } catch (err) {
      console.log(err);
    }
  };

 
  const handleSubmit = () => {
    if (!answer.trim()) return;

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

    return true;
  });

  return (
    <div className="assignments">
      {/* HEADER */}
      <div className="page-header">
        <h2>Assignments 📝</h2>

        {role === "teacher" && (
          <button
            className="add-assignment-btn"
            onClick={() => setShowForm(true)}
          >
            <FaPlus />
            Add Assignment
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
        <div
          className="assignment-popup-overlay"
          onClick={() => setShowForm(false)}
        >
          <div
            className="assignment-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Add Assignment</h2>

            <form onSubmit={handleAdd}>
              <input
                type="text"
                placeholder="Assignment title"
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
        </div>
      )}

      
      {selectedAssignment && role === "student" && (
        <div
          className="assignment-popup-overlay"
          onClick={() => setSelectedAssignment(null)}
        >
          <div
            className="assignment-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedAssignment.title}</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <input
                type="text"
                placeholder="Write your answer..."
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
        </div>
      )}

      
      <div className="assignment-grid">
        {filteredAssignments.map((a) => (
          <div key={a._id} className="assignment-card">
            <div className="card-top">
              <div>
                <h3>{a.title}</h3>

                <p className="due-date">Due: {a.dueDate}</p>
              </div>

              {role === "teacher" && (
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(a._id)}
                >
                  Delete
                </button>
              )}
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default Assignments;
