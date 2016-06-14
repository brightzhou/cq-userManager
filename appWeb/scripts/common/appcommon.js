$.fn.bindAppEvent = function(){
	var event = arguments[0],
		callback = arguments[1],
		_boolean = arguments.length==3 ? arguments[1] : false;
	if(event=='tap'){
		var tar = $(this),
			startTx,startTy;
		for(var i=0;i<tar.length;i++){
			tar[i].addEventListener('touchstart',function(e){
				var touches = e.touches[0];
					startTx = touches.clientX;
					startTy = touches.clientY;		
			})

		 tar[i].addEventListener('touchend', function(e){
				var touches = e.changedTouches[0],
					endTx = touches.clientX,
					endTy = touches.clientY;  
				  if( Math.abs(startTx - endTx) < 6 && Math.abs(startTy - endTy) < 6 ){
						callback.apply(this,arguments);
				  }
				  //console.log(this.innerHTML)
		}, false );
			
		}	
	}
	
}
function getSessionID(fun){
	nativeFunction("getsession", "",
		function (type, result, isSuccess) {
			if (result) {
				$.isFunction(fun) && fun.apply(this,arguments);
			} else {

			}
		});
}
function openView(_url){
  var param = '{"data":"'+_url+'"}';
	nativeFunction("openView",param);
}
function showTitle(_title){
	nativeFunction("navBar",{'data':_title});
}
function relogin(){
	nativeFunction("relogin");
}
function closeWidow(){
	nativeFunction("closeView");
}
$.extend({
  appAjax: function(json) {
		   if(typeof json!='object') return;
		   var option = {
					type : "POST",
					async : false,
					beforeSend : function(xhr) {
						xhr.setRequestHeader("ChannelId", "ServyouClient");
						xhr.setRequestHeader("ClientVersion","V1.0.001");
						xhr.setRequestHeader("Cookis","JSESSIONID=sfsdfsdfsf");
						
					},
					dataType : "JSON",
					//contentType : "application/json",
					url : "/bondegate/saveInfo2/daniel/abc",
					data : '',//JSON.stringify(requestData),
					success : function(data) {
						
					},
					error : function() {
						console.log(2)
					}
				}
			   var param = $.extend(option,json);     
		//	  console.log(param)
			  $.ajax(param);	  
	  }
});

$(function(){
	var w = $(window).height();
	$('#wrapper').height(w-80);
})
