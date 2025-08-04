// // frontend/src/prediction.js

// document.getElementById('prediction-form').addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const form = e.target;
//   const formData = new FormData(form);
//   const data = Object.fromEntries(formData.entries());

//   // Convert numerical fields from string to number
//   for (const key in data) {
//     if (key !== 'BMI Category' && key !== 'Gender' && key !== 'Occupation') {
//       data[key] = parseFloat(data[key]);
//     }
//   }

//   try {
//     // Send data directly to the Node.js server on a new route
//     const response = await fetch('/submit-data', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     });

//     if (response.ok) {
//       // If the request is successful, redirect to the URL the server provides
//       window.location.href = response.url;
//     } else {
//       throw new Error('Data submission failed');
//     }

//   } catch (error) {
//     console.error('Error:', error);
//     alert('Failed to submit data. Please try again.');
//   }
// });

import { supabase } from './context/supabaseClient'; // Make sure this import is present and correct

document.getElementById('prediction-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  // Convert numerical fields from string to number
  for (const key in data) {
    if (key !== 'BMI Category' && key !== 'Gender' && key !== 'Occupation') {
      data[key] = parseFloat(data[key]);
    }
  }

  try {
    // --- Get the logged-in user from Supabase ---
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        // If no user is found, show an error and stop.
        throw new Error('You must be logged in to submit a prediction.');
    }

    // --- Add the user's ID to the data object that will be sent ---
    data.user_id = user.id;

    // Send data (now including user_id) to the Node.js server
    const response = await fetch('/submit-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      // If the request is successful, redirect to the URL the server provides (the dashboard).
      // This preserves your original, working logic.
      window.location.href = response.url;
    } else {
      throw new Error('Data submission failed');
    }

  } catch (error) {
    console.error('Error:', error);
    alert(error.message); // Show a more specific error to the user
  }
});
