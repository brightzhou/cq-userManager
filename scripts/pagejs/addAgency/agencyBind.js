$(function() {
  initBindData();
});

function confirmUnBind() {	
  var djxh = document.getElementById('djxh').innerHTML;
  $.ajax({
    url: "/api/yhgl/removeProxy",
    type: "post",
    data: {
      'dljgdjxh': djxh
    },
    success: function(text) {
      mini.alert("解除绑定成功");
      initBindData();
    },
    error: function(text) {
      mini.alert("解除绑定失败");
    }
  });
}

function initBindData() {
  $.ajax({
    url: "/api/yhgl/queryBindState",
    type: "GET",
    success: function(text) {
      var data = mini.decode(text);
      // console.log(data);
      if(data.success){
    	  if (data.data.length === 0) {
	        $("#contentAgency").html(unbindAgencyHtml);
	        mini.parse();
	      } else {
	        $("#contentAgency").html(bindAgencyHtml);
	        var djxh = data.data[0].djxh;
	        var nsrsbh = data.data[0].nsrsbh;
	        var nsrmc = data.data[0].nsrmc;
	        $("#contentAgency").html(bindAgencyHtml(djxh, nsrsbh, nsrmc));
	      }
      }
    },
    error: function(text) {
      mini.alert("初始化失败" + text);
    }
  });
}

function confirmBind() {
  var form = new mini.Form("#addAgencyForm");
  var dljgdjxh = form.getData().dljgdjxh;
  form.validate();
  if (form.isValid() == false) {
    return;
  }

  $.ajax({
    url: "/api/yhgl/addProxy",
    type: "post",
    data: {
      'dljgdjxh': dljgdjxh
    },
    success: function(text) {
      var data = mini.decode(text);
      if(data.success){
    	  mini.alert("绑定成功");
    	  initBindData();
      }else{
    	  mini.alert("绑定失败");
      }
      
    },
    error: function(text) {
      mini.alert("绑定失败");
    }
  });
}


function queryProxy() {
  var form = new mini.Form("#addAgencyForm");
  form.validate();
  if (form.isValid() == false) {
    return;
  }
  var nsrsbh = mini.get('nsrsbh').getValue();
  nsrsbh = nsrsbh.trim();
  $.ajax({
    url: "/api/yhgl/queryProxy",
    type: "post",
    data: {
      'nsrsbh': nsrsbh
    },
    success: function(text) {
      var data = mini.decode(text);
      if(data.data.length===0){
    	  mini.alert("没有查询对应的代理机构");
      }else{   	  
          mini.get('dljgdjxh').setData(data.data);
          mini.get('dljgdjxh').setValue(data.data[0].djxh); 
      }
    },
    error: function(text) {
      mini.alert("查询失败");
    }
  });
}

function bindAgencyHtml(djxh, nsrsbh, nsrmc) {
  return "<div id=\"addAgencyForm\" class=\"add-agency-form\">\
      <table>\
        <tr style=\"display:none\">\
          <td width=\"170\">登记序号</td>\
          <td id=\"djxh\" name=\"djxh\">" + djxh + "</td>\
        </tr>\
        <tr>\
          <td>代理机构纳税人识别号：</td>\
          <td id=\"nsrsbh\" name=\"nsrsbh\">" + nsrsbh + "</td>\
        </tr>\
        <tr>\
          <td>代理机构名称：</td>\
          <td id=\"nsrmc\" name=\"nsrmc\">" + nsrmc + "</td>\
        </tr>\
        <tr>\
          <td></td>\
          <td>\
            <input value=\"解除绑定\" id=\"confirmUnBind\" class=\"btn-blue\" style=\"margin-left:-100px\" type=\"button\" onclick=\"confirmUnBind()\" />\
          </td>\
        </tr>\
      </table>\
    </div>";
}

var unbindAgencyHtml = "<div id=\"addAgencyForm\" class=\"add-agency-form\">\
      <table>\
        <tr>\
          <td width=\"144\">\
            <label for=\"nsrsbh\">代理机构纳税人识别号</label>\
          </td>\
          <td>\
            <input id=\"nsrsbh\" name=\"nsrsbh\" class=\"mini-textbox\" style=\"width: 240px;\" vtype=\"required;nsrsbh\" onvalidation=\"englishAndNumValidation\" onblur=\"queryProxy()\"/>\
          </td>\
          <td id=\"nsrsbh_error\" class=\"validation-error-text\"></td>\
        </tr>\
        <tr>\
          <td>\
            <label for=\"nsrmc\">代理机构名称</label>\
          </td>\
          <td>\
            <input id=\"dljgdjxh\" name=\"dljgdjxh\" class=\"mini-combobox\" style=\"width:150px;color:#ccc\" textField=\"nsrmc\" valueField=\"djxh\"  value=\"a\" enabled=\"true\" />\
          </td>\
          <td id=\"nsrmc_error\" class=\"validation-error-text\"></td>\
        </tr>\
        <tr>\
          <td></td>\
          <td>\
            <input value=\"确  定\" id=\"confirmBind\" class=\"btn-blue\" type=\"button\" onclick=\"confirmBind()\" />\
          </td>\
        </tr>\
      </table>\
    </div>";