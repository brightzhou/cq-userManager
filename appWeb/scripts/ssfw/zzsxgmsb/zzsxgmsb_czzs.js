var sbzlArray = ['10102','10103'];
var sbzlDm="10102";
$(function(){
	init();
});

/**  税种类表代码01:货劳，02:服务，03:混营  */
var ygzNsrzg;  
var initData;
var pzzlDm = "BDA0610342"; 
var zzsQzd = 30000;  //起征点
var sbResult;//申报结果数据
var curentStep = 0;
var totalStep;
	
//其他减免-货劳
var qtjmHl;
//其他减免-服务
var qtjmFw;

//应纳税减征额标志，true时超过起征点可以填写减征额
var ynsjzeFlag;

//固定资产减免标志
var gdzcFlag;

//出口减免标志
var cktsFlag;

//个体纳税人标志
var gtNsrFlag;
var bsrYddhhm; // 办税人手机号码	

//本期预缴税额
var hwbqyjse;//应税货物及劳务
var fwbqyjse;//应税服务

var yshwlwBz;//应税货物劳务标志
var ysfwBz;//应税服务标志

var sbxxArray;//申报数据信息
var yjxxArray;//预缴税款数据信息

var ssjmxzArray;//减免代码和减免名称信息

var jzfb_template = ''+
	'<div class="margin-top"><h1 class="box_h1 icon02 left marg">减税项目：{ssjmxzhzmc}（{ssjmxzhzDm}）</h1><div class="kele"></div></div>'+
	'	<div class="clear">'+
	'	<input value="{ssjmxzhzDm}" name="jz_uuid_{index}" id="jz_uuid_{index}" type="hidden"/>'+
	'	</div>'+
	'	<div class="box_sbnr">'+
	'	    <ul>'+
	'	        <li><span class="hu i">期初余额：</span>'+
	'	        	<input id="jz_qcye_{index}" name="jz_qcye_{index}" decimal="2" '+
	'					type="text" value="0.00" class="input" >'+
	'				<span class="b p12">元</span></li>'+
	'	        <li><span class="hui">本期发生额：</span>'+
	'	        	<input id="jz_bqfse_{index}" name="jz_bqfse_{index}" decimal="2" invalidateMsg="本期发生额不能小于0"  '+
	'					type="text" value="0.00" class="input" >'+
	'	        	<span class="b p12">元</span></li>'+
	'	        <li><span class="hui">本期应抵减税额：</span>'+
	'	        	<input id="jz_bqytjse_{index}" name="jz_bqytjse_{index}" decimal="2" invalidateMsg="本期应抵减税额不能小于0" calculate="$(\'#jz_bqfse_{index}\')+$(\'#jz_qcye_{index}\')" '+
	'					type="text" value="0.00"  class="readonlyinput" readonly="readonly"  >'+
	'	        	<span class="b p12">元</span></li>'+
	'	        <li><span class="hui">本期实际抵减税额：</span>'+
	'	        	<input id="jz_bqsjdjse_{index}" name="jz_bqsjdjse_{index}" decimal="2" invalidateMsg="实际抵减税额不能大于本期应抵减税额" vtype="lteq[$(\'#jz_bqytjse_{index}\')];gteq[0]" '+
	'					type="text" value="0.00" class="input">'+
	'				<span class="b p12">元</span></li>'+
	'			 <li><span class="hui">期末余额：</span>'+
	'        	<input id="jz_qmye_{index}" name="jz_qmye_{index}" decimal="2" invalidateMsg="期末余额不能小于0" vtype="gteq[0]"'+
	'				type="text" value="0.00"  class="readonlyinput" readonly="readonly" calculate="$(\'#jz_bqytjse_{index}\')-$(\'#jz_bqsjdjse_{index}\')" >'+
	'        	<span class="b p12">元</span>'+
	'        	</li>'+
	'	    </ul>'+
	'	</div>'+
	'';
var jzfb_template_hj = ''+
'<div class="margin-top"><h1 class="box_h1 icon02 left marg">减税项目（期初余额）合计：'+
'	        	<input id="jz_qcye_hj" name="jz_qcye_hj" decimal="2" '+
'					type="text" value="0.00"  class="readonlyinput" readonly="readonly" calculate="{jz_qcye_hj}">'+
'</h1><div class="kele"></div></div>'+
'	<div class="clear">'+
'	<input value="合计" name="jz_uuid_hj" id="jz_uuid_{index}" type="hidden"/>'+
'	        	<input id="jz_bqfse_hj" name="jz_bqfse_hj" decimal="2" invalidateMsg="本期发生额不能小于0"  '+
'					 value="0.00"  class="readonlyinput" readonly="readonly" calculate="{jz_bqfse_hj}"  type="hidden">'+
'	        	<input id="jz_bqytjse_hj" name="jz_bqytjse_hj" decimal="2" invalidateMsg="本期应抵减税额不能小于0"  '+
'					 value="0.00"  class="readonlyinput" readonly="readonly"  calculate="{jz_bqytjse_hj}"  type="hidden">'+
'	        	<input id="jz_bqsjdjse_hj" name="jz_bqsjdjse_hj" decimal="2" invalidateMsg="实际抵减税额不能大于本期应抵减税额"  '+
'					 value="0.00"  class="readonlyinput" readonly="readonly" calculate="{jz_bqsjdjse_hj}"  type="hidden">'+
'        	<input id="jz_qmye_hj" name="jz_qmye_hj" decimal="2" invalidateMsg="期末余额不能小于0" '+
'				 value="0.00"  class="readonlyinput" readonly="readonly" calculate="{jz_qmye_hj}"  type="hidden">'+
'	</div>'+
'';
var jzfb_template_hj_bak = ''+
'<div class="margin-top"><h1 class="box_h1 icon02 left marg">减税项目：合计</h1><div class="kele"></div></div>'+
'	<div class="clear">'+
'	<input value="合计" name="jz_uuid_hj" id="jz_uuid_{index}" type="hidden"/>'+
'	</div>'+
'	<div class="box_sbnr">'+
'	    <ul>'+
'	        <li><span class="hu i">期初余额：</span>'+
'	        	<input id="jz_qcye_hj" name="jz_qcye_hj" decimal="2" '+
'					type="text" value="0.00"  class="readonlyinput" readonly="readonly" calculate="{jz_qcye_hj}">'+
'				<span class="b p12">元</span></li>'+
'	        <li><span class="hui">本期发生额：</span>'+
'	        	<input id="jz_bqfse_hj" name="jz_bqfse_hj" decimal="2" invalidateMsg="本期发生额不能小于0"  '+
'					type="text" value="0.00"  class="readonlyinput" readonly="readonly" calculate="{jz_bqfse_hj}">'+
'	        	<span class="b p12">元</span></li>'+
'	        <li><span class="hui">本期应抵减税额：</span>'+
'	        	<input id="jz_bqytjse_hj" name="jz_bqytjse_hj" decimal="2" invalidateMsg="本期应抵减税额不能小于0"  '+
'					type="text" value="0.00"  class="readonlyinput" readonly="readonly"  calculate="{jz_bqytjse_hj}">'+
'	        	<span class="b p12">元</span></li>'+
'	        <li><span class="hui">本期实际抵减税额：</span>'+
'	        	<input id="jz_bqsjdjse_hj" name="jz_bqsjdjse_hj" decimal="2" invalidateMsg="实际抵减税额不能大于本期应抵减税额"  '+
'					type="text" value="0.00"  class="readonlyinput" readonly="readonly" calculate="{jz_bqsjdjse_hj}">'+
'				<span class="b p12">元</span></li>'+
'			 <li><span class="hui">期末余额：</span>'+
'        	<input id="jz_qmye_hj" name="jz_qmye_hj" decimal="2" invalidateMsg="期末余额不能小于0" '+
'				type="text" value="0.00"  class="readonlyinput" readonly="readonly" calculate="{jz_qmye_hj}" >'+
'        	<span class="b p12">元</span>'+
'        	</li>'+
'	    </ul>'+
'	</div>'+
'';
var mzfb_template = ''+
'<div class="margin-top"><h1 class="box_h1 icon02 left marg">免税项目：{ssjmxzhzmc}（{ssjmxzhzDm}）</h1><div class="kele"></div></div>'+
'	<div class="clear">'+
'	<input value="{ssjmxzhzDm}" name="mz_uuid_{index}" id="mz_uuid_{index}" type="hidden"/>'+
'	</div>'+
'	<div class="box_sbnr">'+
'	    <ul>'+
'	        <li><span class="hu i">免征增值税项目销售额：</span>'+
'	        	<input id="mz_qcye_{index}" name="mz_qcye_{index}" invalidateMsg="免征增值税项目销售额不能小于0" vtype="gteq[0]" decimal="2" '+
'					type="text" value="0.00" class="input" >'+
'				<span class="b p12">元</span></li>'+
'	        <li><span class="hui">免税销售额和扣除项目本期实际扣除金额：</span>'+
'	        	<input id="mz_bqfse_{index}" name="mz_bqfse_{index}" decimal="2" invalidateMsg="免税销售额和扣除项目本期实际扣除金额不能小于0"  vtype="gteq[0]" '+
'					type="text" value="0.00" class="input" >'+
'	        	<span class="b p12">元</span></li>'+
'	        <li><span class="hui">扣除后免税销售额：</span>'+
'	        	<input id="mz_bqytjse_{index}" name="mz_bqytjse_{index}" decimal="2" invalidateMsg="扣除后免税销售额不能小于0" calculate="$(\'#mz_qcye_{index}\')-$(\'#mz_bqfse_{index}\')" vtype="" '+
'					type="text" value="0.00"  class="readonlyinput" readonly="readonly"  >'+
'	        	<span class="b p12">元</span></li>'+
'	        <li><span class="hui">免税销售额对应的进项税额：</span>'+
'	        	<input id="mz_bqsjdjse_{index}" name="mz_bqsjdjse_{index}" decimal="2" calculate="" '+
'					type="text" value="0.00" class="input">'+
'				<span class="b p12">元</span></li>'+
'			 <li><span class="hui">免税额：</span>'+
'        	<input id="mz_qmye_{index}" name="mz_qmye_{index}" decimal="2" invalidateMsg="" calculate="parseFloat($(\'#mz_bqytjse_{index}\')*0.03).toFixed(2)" vtype="gteq[0]"'+
'				type="text" value="0.00"  class="input" >'+
'        	<span class="b p12">元</span>'+
'        	</li>'+
'	    </ul>'+
'	</div>'+
'';
var mzfb_template_hj = ''+
'<div class="margin-top"><h1 class="box_h1 icon02 left marg">免税项目（免征增值税项目销售额）合计：'+
'	        	<input id="mz_qcye_hj" name="mz_qcye_hj"  decimal="2" '+
'					type="text" value="0.00" class="readonlyinput" readonly="readonly" calculate="{mz_qcye_hj}">'+
'</h1><div class="kele"></div></div>'+
'	<div class="clear">'+
'	<input value="合计" name="mz_uuid_hj" id="mz_uuid_{index}" type="hidden"/>'+
'	        	<input id="mz_bqfse_hj" name="mz_bqfse_hj" decimal="2"  '+
'					 value="0.00" class="readonlyinput" readonly="readonly" calculate="{mz_bqfse_hj}" type="hidden">'+
'	        	<input id="mz_bqytjse_hj" name="mz_bqytjse_hj" decimal="2"  '+
'					value="0.00"  class="readonlyinput" readonly="readonly"  calculate="{mz_bqytjse_hj}" type="hidden">'+
'	        	<input id="mz_bqsjdjse_hj" name="mz_bqsjdjse_hj" decimal="2" calculate="{mz_bqsjdjse_hj}" '+
'					 value="0.00" class="readonlyinput" readonly="readonly" type="hidden">'+
'        	<input id="mz_qmye_hj" name="mz_qmye_hj" decimal="2" invalidateMsg="" calculate="{mz_qmye_hj}"'+
'				 value="0.00"  class="readonlyinput" readonly="readonly"  type="hidden">'+

'	</div>'+

'';
var mzfb_template_hj_bak = ''+
'<div class="margin-top"><h1 class="box_h1 icon02 left marg">免税项目：合计</h1><div class="kele"></div></div>'+
'	<div class="clear">'+
'	<input value="合计" name="mz_uuid_hj" id="mz_uuid_{index}" type="hidden"/>'+
'	</div>'+
'	<div class="box_sbnr">'+
'	    <ul>'+
'	        <li><span class="hu i">免征增值税项目销售额：</span>'+
'	        	<input id="mz_qcye_hj" name="mz_qcye_hj"  decimal="2" '+
'					type="text" value="0.00" class="readonlyinput" readonly="readonly" calculate="{mz_qcye_hj}">'+
'				<span class="b p12">元</span></li>'+
'	        <li><span class="hui">免税销售额和扣除项目本期实际扣除金额：</span>'+
'	        	<input id="mz_bqfse_hj" name="mz_bqfse_hj" decimal="2"  '+
'					type="text" value="0.00" class="readonlyinput" readonly="readonly" calculate="{mz_bqfse_hj}">'+
'	        	<span class="b p12">元</span></li>'+
'	        <li><span class="hui">扣除后免税销售额：</span>'+
'	        	<input id="mz_bqytjse_hj" name="mz_bqytjse_hj" decimal="2"  '+
'					type="text" value="0.00"  class="readonlyinput" readonly="readonly"  calculate="{mz_bqytjse_hj}">'+
'	        	<span class="b p12">元</span></li>'+
'	        <li><span class="hui">免税销售额对应的进项税额：</span>'+
'	        	<input id="mz_bqsjdjse_hj" name="mz_bqsjdjse_hj" decimal="2" calculate="{mz_bqsjdjse_hj}" '+
'					type="text" value="0.00" class="readonlyinput" readonly="readonly">'+
'				<span class="b p12">元</span></li>'+
'			 <li><span class="hui">免税额：</span>'+
'        	<input id="mz_qmye_hj" name="mz_qmye_hj" decimal="2" invalidateMsg="" calculate="{mz_qmye_hj}"'+
'				type="text" value="0.00"  class="readonlyinput" readonly="readonly" >'+
'        	<span class="b p12">元</span>'+
'        	</li>'+
'	    </ul>'+
'	</div>'+
'';


