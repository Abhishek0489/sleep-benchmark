// 1. Import the library
const { GoogleGenerativeAI } = require("@google/generative-ai");


const API_KEY = "";
const genAI = new GoogleGenerativeAI(API_KEY);

// Choose the model you want to use
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function run() {
  const prompt = `  
  so I have this following Data Gender- Male , age-20 , sleep_duration -7 , quality of sleep - 9 , physical activity-42
, stress level -8 ,BMI CATERGORY - overweight , heart rate - 80 , daily step - 4000 , blood pressure - 120/90,
and sleep disorder - NONE 
by taking all data diagnose this and suggest some changes required , how it affect sleep and health and how to improve it and what are long term merit and demerit , give response in 300 words
  
  
  `;

  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  console.log(text);
}

run();