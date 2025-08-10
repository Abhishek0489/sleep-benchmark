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

const { createClient } = require('@supabase/supabase-js');
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

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
    // --- ⬇️ NEW: Authenticate the user ---
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication token not provided.' });
    }

    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !user) {
      return res.status(401).json({ message: 'Invalid authentication token.' });
    }
    console.log('Request authenticated for user:', user.id);
    // --- ⬆️ END: User Authentication ---


    // 1. Node.js calls the Python API
    const pythonApiResponse = await axios.post('http://localhost:5001/predict', formData);
    const predictionResult = pythonApiResponse.data.sleep_disorder_prediction;

    // --- ⬇️ NEW: Prepare data and save to Supabase ---
    // Map form data keys to your database column names
    const predictionRecord = {
      user_id: user.id, // The authenticated user's ID
      age: formData['Age'],
      gender: formData['Gender'],
      occupation: formData['Occupation'],
      sleep_duration: formData['Sleep Duration'],
      quality_of_sleep: formData['Quality of Sleep'],
      physical_activity_level: formData['Physical Activity Level'],
      stress_level: formData['Stress Level'],
      heart_rate: formData['Heart Rate'],
      daily_steps: formData['Daily Steps'],
      systolic_bp: formData['Systolic'],
      diastolic_bp: formData['Diastolic'],
      bmi_category: formData['BMI Category'],
      sleep_disorder_prediction: predictionResult // The result from your Python model
    };

    const { error: insertError } = await supabaseAdmin
      .from('predictions')
      .insert(predictionRecord);

    if (insertError) {
      console.error('Supabase Insert Error:', insertError.message);
      throw new Error('Failed to save prediction to the database.');
    }
    console.log('Prediction saved to Supabase successfully.');
    // --- ⬆️ END: Save to Supabase ---


    // Store data in session for analytics page (optional, but you have it)
    req.session.formData = {
      ...formData,
      recentPrediction: predictionResult
    };

    // Redirect to the dashboard
    res.redirect(`/dashboard?prediction=${encodeURIComponent(predictionResult)}`);

  } catch (error) {
    console.error("Error in /submit-data route:", error.message);
    res.status(500).redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
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

app.get('/api/latest-prediction', async (req, res) => {
  try {
    // 1. Authenticate the user from the token sent by the frontend
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication token not provided.' });
    }
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !user) {
      return res.status(401).json({ message: 'Invalid authentication token.' });
    }

    // 2. Fetch the most recent prediction for that user
    const { data, error: predictionError } = await supabaseAdmin
      .from('predictions')
      .select('*') // Get all columns
      .eq('user_id', user.id) // For the logged-in user
      .order('created_at', { ascending: false }) // Get the newest one first
      .limit(1) // We only want one
      .single(); // Expect only a single object back, not an array

    if (predictionError) {
      // It's not a server error if the user just has no data yet
      if (predictionError.code === 'PGRST116') {
        return res.status(404).json({ message: 'No prediction data found for this user.' });
      }
      throw predictionError; // Throw other, actual errors
    }

    // 3. Send the data back to the frontend
    res.status(200).json(data);

  } catch (error) {
    console.error('Error fetching latest prediction:', error.message);
    res.status(500).json({ message: 'Server error while fetching prediction data.' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});