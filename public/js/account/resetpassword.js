$("#frmForgotPassword").on("submit", async (e) => {
  e.preventDefault();
  $("#frmForgotPassword").off("submit").submit();
});
$("#frmResetPassword").on("submit", async (e) => {
  e.preventDefault();
  const password = $("#txtPassword").val();
  const confirmPassword = $("#txtConfirmPassword").val();
  if (password.length === 0 || confirmPassword.length === 0) {
    alert("Invalid data!");
    return;
  }
  if (password !== confirmPassword) {
    alert("Password have to be match.");
    return;
  }
  alert("Password changed.");
  $("#frmResetPassword").off("submit").submit();
});
