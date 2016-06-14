var loginInfo = {};
var browser={
    versions:function(){
        var u = navigator.userAgent, app = navigator.appVersion;
        return {         //移动终端浏览器版本信息
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1  //android终端
        };
    }(),
    language:(navigator.browserLanguage || navigator.language).toLowerCase()
};
/*
 移动端(ios,android)回调
 type 请求类型
 result 移动端返回的数据
 isSuccess 是否成功标志
 */

/*
    if(isSuccess == 'false'){
        alert("获取APP登录信息失败！");
    }else{
        if(type == "loginInfo"){
            if(result){
                loginInfo =  {
                    'ChannelId': result.ChannelId,
                    'djxh':result.djxh,
                    'nsrsbh':result.nsrsbh,
                    'userId':result.userId,
                    'SessionId':result.SessionId
                };
            }
            return loginInfo;
        }
    }
*/
/*
 移动端(ios,android)回调
 type 请求类型
 result 移动端返回的数据
 isSuccess 是否成功标志
 */

function nativeCallback(type,result,isSuccess) {
    if(this.resultCallback){
        this.resultCallback(type,result,isSuccess);
    }
}


/*
 根据type调用不同的本地方法,第二个参数为json数据(可不传),第三个参数为callback回调事件(可不传)
 type 请求类型
 json 给移动端的json数据
 resultCallback 完成后的回调
 */

function nativeFunction(type,json,resultCallback) {//此处根据传进来的type调用不同的本地方法,第二个参数为json数据,可不传
    this.resultCallback = resultCallback;
    if(browser.versions.android) { // 如果是android平台
        android.exec(type,json);
    } else if(browser.versions.ios) { // 如果是ios平台
        var content = '';
        if(json){
            content = '{"type":"'+type+'","argument":'+json+',"callback":""}';
        }else{
            content = '{"type":"'+type+'","argument":"","callback":""}';
        }
        document.location ="webkitpostnotification:"+content;
    }
}

