// frontend/src/prediction.js

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
    const response = await fetch('http://localhost:5001/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Prediction request failed');

    const result = await response.json();
    
    // Store the result in localStorage to pass it to the dashboard page
    localStorage.setItem('predictionResult', result.sleep_disorder_prediction);
    
    // Redirect back to the dashboard
    window.location.href = '/dashboard';

  } catch (error) {
    console.error('Error:', error);
    alert('Failed to get prediction. Please try again.');
  }
});