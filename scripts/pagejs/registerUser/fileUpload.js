/**
 * @description 文件上传js
 */
mini.parse();

function onUploadSuccess(e) {
	alert("上传成功：" + e.serverData);
	this.setText("");
}

function onUploadError(e) {
	// console.log("上传失败:" + e);
}

function startUpload() {
	var fileupload = mini.get("uploadPath");
	var fileName = fileupload.text;//文件名
	fileupload.setPostParam({"fileName":fileName});//设置post上传参数
	fileupload.startUpload();
}