function init(){
	//1.获取核定期初信息
	/*var hdxxData = getHdxx();
	if (hdxxData == null) {
		showMessage("您不是小规模纳税人，不能进行增值税小规模申报.");
		return;
	}
	hdSbzlData = isExsitSbzlHdxx(sbzlArray, hdxxData);
	if(hdSbzlData == null){
		showMessage("您不是小规模纳税人，不能进行增值税小规模申报.");
		return;
	}*/
	var qccgbz ="Y" //hdSbzlData.QCCGBZ ;
	var qccgbzms  = ""//hdSbzlData.QCCGBZMS  ;
	sbzlDm = "10102"//hdSbzlData.SBZLCODE;
	if(qccgbz=="N" ){
		showMessage(qccgbzms);
		return;
	}
	//2.初始化表单
	   //2.1表头
	   //initData = resultData.data;
	   $("#sssqQ").text("2016-5-1");
	   $("#sssqZ").text("2016-5-31");
	   //减免有关
	   //ssjmxzArray = JSON.parse(initData.ssjmxz);
	   qtjmHl = false;//
	   qtjmFw = false;//
	   ynsjzeFlag = true;//应纳税减征额标志 
	   gdzcFlag = true;//固定资产减免标志
	   cktsFlag = false;//出口减免标志
	   gtNsrFlag = false;;
	   if(gtNsrFlag){
	   		$("#bq07_xw").removeClass("input edite");
	   		$("#bq07_xw").addClass("readonlyinput");
	   		$("#bq07_xw").attr("readonly",true);
	   		
	   		$("#fwbq07_xw").removeClass("input edite");
	   		$("#fwbq07_xw").addClass("readonlyinput");
	   		$("#fwbq07_xw").attr("readonly",true);
	   }else{
	   		$("#bq07_qz").removeClass("input edite");
	   		$("#bq07_qz").addClass("readonlyinput");
	   		$("#bq07_qz").attr("readonly",true);
	   		
	   		$("#fwbq07_qz").removeClass("input edite");
	   		$("#fwbq07_qz").addClass("readonlyinput");
	   		$("#fwbq07_qz").attr("readonly",true);
	   }
	   $("#nsrsbh").text("testnsr");
	   $("#nsrmc").text("测试企业");
	   bsrYddhhm = "13879311321"//initData.bsrYddhhm;
	   //2.2初始化索引
	   var sbjcsj ="";// JSON.parse(initData.sbjcxx);
	   yshwlwBz = "Y";//应税货物劳务标志
	   ysfwBz = "Y";//应税服务标志
	   if(yshwlwBz=='Y'&&ysfwBz=='N'){
		   ygzNsrzg = '01';
	   }else if(yshwlwBz=='N'&&ysfwBz=='Y'){
		   ygzNsrzg = '02';
	   }else if(yshwlwBz=='Y'&&ysfwBz=='Y'){
		   ygzNsrzg = '03';
	   }
	   //sbxxArray = sbjcsj.sbxxGrid.sbxxGridlb;//申报数据信息
	  // yjxxArray = sbjcsj.yjxxGrid.yjxxGridlb;//预缴税款数据信息
	   var jmxxGridlb =new Array();
	   //jmxxGridlb[0]="Saab"
	   initStep(ygzNsrzg,jmxxGridlb);
	   
	   //2.3申报表数据
	   //initSbb(sbjcsj);
	   bindEvent();
	/*$.ajax({
	   type: "POST",
	   url: "/app/XgmzzsSb_queryXgmSbjcxx.do",
	   data: {
	   },
	   success: function(data){
		   if(data.messageCode == 'SESSION_TIME_OUT'){
				alert('登入超时,请重新登录...')
					relogin();
					return;
			}
		   var resultData = JSON.parse(data);
		   if(!resultData.success){
				$("body div").hide();
				$("#messageBox").show();
				$("#messageBox div").show();
				$("#message").html(resultData.message);
			   return;
		   }
		   //2.初始化表单
		   //2.1表头
		   initData = resultData.data;
		   $("#sssqQ").text(initData.sssqQ);
		   $("#sssqZ").text(initData.sssqZ);
		   //减免有关
		   ssjmxzArray = JSON.parse(initData.ssjmxz);
		   qtjmHl = false;//
		   qtjmFw = false;//
		   ynsjzeFlag = initData.ynsjzeFlag;//应纳税减征额标志 
		   gdzcFlag = initData.gdzcFlag;//固定资产减免标志
		   cktsFlag = initData.cktsFlag;//出口减免标志
		   gtNsrFlag = initData.gtNsrFlag;
		   if(gtNsrFlag){
		   		$("#bq07_xw").removeClass("input edite");
		   		$("#bq07_xw").addClass("readonlyinput");
		   		$("#bq07_xw").attr("readonly",true);
		   		
		   		$("#fwbq07_xw").removeClass("input edite");
		   		$("#fwbq07_xw").addClass("readonlyinput");
		   		$("#fwbq07_xw").attr("readonly",true);
		   }else{
		   		$("#bq07_qz").removeClass("input edite");
		   		$("#bq07_qz").addClass("readonlyinput");
		   		$("#bq07_qz").attr("readonly",true);
		   		
		   		$("#fwbq07_qz").removeClass("input edite");
		   		$("#fwbq07_qz").addClass("readonlyinput");
		   		$("#fwbq07_qz").attr("readonly",true);
		   }
		   $("#nsrsbh").text(initData.nsrsbh);
		   $("#nsrmc").text(initData.nsrmc);
		   bsrYddhhm = initData.bsrYddhhm;
		   //2.2初始化索引
		   var sbjcsj = JSON.parse(initData.sbjcxx);
		   yshwlwBz = sbjcsj.sbZzsxgmnsrqtxxVO.yshwlwBz;//应税货物劳务标志
		   ysfwBz = sbjcsj.sbZzsxgmnsrqtxxVO.ysfwBz;//应税服务标志
		   if(yshwlwBz=='Y'&&ysfwBz=='N'){
			   ygzNsrzg = '01';
		   }else if(yshwlwBz=='N'&&ysfwBz=='Y'){
			   ygzNsrzg = '02';
		   }else if(yshwlwBz=='Y'&&ysfwBz=='Y'){
			   ygzNsrzg = '03';
		   }
		   sbxxArray = sbjcsj.sbxxGrid.sbxxGridlb;//申报数据信息
		   yjxxArray = sbjcsj.yjxxGrid.yjxxGridlb;//预缴税款数据信息
		   initStep(ygzNsrzg,sbjcsj.jmxxGrid.jmxxGridlb);
		   
		   //2.3申报表数据
		   initSbb(sbjcsj);
		   bindEvent();
	   },
	   error:function(e){
		   alert("初始化页面失败，请稍后再试。");
	   }
	});*/
}

function bindEvent(){
	$(".edite").bind("focus",function(){
		if(this.value==0.00){
			this.value='';
		}
	});
	$(".edite").bind("blur",function(){
		if(this.value==''){
			this.value=0.00;
		}
	});
	$("#fwbq01").bind("blur",function(){
		var fwbq01 = $("#fwbq01").val();
		$("#fb1_bl08").val(fwbq01);		
		var fb1_bl07 = parseFloat(fwbq01*1.03).toFixed(2);
		$("#fb1_bl07").val(fb1_bl07);
		var fb1_bl06 = $("#fb1_bl03").val();
		$("#fb1_bl06").val(fb1_bl06)
		var fb1_bl05 = parseFloat(fb1_bl07+fb1_bl06).toFixed(2);
		$("#fb1_bl05").val(fb1_bl05);
	});
}

function getSsjmxzmc(ssjmxzdm) {
	var mc = '';
	var length = ssjmxzArray.length;
	for ( var i = 0; i < length; i++) {
		var dm = ssjmxzArray[i].DM;
		if (ssjmxzdm == dm) {
			mc = ssjmxzArray[i].MC;
			break;
		}
	}
	return mc;
}

