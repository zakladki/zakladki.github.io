import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not defined in process.env");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

try {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Say hello in Ukrainian and confirm you can help generate website descriptions.",
  });
  console.log("Gemini Response:", response.text);
} catch (error) {
  console.error("Gemini Error:", error);
}
