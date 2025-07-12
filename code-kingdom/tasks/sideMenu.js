
document.addEventListener("DOMContentLoaded", function() {
  function toggleMenu() {
    document.getElementById("sideMenu").classList.toggle("open");
  }
  window.toggleMenu = toggleMenu;
});



// Close menu when clicking outside (mobile)
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 900 
    && !document.getElementById('sideMenu').contains(e.target) 
    && !document.querySelector('.menu-toggle').contains(e.target)) {
    document.getElementById('sideMenu').classList.remove('open');
  }
});
