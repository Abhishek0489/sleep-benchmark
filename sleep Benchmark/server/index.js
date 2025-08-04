// const express = require('express');
// const path = require('path');
// require('dotenv').config();

// //adding 1 new comment line
// const app = express();
// const axios = require('axios');
// app.use(express.json());
// const PORT = process.env.PORT || 5000;
// const session = require('express-session');
// const md = require('markdown-it')();

// //seve dynamic directory
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // 1. Serve all static files (CSS, JS, images) from the 'dist' directory
// app.use(express.static(path.join(__dirname, '../frontend/dist')));

// const { getHealthAnalysis } = require('./ai-api-call.js');

// app.use(session({
//   secret: 'your-very-secret-key-that-is-long-and-random', // Replace with a random string
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false } // Set to true if you are using HTTPS
// }));






// // --- NEW /submit-data route ---
// // It's now an async function to await the prediction
// app.post('/submit-data', async (req, res) => {
//   const formData = req.body;
//   console.log('Initial form data received:', formData);

//   try {
//     // 1. Node.js calls the Python API
//     const pythonApiResponse = await axios.post('http://localhost:5001/predict', formData);
//     const predictionResult = pythonApiResponse.data.sleep_disorder_prediction;

//     req.session.formData = {
//       ...formData, // Copies all original form fields
//       recentPrediction: predictionResult // Adds the new prediction
//     };


//     // 2. Redirect to the dashboard with the result as a query parameter
//     res.redirect(`/dashboard?prediction=${encodeURIComponent(predictionResult)}`);

//   } catch (error) {
//     console.error("Error calling Python API:", error.message);
//     // Redirect with an error message
//     res.redirect('/dashboard?error=Prediction-Failed');
//   }
// });







// // 2. Define routes to serve the built HTML pages from the 'dist' directory
// app.get('/', (req, res) => {
//   console.log("inside the / route");
//   res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
// });

// app.get('/login', (req, res) => {
//   console.log("inside the login route");
//   res.sendFile(path.join(__dirname, '../frontend/dist/login.html'));
// });

// app.get('/signup', (req, res) => {
//   console.log("inside the sign up route");
//   res.sendFile(path.join(__dirname, '../frontend/dist/signup.html'));
// });

// app.get('/dashboard', (req, res) => {
//   // 3. Get the prediction result from the URL query
//   const { prediction, error } = req.query;

//   // 4. Pass the prediction result (or error) to the EJS template
//   res.render('dashboard', {
//     username: 'Trouzee',
//     predictionResult: prediction, // This will be the prediction string or undefined
//     error: error
//   });
// });

// app.get('/prediction', (req, res) => {
//   res.sendFile(path.join(__dirname, '../frontend/dist/prediction.html'));
// });

// app.get('/userdata', (req, res) => {
//   console.log("inside the userdata route");
//   res.sendFile(path.join(__dirname, '../frontend/dist/userdata.html'));
// });

// app.get('/analytics', async (req, res) => {
//   const userHealthData = req.session.formData;

//   if (!userHealthData) {
//     return res.render('analytics', {
//       pageTitle: 'Health Analytics',
//       analysis: '<h2>No Data Found</h2><p>Please <a href="/prediction" class="text-blue-600">submit your health data</a> to get an analysis.</p>'
//     });
//   }

//   try {
//     console.log("Calling health analysis function with session data...");
    
//     // The prompt is no longer created here.
//     // Just pass the userHealthData object directly.
//     const aiResponseText = await getHealthAnalysis(userHealthData); 
//     const analysisHtml = md.render(aiResponseText);
    
//     req.session.formData = null;

//     res.render('analytics', {
//       pageTitle: 'Your AI-Powered Health Analytics',
//       analysis: analysisHtml
//     });

//   } catch (error) {
//     console.error("Error calling Gemini API:", error);
//     res.render('analytics', {
//       pageTitle: 'Error',
//       analysis: '<h2>Error</h2><p>Could not retrieve analysis at this time.</p>'
//     });
//   }
// });



// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

const express = require('express');
const path = require('path');
require('dotenv').config();
const axios = require('axios');
const session = require('express-session');
const md = require('markdown-it')();
const { createClient } = require('@supabase/supabase-js'); // --- NEW: Import Supabase client

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

// --- NEW: Initialize Supabase on the server ---
// It reads the credentials from your server/.env file
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Your existing view engine and static file setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '../frontend/dist')));

const { getHealthAnalysis } = require('./ai-api-call.js');

// Your existing session setup remains unchanged
app.use(session({
  secret: 'your-very-secret-key-that-is-long-and-random',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// The /submit-data route with the added upsert logic
app.post('/submit-data', async (req, res) => {
  const formData = req.body; // This now contains user_id from prediction.js
  console.log('Initial form data received:', formData);

  try {
    // 1. Get prediction from Python (your original logic)
    const pythonApiResponse = await axios.post('http://localhost:5001/predict', formData);
    const predictionResult = pythonApiResponse.data.sleep_disorder_prediction;

    // --- NEW: Prepare data and upsert into Supabase ---
    const dataToUpsert = {
        user_id: formData.user_id, // Get user_id from the form data
        prediction_date: new Date().toISOString().split('T')[0],
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
        sleep_disorder_prediction: predictionResult,
    };

    const { error: upsertError } = await supabase
        .from('predictions')
        .upsert(dataToUpsert, { onConflict: 'user_id, prediction_date' });

    if (upsertError) {
        // If the database operation fails, log it and throw an error
        console.error('Supabase upsert error:', upsertError);
        throw new Error('Failed to save prediction to the database.');
    }
    console.log('Prediction saved successfully to Supabase.');
    // --- End of new logic ---

    // 2. Save data to session for analytics (your original logic)
    req.session.formData = {
      ...formData,
      recentPrediction: predictionResult
    };

    // 3. Redirect to dashboard (your original logic)
    res.redirect(`/dashboard?prediction=${encodeURIComponent(predictionResult)}`);

  } catch (error) {
    console.error("Error in /submit-data route:", error.message);
    res.redirect('/dashboard?error=Prediction-Failed');
  }
});


// --- ALL OTHER ROUTES (/, /login, /dashboard, /analytics, etc.) REMAIN UNCHANGED ---

// Define routes to serve the built HTML pages from the 'dist' directory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/signup.html'));
});

app.get('/dashboard', (req, res) => {
  const { prediction, error } = req.query;
  res.render('dashboard', {
    username: 'Trouzee',
    predictionResult: prediction,
    error: error
  });
});

app.get('/prediction', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/prediction.html'));
});

app.get('/userdata', (req, res) => {
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
