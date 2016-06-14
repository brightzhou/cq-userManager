var JbsbzlDmArray = ['10110','10418','10419','26502','29826','29836','17701','10103'];
var YbsbzlDmArray = ['10101','10416','10417','26501','29806','26535','10601','10602','10102'];

$(function(){
	$("input").each(function (){
		
//		//选中输入框内容
//		$(this).bind("click",$(this),function (e){  // 华为手机有该事件后，微信上面输入框无法弹出输入框
//			e.data.select();
//		});
		
		//计算
		$(this).bind("change",$(this),calculate);
		
//		//去空格
//		$(this).bind("keyup",$(this),function (e){  // 在某些手机上，keyup事件不会触发change事件
//			var value = e.data.val().trim();
//			value = value.replace(/[^\S]/g,'');
//			e.data.val(value);
//			return value;
//		});

		//校验数字
		var decimal = $(this).attr("decimal");
		if(!!decimal){
			$(this).bind("blur",$(this),decimalFormat);
		}
		
		//校验vtype
		//$(this).bind("blur",validateAll);
	});
});

function decimalFormat(e){
	var obj = e.data;
	var decimal = obj.attr("decimal");
	if(!decimal){
		return;
	}
	if(isNaN(obj.val())){
		obj.val("0.00");
		alert("请输入16位整数，"+decimal+"位小数的数字。");
		obj.focus();
		return;
	}
	obj.val(round(obj.val(),decimal));
}

/**
 * 通过绑定校验某个输入框的vtype
 * @param e
 */
function validate(e){
	var object = e.data.sender;
	var vtype = object.attr("vtype");
	if(!!vtype){
		var validateResult = doValidate(object,vtype);
		if(!validateResult){
			alert(object.attr("invalidateMsg"));
			object.focus();
			return;
		}
	}
}

function validateAll(){
	var isValid = true;
	$("input").each(function (){
		if($(this).is(":hidden")){
			return true;
		}
		var vtype = $(this).attr("vtype");
		if(!!vtype){
			var validateResult = doValidate($(this),vtype);
			if(!validateResult){
				alert($(this).attr("invalidateMsg"));
				$(this).focus();
				isValid = false;
				return false;
			}
		}
	});
	return isValid;
}

function calculate(e){
	
	var value = e.data.val().trim();
	value = value.replace(/[^\S]/g,'');
	e.data.val(value);
	
	//先进行校验,校验不通过不进行计算
	var isValid = validateAll();
	if(!isValid){
		return;
	}
	decimalFormat(e);
	$("input").each(function (){
		//如果是当前输入框发生变化，则不计算当前的值
		if(e.data[0].id==$(this)[0].id){
			return;
		}
		var calculate = $(this).attr("calculate");
		if(!!calculate){
			var exp1 = calculate;
			//1.计算校验表达式的值
			while(true){
				var jqueryExpList = exp1.match(/\$\(\S*?\)/gi);
				if(!jqueryExpList){
					break;
				}
				exp1 = exp1.replace(jqueryExpList[0],round(eval(jqueryExpList[0]).val(),2));
			}
			var result = eval(exp1);
			var decimal = $(this).attr("decimal");
			if(!decimal){
				decimal = 2;
			}
			$(this).val(round(result,decimal));
		}
		//2.复杂的计算函数
		var calfunc = $(this).attr("calfunc");
		if(!!calfunc){
			//回调calfunc对应的函数，获取计算结果
			var result = eval(calfunc).apply(this, [$(this)]);
			var decimal = $(this).attr("decimal");
			if(!decimal){
				decimal = 2;
			}
			if(result != undefined){
				$(this).val(round(result,decimal));
			}
		}
	});
}

function doValidate(sender,vtype){
	var value = sender.val();
	var result = true;
	var list = vtype.split(";");
	for(var i=0;i<list.length;i++){
		//2.1取出校验条件
		var exp1 = list[i].match(/\[\S*?\]/gi)[0];
		exp1 = exp1.replace("[","");
		exp1 = exp1.replace("\]","");
		//2.2计算校验表达式的值
		while(true){
			var jqueryExpList = exp1.match(/\$\(\S*?\)/gi);
			if(!jqueryExpList){
				break;
			}
			exp1 = exp1.replace(jqueryExpList[0],round2(eval(jqueryExpList[0]).val()));
		}
		var checkValue = eval(exp1);
		//2.3比较当前值和校验表达式的值
		if(list[i].indexOf("gteq")==0){
			result = result && value>=checkValue;
		}else if(list[i].indexOf("lteq")==0){
			result = result && value<=checkValue;
		}else if(list[i].indexOf("eq")==0){
			result = result && value==checkValue;
		}else if(list[i].indexOf("gt")==0){
			result = result && value>checkValue;
		}else if(list[i].indexOf("lt")==0){
			result = result && value<checkValue;
		}
	}
	return result;
}

/**
 * 获取表单数据
 * @param formId，格式#加ID
 * @returns 表单数据对象
 */
function getFormData(formId){
	var formData = {};
	$(formId).find("input").each(function (){
		if(!!$(this).attr("name")){
			formData[$(this).attr("name")] = $(this).val();
		}
	});
	return formData;
}

