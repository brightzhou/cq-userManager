var refreshtime=3000;
var args=new Object();
$(function () {
    //alert($.browser.version)
    //if ($.browser.msie && $.browser.version == "6.0") DD_belatedPNG.fix('img,.pngbg');
    
   // if ($.browser.msie && parseInt($.browser.version)<9)
       
   // $(".top-logo").css("background", "none").html("<img src='../scripts/sui/themes/tyjrpt/images/topbanner.png' style='height:100%'>")
	
});
//获取某个字符串的字节数
function getLength(s) {
 var i,sum;
 sum=0;
 for(i=0;i<s.length;i++) {
 if ((s.charCodeAt(i)>=0) && (s.charCodeAt(i)<=255))
 sum=sum+1;
 else
 sum=sum+3;
 }
 return sum;
}
$(document).ready(function(){
	var searchStr=window.location.search;
	if(!!!searchStr){
		return ;
	}
	var query= searchStr.substring(1);
	var pairs = query.split("&"); //在逗号处断开
	 for (var i = 0; i < pairs.length; i++) {
         var pos = pairs[i].indexOf('='); //查找name=value   
         if (pos == -1) continue; //如果没有找到就跳过   
         var argname = pairs[i].substring(0, pos); //提取name   
         var value = pairs[i].substring(pos + 1); //提取value   
         args[argname] = unescape(value); //存为属性   
     }
     return args;
});

; (function ($) {

    jQuery.fn.extend({

        /**
        @功能：设置切换盒组件
        @参数： def:"class1" 默认的按钮效果
                chg:"class2" 变化后的按钮效果	
                chglist:"具体的需要变化的列表对象选择" 
                wennull:"当chglist里的内容为空时是否需要显示该BOX" 	
                index:"默认显示第几个" 	
                bindevent:"绑定事件"
        @返回:  无
        @实例:  $(".index_top2 .box3 .list2 div").SwichBox({def:"b2",chg:"b1",chglist:".index_top2 .box3 .list2 ul"})	
        */
        SwichBox: function (settings) {
           
            settings = $.extend({ def: "", chg: "", chglist: "", whennull: false, index: 0, bindevent: "mouseover" }, settings);
            var now = $(this);
            now.unbind();
            settings.chg = settings.chg.replace(".", "");
            settings.def = settings.def.replace(".", "");
            now.each(function (index) {
                if (index == settings.index) {
                    $(this).addClass(settings.chg);
                    $(settings.chglist).eq(index).css("display", "block");
                    if (settings.whennull) {
                        if ($(settings.chglist).eq(index).html() == "") { $(settings.chglist).eq(index).css("display", "none") }
                    }

                } else {
                    $(this).removeClass(settings.chg).addClass(settings.def);
                    $(settings.chglist).eq(index).css("display", "none");
                }

                $(this).bind(
                    settings.bindevent,
                    function (e) {
                        if (e.target.nodeName.toLowerCase() == "a") {
                            //  stopDefault(e);
                        }

                        if ($(this).attr("class") == settings.chg) return;
                        if ($(this).attr("disable")) { return; }

                        now.removeClass(settings.chg).addClass(settings.def);
                        $(this).removeClass(settings.def).addClass(settings.chg);

                        $(settings.chglist).css("display", "none");
                        $(settings.chglist).eq(index).fadeIn("fast");
                        if (settings.whennull) {
                            if ($(settings.chglist).eq(index).html() == "") { $(settings.chglist).eq(index).css("display", "none") }
                        }
                    }
                )
            })
        }

    });
})(jQuery);



var syUtil = {};
; (function () {
     
    syUtil.Time = {
        setdate: function (d) {
            $(".ctime").removeClass("ctime");
            $("#" + d).addClass("ctime");
            uexControl.openDatePicker((new Date).Format("yyyy"), (new Date).Format("MM"), (new Date).Format("dd"));
        }
    }

    syUtil.regTest = {
        testName: function (str) {
            var reg = /^[\u4e00-\u9fa5a-z\u4e00-\u9fa5a-z0-9_\s()]*$/i;
            return reg.test(str);
        },
        testPhone: function (phoneNumber) {
            return (/^1[3|4|5|7|8][0-9]\d{8}$/.test(phoneNumber));
        },
        testDigit: function (number) {
            return (/^[0-9]{1,}$/.test(number));
        }
    }

    syUtil.String = {
        tempreplace: function (htmls, j) {
            for (var r in j) {
                var reg = new RegExp("{" + r + "}", "g");
                htmls = htmls.replace(reg, j[r]);
            }
            return htmls;
        },
        valreplace: function (j) {
            for (var r in j) {
                $("#" + r).val(j[r]);
            }
        },
        htmlreplace: function (j) {
            for (var r in j) {
                $("#" + r).html(j[r]);
            }
        }
    }

})(syUtil, $)


getParamValueByKey=function(key){
	
	
}


ajax=function(url,data,b,fn){
	$.ajax( {
		cache : false,
		async : b,
		url : url,
		data : data,
		type : "post",
		success : function(data) {
			if(fn instanceof Function){
				fn(data);
			}
			
		},
		error : function(text) {
			mini.alert("加载数据失败");
		}
	});
	
	
	
	
}
