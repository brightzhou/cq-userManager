var dbsxPage = (function(){
	var noData = '<tr><td valign="middle" align="center" colspan="5">您本月没有申报信息</td></tr>';
	function _loadData(){
		//  ajax
		$.appAjax({
			url:'/app/appsbcommon_querySbQkAnKkqk.do',
			type : "post",
			data:'',
			beforeSend : function(xhr) {
						xhr.setRequestHeader("ChannelId", "ServyouClient");
						xhr.setRequestHeader("ClientVersion","V1.0.001");
						
					},
			success:function(d){
				if (data.messageCode == 'SESSION_TIME_OUT') {
					alert('登入超时,请重新登录...')
					relogin();
					return;
				}
				//var object = JSON.parse({"data":{"sbzlxxs":{"sbzlxx":[{"kkzt":"01","nsrmc":"","sbzlDm":"10101","sbzlMc":null,"sbzt":"02","skssqq":"2015-10-01","skssqz":"2015-10-31","ynse":"10","yzpzzlDm":"","yzpzzlMc":"","zsxmDm":"","zsxmMc":""},{"kkzt":"01","nsrmc":"","sbzlDm":"10101","sbzlMc":null,"sbzt":"02","skssqq":"2015-10-01","skssqz":"2015-10-31","ynse":"10","yzpzzlDm":"","yzpzzlMc":"","zsxmDm":"","zsxmMc":""},{"kkzt":"01","nsrmc":"","sbzlDm":"10101","sbzlMc":null,"sbzt":"02","skssqq":"2015-10-01","skssqz":"2015-10-31","ynse":"10","yzpzzlDm":"","yzpzzlMc":"","zsxmDm":"","zsxmMc":""}]}},"jylsh":"","message":"","messageCode":"","otherParams":null,"paramList":[],"success":true,"total":""});
				var object = JSON.parse(data);
				if (!object.success) {
					alert(object.message);
					return;
				}
				
				if (object.data.sbzlxxs.sbzlxx.length > 0) {
					var listData = [{"kkzt":"01","nsrmc":"","sbzlDm":"10101","sbzlMc":"小规模","sbzt":"02","skssqq":"2015-10-01","skssqz":"2015-10-31","ynse":"10","yzpzzlDm":"","yzpzzlMc":"","zsxmDm":"","zsxmMc":""},
					    		 {"kkzt":"01","nsrmc":"","sbzlDm":"10101","sbzlMc":"所得税","sbzt":"02","skssqq":"2015-10-01","skssqz":"2015-10-31","ynse":"10","yzpzzlDm":"","yzpzzlMc":"","zsxmDm":"","zsxmMc":""},
					    		 {"kkzt":"01","nsrmc":"","sbzlDm":"10101","sbzlMc":"一般纳税人","sbzt":"02","skssqq":"2015-10-01","skssqz":"2015-10-31","ynse":"10","yzpzzlDm":"","yzpzzlMc":"","zsxmDm":"","zsxmMc":""}]
					    		
					//listData = object.data.sbzlxxs.sbzlxx;
					_randerPage(listData);
				} else {
					$("#nullData").append(noData);
				}
			
				//pageData = d;
				//_randerPage();
			}

		})

  	}
	
	function search(){
			$.ajax({
				url:'/app/appsbcommon_querySbQkAnKkqk.do',
				type : "post",
				async : false,
				data : "",
				success : function(data) {
					if (data.messageCode == 'SESSION_TIME_OUT') {
						alert('登入超时,请重新登录...')
						relogin();
						return;
					}
					var object = JSON.parse(data);
					if (!object.success) {
						alert(object.message);
						return;
					}
					
					if (object.data.sbzlxxs.sbzlxx.length > 0) {
						var listData = object.data.sbzlxxs.sbzlxx;
						_randerPage(listData);
					} else {
						alert("您本月没有申报信息");
						return;
					}
				},
				error : function(data) {
					alert("出现系统错误，请稍后再试。。。。。", "提示信息");
					window.close();
				}
			});
}
	
	function _randerPage(_data){
		var li,url,ul = $('ul');
		var dateq,datez,sbzt,kkzt,ztclass,zt2class;
		$.each(_data,function(i,v){
			dateq = carmpareTime(v.skssqq);
			datez = carmpareTime(v.skssqz);
			sbzt  = getSbzt(v.sbzt);
			kkzt = getKkzt(v.kkzt);
			//url = v.blzlUrl|| v.wssqbUrl;
			ztclass = v.sbzt == '01' ? 'red' :'blue';
			if(v.kkzt=='03'){
				zt2class = 'black';
			}else if(v.kkzt=='02'){
				zt2class = 'blue';
			}else{
				zt2class = 'red';
			}
			li = '<li>'+
				 '<img src="../../images/11.ico" />'+
				 '<h5 class="name-title">'+v.sbzlMc+'</h5>'+
				 '<p>'+dateq+'/'+datez+'</p>'+
				 '<h5 class="zt"><span class="'+ztclass+'">'+sbzt+'</span>&nbsp;<span class="'+zt2class+'">'+kkzt+'</span></h5>'+
				 '</li>';
			ul.append(li);
		})

	
	}
	function getSbzt(str){
		var result='未申报';
		if(str=='02'){
		   result = '已申报';
		}
		return result;
	}
	
	function getKkzt(str){
		var result='未扣款';
		if(str=='03'){
		   result = '无税款';
		}else if(str=='02'){
		   result = '已扣款';
		}
		return result;
	}
	function carmpareTime(d){
		var date = new Date(),
			year = date.getFullYear(),
			mon = date.getMonth()+1,
			day = date.getDate(),
			h = date.getHours(),
			min = date.getMinutes();
		var cur = d.split(' ');
		var arr = cur[0].split('-');
		if(arr[0]==year&&arr[1]==mon&&arr[2]==day){
			var time = cur[1].split(':');
			var del = (h*60+min)-(time[0]*60+(time[1]-0)) ;
			if(del>60){
				return cur[1];
			}else{
				return del+'分钟前'
			}

		}else{
			return cur[0];
		
		}
	}

	function _bindEvent(){
		var ul =$('ul'),
			url;
		$('ul').find('li').bindAppEvent('tap',function(){
			url = $(this).data('app-url');
			openView(url);
		})
	}

		return {
			loadData:function(){
			
			
			
			},
			set_sessionID:function(){
				_sessionID = arguments[0];
			
			},
			randerPage:function(){
			
			
			},
			init:function(){
				search();
				//_loadData();
				//_randerPage();
		//		_bindEvent();
				var  myscroll=new IScroll("#wrapper");
			}		
		}

})();


$(function(){
//	$('.back').bindAppEvent('tap',function(){
//		closeWidow();
//	});
//	getSessionID(function(type, result, isSuccess){
//		dbsxPage.set_sessionID(result);
//		dbsxPage.init();
//	})
	dbsxPage.init();
})