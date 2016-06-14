var dbsxPage = (function(){
	var pageData = '';

var _sessionID;
	function _loadData(){
		//  ajax
		$.appAjax({
			data:'',
			url:'/wycx/wycxAction_queryDbsx.do',
			beforeSend : function(xhr) {
						xhr.setRequestHeader("ChannelId", "ServyouClient");
						xhr.setRequestHeader("ClientVersion","V1.0.001");
						
					},
			success:function(d){
			
			if(d.messageCode == 'SESSION_TIME_OUT'){
			alert('登入超时,请重新登录...')
				relogin();
				return;
			}
				pageData = d;
				
				_randerPage();
			}

		})

  	}
	function _randerPage(){
		var li,url,ul = $('ul');
		var date,zt,ztclass;
		$.each(pageData.data,function(i,v){
			date = carmpareTime(v.dbsxrq);
			zt  = getZT(v.dbsxzt);
			url = v.blzlUrl|| v.wssqbUrl;
			ztclass = v.dbsxzt == '10' ? 'red' :'';
			li = '<li data-app-url="'+url+'">'+
				 '<h5 class="name-title">'+v.dbsxmc+'</h5><h5 class="zt '+ztclass+'">'+zt+'</h5>'+
				 '<span>'+date+'</span>'+
				 '</li>';
			ul.append(li);
		})

	
	}
	function getZT(str){
		var result='受理通过';
		if(str=='01'){
			
		}else if(str=='02'){
			result = '不予受理';
		}else if(str=='11'){
			result = '已签收';
		}else if(str=='10'){
			result = '受理中';
		}else if(str=='03'){
			result = '带审批';
		}else if(str=='04'){
			result = '审批通过';
		}else if(str=='05'){
			result = '审批不通过';
		}else if(str=='06'){
			result = '补正资料';
		}else if(str=='07'){
			result = '代缴税';
		}else if(str=='08'){
			result = '待税种认定';
		}else if(str=='09'){
			result = '税费种认定完成';
		}else if(str=='21'){
			result = '缴税完结';
		}else if(str=='22'){
			result = '发票代开处理完结';
		}else if(str=='23'){
			result = '已补正';
		}else if(str=='20'){
			result = '已登记待开票';
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
				_loadData();
		//		_randerPage();
				_bindEvent();
				var  myscroll=new IScroll("#wrapper");
			}		
		}

})();


$(function(){
	$('.back').bindAppEvent('tap',function(){
		closeWidow();
	});
	getSessionID(function(type, result, isSuccess){
		dbsxPage.set_sessionID(result);
		dbsxPage.init();
	})
})