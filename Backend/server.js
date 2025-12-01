import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js"
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use("/api",chatRoutes);

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
  connectDB();
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected with Database!");
  } catch (err) {
    console.log("Failed to connect with DB", err);
  }
};

// app.post("/test", async (req, res) => {
//   try {

//     const response = await fetch(
//       "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.GOOGLE_API_KEY}`,
//         },
//         body: JSON.stringify({
//           model: "gemini-2.0-flash",
//           messages: [{ role: "user", content: req.body.message }],
//         }),
//       }
//     );

//     const data = await response.json();
//     console.log("Gemini response:", data.choices[0].message.content);
//     res.send(data.choices[0].message.content);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });
