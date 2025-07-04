const PUBLIC_KEY = "v5rH-uKvbLyYcUwSR";
const serviceID = "service_kvz87wf";
const templateID = "template_sy5sifs";
(function() {
    emailjs.init({
        publicKey: PUBLIC_KEY,
    });
})();

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    emailjs.sendForm(serviceID, templateID, this).then(() => {
        const messagePlaceholder = document.getElementById('message-placeholder');
        messagePlaceholder.textContent = 'ההודעה נשלחה';
        messagePlaceholder.style.color = 'green';
        this.reset(); // Clear the form
    }, (err) => {
        const messagePlaceholder = document.getElementById('message-placeholder');
        messagePlaceholder.textContent = 'שליחת ההודעה נכשלה. נסו שוב.';
        messagePlaceholder.style.color = 'red';
    });

});