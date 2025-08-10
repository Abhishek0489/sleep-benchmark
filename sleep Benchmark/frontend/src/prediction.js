// frontend/src/prediction.js

// ❗ Make sure to import the supabase client at the top
import { supabase } from './context/supabaseClient.js';

document.getElementById('prediction-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  // --- ⬇️ NEW: Get the user's session ---
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    alert('You must be logged in to submit a prediction.');
    return;
  }
  // --- ⬆️ NEW: End of session check ---

  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  // Convert numerical fields from string to number
  for (const key in data) {
    if (key !== 'BMI Category' && key !== 'Gender' && key !== 'Occupation') {
      data[key] = parseFloat(data[key]);
    }
  }

const NODE_SERVER_URL = 'https://sleep-web-server-node.onrender.com'; 
  
  try {
    // Send data to the Node.js server
    const response = await fetch(`${NODE_SERVER_URL}/submit-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // --- ⬇️ NEW: Add the Authorization header ---
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      // If the request is successful, redirect to the URL the server provides
      window.location.href = response.url;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Data submission failed');
    }

  } catch (error) {
    console.error('Error:', error);
    alert('Failed to submit data: ' + error.message);
  }
});