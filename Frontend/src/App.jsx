import Sidebar from "./SideBar/Sidebar.jsx";
import ChatWindow from "./ChatWindow/Chatwindow.jsx";
import MyContext from "./MyContext.jsx";
import "./App.css";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";

export default function App() {
  const [promt, setPromt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrentThreadId] = useState(uuidv1());
  const [previouschat, setPreviousChat] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThread, setAllThread] = useState([]);
  const providerValue = {
    promt,
    setPromt,
    reply,
    setReply,
    currThreadId,
    setCurrentThreadId,
    previouschat,
    setPreviousChat,
    newChat,
    setNewChat,
    allThread,
    setAllThread,
  };

  return (
    <div className="app">
      <MyContext.Provider value={providerValue}>
        <Sidebar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  );
}
