document.addEventListener("DOMContentLoaded", function () {
  var deleteUserForm = document.getElementById("delete-user-form");
  var deleteUserBtn = document.getElementById("delete-user-btn");
  var id;
  $("#delete-course-modal").on("show.bs.modal", function (event) {
    var button = $(event.relatedTarget);
    id = button.data("id");
  });
  deleteUserBtn.addEventListener("click", function () {
    deleteUserForm.action = `/admin/users/${id}/del`;
    deleteUserForm.submit();
  });
});
