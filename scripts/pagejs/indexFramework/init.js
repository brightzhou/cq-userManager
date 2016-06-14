//init iframe src
var iframe = document.getElementById("mainframe");
var isShow = true;
iframe.src = "/PortalWeb/pages/nav/navIndex.html";
mini.parse();
var editWindow = mini.get("editWindow");

// $(editWindow._toolsEl).on("click", function() {
// 	cancelAddAgent();
// });

function switchTaxpayer() {
	getTaxpayerList();
	// editWindow.show();
}

function onItemSelect(e) {
  var item = e.item;
  iframe.src = item.url;
}

function onItemClick(e) {
	var item = e.item;
	iframe.src = item.url;
}

function logout(){
	
}

function taxpayerListClick() {
	var obj = $("#taxpayerList");
	if (isShow) {
		getTaxpayerList();
		isShow = false;
		obj.show();
	} else {
		obj.hide();
		isShow = true;
	}
}

function taxpayerInfoAjax(url) {
	var textInfo = "";
	$.ajax({
		url: url,
		type: 'GET',
		dataType: 'json',
		success: function(res) {
			var json = mini.decode(res);
			if(json.success){
				initLoginInfo();
				var miniOutlookmenu = mini.get("miniOutlookmenu");
				miniOutlookmenu.setUrl("/api/yhgl/initMenu");
			}
		},
		error: function(res) {
			mini.alert(res);
		}
	});
}

function taxpayerListClick(index) {
	// var url = "/api" + "?gsNsrmc=" + pamas;
	// taxpayerInfoAjax(url);
}

//点击按钮进入纳税人身份
function enterTaxpayerIdentity() {
	var djxh = "";
	var lis = $("#taxpayerListInfo li");
	for (var i = 0; i < lis.length; i++) {
		if(lis[i].className === "option-checked"){
			djxh = lis[i].children[0].innerHTML;
			break;
		}
	}
	
	editWindow.hide();
	var url = "/api/yhgl/switch/currentNsr" + "?djxh=" + djxh;
	taxpayerInfoAjax(url);
}

function getTaxpayerList() {
	editWindow.show();
	var htmlLi = "";
	$.ajax({
		url: '/api/yhgl/select/nsr',
		type: 'GET',
		dataType: 'json',
		success: function(res) {
			var result = mini.decode(res);
			var json = result.data;
			if(null!=json){
				for (var i = 0; i < json.length; i++) {
					for (var key in json[i]) {
						if (key === "gsNsrmc") {
							htmlLi += "<li>" + json[i][key] + "<span style=\"display:none\">" + json[i]["djxh"] + "</span>" + "</li>"
						}
					}
				}
			}
			
			htmlLi+="<li class=\"option-checked\">个人身份<span style=\"display:none\"></span></li>";
			$("#taxpayerListInfo").html(htmlLi);
		},
		error: function(res) {
			mini.alert(res);
		}
	});
}

function initLoginInfo() {
	$.ajax({
		url: "/api/yhgl/welcomeTip",
		type: 'GET',
		dataType: 'json',
		success: function(res) {
			var json = mini.decode(res);
			if(json.success){
				$("#welcomeNotice span").text(json.data);
			}
		},
		error: function(res) {
			mini.alert(res);
		}
	});
}

$(function() {
	initLoginInfo();
	switchTaxpayer();
	$("#taxpayerListInfo li").live("click", function() {
		$(this).addClass("option-checked").siblings().removeClass("option-checked");
	});

});