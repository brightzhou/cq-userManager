/**========下一步iframe框架=========*/
StepNav = function() {
  "use strict";
  //  StepNav对象的副本
  var stepNavObj = null;
  var dts = [];
  var objul = "";
  var setup = {
      makeLi: function(obj) {
        var html = "";
        for (var i = 0; i < dts.length; i++) {
          html += ' <li class="wizard-steps  ' + (i == 0 ? " stepstart" : "") + '  ' + (i == dts.length - 1 ? "stepend" : "") + '  "><span class="ok">.</span><span class="step">' + (i + 1) + '</span><span class="title">' + dts[i].text + '</span></li>';
        }
        $(obj).empty().append(html);
        _setStep(0);
      }
    }
    //obj:渲染的标签，data：传入的数据
  var _init = function(id, data, stepNav) {
    var ulId = "#" + id;
    dts = data;
    objul = ulId;
    setup.makeLi(ulId);
    if (!!stepNav) {
      stepNavObj = stepNav;
    }
    //      将 完结 按钮 进行隐藏 
    var close = $('#close');
    if (!!close) {
      close.hide();
      close.click(function() {
        parent.$('body').trigger('close.frame.dialog');
      });
    }
    $('#cancel').click(function() {
      parent.$('body').trigger('close.frame.dialog');
    });
    //绑定下一步操作
    var stepnext = $('#stepnext');
    if (!!stepnext) {
      stepnext.click(function() {
        _nextStep();
        if (_lastStep()) {
          //将下一步 改成 提交
          $(this).html("<span class=\"mini-button-text  mini-button-icon ico-next pngbg\">下一步</span>");
        }
        if (_closeStep()) {
          //完结步骤操作按钮
          $("#close").show();
          $("#stepnext,#stepprev,#cancel").hide();
        }
      });
    }

    //


    //    绑定上一步操作
    var stepprev = $("#stepprev");
    if (!!stepprev) {
      stepprev.click(function() {
        _prevStep();
        if (!_lastStep()) {
          //将下一步 改成 提交
          $("#stepnext").html("<span class=\"mini-button-text  mini-button-icon ico-next pngbg\">下一步</span>");
        }
      });
    }

  }

  var _getCurrentStep = function() {
    var objs = $(objul).find("li");
    return objs.index($(objul).find(".current"));
  }

  var _setStep = function(stepnum) {
    var objs = $(objul).find("li");
    objs.removeClass("stepsover").removeClass("current");
    objs.eq(stepnum).addClass("current").addClass("stepsover");
    objs.eq(stepnum).prevAll().addClass("stepsover");
    objs.eq(stepnum).nextAll().removeClass("stepsover");
    $("#content iframe").hide();
    if ($("#content .stepcontent" + stepnum).length == 0) {
      //            var frameId = "stepcontent" + stepnum;
      var frameId = dts[stepnum].id;
      $("#content").append('<iframe  class="stepcontent' + stepnum + '" src="' + dts[stepnum].url + '" width="100%" height="100%" frameborder="0" id="' + frameId + '"></iframe>');
    } else {
      $(".stepcontent" + stepnum).show();
    }
  }

  var _nextStep = function() {
    var messageid = mini.loading("数据加载中...", "提示");
    var c = _getCurrentStep();
    if (c == dts.length - 1) {
      mini.hideMessageBox(messageid);
      return;
    }
    var iframe = _getIFrameByStep(c);
    //1.校验当前页面数据
    if (!!iframe.validate) {
      //校验不通过则不进行下一步
      if (!iframe.validate()) {
        mini.hideMessageBox(messageid);
        return;
      }
    }
    var isGoNext = true;
    //校验通过之后，在调用 doRediect方法  ， 可以做一些  操作，比如控制跳转的路径，
    //此方法中如果需要进行异步调用，并且需要有返回结果才能够跳转到下一个页面，请将返回值 设置为false 或者是"N"，
    //并将下一步的回调函数传给对方，有结果后可以调用进行下一步
    if (!!iframe.changeStepPage) {
      var result = iframe.changeStepPage(stepNavObj, goNextPage);
      if (result == false || "N" == result) { //此处如果返回的是false 或者是"N"
        isGoNext = false;
      }
    }

    if (isGoNext === false) {
      mini.hideMessageBox(messageid);
      return;
    }
    mini.hideMessageBox(messageid);
    goNextPage(iframe, c);

    function goNextPage() { //currentFrame, currentStep


      // 要先执行下一步
      _setStep(c + 1);
      var nextiframe = _getIFrameByStep(c + 1);
      if (_isInitOver(nextiframe)) { // 如果已经加载完成，直接调用doInitData方法
        // 如果是已经加载完成的，说明是点击上一步骤进入的。
        _callDoInitData(iframe, nextiframe, true);

      } else {
        // 如果页面没有加载，则绑定
        $("#" + dts[c + 1].id).bind("load", [iframe, nextiframe, false], _doOnload);
      }
    }

  }

  var _prevStep = function() {
    var c = _getCurrentStep();
    if (c == 0) {
      return;
    }
    _setStep(c - 1);
  }

  var _lastStep = function() {
    var c = _getCurrentStep();
    if (c == dts.length - 2) {
      return true;
    }
    return false;
  }

  var _closeStep = function() {
    var c = _getCurrentStep();
    if (c == dts.length - 1) {
      return true;
    }
    return false;
  }

  var _getIFrameById = function(frameId) {
      var iframeObj = $('#' + frameId);
      //      如果未有此元素，就返回null
      if (!!iframeObj[0]) {
        return iframeObj[0].contentWindow;
      }
      return null;
    }
    /**
     * 根据stepNum获取页面对象
     */
  var _getIFrameByStep = function(stepNum) {
    //        var frameId = "stepcontent" + stepNum;
    var frameId = dts[stepNum].id;
    return _getIFrameById(frameId);
  }



  /**
   * 获取 当前步骤 向前 后退count步的页面对象
   */
  var _getByCurrStepBack = function(count) {
    //      获取当前所在的步骤
    var step = parseFloat(_getCurrentStep());
    var c = Math.abs(parseFloat(count));
    if (step - c < 0) {
      return;
    }
    return _getIFrameByStep(step - c);
  }



  /**
   * 重新设置步骤stepNum的页面url
   */
  var _setLoadUrl = function(stepNum, loadUrl) {
    if (dts[stepNum].url == loadUrl) {
      return;
    }
    dts[stepNum].url = loadUrl;
    if ($("#content .stepcontent" + stepNum).length > 0) {
      $("#content .stepcontent" + stepNum).remove();
    }
  }

  var _reloadIFrame = function(stepNum) {
    if ($("#content .stepcontent" + stepNum).length > 0) {
      $("#content .stepcontent" + stepNum).remove();
    }
  }

  /**
   * 调用doInitData方法
   */
  var _callDoInitData = function(curiframe, nextiframe, isClickPreviousStepInto) {
    if (!!nextiframe.doInitData) {
      var messageid = mini.loading("页面加载中，请稍后 ...", "加载中");
      mini.parse();
      nextiframe.doInitData(curiframe, stepNavObj, isClickPreviousStepInto);
      mini.hideMessageBox(messageid);
    }
  }

  var _doOnload = function(event) {
    _callDoInitData(event.data[0], event.data[1], event.data[2]);
  }

  /**
   * 判断页面iframeObj 是否加载完毕
   */
  var _isInitOver = function(iframeObj) {
      if (iframeObj.document.readyState == 'complete' && iframeObj.document.URL != 'about:blank') {
        return true;
      }
      return false;
    }
    /**
     * 隐藏页面按钮
     */

  var _hidePageButton = function() {
    //隐藏其他按钮，关闭按钮出现
    var close = $("#close");
    if (!!close) {
      close.show();
    }
    //       下一步 隐藏
    var stepnext = $("#stepnext");
    if (!!stepnext) {
      stepnext.hide();
    }
    //       上一部隐藏
    //       $("#stepnext").hide();
    var stepprev = $("#stepprev");
    if (!!stepprev) {
      stepprev.hide();
    }
    //      “ 取消”隐藏
    //       $("#stepprev").hide();
    var cancel = $("#cancel");
    if (!!cancel) {
      cancel.hide();
    }
    //       $("#cancel").hide();
  }

  //  增加一个节点
  //  将一个步骤增加到第step个节点中
  var _addNode2Step = function(step, array) {

    //      如果已经存在该节点就不再重新增加该节点
    var text = dts[step].text;
    var url = dts[step].url;
    if (text == array.text && url == array.url) {
      //        alert("数值相同不要增加");
      return;
    }


    var i = dts.length;
    _addNewElement2Step(step, array);

    //      将step后面的所有已经展现的节点全部清除，重新加载
    while (i >= step) {
      _removePageContent(i);
      i--;
    }
    setup.makeLi(objul);
  }

  /**
   * 添件新的元素到数组中
   */
  function _addNewElement2Step(step, newElement) {
    dts.splice(step, 0, newElement);
  }

  /**
   * 删除元素
   */
  var _removeNode4Step = function(step) {
    var length = dts.length;
    //      移除第几个元素
    dts.splice(step, 1);
    //      将此元素后面的已经加载的节点全部删除
    while (length >= step) {
      _removePageContent(length);
      length--;
    }
    setup.makeLi(objul);
  }

  //  删除页面中的节点
  var _removePageContent = function(i) {
    if ($("#content .stepcontent" + i).length > 0) {
      $("#content .stepcontent" + i).remove();
    }
  }

  //  判断步骤中中是否已经存在 一个 要执行的步骤， 如果存在将其删除
  var _removeNode4Exist = function(step, element) {
      if (!_isExistNode(step, element)) {
        return;
      }

      _removeNode4Step(step);
    }
    /**
     * 判断是不是存在节点  需要一个json对象
     */
  var _isExistNode = function(step, element) {
    //      如果已经存在该节点就不再重新增加该节点
    var text = dts[step].text;
    var url = dts[step].url;
    if (text == element.text && url == element.url) {
      return true;
    }
    return false;
  }

  /**
   * 提交的方法
   * @param url  提交的url
   * @param param  传递的参数
   * @param confirmSm 免责声明
   * @param callback  回调函数
   * @private
   */
  var _doSubmit = function(url, param, confirmSm, callback) {

    mini.prompt("请输入经办人手机号码：", "请输入",
      function(action, value) {
        if (action == "ok") {
          var re = new RegExp("^[0-9\-]{11}$");
          if (!!value && re.test(value)) {
            param["yhdhhm"] = value;
            doRelSubmit(url, param, confirmSm, callback);
          } else {
            mini.alert("请输入正确的11位手机号码");
          }
        }
      }
    );
  }

  function doRelSubmit(url, param, confirmSm, callback) {
    if (!!!confirmSm) {
      confirmSm = "我司所填写、上传资料均是真实的、可靠的、有效的。";
    }

    mini.confirm(confirmSm, "免责声明", function(action) {
      if (action == "ok") {
        var messageid = mini.loading("提交中, 请稍等 ...", "提交中");
        $.ajax({
          type: "POST",
          url: url,
          data: param,
          async: true,
          success: function(data) {
            mini.hideMessageBox(messageid);
            var returnData = mini.decode(data);
            if (!returnData.success) {
              mini.alert(returnData.message);
            } else {

              _slday = returnData.data.blsx;

              if (!!callback) {
                callback(returnData);
                return;
              }
              _hidePageButton();
              //提交需要手工控制跳转的页面
              _setStep(parseInt(_getCurrentStep()) + 1);
            }
          },
          error: function(e) {
            mini.alert("发生异常信息:" + e.message);
            mini.hideMessageBox(messageid);
          }
        });
      }
    });
  }

  return {
    init: _init, //设定参数
    setStep: _setStep, //设定当前需要跳到第几步
    getCurentNum: _getCurrentStep, //获取当前步骤
    nextStep: _nextStep, //执行下一步
    prevStep: _prevStep, //执行上一步
    lastStep: _lastStep, //判断是否最后一步
    getIFrameByStep: _getIFrameByStep, //根据步骤取iframe
    getIFrameById: _getIFrameById,
    setLoadUrl: _setLoadUrl, //改变步骤的跳转路径
    addNode2Step: _addNode2Step, //动态添加步骤
    remove4Step: _removeNode4Step, // 删除一个步骤
    removeNode4Exist: _removeNode4Exist, //删除一个和 step 的内容是element相同的步骤
    getByCurrStepBack: _getByCurrStepBack, //获取  当前步骤起， 向后数第count个 步的  页面对象

    doSubmit: _doSubmit,
    hidePageButton: _hidePageButton,
    reloadIFrame: _reloadIFrame,
    doRelSubmit: doRelSubmit
  }
}
