const fileInput = document.getElementById("file");
const storeBinary = document.getElementById("bdata");
const imgNameInput = document.getElementById("img_name");

fileInput.addEventListener("change", async function (event) {
	const selectedFile = event.target.files[0];
	const fileType = selectedFile.type;
	if (fileType.startsWith("image/")) {
		// const binary = await getBinary(selectedFile);
		// storeBinary.value = binary;
		// imageUploaded(selectedFile);
		imgNameInput.value = selectedFile.name;

		if (imgNameInput.value !== "") {
			$(".drop-title").html("<p>Your File Has<br>Selected</p>");
		}
	}
});

function getBinary(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsBinaryString(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = reject;
	});
}

function imageUploaded(fileInput) {
	// var file = document.querySelector("input[type=file]")["files"][0];
	// var file = fileInput["files"][0];

	var reader = new FileReader();

	reader.onload = function (event) {
		// base64
		// base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
		// imageBase64Stringsep = base64String;

		// blob
		// const blob = new Blob([event.target.result], { type: fileInput.type });

		//byte array
		// const byteArray = new Uint8Array(reader.result);

		// binary string
		const binaryString = event.target.result;
		storeBinary.value = binaryString;
		// alert(imageBase64Stringsep);
		// blob.text().then((val) => {
		// 	console.log(val);
		// });
	};
	reader.readAsBinaryString(fileInput);
}
