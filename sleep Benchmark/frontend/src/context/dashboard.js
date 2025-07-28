import { supabase } from './supabaseClient.js';

(async () => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    window.location.href = '/login.html';
    return;
  }

  const { data, error } = await supabase
    .from('user_data')
    .select('name')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching user name:', error.message);
    return;
  }

  // 🧠 Replace the name in the <b> tag
  const nameEl = document.getElementById('user-name');
  if (nameEl) {
    nameEl.textContent = data.name;
  }
})();
