(function ($,window) {
            if (!$) return false;
            var show,setup;

           show=function (opt) {
               var opts = {
                    showmodal:true,
                    content: "",
                    msgType: "",
                    btn1: "提交",
                    btn1fn:null,
                    btn2: "取消",
                    btn2fn: null,
                    tiptype:null
                   
                };
                opts = $.extend(opts, opt);
               
                $("#msgbox").remove();
                var msgobj = $(setup());

                msgobj.find("#msgcontent").html(opts.content);
                if (!opts.showmodal) { msgobj.removeClass("msg-box-gb"); }
                if (opts.btn1 == null) {
                    msgobj.find("#msgbtn1").remove();
                } else {
                    msgobj.find("#msgbtn1").html(opts.btn1);
                }

                if (opts.btn2 == null) {
                    msgobj.find("#msgbtn2").remove();
                } else {
                    msgobj.find("#msgbtn2").html(opts.btn2);
                }
               
                if (opts.btn1fn != null && typeof opts.btn1fn === "function") {
                    msgobj.find("#msgbtn1").bind("click", function () {
                        opts.btn1fn();
                        close();
                    });
                }

                if (opts.tiptype != null) {
                    msgobj.find("#msgicon").addClass(opts.tiptype);
                } else {
                    msgobj.find("#msgicon").hide();
                }
                
                    msgobj.find("#msgbtn2").bind("click", function () {
                        if (opts.btn2fn != null && typeof opts.btn2fn === "function") { opts.btn2fn(); }
                        close();
                    });
                $("body").append(msgobj);
            };
           close = function () {
               $("#msgbox").remove();
           }
           setup = function () {

               var str = str + '<div class="msg-box msg-box-gb" id="msgbox">';
               str = str + '<div class="ub ub-ver box-1">';
               str = str + '<div class="ub-f1"></div>';
               str = str + '<div class="box-2">';
               str = str + '<div class="msg-box-title">提示</div>';
               str = str + '<div class="msg-box-body ub"><div id="msgicon" class="msg-icon "></div><div id="msgcontent" class="content ub-f1"></div></div>';
               str = str + '<div class="msg-box-footer ub">';
               str = str + '<div class="ub-f1"></div>';
               str = str + '<div class="msg-box-btn btn1" id="msgbtn1">提交</div>';
               str = str + '<div class="msg-box-btn btn2" id="msgbtn2">取消</div>';
               str = str + '<div class="ub-f1"></div>';
               str = str + '</div>';
               str = str + '</div>';
               str = str + '<div class="ub-f1"></div>';
               str = str + '</div>';
               str = str + '</div>"';
               return str;
           }

            var msgBox = {
                show: show,
                close:close,
            }
           
            if (typeof define === 'function' && define.amd) {
                define(msgBox);
            } else {
                window.msgBox = msgBox;
            }

        })(window.jQuery, window);