/**
 * 获取URL中的参数，适用于URL（xxx.do?param1=22&para2=ddd）执行后，跳转后的页面获取URL中的参数
 */
function getParamFromUrl(){
	var hrefs = window.location.href.split("?");
	if(hrefs.length<=1){
		return null;
	}
	var result = {};
	var params = hrefs[1].split("&");
	
	for(var i=0;i<params.length;i++){
		var param = params[i].split("=");
		if(param.length<=1){
			continue;
		}
		result[param[0].trim()] = param[1].trim();
	}
	return result;
}


/** =================获取核定信息，并判断是否有次税种核定信息===============* */
function getHdxx(){
	var hdxxData = null;
	$.ajax({
		url : "/app/appsbcommon_getHdxx.do",
		type : "post",
		async : false,
		data : {
			sbny:getSbny()
		},
		success : function(data) {
			if(data.messageCode == 'SESSION_TIME_OUT'){
				alert('登入超时,请重新登录...')
					relogin();
					return;
			}
			var result = JSON.parse(data);
			if(null!=result.data){
				hdxxData = result.data;
			}
		},
		error : function(data) {
		}
	});

	return hdxxData;
}

function isExsitSbzlHdxx(sbzlArray,hdxxData){
	var hdxxVo = hdxxData.HdxxResponseVo;
	var sbzlNode = null;
	for ( var r = 0; r < hdxxVo.SBZL.length; r++) {
		var sbzl = hdxxVo.SBZL[r].SBZLCODE;
		if(sbzlArray.indexOf(sbzl)!=-1){
			sbzlNode = hdxxVo.SBZL[r];
			break;
		}
    }
	return sbzlNode;
}


function getSssqBySbny(sbny){   
	var d = new Date();
	var vYear = d.getFullYear();// 当前年
	var vMon = d.getMonth();// 当前月，从0-11
	var ssn = vYear;
	var ssy = vMon;
	if (vMon == 0) {
		ssn = ssn - 1;
		ssy = 12;
	}
	var new_date = new Date(vYear, (vMon), 1);
	var sssqzdate = new Date(new_date.getTime() - 1000 * 60 * 60 * 24);
	if (ssy < 10) {
		ssy = "0" + ssy;
	}
	sssqq = ssn + "" + ssy + "01";
	sssqz = ssn + "" + ssy +""+sssqzdate.getDate();
	return new Array(sssqq,sssqz);
};


/** 获取所属时期起止*/
function getSssq(sbny,sbzlDm){
	var  ssn = sbny.substr(0,4);//当前年
	var vMon= sbny.substr(4,2);//所属月
	var sssqq ="";
	var sssqz ="";
	if(JbsbzlDmArray.indexOf(sbzlDm)!=-1){
		if(vMon>=1&&vMon<4){
			sssqq=ssn+"-01-01"
			sssqz=ssn+"-03-31"
		}
		if(vMon>=4&&vMon<7){
			sssqq=ssn+"-04-01"
			sssqz=ssn+"-06-30"
		}
		if(vMon>=7&&vMon<10){
			sssqq=ssn+"-07-01"
			sssqz=ssn+"-09-30"
		}
		if(vMon>=10&&vMon<13){
			sssqq=ssn+"-10-01"
			sssqz=ssn+"-12-31"
		}
	}else{
		sssqq = ssn+"-"+vMon+"-01";
		var new_date = new Date(ssn ,(vMon) ,1);  
		var sssqzdate=new Date(new_date.getTime()-1000*60*60*24)
		sssqz = ssn + "-" + vMon +"-"+sssqzdate.getDate();
	}
	
	return new Array(sssqq,sssqz);
	
}

function getSbny(){
	var d = new Date();
	var vYear = d.getFullYear();
	var vMon = d.getMonth();
	if(vMon==0){
		vYear=vYear-1;
		vMon=12;
	}
	if(vMon<10){
		vMon="0"+vMon;
	}
	return vYear+""+vMon;
}



function getWsxxValueByCode(sbzlNode,wsxxcode){
	var wsxxs = sbzlNode.WSXXS.WSXX;
	var wsxxvalue ="";
	for ( var i = 0; i < wsxxs.length; i++) {
		var wsxxnode = wsxxs[i];
		if (wsxxcode == wsxxnode.CODE) {
			wsxxvalue = wsxxnode.VALUE;
			break;
		}
	}
	return wsxxvalue;
}

//获取申报报表文件名
function getBbFilename(bbid,SBZLCODE) {
    return SBZLCODE+"_" +bbid+".xml";
}

	
function showMessage(msg){
	$("body div").hide();
	$("#messageBox").show();
	$("#messageBox div").show();
	$("#message").html(msg);
}


function querySbfkxx(sssqq,sssqz,sbzlDm){
	var resultData =null ;
	$.ajax({
		url : "/app/appsbcommon_querySbfkxx.do",
		type : "post",
		async:false,
		data : {
			sssqq:sssqq,
			sssqz:sssqz,
			sbzlDm:sbzlDm
		},
		success : function(data) {
			if(data.messageCode == 'SESSION_TIME_OUT'){
				alert('登入超时,请重新登录...')
					relogin();
					return;
			}
			resultData = JSON.parse(data);
		},
		error : function(data) {
		}
	});
	return resultData
}
