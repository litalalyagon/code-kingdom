function initializeMailingListForm() {
    const form = document.getElementById('mailingListForm');
    if (!form) {
        console.error('Mailing list form not found');
        return;
    }

    const emailInput = document.getElementById('emailInput');
    const statusDiv = document.getElementById('mailingFormStatus');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        statusDiv.textContent = '';

        if (!emailInput.value) {
            statusDiv.textContent = 'אנא הזינו כתובת אימייל תקינה.';
            statusDiv.style.color = 'red';
            return;
        }

        const formData = new FormData(form);
        const actionUrl = form.action;

        fetch(actionUrl, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        })
        .then(() => {
            statusDiv.textContent = 'תודה שהצטרפתם לרשימת התפוצה שלנו!';
            statusDiv.style.color = 'green';
            form.reset();
        })
        .catch(() => {
            statusDiv.textContent = 'אירעה שגיאה. אנא נסו שוב מאוחר יותר.';
            statusDiv.style.color = 'red';
        });
    });
}