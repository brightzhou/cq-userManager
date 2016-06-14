package 
{
	import flash.external.ExternalInterface;
	import flash.display.Sprite;
	import flash.system.Security;
	import flash.net.URLRequest;
	import flash.net.URLLoader;
	import flash.events.Event;
	import flash.system.ApplicationDomain;
	public class Rookie extends Sprite
	{
		private var co:Cookie;
		public function Rookie()
		{
			co = new Cookie()  ;
			if (ExternalInterface.available)
			{
				var crossDomain = ExternalInterface.call("SUI.store.cross");
				if (crossDomain)
				{
					var loader:URLLoader = new URLLoader  ;
					loader.addEventListener(Event.COMPLETE,getPolicy);
					loader.load(new URLRequest(/.*\//i.exec(this.loaderInfo.url)[0] + "policy.txt"));
				}
				else
				{
					ExternalInterface.call("SUI.store.swfReady");
				}
				ExternalInterface.addCallback("set",co.set_cookie);
				ExternalInterface.addCallback("get",co.get_cookie);
				ExternalInterface.addCallback("remove",co.remove_cookie);
				ExternalInterface.addCallback("clear",co.clear_cookie);
				ExternalInterface.addCallback("callAS",callAS);
			}
		}
		
		private function getPolicy(e:Event):void
		{
			//ExternalInterface.call("console.warn","Check CROSS DOMAIN Policy file");
			var domains:Array = e.target.data.split(/\s+/);
			for (var i = 0,l = domains.length; i < l; i++)
			{
				flash.system.Security.allowDomain(domains[i]);
			}
			ExternalInterface.call("SUI.store.swfReady");
		}
		private function callAS():Boolean
		{
			return true;
		}
		//ExternalInterface.call("console.info","Rookie installed successfully！");
	};
};


import flash.net.SharedObject;
import flash.external.ExternalInterface;

class Cookie{
	private var so:SharedObject;
	private var soName:String;
	private var ALL_SAVE_KEY_LIST:String = "allsavekeylist";
	public function Cookie()
	{
	}
	public function set_cookie(sName:String,sValue,config:Object=null)
	{
		var cookieValue:String = "sValue_";
		so = SharedObject.getLocal(sName,"/");
		if (config == null)
		{
			config = {expire:0,crossBrowser:true};
		}
		else
		{
			if (! config.hasOwnProperty("expire"))
			{
				config.expire = 0;
			}
			if (! config.hasOwnProperty("crossBrowser"))
			{
				config.crossBrowser = true;
			}
		}
		if (config.crossBrowser == false)
		{
			cookieValue +=  ExternalInterface.call("SUI.store._get_browser");
		}
		
		so.data[cookieValue] = sValue;
		so.data.crossBrowser = config.crossBrowser;
		so.data.expire = config.expire;
		so.data.createTime = (new Date).getTime();
		so.flush();
		var s:Array = [sName," = ",sValue," , config = {expire:",config.expire," day(s), ","crossBrowser:",config.crossBrowser,"}"];
//		ExternalInterface.call("console.log","Set: "+s.join(""));
		//保存全部保存箱列表
		
		var keyList:String = this.get_cookie(ALL_SAVE_KEY_LIST) || "";
		if (sName !== ALL_SAVE_KEY_LIST && keyList.indexOf(sName) < 0)
		{
			keyList = keyList.length > 0 ? keyList + "," + sName:sName;
			this.set_cookie(ALL_SAVE_KEY_LIST,keyList);
		}
	}
	public function get_cookie(sName)
	{
		var cookieValue:String = "sValue_";
		so = SharedObject.getLocal(sName,"/");
		if (so.size == 0)
		{
			//ExternalInterface.call("console.warn",sName+ " : unset, Get : undefined");
			return;
		}
		else
		{
			if (so.data.expire != 0)
			{
				if (so.data.createTime + so.data.expire * 1000 * 60 * 60 * 24 < (new Date.getTime()))
				{
					so.clear();
					//ExternalInterface.call("console.warn",sName+ " Expired! Get : undefined");
					return;
				}
			}
		}
		
		if (so.data.crossBrowser == false)
		{
			cookieValue +=  ExternalInterface.call("SUI.store.get_browser");
		}
		//ExternalInterface.call("console.log","Get: "+sName+" = "+so.data[cookieValue]);
		return so.data[cookieValue];
		
	}
	public function remove_cookie(sName:String)
	{
		so = SharedObject.getLocal(sName,"/");
		so.clear();
		//ExternalInterface.call("console.warn","Clear: "+sName);
	}
	public function clear_cookie():void
	{
		var keyStrings = this.get_cookie(ALL_SAVE_KEY_LIST);
		if(!keyStrings){
			return;
		}
		var keyList:Array = keyStrings.split(",");
		var i = 0, l = keyList.length;
		for(;i < l ; i++){;
			this.remove_cookie(keyList[i]);
			
		}
	}
}
