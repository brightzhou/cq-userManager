mini.parse();
var editWindow = mini.get("editWindow");
var grid = mini.get("agentData");
grid.load();
var baddAgent = false;
// grid.sortBy("createtime", "desc");
$(editWindow._toolsEl).on("click", function() {
  cancelAddAgent();
});

$("#confirmBind").on("click", function() {
  confirmBindClick();
});

function confirmBindClick() {
  var taxNum = "2333049944003030";
  var corporateName = "*********";
  var bind = "bindSuccess";
  mini.showMessageBox({
    width: 420,
    height: 220,
    title: "绑定结果",
    buttons: ["确定", "取消"],
    html: "<div class="+bind+"><h2>恭喜你，绑定成功！</h2><p>你已成为税号："+taxNum+"，名称："+corporateName+"企业的管理员</p></div>",
    callback: function(action) {
      alert(action);
    }
  });
}
function onStateRenderer(e) {
	var grid = e.sender;
	var record = e.record;
	var state = record.yxbz;
	var uid = record._uid;
	var rowIndex = e.rowIndex;
	if(state == 1){
		return "已绑定";
	}else{
		return "未绑定";
	}
}
function onActionRenderer(e) {
  var grid = e.sender;
  var record = e.record;
  var uid = record._uid;
  var rowIndex = e.rowIndex;
  var state = record.yxbz;
  var s;
  if (baddAgent) return '<a class="cancel-agent-button" href="javascript:releaseAgent(\'' + uid + '\')" style="padding:0 10px;">解除绑定</a>';
  if (state.indexOf("1") != -1) {
    s = '<a class="cancel-agent-button" href="javascript:releaseAgent(\'' + uid + '\')" style="padding:0 10px;">解除绑定</a>';
  }else{
    s = '<a class="cancel-agent-button" href="javascript:addAgent(\'' + uid + '\')" style="padding:0 10px;">绑定</a>';
  }
  return s;
}


function releaseAgent(row_uid) {
  var row = grid.getRowByUID(row_uid);
  if (row) {
    mini.confirm("确定解除此绑定吗？", "解除绑定",
      function(action) {
        if (action == "ok") {
          //删除
          $.ajax({
            url: "/api/yhgl/nsrBinding/unBinding",
            type: "post",
//            contentType: "application/json",
            data: {
              "id": row.id
            },
            success: function(text) {
            	var data = mini.decode(text);
            	if(data.success){
            		mini.confirm("解除绑定成功,是否切换身份信息!","提示信息" ,function(item){
            			if(item == "ok"){
            				window.parent.location.href = "/api/yhgl/index";
            			}else{
            				grid.reload();
            			}
            		});
            	}else{
            		mini.alert(data.message);
            	}
            },
            error: function(text) {
              mini.alert("解除绑定失败");
            }
          });
        } else {
          //不删除
        }
      }
    );
  }
}

function addAgent(row_uid) {
	var row = grid.getRowByUID(row_uid);
	if (row) {
		mini.confirm("确定绑定吗？", "重新绑定绑定",
				function(action) {
			if (action == "ok") {
				//删除
				$.ajax({
					url: "/api/yhgl/nsrBinding/reBinding",
					type: "post",
//            contentType: "application/json",
					data: {
						"id": row.id
					},
					success: function(text) {
						var data = mini.decode(text);
		            	if(data.success){
		            		mini.confirm("绑定成功,是否切换身份信息!","提示信息" ,function(item){
		            			if(item == "ok"){
		            				window.parent.location.href = "/api/yhgl/index";
		            			}else{
		            				grid.reload();
		            			}
		            		});
		            	}else{
		            		mini.alert(data.message);
		            	}
					},
					error: function(text) {
						mini.alert("重新绑定失败");
					}
				});
			} else {
				//不删除
			}
		}
		);
	}
}

function addBind() {
  baddAgent = true;
  var row = {};
  grid.addRow(row, grid.data.length);
  editBind(row._uid);
}

function cancelAddAgent() {
  grid.reload();
  editWindow.hide();
}

function editBind(row_uid) {
  var row = grid.getRowByUID(row_uid);
  if (row) {
    editWindow.show();
  }
}

function updateBindRow() {
  var form = new mini.Form("#editform");
  form.validate();
  if (form.isValid() == false) return;
  var o = form.getData();
  var json = mini.encode(o);
//  grid.loading("保存中，请稍后......");
  // console.log(json);
  $.ajax({
    url: "/api/yhgl/nsrBinding/binding",
    type: "post",
//    contentType: "application/json",
    data: {
      "jsonStr": json
    },
    success: function(text) {
      var data = mini.decode(text);
      if(data.success){
    	  form.reset();
    	  mini.confirm("绑定成功,是否切换身份信息!","提示信息" ,function(item){
  			if(item == "ok"){
  				window.parent.location.href = "/api/yhgl/index";
  			}else{
  				grid.reload();
  			}
  		});
      }else{
    	  mini.alert(data.message); 
      }
      grid.unmask();
      grid.reload();
    },
    error: function(text) {
      var data = mini.decode(text);
      grid.unmask();
      grid.reload();
    }
  });

  editWindow.hide();
}

