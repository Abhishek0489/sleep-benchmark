const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key from environment variables
const genAI = new GoogleGenerativeAI("AIzaSyArNfnNGyhENiAHOVnXD857Fx4gFO6zzaU");

async function generateContent() {
  try {
    // Choose a model, like gemini-1.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Write a short, thrilling story about an astronaut discovering a secret on Mars.";

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    console.log(text);
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

generateContent();
