$(function() {
	mini.parse();
	// var grid;
	// grid = mini.get("gridData");
	// grid.load();
	var arrLi = $("#taxSearchList li");
	for ( var i = 0; i < arrLi.length; i++) {
		arrLi[i].setAttribute("index", i);
	}
	arrLi.on("click", function() {
		// id="codeimg1" 
		var index = this.getAttribute("index");
		if (index == 5 || index == 6 || index == 7)
			return;
		$('#codeimg'+index).attr("src" ,"/captcha.jpg?"+Math.random());
		var taxFormContentObj = $("#lowerContent .taxFormContent");
		taxFormContentObj[index].style.display = "block";
		for ( var i = 0; i < taxFormContentObj.length; i++) {
			if (index == i)
				continue;
			taxFormContentObj[i].style.display = "none";
		}
	});
	
});
//初始化验证码
function initCodeImage(index){
	$('#codeimg'+index).attr("src" ,"/captcha.jpg?"+Math.random());
};
// 发票明细查询
var doQueryFpmx = function() {
	var fpxxGrid = mini.get("fpxxGridData");
	var form = new mini.Form("#fpxxSearchForm");
	var validate = form.validate();
	if (validate) {
		var data = form.getData();
		var json = mini.encode(data);
		fpxxGrid.setUrl("/api/sscx/fpmx");
		fpxxGrid.load({
			"jsonStr" : json
		},function(){
			initCodeImage(1);
		});
	}
};

var onRendererFpxx = function(e) {
	var record = e.record;
	var state = record.kjqk;
	if (state == 0) {
		return "正常开具";
	} else if (state == 1) {
		return "红字发票";
	} else if (state == 2) {
		return "作废发票";
	} else {
		return "其它";
	}
};
/*var validateFplx = function(){
	var swjgdk = mini.get("swjgdk").getValue();
	if(swjgdk == "1"){
		//不验证开票方名称
		mini.get("kpfmc").setIsValid(true);
	}
};*/
//发票流向查询
var doQueryFplx = function() {
	var fplxGrid = mini.get("fplxGridData");
	var form = new mini.Form("#fplxSearchForm");
	var validate = form.validate();
	if (validate) {
		var data = form.getData();
		var json = mini.encode(data);
		fplxGrid.setUrl("/api/sscx/fplx");
		fplxGrid.load({
			"jsonStr" : json
		},function (){
			initCodeImage(0);
		});
	}
};
var swjgdkClick = function(){
};
//信用等级查询
function doQueryXydj() {
	var nsrsbh = mini.get("nsrsbh_xydj").getValue();
	var identifyCode = mini.get("identifyCode_xydj").getValue();
	if (identifyCode.length !== 4) {
		mini.alert("请输入4位正确的验证码!");
		return;
	}
	if (nsrsbh === "") {
		mini.alert("请输入正确的纳税人识别号");
		return;
	}	
	$.ajax({
		url : "/api/sscx/queryNsxydj",
		type : "post",
		data : {
			"nsrsbh" : nsrsbh,
			"identifyCode" : identifyCode
		},
		success : function(text) {
			var data = mini.decode(text);
			if (!data.success) {
				initCodeImage(4);
				if (data.messageCode === "80480804") {
					mini.alert("验证码错误");
					initCodeImage(4);
					return;
				}
				mini.alert("查询失败");				
				return;
			}
			if (data.data.length === 0) {
				mini.alert("没有查询到数据");
				initCodeImage(4);
				return;
			}
			var grid = mini.get("xydjGridData");
			grid.setData(data.data);
			
		},
		error : function(text) {
			initCodeImage(4);
			var grid = mini.get("xydjGridData");
			grid.unmask();
			mini.alert("查询请求失败,请稍后再试!");
		}
	});
}

//欠税查询
var doQueryQszt = function() {
	var form = new mini.Form("#qsztSearchForm");
	var qsztSearchForm = mini.get("qsztGridData");
	var validate = form.validate();
	if (validate) {
		var data = form.getData();
		var json = mini.encode(data);
		qsztSearchForm.setUrl("/api/sscx/qsqy");
		qsztSearchForm.load({
			"jsonStr" : json
		} ,function (){
			initCodeImage(3);
		});
	}
};
var onRendererQszt = function(e) {
	var record = e.record;
	var state = record.qfzt;
	if (state == 1) {
		return "是";
	} else {
		return "否";
	}
};

var doQueryNsrzt = function() {
	var nsrsbh = mini.get("nsrsbh_nsrzt").getValue().trim();
	var identifyCode = mini.get("identifyCode_nsrzt").getValue().trim();
	if (identifyCode.length !== 4) {
		mini.alert("请输入4位正确的验证码!");
		return;
	}
	if (nsrsbh === "") {
		mini.alert("请输入正确的纳税人识别号");
		return;
	}
	$.ajax({
		url : "/api/sscx/queryNsrzt",
		type : "post",
		data : {
			"nsrsbh" : nsrsbh,
			"identifyCode" : identifyCode
		},
		success : function(text) {
			var data = mini.decode(text);
			if (!data.success) {
				initCodeImage(2);
				if (data.messageCode === "80480804") {
					mini.alert("验证码错误");
					return;
				}
				mini.alert("查询失败");
				return;
			}
			if (data.data.length === 0) {
				mini.alert("没有查询到数据");
				initCodeImage(2);
				return;
			}
			var grid = mini.get("nsrztGridData");
			grid.setData(data.data);
		},
		error : function(text) {
			initCodeImage(2);
			var grid = mini.get("nsrztGridData");
			grid.unmask();
			mini.alert("查询请求失败,请稍后再试!");
		}
	});
};


var onload = function(e){
	var data = e.data;
	if(e.result.success == false){
		mini.alert(e.result.paramList[0]);
	}
};