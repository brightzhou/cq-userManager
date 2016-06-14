var jsonObj;

function confirmSubmit() {
	var form = new mini.Form("#forgetPasswordForm");
	form.validate();
	if (form.isValid() == false) return;
	var o = form.getData();
	// console.log(json);
	$.ajax({
		url: "/api/queryUserinfoByLoginName",
		type: "post",
		//contentType: "application/json",
		data: o,
		success: function(text) {
			var data = mini.decode(text);
			if (data.success) {
				jsonObj = data.value;
				jsonObj.loginName = o.loginName;
				$("#content").html(findHtml);
			}else{
				mini.alert(data.message);
				$("#tpcode")[0].src = "/captcha.jpg?'+Math.random()";
				//$("#loginName_error").html("您输入的用户名不存在");
			}
			
		},
		error: function(text) {
			mini.alert("请求出错");
		}
	});
}

function phoneFind() {
	passwordAjax("PHONE");
}

function emailFind() {
	passwordAjax("YJ");
}

//发送验证码
function passwordAjax(zhfs) {
	jsonObj.zhfs = zhfs;
	$.ajax({
		url: "/api/sendCode",
		type: "post",
		//contentType: "application/json",
		data: jsonObj,
		success: function(text) {
			var data = mini.decode(text);
			if (data.success) {
				$("#content").html(setUpPasswordHtml);
				mini.parse();
			}else{
				mini.alert(data.message);
			}
			
		},
		error: function(text) {
			mini.alert(text);
		}
	});
}

//重新发送验证码
var countdown = 60;
var clearTime = null;
function getVerificationCode(e) {
  setTime(e);
  $.ajax({
		url: "/api/sendCode",
		type: "post",
		//contentType: "application/json",
		data: jsonObj,
		success: function(text) {
			var data = mini.decode(text);
			if (!data.success) {
				mini.alert(data.message);
			}
		},
		error: function(text) {
			mini.alert(text);
		}
	});
}
//倒计时
function setTime(obj) {
  clearTime = setTimeout(function() {
    setTime(obj);
  }, 1000);
  if (countdown === 0) {
    clearTimeout(clearTime);
    obj.sender.setEnabled(true);
    obj.sender.el.innerText = "重新发送";
    countdown = 60;
  } else {
    obj.sender.setEnabled(false);
    obj.sender.el.innerText = "重新发送(" + countdown + "s" + ")";
    countdown--;
  }
}

function confirmSetUp() {
	var form = new mini.Form("#setUpPasswordForm");
	form.validate();
	if (form.isValid() == false) return;
	//提交数据
	var data = form.getData();
	jsonObj.newPassword = data.newPassword;
	jsonObj.code = data.code;
	var json = mini.encode(jsonObj);
	// console.log(json);
	$.ajax({
		url: "/api/resetPassword",
		type: "post",
		contentType: "application/json",
		data: json,
		success: function(text) {
			var data = mini.decode(text);
			if (data.success) {
				alert("修改成功");
			} else {
				mini.alert(data.message);
			}
			// console.log("提交成功，返回结果:" + text);
		},
		error: function(text) {
			// console.log(text);
			$("#code_error").html("您输入的验证码错误，请重新输入");
		}
	});
}