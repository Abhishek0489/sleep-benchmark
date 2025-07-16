import { supabase } from './supabaseClient.js';

const form = document.getElementById('user-data-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    alert('You must be logged in to submit data.');
    return;
  }

  const data = {
    id: user.id,
    name: document.getElementById('name').value,
    age: parseInt(document.getElementById('age').value),
    occupation: document.getElementById('occupation').value,
    sleep_duration: parseFloat(document.getElementById('sleep').value),
    steps_walked: parseInt(document.getElementById('steps').value),
    gender: document.getElementById('gender').value,
  };

  const { error } = await supabase.from('user_data').upsert(data);

  if (error) {
    alert('Failed to save data: ' + error.message);
  } else {
    alert('Data submitted successfully!');
    form.reset();
  }
});
