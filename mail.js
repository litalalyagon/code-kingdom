var form = document.getElementById("contact-form");

async function handleSubmit(event) {
  event.preventDefault();
  var messagePlaceholder = document.getElementById("message-placeholder");
  var data = new FormData(event.target);
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

form.addEventListener('submit', handleSubmit);  