function initSbb(sbjcsj){

	//税局代开金额
	$("#bq02").val(sbjcsj.sbZzsxgmnsrqtxxVO.yshwlwFpdkbhsxse);//应税货物及劳务增值税专用发票不含税销售额本期数
	$("#fwbq02").val(sbjcsj.sbZzsxgmnsrqtxxVO.ysfwFpdkbhsxse);//应税服务增值税专用发票不含税销售额本期数
	setBqyjse();
	$("#fb1_bl01").val(!!sbjcsj.sbZzsxgmnsrqtxxVO.flzlqcye?sbjcsj.sbZzsxgmnsrqtxxVO.flzlqcye:"0.00");  //附表一期初余额
	// 20160517 税务机关代开的增值税专用发票不含税销售额
	$('#fwbq_swjgdkdzzszyfpbhsxse').val(sbjcsj.sbZzsxgmnsrqcsxxVO.swjgdkdzzszyfpbhsxse1);
}
/**
 * 设置本期预缴税额
 * @return
 */
function setBqyjse() {
	var zspmDmTmp;
	fwbqyjse = 0;
	hwbqyjse = 0;
	if (yjxxArray != null && $.isArray(yjxxArray)) {
		var length = yjxxArray.length;
		for (var i = 0; i < length; i++) {
			//按征收品目来判断
			zspmDmTmp = yjxxArray[i].zspmDm;
			if (startsWith(zspmDmTmp, "101016") || startsWith(zspmDmTmp, "101017")) {
				fwbqyjse = fwbqyjse + yjxxArray[i].yjye1 / 1;
			} else {
				hwbqyjse = hwbqyjse + yjxxArray[i].yjye1 / 1;
			}
		}
	}	
	//取批扣的预缴值
	if (sbxxArray != null && $.isArray(sbxxArray)) {
		var sblength =sbxxArray.length;		
		for (var i = 0; i < sblength; i++) {
			//按征收品目来判断
			zspmDmTmp = sbxxArray[i].zspmDm;
			if (startsWith(zspmDmTmp, "101016") || startsWith(zspmDmTmp, "101017")) {
				fwbqyjse = fwbqyjse + sbxxArray[i].yjse / 1;
			} else {
				hwbqyjse = hwbqyjse + sbxxArray[i].yjse / 1;
			}
		}
	} 
	
	if (yshwlwBz == 'N') {
		hwbqyjse = 0;
	}
	if (ysfwBz == 'N') {
		fwbqyjse = 0;
	}
	hwbqyjse = parseFloat(hwbqyjse);
	fwbqyjse = parseFloat(fwbqyjse)
	//$("#bq13").val(hwbqyjse);  //货劳预缴	20160531
	//$("#fwbq13").val(fwbqyjse);  //服务预缴

}
function startsWith(totalStr, beginStr) {
	var index = totalStr.indexOf(beginStr);
	if (index == 0) {
		return true;
	} else {
		return false;
	}
}
var stepConfig = new Array();

var allConfig = [
{num : '1',step : 'step_1',steppage : 'hl_steppage'},
{num : '2',step : 'step_2',steppage : 'fw_steppage'},
{num : '3',step : 'step_3',steppage : 'fb_steppage'},
{num : '4',step : 'step_4',steppage : 'jmzfb_steppage'},
{num : '5',step : 'step_5',steppage : 'tj_steppage'}
                 ];
function replaceAll_(str,regex,val){
	var newStr = str ;
	while(newStr.indexOf(regex)!=-1){
		newStr = newStr.replace(regex, val);
	}
	return newStr;
}
var mz_qcye_hj = '';
var mz_bqfse_hj= '';
var mz_bqytjse_hj= '';
var mz_bqsjdjse_hj= '';
var mz_qmye_hj= '';
var jz_qcye_hj= '';
var jz_bqfse_hj= '';
var jz_bqytjse_hj= '';
var jz_bqsjdjse_hj= '';
var jz_qmye_hj= '';

