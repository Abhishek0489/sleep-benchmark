import { supabase } from './supabaseClient.js';

// 🔐 Redirect if already logged in and on login/signup page
(async () => {
  const { data: { session }, error } = await supabase.auth.getSession();

  const isAuthPage = window.location.pathname.includes('login') || window.location.pathname.includes('signup');
  if (session && isAuthPage) {
    console.log('User already logged in. Redirecting to /dashboard.html...');
    window.location.href = '/dashboard';
  }
})();

// 🔐 Signup
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert('Signup failed: ' + error.message);
    } else {
      alert('Signup successful! Check your email to confirm.');
      window.location.href = '/userdata.html';
    }
  });
}

// 🔐 Login
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert('Login failed: ' + error.message);
    } else {
      // Do not redirect here — let onAuthStateChange handle it
    }
  });
}

// 🔁 Auth state change handler
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('User signed in.');
    const isAuthPage = window.location.pathname.includes('login') || window.location.pathname.includes('signup');
    if (isAuthPage) {
      alert('Login successful!');
      window.location.href = '/dashboard';
    }
  }
});

// 🔓 Logout handler
document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        alert('Logout failed: ' + error.message);
      } else {
        alert('You have been logged out.');
        window.location.href = '/login.html';
      }
    });
  }
});

// 🔐 Protect restricted pages
document.addEventListener('DOMContentLoaded', async () => {
  const protectedPages = ['dashboard.html', 'userdata.html'];
  const isProtectedPage = protectedPages.some(page => window.location.pathname.includes(page));

  if (isProtectedPage) {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      console.log('User not logged in or error occurred. Redirecting to login.');
      window.location.href = '/login.html';
    } else {
      console.log('User is logged in. Access granted.');
    }
  }
});