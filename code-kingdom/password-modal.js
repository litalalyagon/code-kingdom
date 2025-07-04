// password-modal.js
function showPasswordModal(onSuccess) {
  let modal = document.getElementById('password-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'password-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <h2>הכנס סיסמה</h2>
        <input type="password" id="password-input" placeholder="סיסמה" />
        <div class="modal-actions">
          <button id="password-submit">אישור</button>
          <button id="password-cancel">ביטול</button>
        </div>
        <div id="password-error" style="color:red;display:none;margin-top:8px;">סיסמה שגויה</div>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('password-cancel').onclick = hidePasswordModal;
    document.getElementById('password-submit').onclick = function() {
      const password = document.getElementById('password-input').value;
      if (password === '1234') {
        hidePasswordModal();
        onSuccess();
      } else {
        document.getElementById('password-error').style.display = 'block';
      }
    };
    document.getElementById('password-input').onkeydown = function(e) {
      if (e.key === 'Enter') document.getElementById('password-submit').click();
    };
  } else {
    modal.style.display = 'block';
    document.getElementById('password-input').value = '';
    document.getElementById('password-error').style.display = 'none';
  }
}

function hidePasswordModal() {
  const modal = document.getElementById('password-modal');
  if (modal) modal.style.display = 'none';
}
