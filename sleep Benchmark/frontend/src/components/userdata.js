import { supabase } from '../context/supabaseClient.js';

// 🔐 Redirect to login if not authenticated
(async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    alert('You must be logged in to access this page.');
    window.location.href = '/login.html';
    return;
  }
})();

// 📋 Handle form submission
const form = document.getElementById('user-data-form');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      alert('You must be logged in to submit data.');
      return;
    }

    const userData = {
      id: user.id,
      name: document.getElementById('name').value,
      age: parseInt(document.getElementById('age').value),
      phone: document.getElementById('phone').value,
      alt_phone: document.getElementById('altPhone').value || null,
      gender: document.getElementById('gender').value,
      occupation: document.getElementById('occupation').value,
      height: parseFloat(document.getElementById('height').value),
      weight: parseFloat(document.getElementById('weight').value),
    };

    const userDataJSON = JSON.stringify(userData); // ← JSON string version

    console.log('Submitting data:', userData); // Optional debug

    const { error } = await supabase.from('user_data').upsert(userData);

    if (error) {
      alert('Failed to save data: ' + error.message);
    } else {
      alert('Data submitted successfully!');
      window.location.href = '/';

    }
  });
}
