import { useEffect, useState } from "react";
import "./TeacherAssignments.css";
import { FaPlus } from "react-icons/fa";

function TeacherAssignments() {
  const [assignments, setAssignments] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // FETCH
  const fetchAssignments = () => {
    fetch("https://educonnect-q5og.onrender.com/api/assignments")
      .then((res) => res.json())
      .then((data) => {
        setAssignments(data);
      });
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // CREATE
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!title || !dueDate) {
      return alert("Fill all fields");
    }

    await fetch("https://educonnect-q5og.onrender.com/api/assignments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        dueDate,
      }),
    });

    setTitle("");
    setDueDate("");
    setShowForm(false);

    fetchAssignments();
  };

  // DELETE
  const handleDelete = async (id) => {
    await fetch(`https://educonnect-q5og.onrender.com/api/assignments/${id}`, {
      method: "DELETE",
    });

    fetchAssignments();
  };

  // RETURN
  const handleReturn = async (assignmentId, student) => {
    await fetch(
      `https://educonnect-q5og.onrender.com/api/assignments/return/${assignmentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student,
        }),
      },
    );

    const updatedAssignments = await fetch(
      "https://educonnect-q5og.onrender.com/api/assignments",
    ).then((res) => res.json());

    setAssignments(updatedAssignments);

    const latestAssignment = updatedAssignments.find(
      (a) => a._id === assignmentId,
    );

    setSelectedAssignment(latestAssignment);
  };

  return (
    <div className="teacher-assignments-page">
      {/* HEADER */}
      <div className="teacher-assignments-header">
        <h1>Assignments 📝</h1>

        <button
          className="teacher-create-btn"
          onClick={() => setShowForm(true)}
        >
          <FaPlus />
          Create Assignment
        </button>
      </div>

      {/* CREATE FORM */}
      {showForm && (
        <div className="teacher-modal-overlay">
          <form className="teacher-form" onSubmit={handleCreate}>
            <h2>Create Assignment</h2>

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

            <div className="teacher-form-buttons">
              <button type="submit">Create</button>

              <button type="button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* GRID */}
      <div className="teacher-assignment-grid">
        {assignments.map((a) => (
          <div key={a._id} className="teacher-assignment-card">
            <div className="teacher-card-top">
              <div>
                <h2>{a.title}</h2>
                <p>Due: {a.dueDate}</p>
              </div>

              <button
                className="teacher-delete-btn"
                onClick={() => handleDelete(a._id)}
              >
                Delete
              </button>
            </div>

            <div className="teacher-stats">
              <div className="teacher-stat-box">
                <span>
                  {a.submissions?.filter((s) => s.status !== "returned")
                    .length || 0}
                </span>

                <p>Submissions</p>
              </div>

              <div className="teacher-stat-box returned">
                <span>
                  {a.submissions?.filter((s) => s.status === "returned")
                    .length || 0}
                </span>

                <p>Returned</p>
              </div>
            </div>

            <button
              className="teacher-view-btn"
              onClick={() => setSelectedAssignment(a)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* DETAILS MODAL */}
      {selectedAssignment && (
        <div className="teacher-modal-overlay">
          <div className="teacher-details-modal">
            {/* HEADER */}
            <div className="teacher-details-header">
              <div>
                <h2>{selectedAssignment.title}</h2>
                <p>Due: {selectedAssignment.dueDate}</p>
              </div>

              <button onClick={() => setSelectedAssignment(null)}>✖</button>
            </div>

            {/* COLUMNS */}
            <div className="modal-columns">
              {/* SUBMISSIONS */}
              <div className="column">
                <div className="column-header">
                  <h3>Submissions</h3>

                  <span className="count">
                    {selectedAssignment.submissions?.filter(
                      (s) => s.status !== "returned",
                    ).length || 0}
                  </span>
                </div>

                {selectedAssignment.submissions
                  ?.filter((s) => s.status !== "returned")
                  .map((s, i) => (
                    <div key={i} className="submission-row">
                      <div className="left">
                        <span className="index">{i + 1}</span>

                        <div>
                          <p className="student">{s.student}</p>
                          <p className="answer">{s.answer}</p>
                        </div>
                      </div>

                      <button
                        className="return-btn"
                        onClick={() =>
                          handleReturn(selectedAssignment._id, s.student)
                        }
                      >
                        Return
                      </button>
                    </div>
                  ))}

                {selectedAssignment.submissions?.filter(
                  (s) => s.status !== "returned",
                ).length === 0 && <p className="empty">No submissions</p>}
              </div>

              {/* RETURNED */}
              <div className="column">
                <div className="column-header">
                  <h3>Returned</h3>

                  <span className="count green-count">
                    {selectedAssignment.submissions?.filter(
                      (s) => s.status === "returned",
                    ).length || 0}
                  </span>
                </div>

                {selectedAssignment.submissions
                  ?.filter((s) => s.status === "returned")
                  .map((s, i) => (
                    <div key={i} className="submission-row returned">
                      <div className="left">
                        <span className="index">{i + 1}</span>

                        <div>
                          <p className="student">{s.student}</p>
                          <p className="answer">{s.answer}</p>
                        </div>
                      </div>

                      <span className="returned-badge">Returned</span>
                    </div>
                  ))}

                {selectedAssignment.submissions?.filter(
                  (s) => s.status === "returned",
                ).length === 0 && (
                  <p className="empty">No returned submissions</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherAssignments;
