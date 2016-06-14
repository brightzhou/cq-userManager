var b = false;
mini.parse();
var editWindow = mini.get("editWindow");
var grid = mini.get("agentData");
grid.load();
// grid.sortBy("createtime", "desc");
$(editWindow._toolsEl).on("click", function() {
  cancelAddAgent();
});
function getUserInfo(){
	 var form = new mini.Form("#editform");
	  form.validate();
	  var cardNo = mini.get("sfzhm").getValue();
	  if (form.isValid() == false) return;
	  $.ajax({
          url: "/api/binding/getuserinfo",
          type: "post",
//          contentType: "application/json",
          data: {
            "cardNo": cardNo
          },
          success: function(text) {
          	var data = mini.decode(text);
          	if(data.success){
          		b = true;
          		var value = data.value;
          		mini.get("realName").setValue(value.fullName);
          		mini.get("phone").setValue(value.mobile);
          		mini.get("accountId").setValue(value.id);
          	}else{
          		mini.alert(data.message);
          	}
          },
          error: function(text) {
            grid.unmask();
            mini.alert("请求失败,请稍后再试!");
          }
	  });
}
function onActionRenderer(e) {
  var grid = e.sender;
  var record = e.record;
  var uid = record._uid;
  var rowIndex = e.rowIndex;
  var s = '<a class="freeze-button" href="javascript:deleteAgent(\'' + uid + '\')" style="padding:0 10px;">点击删除</a>';
  return s;
}
function onStateRenderer(e) {
	var grid = e.sender;
	var record = e.record;
	var state = record.isBinding;
	var uid = record._uid;
	var rowIndex = e.rowIndex;
	if(state == 1){
		return "已绑定";
	}else{
		return "未绑定";
	}
}

// function deleteAgent(uid) {
//   mini.alert("删除成功");
// }

function addAgent() {
  var row = {};
  grid.addRow(row, grid.data.length);
  editRow(row._uid);
}

function editRow(row_uid) {
  var row = grid.getRowByUID(row_uid);
  if (row) {
    editWindow.show();
    // var form = new mini.Form("#editform");
    // form.clear();
    // form.loading();
    // $.ajax({
    //   url: "",
    //   dataType: "json",
    //   success: function(text) {
    //     form.unmask();
    //     form.setData(text);
    //   },
    //   error: function() {
    //     alert("表单加载错误");
    //     form.unmask();
    //   }
    // });
  }
}

function cancelAddAgent() {
  grid.reload();
  editWindow.hide();
}

function deleteAgent(row_uid) {
  var row = grid.getRowByUID(row_uid);
  if (row) {
    mini.confirm("确定要删除此代理人吗？", "删除代理人",
      function(action) {
        if (action == "ok") {
          //删除
          grid.loading("删除中，请稍后......");
          $.ajax({
            url: "/api/yhgl/nsrBinding/deleteBsr",
            type: "post",
//            contentType: "application/json",
            data: {
              "ryxxId": row.id
            },
            success: function(text) {
            	var data = mini.decode(text);
            	if(data.success){
            	}else{
            		mini.alert(data.message);
            	}
            	grid.removeRow(row);
            	grid.reload();
            },
            error: function(text) {
              grid.unmask();
              mini.alert("删除失败,请稍后再试!");
            }
          });
        } else {
          //不删除
        }
      }
    );
  }
}

function updateAgentRow() {
	if(!b){
		var type = mini.get("type").getValue();
		if(type != '1')
			return;
	}
  var form = new mini.Form("#editform");
  form.validate();
  if (form.isValid() == false) return;
  var o = form.getData();
  var json = mini.encode(o);
  grid.loading("绑定中，请稍后......");
  // console.log(json);
  $.ajax({
    url: "/api/yhgl/nsrBinding/add",
    type: "post",
//    contentType: "application/json",
    data: {
      "jsonStr": json
    },
    success: function(text) {
      var data = mini.decode(text);
      if(data.success){
    	  //添加成功
    	  form.reset();
      }else{
    	  alert(data.message);
      }
      grid.reload();
      grid.unmask();
    },
    error: function(text) {
      var data = mini.decode(text);
      grid.unmask();
      grid.reload();
      alert(data.message);
    }
  });

  editWindow.hide();
}