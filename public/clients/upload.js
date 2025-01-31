tinymce.init({
  selector: 'textarea#default',
  width : 1200,
  height : 600,
});

const fileInput = document.getElementById("cover");
const selectedFileName = document.querySelector(".input-label")

fileInput.addEventListener("change", function() {
    const files = fileInput.files;
    if (files.length > 0) {
      selectedFileName.textContent = "" + files[0].name;
    }
  });