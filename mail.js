//kidscodebook
// const PUBLIC_KEY = "v5rH-uKvbLyYcUwSR";
// const serviceID = "service_kvz87wf";
// const templateID = "template_sy5sifs";
// btlines
const PUBLIC_KEY = "a1MkJyIBTPl5CUOws";
const serviceID = "service_er9uci5";
const templateID = "template_7z558hg";
const templateID_codeKingdom = "template_uwxrfd8";

(function() {
    emailjs.init({
        publicKey: PUBLIC_KEY,
    });
})();

function sendForm(form, template) {
    emailjs.sendForm(serviceID, template, form).then(() => {
        const messagePlaceholder = document.getElementById('message-placeholder');
        messagePlaceholder.textContent = 'ההודעה נשלחה';
        messagePlaceholder.style.color = 'green';
        form.reset(); // Clear the form
    }, (err) => {
        const messagePlaceholder = document.getElementById('message-placeholder');
        messagePlaceholder.textContent = 'שליחת ההודעה נכשלה. נסו שוב.';
        messagePlaceholder.style.color = 'red';
    });
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        sendForm(this, templateID);
    });
}

const codeKingdomForm = document.getElementById('contact-form-code-kingdom');
if (codeKingdomForm) {
    codeKingdomForm.addEventListener('submit', function(event) {
        event.preventDefault();
        sendForm(this, templateID_codeKingdom);
    });
}