var form = new mini.Form("#taxpayerInfoMaintainForm");
$("#infoMaintainConfirm").on("click", function() {
  form.validate();
  if (form.isValid() == false) return;
  modifyInfoConfirm();
});

function confirmModifyInfo() {
  var data = form.getData();
  var json = mini.encode(data);
  $.ajax({
    url: "/api/yhgl/nsrxxwh",
    type: "post",
    contentType :"application/json",
    data: json,
    success: function(text) {
    	var data = mini.decode(text);
        if(data.success){
      	  alert("信息修改成功");
      	  window.parent.location = "/api/yhgl/index";
        }else{
      	  alert(data.message);
        }
      // console.log("提交成功，返回结果:" + text);
    },
    error: function(text) {
      mini.alert("修改失败" + text);
    }
  });
}

function modifyInfoConfirm() {
  mini.confirm("确定要更改个人信息吗？", "更改个人信息",
    function(action) {
      if (action == "ok") {
        confirmModifyInfo();
      } else {
        // alert("不更改!");
      }
    }
  );
}

function initTaxpayerInfo() {
  $.ajax({
    url: "/api/yhgl/initNsrinfo",
    type: "POST",
    contentType: "application/json",
    success: function(res) {
      // console.log("获取初始化数据成功，返回结果:" + res);
     var data = mini.decode(res);
     if(data.success!=undefined){
    	 mini.alert(data.message);
     }else{
    	 form.setData(data);
     }
    },
    error: function(res) {
      // console.log("获取初始化数据失败，返回结果:" + res);
    }
  });
}

function cancelBorderStyle(arr) {
  for (var i = 0; i < arr.length; i++) {
    var inputObj = mini.get(arr[i]);
    inputObj.setBorderStyle("border:none;");
  }
}

//初始化页面
$(function() {
  initTaxpayerInfo();
  cancelBorderStyle(["nsrsbhGs","gsNsrmc","fddbrxm","fddbrxmzjhm","fddbrxmyddh"]);
});