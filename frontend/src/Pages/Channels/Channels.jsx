import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import "./Channels.css";

function Channels() {
  const navigate = useNavigate();

  const user = localStorage.getItem("user");
  const role = localStorage.getItem("role");

  const [channels, setChannels] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newChannel, setNewChannel] = useState("");

  const fetchChannels = () => {
    fetch("http://localhost:5000/api/channels")
      .then((res) => res.json())
      .then((data) => setChannels(data));
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const handleSave = async () => {
    if (!newChannel.trim()) return;

    await fetch("http://localhost:5000/api/channels/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newChannel,
        createdBy: user,
      }),
    });

    setNewChannel("");
    setShowInput(false);
    fetchChannels();
  };

  const handleRequest = async (id) => {
    await fetch(`http://localhost:5000/api/channels/request/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student: user }),
    });

    fetchChannels();
  };

  return (
    <div className="channels-page">
      {/* HEADER */}
      <div className="channels-header">
        <h2>Channels</h2>

        {role === "teacher" && (
          <button
            className="channel-create-btn"
            onClick={() => setShowInput(true)}
          >
            <FaPlus />
            Create Channel
          </button>
        )}
      </div>

      {/* POPUP */}
      {showInput && role === "teacher" && (
        <div className="popup-overlay" onClick={() => setShowInput(false)}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
            <h3>Create Channel</h3>

            <input
              value={newChannel}
              onChange={(e) => setNewChannel(e.target.value)}
              placeholder="Channel name..."
            />

            <div className="popup-actions">
              <button onClick={handleSave}>Create</button>
              <button onClick={() => setShowInput(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* GRID */}
      <div className="channel-grid">
        {channels.map((c) => {
          const request = c.requests?.find((r) => r.student === user);
          const member = c.members?.find((m) => m.student === user);

          return (
            <div key={c._id} className="student-channel-card">
              <img
                className="channel-img"
                src={`https://api.dicebear.com/7.x/shapes/svg?seed=${c.name}`}
                alt="channel"
              />

              <h3>{c.name}</h3>
              <p>{c.createdBy}</p>

              {role === "teacher" ? (
                <button onClick={() => navigate(`/channel/${c._id}`)}>
                  Open
                </button>
              ) : member ? (
                <button onClick={() => navigate(`/channel/${c._id}`)}>
                  Enter
                </button>
              ) : request?.status === "pending" ? (
                <button disabled>Requested</button>
              ) : request?.status === "rejected" ? (
                <button disabled className="reject">
                  Rejected
                </button>
              ) : (
                <button onClick={() => handleRequest(c._id)}>
                  Request to Join
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Channels;
