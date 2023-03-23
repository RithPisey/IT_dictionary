const fileInput = document.getElementById("file");
const imgNameInput = document.getElementById("img_name");

fileInput.addEventListener("change", function () {
    const selectedFile = fileInput.files[0];
    imgNameInput.value = selectedFile.name;
    if (imgNameInput.value !== "") {
        $(".drop-title").html("<p>Your File Has<br>Selected</p>");
    }
});
