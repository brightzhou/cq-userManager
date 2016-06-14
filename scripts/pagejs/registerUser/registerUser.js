var passwordComplex = "";
var countdown = 60;
var clearTime = null;

function submitRegisterForm() {
  var form = new mini.Form("#registerForm");
  form.validate();
  if (form.isValid() == false) return;
  //提交数据
  var data = form.getData();
  var addressMap = {};
  addressMap.address = data.address;
  data.addressMap = addressMap;
  data.mrdzName = "address";
  var json = mini.encode(data);
  
  var infoRegister = {
    "name": data.xm,
    "idCardNum": data.sfzhm,
    "telNum": data.mobile,
    "email": data.email
  };
  $.ajax({
    url: "/api/registerAccount",
    type: "post",
    data: json,
    contentType : "application/json",
    success: function(res) {
      var text = mini.decode(res);
      if (text.success) {
        $("#content").html(getRegisterSuccessHtml(infoRegister));
      } else {
        mini.alert(text.message);
      }
    },
    error: function(res) {
      //to do
      // 1、 校验手机验证码是否正确；
      // 2、 判断该手机号或用户名是否已经注册；
      // 3、 根据姓名身份证号进行公安实名认证；
      // 4、 根据姓名、 身份证号、 手机号和银行卡号进行银联实名认证；
      // 5、 完成注册， 并将用户信息记录到账户中心
      mini.alert("注册失败" + res);
      // var code = mini.get("code");
      // var code_error = document.getElementById("code_error");
      // code.setBorderStyle("border-color: #DE2A2A");
      // code_error.innerHTML = "您输入的验证码不正确";
    }
  });
}

// 检查密码复杂度
function checkComplex(e) {
  var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
  var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
  var enoughRegex = new RegExp("(?=.{6,}).*", "g");
  var clsName = "safetyStrength";
  var val = e.sender.getInputText();
  var id = e.sender.id + "_error";
  var el = document.getElementById(id);
  var html = "<span class=" + clsName + ">安全强度：</span>";
  if (false == enoughRegex.test(val)) {
    passwordComplex = "弱"
    el.innerHTML = html + passwordComplex;
  } else if (strongRegex.test(val)) {
    passwordComplex = "强"
    el.innerHTML = html + passwordComplex;
  } else if (mediumRegex.test(val)) {
    passwordComplex = "中"
    el.innerHTML = html + passwordComplex;
  } else {
    passwordComplex = "弱"
    el.innerHTML = html + passwordComplex;
  }
  return true;
}

//发送验证码
function getVerificationCode(e) {
  var mobile = mini.get("mobile");
  //发送之前先校验手机号码
  mobile.validate();
  if (!mobile.isValid()) return;
  setTime(e);
  var telNum = mobile.value; //发送的手机号码参数
  $.ajax({
    url: "/api/sendVerifyCode",
    type: "post",
    data: {
      phone: telNum
    },
    success: function(res) {
      var text = mini.decode(res);
      if (text.success) {
        //alert("");
      } else {
        mini.alert(text.message);
      }
    },
    error: function(res) {

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

// 注册成功js
function getArgsHref() {
  var href = window.location.href;
  var url = decodeURI(decodeURI(href));
  var len = url.length;
  var offset = url.indexOf("?");
  var strArgs = url.substr(offset + 1, len);
  var args = strArgs.split("&");
  var retval = [];
  for (var i = 0; i < args.length; i++) {
    var str = args[i];
    var arg = str.split("=");
    retval.push(arg[1]);
  }
  return retval;
}

function getRegisterSuccessHtml(obj) {
  var info = "";
  if (obj.email != "") {
    info = "<tr><td>邮箱</td><td>" + obj.email + "</td></tr>"
  }
  return "<div id=\"registerSuccess\">\
    <div class=\"register-success-title\">\
      <h1><img src=\"../../images/success.png\">恭喜你，实名账户注册成功</h1>\
    </div>\
    <div class=\"user-info\">\
      <h4>您的账户信息如下：</h4>\
      <table id=\"accountInfo\" class=\"user-infos\">\
        <tr>\
          <td>姓名</td>\
          <td>" + obj.name + "</td>\
        </tr>\
        <tr>\
          <td>身份证号码</td>\
          <td>" + obj.idCardNum + "</td>\
        </tr>\
        <tr>\
          <td>手机号码</td>\
          <td>" + obj.telNum + "</td>\
          <td style=\"color: red;width: 200px;\">（请用此手机号码登录您的账户）</td>\
        </tr>\
        " + info + "\
      </table>\
    </div>\
    <div id=\"corporateBindForm\" class=\"corporate-bind-form\">\
      <h4>企业信息绑定：（绑定后你可以办理该单位的涉税事项）</h4>\
      <table>\
        <tr>\
          <td>\
            <a href='/api/yhgl/index' class=\"btn-blue\" type=\"button\">注册成功</a>\
          </td>\
        </tr>\
      </table>\
    </div>\
  </div>";
}