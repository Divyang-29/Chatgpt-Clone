import "dotenv/config";

const getAiResponse = async (message) => {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_API_KEY, // ✅ Correct header for Gemini
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // Uncomment this line to inspect the response structure during debugging
    // console.log("Gemini raw response:", JSON.stringify(data, null, 2));

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.error("Unexpected Gemini response:", data);
      throw new Error("No valid response from Gemini API");
    }

    return reply;
  } catch (err) {
    console.error("Error in getAiResponse:", err.message);
    throw err;
  }
};

export default getAiResponse;