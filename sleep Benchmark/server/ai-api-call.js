const { GoogleGenerativeAI } = require("@google/generative-ai");

async function callGeminiAPI(prompt) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const apiResponse = await result.response;
  return apiResponse.text();
}

async function getHealthAnalysis(healthData) {
  // 1. Console log the incoming data
  console.log('Data received for AI analysis:', healthData);

  const {
    Age,
    Gender,
    Occupation,
    'Sleep Duration': sleepDuration,
    'Quality of Sleep': qualityOfSleep,
    'Physical Activity Level': physicalActivityLevel,
    'Stress Level': stressLevel,
    'BMI Category': bmiCategory,
    'Heart Rate': heartRate,
    'Daily Steps': dailySteps,
    Systolic: systolic,
    Diastolic: diastolic,
    recentPrediction
  } = healthData;

  // 2. Console log all the extracted variables
  console.log('Extracted Health Data for AI Prompt:', {
    Age,
    Gender,
    Occupation,
    sleepDuration,
    qualityOfSleep,
    physicalActivityLevel,
    stressLevel,
    bmiCategory,
    heartRate,
    dailySteps,
    systolic,
    diastolic,
    recentPrediction
  });



  // 3. Use all the new variables in a more comprehensive prompt
  const prompt = `
    Analyze the following user health data and provide a detailed, easy-to-read summary with actionable improvement tips.
    The user is a ${Age}-year-old ${Gender} who works as an ${Occupation}.

    Key Health Metrics:
    - Sleep Duration: ${sleepDuration} hours
    - Quality of Sleep (1-10): ${qualityOfSleep}
    - Stress Level (1-10): ${stressLevel}
    - Physical Activity: ${physicalActivityLevel} minutes per day
    - Daily Steps: ${dailySteps}
    - Heart Rate: ${heartRate} bpm
    - Blood Pressure: ${systolic}/${diastolic}
    - BMI Category: ${bmiCategory}

    The user's recent sleep disorder prediction from our model was: "${recentPrediction}".

    Based on all this information, provide a holistic analysis and tailored advice. Format the response in markdown with headings and bullet points.
  `;

  return callGeminiAPI(prompt);
}

module.exports = { getHealthAnalysis };
