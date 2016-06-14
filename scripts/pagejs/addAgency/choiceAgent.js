var grid;

$(function() {
  grid = mini.get("agentData");
  grid.load();
  //grid.sortBy("createtime", "desc");
});

function research() {
  var key = mini.get("taxpayerIdentifyNum").getValue();
  var data ={"nsrsbh": key};
  grid.setUrl("/api/yhgl/queryCompany");
  grid.load(data);
 /* if (key === "") {
    mini.alert("请输入纳税人识别号！");
  } else {
    $.ajax({
      url: "/api/yhgl/queryCompany",
      type: "post",
      data: {
        "nsrsbh": key
      },
      success: function(text) {
        grid.reload();
      },
      error: function(text) {
        alert(text);
      }
    });
    // grid.loading("查询中，请稍后......");
    // grid.load({
    //   key: key
    // }, function(json) {
    //   var resultData = json.result;
    //   console.log(resultData);
    //   // grid.setData([key]);
    //   if (!resultData.success) {
    //     mini.alert(resultData.message, '提示信息');
    //   }
    // });
  }*/
}
function onKeyEnter(e) {
  research();
}

function onSwitchType(e){
	var record = e.record;
	var state = record.dlzt;
	if(state=='0'){
		return "未代理";
	}else{
		return "已代理";
	}	
}


function onActionRenderer(e) {
  var record = e.record;
  var uid = record._uid;
  var state = record.dlzt;
  var s;
  if (state.indexOf("1") != -1) {
    s = '<a class="cancel-agent-button" href="javascript:releaseAgent(\'' + uid + '\')" style="padding:0 10px;">解除代理</a>';
  } else{
    s = '<a class="cancel-agent-button" href="javascript:addAgent(\'' + uid + '\')" style="padding:0 10px;">代理</a>';
  }
  return s;
}

function addAgent(row_uid) {
	  // mini.alert("解除代理成功。");
	  var row = grid.getRowByUID(row_uid);
	  if (row) {
	    if (confirm("确定要绑定？")) {
	      grid.loading("绑定中，请稍后......");
	      $.ajax({
	        url: "/api/yhgl/addCompany",
	        type: "post",
	     //   contentType: "application/json",
	        data: {
	   /*       "accountId":"个人账号",*/
	          "djxh":row.djxh
	        },
	        success: function(text) {
	          grid.reload();
	        },
	        error: function() {}
	      });
	    }
	  }
	}
















function releaseAgent(row_uid) {
  // mini.alert("解除代理成功。");
  var row = grid.getRowByUID(row_uid);
  if (row) {
    if (confirm("确定要解除代理吗？")) {
      grid.loading("解除中，请稍后......");
      $.ajax({
        url: "/api/yhgl/removeCompany",
        type: "post",
     //   contentType: "application/json",
        data: {
   /*       "accountId":"个人账号",*/
          "djxh":row.djxh
        },
        success: function(text) {
          grid.reload();
        },
        error: function() {}
      });
    }
  }
}

function delRow(row_uid) {
  var row = grid.getRowByUID(row_uid);
  if (row) {
    if (confirm("确定删除此记录？")) {
      grid.loading("删除中，请稍后......");
      $.ajax({
        url: "" + row.id,
        success: function(text) {
          grid.reload();
        },
        error: function() {}
      });
    }
  }
}