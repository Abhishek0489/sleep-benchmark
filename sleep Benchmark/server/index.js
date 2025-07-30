const express = require('express');
const path = require('path');

//adding 1 new comment line
const app = express();
const axios = require('axios');
app.use(express.json());
const PORT = process.env.PORT || 5000;

//seve dynamic directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 1. Serve all static files (CSS, JS, images) from the 'dist' directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));



// --- NEW /submit-data route ---
// It's now an async function to await the prediction
app.post('/submit-data', async (req, res) => {
  const formData = req.body;
  console.log('Data received in Node.js:', formData);

  try {
    // 1. Node.js calls the Python API
    const pythonApiResponse = await axios.post('http://localhost:5001/predict', formData);
    const predictionResult = pythonApiResponse.data.sleep_disorder_prediction;

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


app.get('/analytics', (req, res) => {
  // Example data to pass to the analytics page
  const analyticsData = {
    pageTitle: 'User Analytics',
    totalUsers: 150,
    dataPoints: [
      { month: 'May', logins: 320 },
      { month: 'June', logins: 450 },
      { month: 'July', logins: 510 }
    ]
  };

  res.render('analytics', analyticsData);
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});