document.addEventListener('DOMContentLoaded', function () {
  var deletePaperForm = document.getElementById('delete-paper-form');
  var deletePaperBtn = document.getElementById('delete-paper-btn');
  var id;
  $('#exampleModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    id = button.data('id');
  });
  deletePaperBtn.addEventListener('click', function () {
    deletePaperForm.action = `/writer/management/paper/${id}/del`;
    deletePaperForm.submit();
  });
});
