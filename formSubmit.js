document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault(); // prevent default form submission
    fetch("https://formsubmit.co/b0c0e3ad6c8aac97a49ca479ae0a0592", {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(new FormData(this)).toString()
    })
    .then(response => {
      if (response.ok) {
        const messagePlaceholder = document.getElementById('message-placeholder');
        messagePlaceholder.textContent = 'ההודעה נשלחה';
        messagePlaceholder.style.color = 'green';
        this.reset(); // Clear the form
      } else {
        const messagePlaceholder = document.getElementById('message-placeholder');
        messagePlaceholder.textContent = 'שליחת ההודעה נכשלה. נסו שוב.';
        messagePlaceholder.style.color = 'red';
      }
    })
    .catch(error => {
      alert('שגיאה בשליחה');
    });
  });