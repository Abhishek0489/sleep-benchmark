const express = require('express');
const path = require('path');

//adding 1 new comment line
const app = express();
const PORT = process.env.PORT || 5000;

//seve dynamic directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 1. Serve all static files (CSS, JS, images) from the 'dist' directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

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
  // Data to pass into the EJS file
  console.log("inside the dashboard route");
  const userData = {
    username: 'Shyam', // You can get this data from a database or session
    isAdmin: true
  };

  res.render('dashboard.ejs', userData);
});

app.get('/prediction', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/prediction.html'));
});

app.get('/userdata', (req, res) => {
  console.log("inside the userdata route");
  res.sendFile(path.join(__dirname, '../frontend/dist/userdata.html'));
});




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});