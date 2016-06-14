var MsgPage = (function(){
	var pageData = '';


	function _loadData(){
		//TODO  ajax

	$.appAjax({
	  data:'',
	  url:'http://192.168.31.172:9010/getCms/getCmsAction_queryCmsTZ.do',
	  success:function(d){
		 pageData = $.parseJSON(d.data);
		 console.log(d);
		_randerPage();
	  }
	  
	})
	//---------------
	
  	}
	function _randerPage(){
		var li,ul = $('ul');
		var date;
		console.log(pageData)
		$.each(pageData.body.data,function(i,v){
			date = carmpareTime(v.publishDate)
			li = '<li data-app-url="'+v.mainContentPath+'">'+
				 '<h5>'+v.subject+'</h5>'+
				 '<span>'+date+'</span>'+
				 '</li>';
			ul.append(li);
		})

	
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
			console.log(url)
		
		})
	}

		return {
			loadData:function(){
			
			
			
			},
			randerPage:function(){
			
			
			},
			init:function(){
				_loadData();
			//	_randerPage();
				_bindEvent();
				var  myscroll=new IScroll("#wrapper");
			}		
		}

})()


$(function(){
	MsgPage.init();
	
})