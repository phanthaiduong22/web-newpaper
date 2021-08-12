document.addEventListener("DOMContentLoaded", function () {
  var deletePaperForm = document.getElementById("delete-paper-form");
  var deletePaperBtn = document.getElementById("delete-paper-btn");
  $("#exampleModal").on("show.bs.modal", function (event) {
    var button = $(event.relatedTarget);
    var id = button.data("id");
  });
  deletePaperBtn.addEventListener("click", function () {
    deletePaperForm.submit();
  });
});
