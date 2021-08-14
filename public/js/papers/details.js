var input = document.querySelector('input[name=tags]');
new Tagify(input);
var tags = document.querySelectorAll('.tagify__tag-text');
for (let tag of tags) {
  tag.addEventListener('click', (e) => {
    var tagName = tag.innerHTML;
    var url = '/tags?name=' + encodeURIComponent(`${tagName}`);
    window.location.href = url;
  });
}
//Get the button
var mybutton = document.getElementById('myBtn');
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};
function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = 'block';
  } else {
    mybutton.style.display = 'none';
  }
} // When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

var downloadBtn = $('#download');
downloadBtn.on('click', function (e) {
  e.preventDefault();
  var paperId = downloadBtn[0].dataset.id;
  window.open(`/papers/details/${paperId}/download`);
});
