/**
 * Created by mjial on 2016/5/23.
 */

var myDate=new Date();
var myYear=myDate.getFullYear()+"年";
var myMonth=myDate.getMonth()+1+"月";
var myDay=myDate.getDate()+"日";
$(".noticeDate")[0].innerHTML=myYear+myMonth+myDay;
$(".tax-system .tax-month")[0].innerHTML=myMonth;
$(".tax-calendar .tax-month")[0].innerHTML=myMonth;
$(".tax-day")[0].innerHTML=myDate.getDate();

$(".body-left .left-Icon").each(function(i){
    this.onclick=function(){
        $(".left-detail").removeClass("show-content");
        $(".left-detail").eq(i).addClass("show-content");
    };
});

$(".body-right .right-tab").each(function(i){
    this.onclick=function(){
        $(this).parent().find(".right-tab").removeClass("loginSelected");
        $(this).addClass("loginSelected");
        $(".form-input-content").removeClass("show-form");
        $(".form-input-content").eq(i).addClass("show-form");
    };
});

$(".login-btn").on("click", function() {
	location.href = "handleTaxService/index.html";
	
});

//function toMain() {
//	location.href = "main.html";
//	
//}

