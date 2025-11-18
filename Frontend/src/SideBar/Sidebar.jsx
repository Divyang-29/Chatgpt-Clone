import "./Sidebar.css";
import aiImage from "../assets/chatgpt.png";
import { useContext, useEffect } from "react";
import MyContext from "../MyContext";
import { v1 as uuidv1 } from "uuid";

export default function Sidebar() {
  const {
    allThread,
    setAllThread,
    setNewChat,
    setPromt,
    setReply,
    currThreadId,
    setCurrentThreadId,
    setPreviousChat,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/thread");
      const res = await response.json();
      const filterData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThread(filterData);
    } catch (err) {
      console.log("Error fetching threads:", err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, []);

  const createNewChat = () => {
    const newThreadId = uuidv1();
    setPreviousChat([]);
    setPromt("");
    setReply("");
    setNewChat(true);
    setCurrentThreadId(newThreadId);
  };

  const changeThread = async (newThreadId) => {
    setCurrentThreadId(newThreadId);
    try {
      const response = await fetch(
        `http://localhost:8080/api/thread/${newThreadId}`
      );
      const res = await response.json();
      setPreviousChat(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteThread = async (threadId, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setAllThread((prev) => prev.filter((t) => t.threadId !== threadId));
      } else {
        console.log("Failed to delete thread");
      }
    } catch (err) {
      console.log("Error deleting thread:", err);
    }
  };

  return (
    <section className="sidebar">
      {/* new chat button */}
      <div className="buttonClasss">
        <button>
          <img src={aiImage} alt="Ai logo" className="ailogo" />
        </button>
        <button onClick={createNewChat}>
          <span>
            <i className="fa-solid fa-pen-to-square"></i>
          </span>
        </button>
      </div>

      {/* history */}
      <ul className="history">
        {allThread?.map((thread) => (
          <li
            key={thread.threadId}
            onClick={() => changeThread(thread.threadId)}
            className={thread.threadId === currThreadId ? "highlighted" : ""}
          >
            <span className="thread-title">{thread.title}</span>

            <span
              className="delete"
              onClick={(e) => handleDeleteThread(thread.threadId, e)}
            >
              <i className="fa-solid fa-trash"></i>
            </span>
          </li>
        ))}
      </ul>

      {/* sign */}
      <div className="sign">
        <p>By Divyang &hearts;</p>
      </div>
    </section>
  );
}
