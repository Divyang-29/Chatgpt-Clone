import { useContext, useRef, useEffect, useState } from "react";
import "./Chat.css";
import MyContext from "../MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export default function Chat() {
  const { newChat, previouschat, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState("");
  const endRef = useRef(null);

  // 🧠 Typing animation effect
  useEffect(() => {
    // if (!reply) return;
    if (reply === null) {
      setLatestReply("");
      return;
    }

    const words = reply.split(" ");
    let idx = 0;
    setLatestReply("");
    const interval = setInterval(() => {
      setLatestReply((prev) => prev + (idx === 0 ? "" : " ") + words[idx]);
      idx++;
      if (idx >= words.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [reply]);

  // 🧹 Clear latest reply when new chat starts
  useEffect(() => {
    setLatestReply("");
  }, [newChat]);

  // 🧹 Also clear when chat history resets
  useEffect(() => {
    if (previouschat.length === 0) setLatestReply("");
  }, [previouschat]);

  // 🧭 Auto-scroll on new message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [previouschat, latestReply]);

  return (
    <div className="chatContainer">
      <div className="chats">
        {/* Heading only when no chats exist */}
        {(!previouschat || previouschat.length === 0) && (
          <h1 className="chatHeading">What’s on your mind today?</h1>
        )}

        {/* Render all previous chats */}
        {previouschat?.map((chat, idx) => (
          <div
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
            key={idx}
          >
            {chat.role === "user" ? (
              <p className="usermsg">{chat.content}</p>
            ) : (
              <div className="gptmsg">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {chat.content || ""}
                </ReactMarkdown>
              </div>
            )}
          </div>
        ))}

        {/* Show the assistant typing animation */}
        {latestReply && (
          <div className="gptDiv">
            <div className="gptmsg">
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {latestReply}
              </ReactMarkdown>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>
    </div>
  );
}
