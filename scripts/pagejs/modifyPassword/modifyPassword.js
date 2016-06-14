$("#confirmModify").on("click", function() {
	confirmModify();
});

function confirmModify() {
	var form = new mini.Form("#modifyPasswordForm");
	form.validate();
	if(form.isValid() == false){
		return;
	}
	var data = form.getData();
	var json = mini.encode(data);
	$.ajax({
		url: "/api/yhgl/modifyPassword",
		type: "post",
		contentType: "application/json",
		data: json,
		success: function(text) {
			var data = mini.decode(text);
			if (data.success){
				mini.alert("修改成功");
			} else {
				mini.alert(data.message);
			}
		},
		error: function(text) {
			mini.alert("修改密码失败");
		}
	});
}