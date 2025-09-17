fetch('/common-components/contact-form.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('contact-section').innerHTML += html;
        const form = document.querySelector('#contact-form');
        form.addEventListener('submit', handleSubmit);  
});

async function handleSubmit(event) {
  event.preventDefault();
  var messagePlaceholder = document.getElementById("message-placeholder");
  var data = new FormData(event.target);
  const form = document.querySelector('#contact-form');
  fetch(event.target.action, {
    method: form.method,
    body: data,
    headers: {
        'Accept': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      messagePlaceholder.textContent = 'ההודעה נשלחה, תודה!';
      messagePlaceholder.style.color = 'green';
      form.reset()
    } else {
      response.json().then(data => {
        if (Object.hasOwn(data, 'errors')) {
          messagePlaceholder.textContent = data["errors"].map(error => error["message"]).join(", ")
        } else {
          messagePlaceholder.textContent = 'שליחת ההודעה נכשלה. נסו שוב.';
        }
        messagePlaceholder.style.color = 'red';
      })
    }
  }).catch(error => {
    messagePlaceholder.textContent = 'שליחת ההודעה נכשלה. נסו שוב.';
    messagePlaceholder.style.color = 'red';
  });
}

function changeFormId(formId) {
   // wait for the contact form to be loaded before changing the id
  const interval = setInterval(() => {
    const formIdInput = document.querySelector('#contact-section input[name="form-id"]');
    if (formIdInput) {
      formIdInput.value = formId;
      clearInterval(interval);
    }
  }, 1000);
}

