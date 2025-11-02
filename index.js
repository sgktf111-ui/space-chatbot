import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.static("public")); // Serves your HTML from the public folder

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  console.log("User message:", userMessage);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful NASA chatbot." },
          { role: "user", content: userMessage },
        ],
      }),
    });

    const data = await response.json();
    console.log("OpenAI response:", data);

    if (data.choices && data.choices.length > 0) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      res.json({ reply: "Sorry, I didn’t get a response from OpenAI." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ reply: "Error communicating with OpenAI." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 NASA Chatbot Server is Running!`));
