import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import MyContext from "../MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

export default function Chatwindow() {
  const {
    promt,
    setPromt,
    reply,
    setReply,
    currThreadId,
    previouschat,
    setPreviousChat,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handelProfileClick = () => {
    setIsOpen(!isOpen);
  };

  const getReply = async () => {
    if (!promt.trim()) return; // prevent empty messages

    // Store user message in chat
    setPreviousChat((prev) => [...prev, { role: "user", content: promt }]);
    setPromt(""); // Clear input

    setLoading(true);

    const options = {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        message: promt,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await fetch("https://chatgpt-clone-cxt6.onrender.com/api/chat", options);
      const res = await response.json();
      console.log(res);
      setReply(res.reply);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  // Push assistant reply into chat
  useEffect(() => {
    if (reply) {
      setPreviousChat((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);
      setReply(""); // Clean reply after pushing
    }
  }, [reply]);

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span id="heading">
          ChatGPT <span id="shade">5</span>
          <i id="shade" className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="userIconDiv" onClick={handelProfileClick}>
          <i className="fa-solid fa-user"></i>
        </div>
      </div>

      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItems">
            <i className="fa-solid fa-gear"></i> Setting
          </div>
          <div className="dropDownItems">
            <i className="fa-solid fa-crown"></i> Upgrade plan
          </div>
          <div className="dropDownItems">
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </div>
        </div>
      )}

      <Chat />
      <ScaleLoader color="#fff" loading={loading} />

      <div className="chatInput">
        <div className="userInput">
          <div className="plus">
            <i className="fa-solid fa-plus"></i>
          </div>

          <input
            type="text"
            placeholder="Ask anything"
            value={promt}
            onChange={(e) => setPromt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                getReply();
              }
            }}
          />

          <div className="mic">
            <i className="fa-solid fa-microphone"></i>
          </div>

          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>

        <p className="info">
          ChatGPT can make mistakes. Check important info. See{" "}
          <a href="#">Cookie Preferences.</a>
        </p>
      </div>
    </div>
  );
}
