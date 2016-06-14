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

/**
 * 发送手机验证码
 * @param nsrsbh
 * @param sjhm
 * @param btnId
 * @param callback
 */
function sendSjYzm(nsrsbh,btn,callback) {
	if(!!!nsrsbh){
		alert("无法获取到纳税人识别号！","提示信息");
		return ;
	}
    /*如果butId不为空，那么就控制btnId不可点击*/
    if(!!btn){
        time(btn);
    }


	$.ajax( {
		   type: "POST",
		   url: "/Common_sendSjYzmForSb.do?nsrsbh=" + nsrsbh,
		   data: {},
			success : function(data) {
				var returndata = JSON.parse(data);
				if (!returndata.success) {
					if ($("#font_ok").html().indexOf(":") > -1) {
						$("#font_ok").html($("#font_ok").html().substr(0, $("#font_ok").html().indexOf(":")));
					}
					$("#font_ok").html($("#font_ok").html() + ":<font color='red'>" + returndata.message + "</font>");
				}else{
					if(!!callback  && callback instanceof  Function){
						callback.apply(this, arguments); 
                    }
				}
			}
		});
}



var wait = 60;
function time(btn) {
    if (wait == 0) {
        btn.disabled=false;
        btn.value="发送验证码";
        wait = 60;
    } else {
    	btn.disabled=true;
    	btn.value= wait + "秒后重新获取";
        wait--;
        setTimeout(function () {
                time(btn);
            },
            1000)
    }
}


function sendDzyzmAndCommitData(callback){
	if ("NO" == bsrYddhhm) {
		submitData(callback);
		return;
	}
	
	//var hm = bsrYddhhm.substr(0, 3) + "****" + bsrYddhhm.substr(bsrYddhhm.length -4)
	var hm = bsrYddhhm;
	
	showmsg({'font_tit':'手机验证','font_ok':'短信将发送至您'+hm+'的手机号码,如果号码已变更，请先进行变更登记','font_nor':'请输入验证码','font_err':'请输入验证码!','font_fs':'发送验证码'},function(e){
		
		waitdiv.show();        //打开遮罩层
		$.ajax( {
			   type: "POST",
			   url: "/Common_jySjyzmForSb.do?sjhm=" + bsrYddhhm + "&sjyzm=" + e,
			   data: {},
				success : function(data) {
					var returndata = JSON.parse(data);
					if (!returndata.success || returndata.data != 'Y') {
						returndata.message = "验证码不正确，请重新输入！";
						if ($("#font_ok").html().indexOf(":") > -1) {
							$("#font_ok").html($("#font_ok").html().substr(0, $("#font_ok").html().indexOf(":")));
						}
						$("#font_ok").html($("#font_ok").html() + ":<font color='red'>" + returndata.message + "</font>");
						
						document.getElementById("msg_Submitform").disabled=false;
						waitdiv.hide();        //隐藏遮罩层
					}else{
						
						$("#wrap").remove();   //关闭弹窗
				        $("#msg").remove();    //关闭弹窗
				        
				        submitData(callback); // 提交数据
						
						waitdiv.hide();        //打开遮罩层
					}
				}
			});
		
	});
}

function openWsjk() {
	window.open("http://app.gd-n-tax.gov.cn/wssw/jsp/index/new_common/login_yth.jsp");
}