function setMzhj(i){
	mz_qcye_hj += " $('#mz_qcye_"+i+"') +";
	mz_bqfse_hj += " $('#mz_bqfse_"+i+"') +";
	mz_bqytjse_hj += " $('#mz_bqytjse_"+i+"') +";
	mz_bqsjdjse_hj += " $('#mz_bqsjdjse_"+i+"') +";
	mz_qmye_hj += " $('#mz_qmye_"+i+"') +";
}
function setJzhj(i){
	jz_qcye_hj += " $('#jz_qcye_"+i+"') +";
	jz_bqfse_hj += " $('#jz_bqfse_"+i+"') +";
	jz_bqytjse_hj += " $('#jz_bqytjse_"+i+"') +";
	jz_bqsjdjse_hj += " $('#jz_bqsjdjse_"+i+"') +";
	jz_qmye_hj += " $('#jz_qmye_"+i+"') +";
}
function splitXmgStr(Str){
	return Str.substring(0, Str.length-2);
}
function setJzHj(){
	var newMb = '';
	if(jz_qcye_hj&&jz_qcye_hj!=''){
		jz_qcye_hj  = splitXmgStr(jz_qcye_hj);
		jz_bqfse_hj = splitXmgStr(jz_bqfse_hj);
		jz_bqytjse_hj = splitXmgStr(jz_bqytjse_hj);
		jz_bqsjdjse_hj = splitXmgStr(jz_bqsjdjse_hj);
		jz_qmye_hj = splitXmgStr(jz_qmye_hj);
		newMb = jzfb_template_hj;
		newMb = replaceAll_(newMb,"{jz_qcye_hj}",jz_qcye_hj);
		newMb = replaceAll_(newMb,"{jz_bqfse_hj}",jz_bqfse_hj);
		newMb = replaceAll_(newMb,"{jz_bqytjse_hj}",jz_bqytjse_hj);
		newMb = replaceAll_(newMb,"{jz_bqsjdjse_hj}",jz_bqsjdjse_hj);
		newMb = replaceAll_(newMb,"{jz_qmye_hj}",jz_qmye_hj);
		$("#jmzfb_steppage").append(newMb);
	}
}
function setMzHj(){
	var newMb = '';
	if(mz_qcye_hj&&mz_qcye_hj!=''){
		mz_qcye_hj  = splitXmgStr(mz_qcye_hj);
		mz_bqfse_hj  = splitXmgStr(mz_bqfse_hj);;
		mz_bqytjse_hj  = splitXmgStr(mz_bqytjse_hj);
		mz_bqsjdjse_hj  = splitXmgStr(mz_bqsjdjse_hj);
		mz_qmye_hj  = splitXmgStr(mz_qmye_hj);
		newMb = mzfb_template_hj;
		newMb = replaceAll_(newMb,"{mz_qcye_hj}",mz_qcye_hj);
		newMb = replaceAll_(newMb,"{mz_bqfse_hj}",mz_bqfse_hj);
		newMb = replaceAll_(newMb,"{mz_bqytjse_hj}",mz_bqytjse_hj);
		newMb = replaceAll_(newMb,"{mz_bqsjdjse_hj}",mz_bqsjdjse_hj);
		newMb = replaceAll_(newMb,"{mz_qmye_hj}",mz_qmye_hj);
		$("#jmzfb_steppage").append(newMb);
	}
}
function getJmzList(jmxxGridlb,type){
	var newArr = [];
	for(var i=0;i<jmxxGridlb.length;i++){
		var tempObj = jmxxGridlb[i];
		var mc = getSsjmxzmc(tempObj.ssjmxzhzDm);
		var newMb = "";
		if(tempObj.jmzlxDm==type){//免征
			tempObj.mc = mc;
			newArr.push(tempObj);
		}
	}
	return newArr;
}
function setDivVisible(jmxxGridlb){
	for(var i=0;i<allConfig.length;i++){
		$("#"+allConfig[i].step).hide();
		$("#"+allConfig[i].steppage).hide();
	}
	for(var i=0;i<stepConfig.length;i++){
		$("#"+stepConfig[i].step).show();
	}
	$("#"+stepConfig[0].step).show();
	$("#"+stepConfig[0].steppage).show();
	
	$("#jmzfb_steppage").html('');
	
	var jzGrid = getJmzList(jmxxGridlb,"01");
	var mzGrid = getJmzList(jmxxGridlb,"02");
	
	for(var i=0;i<jzGrid.length;i++){
		var tempObj = jzGrid[i];
		var newMb = jzfb_template+'';
		setJzhj(i);
		newMb = replaceAll_(newMb,"{index}",i);
		newMb = replaceAll_(newMb,"{ssjmxzhzmc}",tempObj.mc);
		newMb = replaceAll_(newMb,"{ssjmxzhzDm}",tempObj.ssjmxzhzDm);
		$("#jmzfb_steppage").append(newMb);
	}
	setJzHj();
	
	
for(var i=0;i<mzGrid.length;i++){
	var tempObj = mzGrid[i];
	var newMb = mzfb_template + '';
	setMzhj(i);
	newMb = replaceAll_(newMb,"{index}",i);
	newMb = replaceAll_(newMb,"{ssjmxzhzmc}",tempObj.mc);
	newMb = replaceAll_(newMb,"{ssjmxzhzDm}",tempObj.ssjmxzhzDm);
	$("#jmzfb_steppage").append(newMb);
}
setMzHj();
	//绑定input
	bindINput();
}
function bindINput(){
	$("#jmzfb_steppage input").each(function (){
		//计算
		$(this).bind("change",$(this),calculate);
		//校验数字
		var decimal = $(this).attr("decimal");
		if(!!decimal){
			$(this).bind("blur",$(this),decimalFormat);
		}
	});
}

function initStep(ygzNsrzg,jmxxGridlb){
	//01	应税货物增值税,02	应税服务增值税,03	混征增值税
	if(ygzNsrzg == "01"){
		stepConfig.push(allConfig[0]);
		if(jmxxGridlb&&jmxxGridlb.length>0){
			stepConfig.push(allConfig[3]);
		}
		stepConfig.push(allConfig[4]);
	}else if(ygzNsrzg == "02"){
		stepConfig.push(allConfig[1]);
		stepConfig.push(allConfig[2]);
		if(jmxxGridlb&&jmxxGridlb.length>0){
			stepConfig.push(allConfig[3]);
		}
		stepConfig.push(allConfig[4]);
	}else {
		stepConfig.push(allConfig[0]);
		stepConfig.push(allConfig[1]);
		stepConfig.push(allConfig[2]);
		if(jmxxGridlb&&jmxxGridlb.length>0){
			stepConfig.push(allConfig[3]);
		}
		stepConfig.push(allConfig[4]);
	}
	setDivVisible(jmxxGridlb);
	
	var index = 1;
	$(".number1:visible").each(function (){
		$(this).text(index);
		index++;
	});
	
	totalStep = stepConfig.length;
	nextStep();
}

function nextStep(){
	if(!validateAll()){
		return;
	}
	
	if(curentStep == totalStep-1){
		doSubmit(doNext);
		return;
	}
	doNext();
}

function preStep(){
	if(curentStep==1){
		return;
	}
	doPre();
}

function doPre(){
	curentStep--;
	
	//1.控制步骤显示
	var numberDiv = $(".number:visible").last();
	numberDiv.addClass("number1");
	numberDiv.removeClass("number");
	
	var numberText = $(".number_text").last();
	numberText.addClass("number_text1");
	numberText.removeClass("number_text");
	
	var numberLine = $("#step_"+curentStep+"a");
	numberLine.removeClass("number_line");
	numberLine.addClass("number_line1");
	
	$("#nextBtn").show();
	$("#closeBtn").hide();
	
	//2.控制纳税人信息显示
	if(curentStep==1){
		$("#jbxxDiv").show();
	}else{
		$("#jbxxDiv").hide();
	}
	
	//3.控制表单显示
	$("#"+stepConfig[curentStep].steppage).hide();
	$("#"+stepConfig[curentStep-1].steppage).show();
	
	//4.如果是最后一步则恢复提交的颜色
	/*if(curentStep==(totalStep-1)){
		$(".number:visible").last().css("background","#f99537");
		$(".number_text").last().css("color","#f99537");
	}*/
	
}

