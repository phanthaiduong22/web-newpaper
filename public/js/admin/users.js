document.addEventListener("DOMContentLoaded", function () {
  var deleteUserForm = document.getElementById("delete-user-form");
  var deleteUserBtn = document.getElementById("delete-user-btn");
  var extendBtn = document.getElementById("extend-btn");
  var extendForm = document.getElementById("extend-form");
  var id;
  $("#delete-course-modal").on("show.bs.modal", function (event) {
    var button = $(event.relatedTarget);
    id = button.data("id");
  });
  deleteUserBtn.addEventListener("click", function () {
    deleteUserForm.action = `/admin/users/${id}/del`;
    deleteUserForm.submit();
  });

  $("#extend").on("show.bs.modal", function (event) {
    var button = $(event.relatedTarget);
    id = button.data("id");
  });
  extendBtn.addEventListener("click", function () {
    extendForm.action = `/account/profile/extend?id=${id}`;
    extendForm.submit();
  });
});
