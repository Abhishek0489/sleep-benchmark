const navdial = document.getElementById('nav-dial');
function handleMenu() {
      navdial.classList.toggle('hidden');
}     

function openLoginModal() {
    document.getElementById('loginModal').classList.remove('hidden');
    document.getElementById('loginModal').classList.add('flex');
  }

  function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('flex');
    document.getElementById('loginModal').classList.add('hidden');
  }

function openSignupModal() {
    document.getElementById('SignupModal').classList.remove('hidden');
    document.getElementById('SignupModal').classList.add('flex');
  }

  function closeSignupModal() {
    document.getElementById('SignupModal').classList.remove('flex');
    document.getElementById('SignupModal').classList.add('hidden');
  }

function SwitchLoginModal(){
  closeSignupModal();
  openLoginModal();
}

function SwitchSignupModal(){
  closeLoginModal();
  openSignupModal();
}