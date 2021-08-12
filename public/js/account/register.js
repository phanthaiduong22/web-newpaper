$('#frmRegister').on('submit', async (e) => {
  e.preventDefault();
  const username = $('#txtUsername').val();
  const email = $('#txtEmail').val();
  if (username.length === 0 || email.length === 0) {
    alert('Username or email must not be empty!');
    return;
  }
  const isValidUsername = await fetch(
    `/account/is-valid-username?username=${username}`,
    { method: 'GET' },
  ).then((res) => res.json());
  if (!isValidUsername) {
    alert('Username is used');
    return;
  }
  const isValidEmail = await fetch(`/account/is-valid-email?email=${email}`, {
    method: 'GET',
  }).then((res) => res.json());
  if (!isValidEmail) {
    alert('Email is used');
    return;
  }
  const password = $('#txtPassword').val();
  const confirmPassword = $('#txtConfirmPassword').val();
  if (password.length === 0) {
    alert('Password must not be empty!');
    return;
  }
  if (password !== confirmPassword) {
    alert('Password have to be match!');
    return;
  }
  $('#frmRegister').off('submit').submit();
});
$('#txtDOB').datetimepicker({ format: 'd/m/Y', timepicker: false, mask: true });
$('#txtUsername').focus();
