import { useEffect, useState } from "react";
import "./StudentAssignments.css";

function StudentAssignments() {
  const user = localStorage.getItem("user");

  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const [answer, setAnswer] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  // FETCH
  const fetchAssignments = () => {
    fetch("https://educonnect-q5og.onrender.com/api/assignments")
      .then((res) => res.json())
      .then((data) => setAssignments(data));
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // SUBMIT
  const handleSubmit = async () => {
    if (!answer.trim()) return alert("Write answer");

    await fetch(
      `https://educonnect-q5og.onrender.com/api/assignments/submit/${selectedAssignment._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student: user,
          answer,
        }),
      },
    );

    setAnswer("");
    setSelectedAssignment(null);

    fetchAssignments();
  };

  // FILTER
  const filteredAssignments = assignments.filter((a) => {
    const submission = a.submissions?.find((s) => s.student === user);

    if (activeTab === "pending") return !submission;

    if (activeTab === "completed") return submission;

    return true;
  });

  return (
    <div className="student-assignments-page">
      {/* HEADER */}
      <div className="student-assignments-header">
        <h1>Assignments 📝</h1>
      </div>

      {/* TABS */}
      <div className="student-tabs">
        <button
          className={activeTab === "pending" ? "active-tab" : ""}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </button>

        <button
          className={activeTab === "completed" ? "active-tab" : ""}
          onClick={() => setActiveTab("completed")}
        >
          Completed
        </button>
      </div>

      {/* GRID */}
      <div className="student-assignment-grid">
        {filteredAssignments.map((a) => {
          const submission = a.submissions?.find((s) => s.student === user);

          return (
            <div key={a._id} className="student-assignment-card">
              <div className="student-card-top">
                <div>
                  <h2>{a.title}</h2>
                  <p className="student-date">Due: {a.dueDate}</p>
                </div>
              </div>

              {!submission && (
                <button
                  className="student-open-btn"
                  onClick={() => setSelectedAssignment(a)}
                >
                  Open Assignment
                </button>
              )}

              {submission && (
                <div className="student-status-box">
                  <p className="submitted-text">✅ Submitted</p>

                  {submission.status === "returned" && (
                    <p className="returned-text">↩ Returned</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* POPUP */}
      {selectedAssignment && (
        <div className="student-modal-overlay">
          <div className="student-modal">
            <h2>{selectedAssignment.title}</h2>

            <textarea
              placeholder="Write your answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />

            <div className="student-modal-buttons">
              <button className="student-submit-btn" onClick={handleSubmit}>
                Submit
              </button>

              <button
                className="student-cancel-btn"
                onClick={() => {
                  setSelectedAssignment(null);
                  setAnswer("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentAssignments;