function doNext(){
	//1.控制步骤显示
	$(".number1:visible:eq(0)").addClass("number");
	$(".number1:visible:eq(0)").removeClass("number1");
	$(".number_text1:visible:eq(0)").addClass("number_text");
	$(".number_text1:visible:eq(0)").removeClass("number_text1");
	
	if(curentStep>0){
		var numberLine = $("#step_"+curentStep+"a");
		numberLine.addClass("number_line");
		numberLine.removeClass("number_line1");
	}
	
	//2.控制纳税人信息显示
	if(curentStep==0){
		$("#jbxxDiv").show();
	}else{
		$("#jbxxDiv").hide();
	}
	
	//3.控制表单显示
	if(curentStep>0){
		$("#"+stepConfig[curentStep].steppage).show();
		$("#"+stepConfig[curentStep-1].steppage).hide();
	}
	
	//4.如果是申报提交后的结果显示，则填充相应内容
	if(curentStep==totalStep-1){
		var sbfk = sbResult.value;
		$("#sbjg_nsrsbh").text(sbfk.nsrsbh);
		$("#sbjg_sbsj").text(sbfk.sbrq);
		$("#sbjg_zsxmMc").text(sbfk.zsxmMc);
		$("#sbjg_ybtse").text(sbfk.ybtse);
		$("#sbjg_sbjgSm").text(sbfk.sbjgSm);
		
		$("#nextBtn").hide();
		$("#closeBtn").show();
		
		$("#preBtn").hide();
		
		/*//将提交步骤设置成绿色
		$(".number:visible").last().css("background","#87D319");
		$(".number_text").last().css("color","#87D319");*/
	}
	
	curentStep++;
}

function doSubmit(callback){
	//1.校验提交数据
	/*if(!checkYnsjze()){
		return;
	}*/
	
	if(parseFloat($("#fwbq01").val())!=parseFloat($("#fb1_bl08").val())){
		alert("应税服务第一栏与附列资料中不含税销售额不符，请核实。");
		return;
	}
	
	if($("#jz_bqsjdjse_hj")&&$("#jz_bqsjdjse_hj").val()){
		if(parseFloat($("#jz_bqsjdjse_hj").val())!=(parseFloat($("#bq11").val())+parseFloat($("#fwbq11").val()))){
			alert("本期实际抵减税额合计必须等于本期应纳税额减征额。");
			return;
		}
	}
	if($("#mz_qcye_hj")&&$("#mz_qcye_hj").val()){
		if(parseFloat($("#mz_qcye_hj").val())!=(parseFloat($("#bq07").val())+parseFloat($("#fwbq07").val()))){
			alert("免征增值税项目销售额必须等于（其中：其它免税销售额）！");
			return;
		}
	}
	
	var ybtse = round2(parseFloat($("#bq14").val())+parseFloat($("#fwbq14").val()));
	if(window.confirm("申报税额为："+ybtse+"，请确认是否进行申报？")){
		submitData(callback);
	}else{
		return;
	}

}



function submitData(callback) {
	var hlxxData = getFormData("#hl_steppage");
	var fwxxData = getFormData("#fw_steppage");
	var fbxxData = getFormData("#fb_steppage");
	var jmzfbData = getFormData("#jmzfb_steppage");//减免征数据
	var fromData = {
			hlxx:hlxxData,
			fwxx:fwxxData,
			fb01xx:fbxxData,
			jmzfbData:jmzfbData
	};
	waitdiv.show();        //打开遮罩层
	$.ajax({
		type : "POST",
		url : "/app/sb/XgmzzsSb_commitSb.do",
		data : {
			pzzlDm:pzzlDm,
			sbData:JSON.stringify(fromData),
			sssqQ:initData.sssqQ,
			sssqZ:initData.sssqZ,
			sbzldm:sbzlDm,
			ybtse:round2(parseFloat($("#bq14").val())+parseFloat($("#fwbq14").val()))
		},
		success : function(data) {
			waitdiv.hide();        //隐藏遮罩层
			sbResult = JSON.parse(data);
			if (!sbResult.success) {
				var mes = sbResult.message;
				if(mes=="reLogin"){
					alert("会话超时，请重新登录。");
					return;
				}
				alert("申报数据提交失败，异常原因："+sbResult.message);
				return;
			}
			callback();
		},
		error : function(e) {
			waitdiv.hide();        //隐藏遮罩层
			alert("申报数据提交失败，请稍后再试。");
		}
	});
}
/**
 * 应纳税减征额校验
 * @returns {Boolean}
 */
