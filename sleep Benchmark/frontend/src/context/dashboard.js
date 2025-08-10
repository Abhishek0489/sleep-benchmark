// /frontend/src/context/dashboard.js

import { supabase } from './supabaseClient.js';

// This main function will run as soon as the dashboard loads
(async () => {
  // First, get the user's session and token
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  // If no session, the user is not logged in. Redirect them.
  // The 'auth.js' script also does this, but it's good practice to have it here too.
  if (sessionError || !session) {
    window.location.href = '/login.html';
    return;
  }

  // Fetch both user data and prediction data at the same time
  await fetchAndDisplayUserData(session.user);
  await fetchAndDisplayPredictionData(session.access_token);
})();


// --- Function to get user's name and gender ---
async function fetchAndDisplayUserData(user) {
  const { data, error } = await supabase
    .from('user_data')
    .select('name, gender') // Select both name and gender
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching user data:', error.message);
    return;
  }

  // Update the user's name in the navbar
  document.getElementById('user-name').textContent = data.name || 'User';

  // Update the gender icon (You had this hardcoded, now it's dynamic)
  const genderIcon = document.getElementById('gender-icon');
  const maleSVG = `...`; // Keep your existing long SVG string here
  const femaleSVG = `...`; // Keep your existing long SVG string here
  genderIcon.innerHTML = data.gender.toLowerCase() === "female" ? femaleSVG : maleSVG;
}


// --- Function to get the latest prediction data and update the dashboard ---
async function fetchAndDisplayPredictionData(token) {
  try {
    const response = await fetch('/api/latest-prediction', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Use the token to authenticate
      }
    });

    if (!response.ok) {
      // If the response is 404, it just means no data yet, which is fine.
      if (response.status === 404) {
        console.log('No prediction data found for user.');
        document.getElementById('no-prediction-card').classList.remove('hidden');
        return;
      }
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();

    // --- Update the dashboard cards with the fetched data ---
    document.getElementById('quality-of-sleep-value').textContent = `${data.quality_of_sleep}/10`;
    document.getElementById('stress-level-value').textContent = `${data.stress_level}/10`;
    document.getElementById('sleep-duration-value').textContent = `${data.sleep_duration} hrs`;
    document.getElementById('bmi-category-value').textContent = data.bmi_category;
    document.getElementById('blood-pressure-value').textContent = `${data.systolic_bp}/${data.diastolic_bp}`;
    document.getElementById('daily-steps-value').textContent = data.daily_steps;

    // --- Update the Sleep Disorder card ---
    const disorderType = data.sleep_disorder_prediction; // e.g., "Insomnia", "Sleep Apnea", "None"

    // Hide the default "no data" card
    document.getElementById('no-prediction-card').classList.add('hidden');

    // Show the correct card based on the prediction
    const disorderCard = document.getElementById(`disorder-card-${disorderType}`);
    if (disorderCard) {
      disorderCard.classList.remove('hidden');
    } else {
      // If the prediction doesn't match a card, show the default one as a fallback
      document.getElementById('no-prediction-card').classList.remove('hidden');
    }

  } catch (error) {
    console.error('Failed to fetch or display prediction data:', error);
    // Show the default card if there's an error
    document.getElementById('no-prediction-card').classList.remove('hidden');
  }
}