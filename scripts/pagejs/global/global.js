$(document).ajaxComplete(function(evt, request, settings) {
	var result = mini.decode(request.responseText);
	if (result.message == "ajaxSessionTimeOut") {
		mini.alert("登录超时，请重新登录。", "提示信息", function() {
			window.parent.location.href = "/api/yhgl/index";
		});
	}
});