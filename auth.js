import { supabase } from './supabaseClient.js';

const isAuthPage = window.location.pathname.includes('login') || window.location.pathname.includes('signup');
if (isAuthPage) {
  await supabase.auth.signOut();
  console.log('Auto-logout triggered on auth page');
}

(async () => {
  const { data: sessionData, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Failed to get session:', error.message);
    return;
  }

  const isAuthPage = window.location.pathname.includes('login') || window.location.pathname.includes('signup');
  if (sessionData.session && isAuthPage) {
    console.log('User already logged in. Redirecting to /userdata.html...');
    window.location.href = '/userdata.html';
  }
})();


// 🔐 Signup
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const username = document.getElementById('signup-username').value;

    // Save username temporarily
    localStorage.setItem('pendingUsername', username);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert('Signup failed: ' + error.message);
    } else {
      alert('Signup successful! Check your email to confirm.');
    }
  });
}

// 🔁 When user confirms and signs in
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('User signed in.');

    const isAuthPage = window.location.pathname.includes('login') || window.location.pathname.includes('signup');

    if (isAuthPage) {
      alert('Login successful!');
    }

    window.location.href = '/userdata.html';
  }
});


// 🔐 Login
const loginForm = document.getElementById('login-form');
// if (loginForm) {
//   loginForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const email = document.getElementById('login-email').value;
//     const password = document.getElementById('login-password').value;

//     const { error } = await supabase.auth.signInWithPassword({ email, password });

//     if (error) {
//       alert('Login failed: ' + error.message);
//     } else {
//       alert('Login successful!');
//       window.location.href = '/userdata.html';
//     }
//   });
// }

//const loginForm = document.getElementById('login-form');
if (loginForm) {
  console.log('Login form found and event listener added!');
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Login form submitted!');

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    console.log("Attempting to sign in with Supabase...");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('Login failed:', error.message);
      alert('Login failed: ' + error.message);
    } else {
      console.log('Login initiated. Waiting for onAuthStateChange to redirect...');
      // Don't redirect here — the onAuthStateChange will handle it.
    }
  });
}
