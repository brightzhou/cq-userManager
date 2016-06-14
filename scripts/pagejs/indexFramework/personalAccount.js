//init iframe src
var iframe = document.getElementById("mainframe");
iframe.src = "./pages/taxpayerInfoMaintain/userInfoMaintain.html";
function onItemSelect(e) {
  var item = e.item;
  iframe.src = item.url;
}

function onItemClick(e) {
  var item = e.item;
  iframe.src = item.url;
}

function getBankTypeValue(e) {
  // console.log(e.value);
}

function submitForm() {
  //提交表单数据
  var form = new mini.Form("#authenticationForm");
  var data = form.getData(); //获取表单多个控件的数据
  var json = mini.encode(data); //序列化成JSON
  $.ajax({
    url: "",
    type: "post",
    data: {
      submitData: json
    },
    success: function(text) {
      alert("提交成功，返回结果:" + text);
    }
  });

}