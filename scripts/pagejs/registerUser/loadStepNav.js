$(function(){
	init();
});

function init(){
	var loadUrl = "pages/registerUser/registerSuccess.html";
	var stepNav = new StepNav();
	// 1. 初始化step框架
	stepNav.init("xd", [ {
		id : "registerUsers",
		text : "注册实名用户",
		url : "pages/registerUser/registerUser.html"
	}, {
		id : "registerBind",
		text : "绑定企业",
		url : loadUrl
	},{
		id : "authentications",
		text : "实名认证",
		url : "pages/registerUser/authentication.html"
	}, {
		id : "maintainInfos",
		text : "信息维护",
		url : "pages/registerUser/maintainInfo.html"
	}], stepNav);
	
	$('#close').hide();

}