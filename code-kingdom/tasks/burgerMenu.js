// Burger menu logic
const burgerBtn = document.getElementById('burgerBtn');
const nav = document.querySelector('nav');

burgerBtn.addEventListener('click', () => {
  nav.classList.toggle('open');
});

// Close menu when clicking outside (mobile)
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 900 && nav.classList.contains('open')) {
    if (!nav.contains(e.target) && e.target !== burgerBtn) {
      nav.classList.remove('open');
    }
  }
});
