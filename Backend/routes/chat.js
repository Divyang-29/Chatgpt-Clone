import express from "express";
import Thread from "../models/Thread.js";
import ai from "../utils/ai.js";

const router = express.Router();

//test
router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "xyz",
      title: "Testing New Thread",
      // message: "Hello, lets test",
      createdAt: "2025-11-08",
      updatedAt: "2025-11-10",
    });

    const response = await thread.save();
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to save in DB" });
  }
});

router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch thread" });
  }
});

router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    // return the messages array (could be empty)
    // some older documents may have 'messages' (plural) due to a typo — support both
    res.json(thread.message || thread.messages || []);
  } catch (err) {
    console.log(err);
    res.send(500).json({ error: "Failed to fetch chat" });
  }
});

router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const deletedthread = await Thread.findOneAndDelete({ threadId });

    if (!deletedthread) {
      res.status(404).json({ error: "Thread could not be deleted" });
    }

    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.log(err);
    res.send(500).json({ error: "Failed to fetch chat" });
  }
});

router.delete("thread/:threadId", async (req, res) => {
  const { threadId } = req.body;
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });

    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.status(200).json({ success: "Thread deleted successfully" });
    res.status(500).json({ error: "Failed to delete thread" });
  } catch (err) {
    console.log(err);
  }
});

router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "missing required fields" });
  }
  try {
    let thread = await Thread.findOne({ threadId });
    if (!thread) {
      thread = new Thread({
        threadId,
        title: message,
        // Schema uses `message` (singular). Use the correct field so messages persist.
        message: [{ role: "user", content: message }],
      });
    } else {
      thread.message.push({ role: "user", content: message });
    }

    const assistantReply = await ai(message);

    thread.message.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();

    await thread.save();
    res.json({ reply: assistantReply });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
