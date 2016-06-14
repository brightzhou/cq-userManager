this.SUI = {};
this.SUI.store = (function () {
    var api               = {},
        win               = window,
        doc               = win.document,
        localStorageName  = 'localStorage',
        globalStorageName = 'globalStorage',
        storage;

    api.set    = function (key, value) {};
    api.get    = function (key)        {};
    api.remove = function (key)        {};
    api.clear  = function ()           {};
    //增加此方法，解决ie6下，$(document).ready中的方法执行时，flash未加载完成 2014-10 pzf
    api.ready = function (callback){
        if(SUI.store.useFlash){
            (function(){
                if(SUI.store.isReady){
                    callback.call(api);
                }else{
                    setTimeout(arguments.callee, 15);
                }
            })()
        }else{
            callback.call(api);
        }

    };
    
    if (localStorageName in win && win[localStorageName]) {
        storage    = win[localStorageName];
        api.set    = function (key, val) { storage.setItem(key, val) };
        api.get    = function (key)      { return storage.getItem(key) };
        api.remove = function (key)      { storage.removeItem(key) };
        api.clear  = function ()         { storage.clear() };
        api.isReady = true;

    } else if (globalStorageName in win && win[globalStorageName]) {
        storage    = win[globalStorageName][win.location.hostname];
        api.set    = function (key, val) { storage[key] = val };
        api.get    = function (key)      { return storage[key] && storage[key].value };
        api.remove = function (key)      { delete storage[key] };
        api.clear  = function ()         { for (var key in storage ) { delete storage[key] } };
        api.isReady = true;
    } else if (doc.documentElement.addBehavior) {
        api.swfReady = function(){
            api.isReady = true;
        }
        api.useFlash = true;
        api.cross = function(){return false};  // 配置跨域信息
        //api的 其他方法由flash 提供。
        api._get_browser = function(){
            var ua = navigator.userAgent.toLowerCase();
            if(window.ActiveXObject){return "ie"};
            if(/firefox/i.test(ua)){return "firefox"};
            if(/chrome/i.test(ua) && /webkit/i.test(ua) && /mozilla/i.test(ua)){return "chrome"};
            if(window.opera){return "opera"};
            if(window.openDatabase){return "safari"};
            return "other";
        }
        function flashChecker() {
            var hasFlash = 0; // 是否安装了flash
            var flashVersion = 0; // flash版本

            if (document.all) {
                try{
                    var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                    if (swf) {
                        hasFlash = 1;
                        VSwf = swf.GetVariable("$version");
                        flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
                    }
                }catch(ex){

                }
            } else {
                if (navigator.plugins && navigator.plugins.length > 0) {
                    var swf = navigator.plugins["Shockwave Flash"];
                    if (swf) {
                        hasFlash = 1;
                        var words = swf.description.split(" ");
                        for (var i = 0; i < words.length; ++i) {
                            if (isNaN(parseInt(words[i])))
                                continue;
                            flashVersion = parseInt(words[i]);
                        }
                    }
                }
            }
            return {
                hasFlash  : hasFlash,
                version   : flashVersion
            };
        }
        function loadSwf(){
            var scripts = document.getElementsByTagName('script');
            var swfFile = "";
            for(var i = 0, l = scripts.length; i < l; i++){
                if(/store\.js/.test(scripts[i].src)){
                    var src = scripts[i].src;
                    swfFile = src.replace(/[^/]*store\.js.*$/,'Rookie.swf');
                    break;
                }
            }


            if((/http:\/\//i).test(swfFile)&&swfFile.indexOf(window.location.host)==-1){api.cross=true;}

            swfFile+="?"+Math.floor(Math.random()*100000);

            var flash='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="1" height="1" id="rookieswf"><param name="movie" value="'+swfFile+'" /><param name="allowScriptAccess" value="always" /><embed src="'+swfFile+'" width="1" height="1" name="rookieswf" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" /></object>';
            var flashCont=document.createElement("div");
            function getSWF(movieName){
                if (window.document[movieName]){
                    return window.document[movieName];
                }else{
                    return document.getElementById(movieName);
                }
            }

            (function () {

                flashCont.innerHTML = flash;
                document.body.insertBefore(flashCont, document.body.firstChild);
                var obj = getSWF('rookieswf');
                //解决ie6下，$(document).ready中的方法执行时，flash未加载完成 2014-10 pzf
                (function () {
                    //假如没有安装flash
                    if (obj.set) {
                        api.set = function (key, val) {
                            obj.set(key, val);
                        }
                        api.get = function (key) {
                            return obj.get(key);
                        }
                        api.remove = function (key) {
                            obj.remove(key);
                        }

                        api.clear = function () {
                            obj.clear();
                        }
                        api.swfReady();
                    } else {
                        setTimeout(arguments.callee, 15);
                    }
                })()


            })();

        };
        $(function(){
            if(!flashChecker().hasFlash){
                alert("缓存组件依赖于Flash Play,请安装Flash Player。");
                return;
            }
            loadSwf();
        })

    }
    return api;
})();

/**
 * Created by pzf on 2014/11/10.
 */
if (typeof define === 'function' && define.amd) {
    define('store', [], function() {
        return this.SUI.store;
    });
}


