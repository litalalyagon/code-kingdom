// Load navbar
fetch('/common-components/navbar.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('navbar-placeholder').innerHTML = html;
             
        const navToggle = document.querySelector('.navbar-toggle');
        const navLinks = document.querySelector('.navbar-links');
        
        // Function to handle menu visibility based on screen width
        function handleMenuVisibility() {
            if (window.innerWidth <= 768) {
                navToggle.style.display = 'flex';
                navLinks.style.display = 'none';
            } else {
                navToggle.style.display = 'none';
                navLinks.style.display = 'flex';
            }
        }

        // Toggle menu when button is clicked
        navToggle.addEventListener('click', () => {
            const currentDisplay = navLinks.style.display;
            navLinks.style.display = currentDisplay === 'none' ? 'flex' : 'none';
        });

        // Handle initial state and resize
        handleMenuVisibility();
        window.addEventListener('resize', handleMenuVisibility);

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                !navToggle.contains(e.target) && 
                !navLinks.contains(e.target)) {
                navLinks.style.display = 'none';
            }
        });
    });

    
