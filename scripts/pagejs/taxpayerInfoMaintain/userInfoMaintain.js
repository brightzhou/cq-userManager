var form = new mini.Form("#userInfoMaintainForm");
var arrTelNumAndBankNum = [];

$("#infoMaintainConfirm").on("click", function() {
  form.validate();
  if (form.isValid() == false) return;
  modifyInfoConfirm();
});

function modifyInfoConfirm() {
  var telNum = mini.get("mobile").getValue();
  var bankNum = mini.get("yhkh").getValue();
  mini.confirm("确定要更改个人信息吗？", "更改个人信息",
    function(action) {
      if (action == "ok") {
        if (telNum != arrTelNumAndBankNum[0] || bankNum != arrTelNumAndBankNum[1]) {
          confirmModifyInfo("Y");
        } else {
          confirmModifyInfo("N");
        }
      } else {
        // alert("不更改!");
      }
    }
  );
}

function confirmModifyInfo(param) {
  var data = form.getData();
  var addressMap = {};
  addressMap.address1 = mini.get("address1").getValue();
  addressMap.address2 = mini.get("address2").getValue();
  addressMap.address3 = mini.get("address3").getValue();
  data.mrdzName = "address1";
  data.addressMap = addressMap;
  var json = mini.encode(data);
  $.ajax({
    url: "/api/yhgl/fnsrxxwh/" + param,
    type: "post",
    data: json,
    contentType: "application/json",
    success: function(text) {
      var data = mini.decode(text);
      if (data.success) {
        mini.alert("个人信息修改成功");
      } else {
        mini.alert(data.message);
      }
    },
    error: function(text) {
      mini.alert("个人信息修改失败" + text);
    }
  });
}

function initTaxpayerInfo() {
  var form = new mini.Form("#userInfoMaintainForm");
  // var obj = {
  //   username: "344433",
  //   xm: "334444dd",
  //   sfzhm: "46633332222",
  //   mobile: "13789067894",
  //   yhkh: "4488293934390293932",
  //   sfdlr: "0",
  //   email: "adakddk",
  //   wxzh: "77678999",
  //   address: "eefdadad@163.com"
  // }
  // form.setData(obj);
  $.ajax({
    url: "/api/yhgl/initAccountinfo",
    type: "POST",
    contentType: "application/json",
    success: function(res) {
    	var data = mini.decode(res);
        if(data.success==undefined){
        	arrTelNumAndBankNum = [data.mobile, data.yhkh];
        	form.setData(data);
        	var addressMap = data.addressMap;
        	mini.get("address1").setValue(addressMap.address1);
        	mini.get("address2").setValue(addressMap.address2);
        	mini.get("address3").setValue(addressMap.address3);
            
        }else{
        	mini.alert(data.message);
        }
    },
    error: function(res) {
      // console.log("获取初始化数据失败，返回结果:" + res);
    }
  });
}

function cancelBorderStyle(id) {
  var inputObj = mini.get(id);
  inputObj.setBorderStyle("border:none;");
}

//初始化页面
$(function() {
  initTaxpayerInfo();
  cancelBorderStyle("username");
  cancelBorderStyle("xm");
  cancelBorderStyle("sfzhm");
});