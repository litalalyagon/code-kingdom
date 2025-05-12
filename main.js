
function handleEnter() {
    const password = prompt('הכנס סיסמה:');
        if (password === 'robi') { // Change '1234' to your desired password
          window.location.href = 'tasks/index.html';
        } else if (password !== null) {
          alert('סיסמה שגויה');
        }
    }
    