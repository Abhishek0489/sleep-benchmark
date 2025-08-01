const express = require('express');
const path = require('path');
require('dotenv').config();

//adding 1 new comment line
const app = express();
const axios = require('axios');
app.use(express.json());
const PORT = process.env.PORT || 5000;
const session = require('express-session');
const md = require('markdown-it')();

//seve dynamic directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 1. Serve all static files (CSS, JS, images) from the 'dist' directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

const { getHealthAnalysis } = require('./ai-api-call.js');

app.use(session({
  secret: 'your-very-secret-key-that-is-long-and-random', // Replace with a random string
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if you are using HTTPS
}));






// --- NEW /submit-data route ---
// It's now an async function to await the prediction
app.post('/submit-data', async (req, res) => {
  const formData = req.body;
  console.log('Initial form data received:', formData);

  try {
    // 1. Node.js calls the Python API
    const pythonApiResponse = await axios.post('http://localhost:5001/predict', formData);
    const predictionResult = pythonApiResponse.data.sleep_disorder_prediction;

    req.session.formData = {
      ...formData, // Copies all original form fields
      recentPrediction: predictionResult // Adds the new prediction
    };


    // 2. Redirect to the dashboard with the result as a query parameter
    res.redirect(`/dashboard?prediction=${encodeURIComponent(predictionResult)}`);

  } catch (error) {
    console.error("Error calling Python API:", error.message);
    // Redirect with an error message
    res.redirect('/dashboard?error=Prediction-Failed');
  }
});







// 2. Define routes to serve the built HTML pages from the 'dist' directory
app.get('/', (req, res) => {
  console.log("inside the / route");
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.get('/login', (req, res) => {
  console.log("inside the login route");
  res.sendFile(path.join(__dirname, '../frontend/dist/login.html'));
});

app.get('/signup', (req, res) => {
  console.log("inside the sign up route");
  res.sendFile(path.join(__dirname, '../frontend/dist/signup.html'));
});

app.get('/dashboard', (req, res) => {
  // 3. Get the prediction result from the URL query
  const { prediction, error } = req.query;

  // 4. Pass the prediction result (or error) to the EJS template
  res.render('dashboard', {
    username: 'Trouzee',
    predictionResult: prediction, // This will be the prediction string or undefined
    error: error
  });
});

app.get('/prediction', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/prediction.html'));
});

app.get('/userdata', (req, res) => {
  console.log("inside the userdata route");
  res.sendFile(path.join(__dirname, '../frontend/dist/userdata.html'));
});

app.get('/analytics', async (req, res) => {
  const userHealthData = req.session.formData;

  if (!userHealthData) {
    return res.render('analytics', {
      pageTitle: 'Health Analytics',
      analysis: '<h2>No Data Found</h2><p>Please <a href="/prediction" class="text-blue-600">submit your health data</a> to get an analysis.</p>'
    });
  }

  try {
    console.log("Calling health analysis function with session data...");
    
    // The prompt is no longer created here.
    // Just pass the userHealthData object directly.
    const aiResponseText = await getHealthAnalysis(userHealthData); 
    const analysisHtml = md.render(aiResponseText);
    
    req.session.formData = null;

    res.render('analytics', {
      pageTitle: 'Your AI-Powered Health Analytics',
      analysis: analysisHtml
    });

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.render('analytics', {
      pageTitle: 'Error',
      analysis: '<h2>Error</h2><p>Could not retrieve analysis at this time.</p>'
    });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});