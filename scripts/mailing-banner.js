// Initialize banner height variable
document.documentElement.style.setProperty('--banner-height', '0px');

// Expiration time in days (change this value to set how often the banner reappears)
const BANNER_EXPIRATION_DAYS = 30;

// Function to close banner and save preference with expiration
function closeBanner() {
    const banner = document.querySelector('.mailing-banner');
    if (banner) {
        banner.style.display = 'none';
        
        // Set expiration time
        const expirationTime = new Date().getTime() + (BANNER_EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
        localStorage.setItem('mailing-banner-closed', JSON.stringify({
            closed: true,
            expiresAt: expirationTime
        }));
        
        document.documentElement.style.setProperty('--banner-height', '0px');
        document.body.style.paddingTop = '0px';
    }
}

// Function to check if banner closure has expired
function isBannerClosureExpired() {
    const storedData = localStorage.getItem('mailing-banner-closed');
    if (!storedData) return true; // No data = expired (show banner)
    
    try {
        const data = JSON.parse(storedData);
        const currentTime = new Date().getTime();
        return currentTime > data.expiresAt;
    } catch (e) {
        // If parsing fails, treat as expired
        return true;
    }
}

// Load mailing banner
const navbarPlaceholder = document.getElementById('navbar-placeholder');
if (navbarPlaceholder) {
    // Create banner placeholder before navbar
    const bannerPlaceholder = document.createElement('div');
    bannerPlaceholder.id = 'mailing-banner-placeholder';
    navbarPlaceholder.parentNode.insertBefore(bannerPlaceholder, navbarPlaceholder);

    // Check if user has already closed or registered
    const hasClosed = !isBannerClosureExpired(); // True if NOT expired
    const hasRegistered = localStorage.getItem('mailing-list-registered');
    
    // Store initial banner height to maintain it after registration
    let initialBannerHeight = 0;
    
    // Load banner
    fetch('/common-components/mailing-banner.html')
        .then(response => response.text())
        .then(html => {
            bannerPlaceholder.innerHTML = html;
            
            // Hide banner if user has already closed it (and not expired) or registered
            const banner = document.querySelector('.mailing-banner');
            if (banner && (hasClosed || hasRegistered === 'true')) {
                banner.style.display = 'none';
                document.documentElement.style.setProperty('--banner-height', '0px');
                document.body.style.paddingTop = '0px';
                return;
            }
            
            // Initialize banner form handling
            initializeMailingBannerForm();
            
            // Update navbar top position and body padding based on banner height
            if (banner) {
                const updatePositions = (preserveHeight = false) => {
                    // Check if banner is visible
                    const isVisible = banner.style.display !== 'none' && banner.offsetHeight > 0;
                    let bannerHeight;
                    
                    if (preserveHeight && initialBannerHeight > 0) {
                        // Use stored initial height to maintain consistency
                        bannerHeight = initialBannerHeight;
                    } else {
                        bannerHeight = isVisible ? Math.ceil(banner.offsetHeight) : 0;
                        // Store initial height on first calculation
                        if (isVisible && initialBannerHeight === 0) {
                            initialBannerHeight = bannerHeight;
                        }
                    }
                    
                    document.documentElement.style.setProperty('--banner-height', `${bannerHeight}px`);
                    
                    // Add padding to body to account for fixed banner
                    if (isVisible) {
                        document.body.style.paddingTop = `${bannerHeight}px`;
                    } else {
                        document.body.style.paddingTop = '0px';
                    }
                };
                
                // Wait for banner to render, then update position
                setTimeout(() => {
                    updatePositions();
                    // Update on resize
                    window.addEventListener('resize', () => updatePositions(false));
                    
                    // Watch for banner visibility changes (when closed) but don't recalculate height on content changes
                    const observer = new MutationObserver((mutations) => {
                        // Only update if banner visibility changed, not content changes
                        const visibilityChanged = mutations.some(mutation => 
                            mutation.type === 'attributes' && mutation.attributeName === 'style'
                        );
                        if (visibilityChanged) {
                            setTimeout(() => updatePositions(false), 50);
                        }
                    });
                    observer.observe(banner, {
                        attributes: true,
                        attributeFilter: ['style']
                    });
                }, 0);
            }
        })
        .catch(err => console.error('Error loading mailing banner:', err));
}

function initializeMailingBannerForm() {
    const form = document.getElementById('mailingBannerForm');
    if (!form) {
        return;
    }

    const emailInput = document.getElementById('emailBannerInput');
    const statusDiv = document.getElementById('mailingBannerStatus');

    if (!emailInput || !statusDiv) {
        return;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        statusDiv.textContent = '';

        if (!emailInput.value) {
            statusDiv.textContent = 'אנא הזינו כתובת אימייל תקינה.';
            statusDiv.style.color = '#ffcc00';
            return;
        }

        const formData = new FormData(form);
        const actionUrl = form.action;
        const formContainer = document.getElementById('mailingBannerFormContainer');
        const thankYouMessage = document.getElementById('mailingBannerThankYou');
        const bannerText = document.getElementById('mailingBannerText');

        fetch(actionUrl, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        })
        .then(() => {
            // Save registration status to localStorage
            localStorage.setItem('mailing-list-registered', 'true');
            
            // Hide the form and text, show thank you message
            if (formContainer) {
                formContainer.style.display = 'none';
            }
            if (bannerText) {
                bannerText.style.display = 'none';
            }
            if (thankYouMessage) {
                thankYouMessage.style.display = 'flex';
            }
            
            // Recalculate banner height after content changes
            const banner = document.querySelector('.mailing-banner');
            if (banner) {
                
                setTimeout(() => {
                    const bannerHeight = Math.ceil(banner.offsetHeight);
                    document.documentElement.style.setProperty('--banner-height', `${bannerHeight}px`);
                    document.body.style.paddingTop = `${bannerHeight}px`;
                }, 100);
            }
        })
        .catch(() => {
            statusDiv.textContent = 'אירעה שגיאה. אנא נסו שוב מאוחר יותר.';
            statusDiv.style.color = '#ffcc00';
        });
    });
}
