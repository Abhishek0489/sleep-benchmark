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
    // Send data directly to the Node.js server on a new route
    const response = await fetch('/submit-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      // If the request is successful, redirect to the URL the server provides
      window.location.href = response.url;
    } else {
      throw new Error('Data submission failed');
    }

  } catch (error) {
    console.error('Error:', error);
    alert('Failed to submit data. Please try again.');
  }
});