function checkYnsjze(){
	if (ygzNsrzg == "03") {
		var xsze_hl = parseFloat($("#bq01").val())+parseFloat($("#bq04").val())+parseFloat($("#bq06").val())+parseFloat($("#bq08").val());
		var xsze_fw = parseFloat($("#fwbq01").val())+parseFloat($("#fwbq06").val())+parseFloat($("#fwbq08").val());
		var xsze = parseFloat(xsze_hl)+parseFloat(xsze_fw);
		
		var cgqzdFlag = false;  //超过起征点标志
		if(gtNsrFlag&&xsze > zzsQzd){
			cgqzdFlag = true;
		}
		if(!gtNsrFlag&&xsze > zzsQzd){
			cgqzdFlag = true;
		}
		
		if(!cgqzdFlag){
			var ynsjzeHl = round((parseFloat($("#bq01").val())-parseFloat($("#bq02").val()))*0.03,2);
			var bq11 = parseFloat($("#bq11").val());
			if(bq11>ynsjzeHl){
				alert("应税货物及劳务本期应纳税额减征额应小于等于(第1栏减第2栏)乘以3%!");
				return;
			}
			
			var ynsjzeFw = round((parseFloat($("#fwbq01").val())-parseFloat($("#fwbq02").val()))*0.03,2);
			var fwbq11 = parseFloat($("#fwbq11").val());
			if(fwbq11>ynsjzeFw){
				alert("应税服务本期应纳税额减征额应小于等于(第1栏减第2栏)乘以3%!");
				return;
			}
		}
		
		if(cgqzdFlag){
			var ynsjzeHj = parseFloat($("#bq11").val())+parseFloat($("#fwbq11").val());
			if(!ynsjzeFlag&&ynsjzeHj>0){
				alert("请先办理减免税资格的备案登记,否则不能填写本期应纳税额减征额!");
				return false;
			}
		}
	}
	return true;
}

function checkQtjmHl(e){
	if(e.value!=0&&!qtjmHl){
		alert("尚未进行增值税减免税款备案，请确认!");
		e.value = "0.00";
	}
}

function checkQtjmFw(e){
	if(e.value!=0&&!qtjmFw){
		alert("尚未进行增值税减免税款备案，请确认!");
		e.value = "0.00";
	}
}

function checkYnsjzeHl(e){
	if(ygzNsrzg == "01"){
		var xsze_hl = parseFloat($("#bq01").val())+parseFloat($("#bq04").val())+parseFloat($("#bq06").val())+parseFloat($("#bq08").val()); 
		var cgqzdFlag = false;  //超过起征点标志
		if(gtNsrFlag&&xsze_hl > zzsQzd){
			cgqzdFlag = true;
		}
		if(!gtNsrFlag&&xsze_hl > zzsQzd){
			cgqzdFlag = true;
		}
		
		if(!cgqzdFlag){
			var ynsjze = round((parseFloat($("#bq01").val())-parseFloat($("#bq02").val()))*0.03,2);
			var bq11 = parseFloat($("#bq11").val());
			if(bq11>ynsjze){
				alert("本期应纳税额减征额应小于等于(第1栏减第2栏)乘以3%!");
				e.value = ynsjze;
				return;
			}
		}
		
		if (e.value > 0 && !ynsjzeFlag && cgqzdFlag) {
			alert("请先办理减免税资格的备案登记!");
			e.value = "0.00";
		}
	}
}

function ynsjzeCalHl(sender){
	if(ygzNsrzg == "01"){
		var xsze_hl = parseFloat($("#bq01").val())+parseFloat($("#bq04").val())+parseFloat($("#bq06").val())+parseFloat($("#bq08").val()); 
		var cgqzdFlag = false;  //超过起征点标志
		if(gtNsrFlag&&xsze_hl > zzsQzd){
			cgqzdFlag = true;
		}
		if(!gtNsrFlag&&xsze_hl > zzsQzd){
			cgqzdFlag = true;
		}
		
		if(!cgqzdFlag){  //没有达到起征点则自动计算
			var ynsjze = round((parseFloat($("#bq01").val()) - parseFloat($("#bq02").val()))*0.03,2);
			return ynsjze;
		}else if(!ynsjzeFlag){
			return "0.00";
		}
	}
}

function ynsjzeCalFw(sender){
	if(ygzNsrzg == "02"){
		var xsze_fw = parseFloat($("#fwbq01").val())+parseFloat($("#fwbq06").val())+parseFloat($("#fwbq08").val());
		var cgqzdFlag = false;  //超过起征点标志
		if(gtNsrFlag&&xsze_fw > zzsQzd){   //个体纳税人大于等于两万
			cgqzdFlag = true;
		}
		if(!gtNsrFlag&&xsze_fw > zzsQzd){    //单位纳税人大于两万
			cgqzdFlag = true;
		}
		
		if(!cgqzdFlag){
			var ynsjze = round((parseFloat($("#fwbq01").val()) - parseFloat($("#fwbq02").val()))*0.03,2);
			return ynsjze;
		}else if(!ynsjzeFlag){
			return "0.00";
		}
		
	}
}

function checkYnsjzeFw(e){
	if(ygzNsrzg == "02"){
		var xsze_fw = parseFloat($("#fwbq01").val())+parseFloat($("#fwbq06").val())+parseFloat($("#fwbq08").val());
		var cgqzdFlag = false;  //超过起征点标志
		if(gtNsrFlag&&xsze_fw > zzsQzd){   //个体纳税人大于等于两万
			cgqzdFlag = true;
		}
		if(!gtNsrFlag&&xsze_fw > zzsQzd){    //单位纳税人大于两万
			cgqzdFlag = true;
		}
		if(!cgqzdFlag){
			var ynsjze = round((parseFloat($("#fwbq01").val())-parseFloat($("#fwbq02").val()))*0.03,2);
			var fwbq11 = parseFloat($("#fwbq11").val());
			if(fwbq11>ynsjze){
				alert("本期应纳税额减征额应小于等于(第1栏减第2栏)乘以3%!");
				e.value = ynsjze;
				return;
			}
		}
		if (e.value > 0 && !ynsjzeFlag && cgqzdFlag) {
			alert("请先办理减免税资格的备案登记!");
			e.value = "0.00";
		}
	}
}

function checkCkms(e){
	if(!cktsFlag&&parseFloat(e.value)>0){
		alert("请先办理出口免税资格认证!");
		e.value = "0.00";
	}
}

function checkGdzcJm(e){
	if(!gdzcFlag&&parseFloat(e.value)>0){
		alert("请先办理固定资产销售备案!!");
		e.value = "0.00";
	}
}

function winClose(){
	closeWidow();
}