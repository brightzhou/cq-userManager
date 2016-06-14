var nsrData;
var noData = '<tr><td valign="middle" align="center" colspan="5">您没有小规模增值税的未缴款信息</td></tr>';
var rowData ='<tr name="wkkxx"><td valign="middle"><input id="jsxmCheck" name="jsxmCheck" type="radio"/></td><td valign="middle">{yzpzzlDm}</td>'+
'<td valign="middle">{skssqq}</td><td valign="middle">{skssqz}</td><td valign="middle">{ybtse}</td>'
+'<td style = "display:none;">{jkqx}</td><td style = "display:none;">{yzpzmxxh}</td><td style = "display:none;">{zsuuid}</td></tr>';
var listData;
var nsrsbhxx;
$(function() {
	$("#nextBtn").hide();
	search();
	
});

function search(){
	$("#nextBtn").hide();
	waitdiv.show();        //打开遮罩层
		$.ajax({
			url : "/app/appskzs_searchWjsJl.do",
			type : "post",
			async : false,
			data : "",
			success : function(data) {
				waitdiv.hide();        //隐藏遮罩层
				
				if (data.messageCode == 'SESSION_TIME_OUT') {
					alert('登入超时,请重新登录...')
					relogin();
					return;
				}
				var object = JSON.parse(data);
				nsrsbhxx = object.total;
				$("#nsrsbh").text(nsrsbhxx.split("@")[0]);
				$("#nsrmc").text(nsrsbhxx.split("@")[1]);
				if (!object.success) {
					alert(object.message);
					return;
				}
				
				if (object.data.ZSXX.length > 0) {
					listData = object.data.ZSXX;
					buildReplaceData(object.data.ZSXX, rowData);
				} else {
					$("#nullData").append(noData);
				}
			},
			error : function(data) {
				waitdiv.hide();        //隐藏遮罩层
				alert("出现系统错误，请稍后再试。。。。。", "提示信息");
				window.close();
			}
		});
}

// temp模板 数据重组
function buildReplaceData(objData, temp) {
	var isHasXgm = false;
	for ( var key in objData) {
		if (objData[key].pzzldm.indexOf("小规模")!=-1) {// 只支持小规模，所以增加小规模的过滤
			isHasXgm=true;
			temp = temp.replace("{yzpzzlDm}", objData[key].pzzldm);
			temp = temp.replace("{skssqq}", objData[key].sssqq);
			temp = temp.replace("{skssqz}", objData[key].sssqz);
			temp = temp.replace("{ybtse}", objData[key].kkse);
			temp = temp.replace("{jkqx}", objData[key].jkqx);
			temp = temp.replace("{yzpzmxxh}", objData[key].yzpzmxxh);
			temp = temp.replace("{zsuuid}", objData[key].zsxh);
			$("#nullData").append(temp);
			temp = '<tr name="wkkxx"><td valign="middle"><input id="jsxmCheck" name="jsxmCheck" type="radio"/></td><td valign="middle">{yzpzzlDm}</td>'+
			'<td valign="middle">{skssqq}</td><td valign="middle">{skssqz}</td><td valign="middle">{ybtse}</td>'
			+'<td style = "display:none;">{jkqx}</td><td style = "display:none;">{yzpzmxxh}</td><td style = "display:none;">{zsuuid}</td></tr>';
			
			 
		}
	}
	if(isHasXgm){
		$("#nextBtn").show();
	}else{
		$("#nullData").append(noData);
	}
	return temp;
}

function validateKkxx(){
	var returnVal = false;
	$("input[name='jsxmCheck']").each(function(){
		if($(this).attr("checked")){
			returnVal = true;
		}
	});
	return returnVal;
}
// 三方协议扣款
function sfxyjk() {
	
	var objVal = validateKkxx();
	if(!objVal){
		alert("请选择需要扣款的申报数据。");
		return false;
	}
	
	
	
	var jkqx = "";
	//本次扣款税额
	var kkje = "";
	//应征凭证明细序号
	var yzpzmxxh = "";
	//征收序号
	var zsuuid = "";
	$("tr[name='wkkxx']").each(function(){
		if($(this).find("input[name='jsxmCheck']").attr("checked")){
			
			kkje = $(this).find("td").eq(4).text();
			jkqx = $(this).find("td").eq(5).text();
			yzpzmxxh = $(this).find("td").eq(6).text();
			zsuuid = $(this).find("td").eq(7).text();
		}
	});
	var sbnr = buildJsData(listData,kkje,jkqx,yzpzmxxh,zsuuid);
	waitdiv.show();        //打开遮罩层
	
	$.ajax({
		url : "/app/appskzs_sfxyKK.do",
		type : "post",
		async : false,
		data : sbnr,
		success : function(data) {
			waitdiv.hide();        //隐藏遮罩层

			if (data.messageCode == 'SESSION_TIME_OUT') {
				alert('登入超时,请重新登录...')
				relogin();
				return;
			}
			var data = JSON.parse(data);
			if (data.success) {
				alert("三方协议扣款成功");
				search();
				return;
			} else {
				alert(data.message);
				return;
			}
		},
		error : function(data) {
			waitdiv.hide();        //隐藏遮罩层

			alert("出现系统错误，请稍后再试。。。。。", "提示信息", function() {
				// window.close();
			});
		}
	});
}

function buildJsData(listData,kkje,jkqx,yzpzmxxh,zsuuid) {
	// var jkqx = mini.formatDate(listData[0].jkqx, "yyyy-MM-dd");

	var jsxxcontent = {
		djxh : nsrsbhxx.split("@")[2],
		nsrsbh : nsrsbhxx.split("@")[0],
		nsrmc : nsrsbhxx.split("@")[1],
		sfxyh : listData[0].sfxyh,
		swjgdm : listData[0].swjgdm,
		yzpzxh : listData[0].yzpzxh,
		jkqx :jkqx,
		kkje : kkje,
		yzpzmxxh : yzpzmxxh,
		zsuuid : zsuuid
	};
	return jsxxcontent;
}
