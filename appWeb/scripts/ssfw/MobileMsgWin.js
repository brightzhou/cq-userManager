

var waitdiv = new Object();
waitdiv.show = function(){
	var str="<div id='waitdiv' style='width:100%;height:100%;display:block;background:#000;filter:alpha(opacity=50);-moz-opacity:0.5;-khtml-opacity: 0.5;opacity: 0.5;position:absolute;top:0;left:0;z-index:9999;'><img src='/BsfwtWeb/appWeb/images/load.gif' style='width:165px;height:120px;display:block;position:absolute;top:50%;left:50%;margin-top:-60px;margin-left:-82px;' /></div>";
	$("body").append(str);
};

waitdiv.hide = function(){
	$("#waitdiv").remove();
}

var showmsg = function(opt,objgetP){
    var font_tit = opt.font_tit;
    var font_nor = opt.font_nor;
	var font_err = opt.font_err;
	var font_fs = opt.font_fs;
	var font_ok = opt.font_ok
    var str="<div id='wrap' style='width:100%;height:100%;display:none;background:#000;filter:alpha(opacity=50);-moz-opacity:0.5;-khtml-opacity: 0.5;opacity: 0.5;position:fixed;top:0;left:0;z-index:999;'></div>";
	str = str + "<div id='msg' style='width:92%;height:220px;display:none;background:#f5f5f5;top:50%;left:50%;margin-left:-46%;margin-top:-110px;position:fixed;border-radius:10px;z-index:999;'>";
    str = str + "<h4 style='width:100%;height:40px;background:#A2C7F4;border-top-left-radius:10px;border-top-right-radius:10px;text-align:center;line-height:40px;color:#fff;padding:0px;margin:0px;font-size:14px;font-weight:bold;'>"+font_tit+"</h4>";
	str = str + "<div style='width:86%;height:50px;display:block;text-align:center;margin:15px auto 0 auto;'>";
	str = str + "<div style='width:50%;height:40px;display:block;background:#fff;border-radius:6px;color:#666; padding-left:6%;float:left'>";
	str = str + "<input type='text' id='msg_text' value='"+font_nor+"' style='border:0 none;background:none;width:100%;height:36px;line-height:36px;float:right;font-size:14px;color:#ccc;outline:0 none;'/>";
	str = str + "<input type='text' id='msg_password' style='display:none;border:0 none;background:none;width:100%;height:36px;line-height:36px;float:right;font-size:14px;outline:0 none;'/>";
	str = str + "</div><input type='button' style='width:40%;height:40px;display:block;font-size:14px;color:#fff;background:#ff9900;border:0 none;text-align:center;margin-left:4%;line-height:40px;float:left;text-decoration:none;' id='btn_fs' value='"+font_fs+"' /></div>";
	str = str + "<div style='width:86%;height:20px;display:block;line-height:20px;color:#ff9900;margin:0 auto;text-align:left;' id='font_ok' >"+font_ok+"</div>";
	str = str + "<a href='javascript:void(0)' style='width:40%;height:40px;display:block;background:#ccc;border:0 none;border-radius:6px;color:#f5f5f5;position:absolute;bottom:10px;left:7%;text-align:center;line-height:40px;text-decoration:none; outline:0 none;font-size:14px;' id='msg_Closed' >取 消</a>";
	str = str + "<input type='button' style='width:40%;height:40px;display:block;background:#1585c8;border:0 none;border-radius:6px;color:#fff;position:absolute;bottom:10px;right:7%;text-align:center;line-height:40px;text-decoration:none; outline:0 none;font-size:14px;' id='msg_Submitform' value='提 交' />";
	
	
	$("body").append(str);
	
	$("#msg_Closed").click(function(){
	    $("#wrap").remove();
	    $("#msg").remove();
	});
	var getP = function(){
	    var password = $('#msg_password').val();
		if(password==''){
			$('#msg_password').hide();
			$('#msg_text').val(font_err);
			$('#msg_text').css("color","#ff0000");
			$('#msg_text').show();
			return false;
		}else{
			document.getElementById("msg_Submitform").disabled=true; 
			objgetP(password);     //获取密码
		}
	};
	$("#btn_fs").click(function(){sendSjYzm(nsrsbh,this,null)}); //调用发送接口
	
	
	
	$("#msg_Submitform").click(function(){
		getP();
		});
	
	$("#msg_password").blur(function(){
	    if($(this).val()==''){
			$(this).hide();
			$('#msg_text').val(font_err);
			$('#msg_text').css("color","#ff0000");
			$('#msg_text').show();
		}
	});
	$("#msg_text").focus(function(){
	    $(this).hide();
		$('#msg_password').show();
		$('#msg_password').focus();
	});
	
	
    $("#wrap").fadeIn("fast");
	$("#msg").fadeIn("fast");
}
