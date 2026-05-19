import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./ChannelChat.css";

function ChannelChat() {
  const { id } = useParams();

  const user = localStorage.getItem("user");
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    fetch("https://educonnect-q5og.onrender.com/api/channels")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((c) => c._id === id);

        setChannel(found);
        setMessages(found?.messages || []);
      });
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;

    const newMsg = {
      sender: user,
      text,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newMsg]);

    setText("");
  };

  if (!channel) return null;

  return (
    <div className="chat-page">
      {/* HEADER */}
      <div className="chat-header">
        <div className="back-circle" onClick={() => navigate(-1)}>
          <FiArrowLeft />
        </div>

        <h2 className="title">{channel.name}</h2>

        <div className="right">
          <div className="profile-icon">
            {channel.instructor?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="chat-body">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.sender === user ? "own" : ""}`}>
            <div className="msg-sender">{m.sender}</div>

            <div className="msg-text">{m.text}</div>

            <div className="msg-time">{m.time}</div>
          </div>
        ))}

        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      <div className="chat-input">
        <input
          placeholder="Type message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChannelChat;
