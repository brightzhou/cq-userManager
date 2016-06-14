/**
 * @description 文件上传js
 */

// 错误队列
var queueErrorArray;

var fileSwfUpload;

$(function() {
  fileSwfUpload = new SWFUpload(getAppSettingObj());
});

function getAppSettingObj() {
  return {
    upload_url: '/api/uploadFile',
    flash_url: '../../scripts/swfupload/Flash/swfupload.swf',
    file_post_name: 'Filedata',
    use_query_string: true,
    post_params: {
      fileType: 'appFile'
    },

    file_types: '*.jpg;*.png;*.bmp',
    file_types_description: '图片',
    file_size_limit: '10 MB',
    file_upload_limit: 2,

    // handlers
    file_dialog_start_handler: fileDialogStart,
    file_queued_handler: fileQueued,
    file_queue_error_handler: fileQueueError,
    file_dialog_complete_handler: fileDialogComplete,
    upload_start_handler: uploadStartup,
    upload_progress_handler: uploadProgress,
    upload_success_handler: uploadSuccess,
    upload_complete_handler: uploadComplete,

    button_placeholder_id: 'appUploadButton',
    button_text: '上传文件',
    button_text_style:"color: #333",
    button_width: 60,
    button_height: 26,
    button_text_left_padding: 4,
    button_text_top_padding: 7,
    button_cursor: SWFUpload.CURSOR.HAND,
    button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,

    debug: false,

    custom_settings: {}
  }
}

//========================================  回调函数Handlers  ===================================

/**
 * 打开文件选择对话框时响应
 */
function fileDialogStart() {
  if (queueErrorArray) {
    queueErrorArray = null;
  }
}

/**
 * 文件被加入上传队列时的回调函数,增加文件信息到列表并自动开始上传.<br />
 * <p></p>
 * SWFUpload.startUpload(file_id)方法导致指定文件开始上传,
 * 如果参数为空,则默认上传队列第一个文件;<br />
 * SWFUpload.cancelUpload(file_id,trigger_error_event)取消指定文件上传并从队列删除,
 * 如果file_id为空,则删除队列第一个文件,trigger_error_event表示是否触发uploadError事件.
 * @param file 加入队列的文件
 */
function fileQueued(file) {
  /* var _swfUpload = this;
   var listItem = '<div id="' + file.id + '">';
   listItem += '<em class="fileName" >' + file.name + '</em>('
           + Math.round(file.size / 1024.0 / 1024.0) + ' MB)';
   listItem += '<span class="progressValue"></span>'
           + '<div class="progressBar"><div class="progress"></div></div>'
           + '<span class="status" >上传中...</span>'
           + '<span class="cancel" >&nbsp;</span>' + '</div>';
   $("#appUploadLog").html('');
   $("#appUploadLog").append(listItem);
   $("div#" + file.id + " .cancel").click(function(e) {
               _swfUpload.cancelUpload(file.id);
               $("div#" + file.id).slideUp('fast');
           })*/
	//this.startUpload();
}

/**
 * 文件加入上传队列失败时触发,触发原因包括:<br />
 * 文件大小超出限制<br />
 * 文件类型不符合<br />
 * 上传队列数量限制超出等.
 * @param file 当前文件
 * @param errorCode 错误代码(参考SWFUpload.QUEUE_ERROR常量)
 * @param message 错误信息
 */
function fileQueueError(file, errorCode, message) {
  if (!queueErrorArray) {
    queueErrorArray = [];
  }
  var errorFile = {
    file: file,
    code: errorCode,
    error: ''
  };
  switch (errorCode) {
    case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
      errorFile.error = '文件大小超出限制'+ this.settings.file_size_limit +'';
      break;
    case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
      errorFile.error = '文件类型受限('+this.settings.file_types+')';
      break;
    case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
      errorFile.error = '文件为空文件';
      break;
    case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
      errorFile.error = '超出文件数量限制'+this.settings.file_upload_limit+'个';
      break;
    default:
      alert('加载入队列出错.');
      break;
  }
  queueErrorArray.push(errorFile);
}

/**
 * 选择文件对话框关闭时触发,报告所选文件个数、加入上传队列文件数及上传队列文件总数
 * @param numSelected 选择的文件数目
 * @param numQueued 加入队列的文件数目
 * @param numTotalInQueued 上传文件队列中文件总数
 */
function fileDialogComplete(numSelected, numQueued, numTotalInQueued) {
  //var swfupload = this;
  if (queueErrorArray && queueErrorArray.length) {
    mini.alert(queueErrorArray[0].error);
  } else {
	  this.startUpload(); 
  }
 
	
}

/**
 * 文件开始上传时触发
 * @param file 开始上传目标文件
 */
function uploadStartup(file) {
  if (file) {
    this.setPostParams({
      'fileName': encodeURIComponent(file.name)
    });
    /*$('#appUploadLog').show();
    $("#logList li#" + file.id).find('p.status').text('上传中...');
    $("#logList li#" + file.id).find('p.progressValue').text('0%');*/
  }
}

/**
 * 文件上传过程中定时触发,更新进度显示
 * @param file 上传的文件
 * @param bytesCompleted 已上传大小
 * @param bytesTotal 文件总大小
 */
function uploadProgress(file, bytesCompleted, bytesTotal) {
  /* var percentage = Math.round((bytesCompleted / bytesTotal) * 100);
   $("#appUploadLog div#" + file.id).find('div.progress').css('width',
           percentage + '%');
   $("#appUploadLog div#" + file.id).find('span.progressValue').text(percentage
           + '%');*/
}

/**
 * 文件上传完毕并且服务器返回200状态码时触发
 * @param file 上传的文件
 * @param serverData 
 * @param response
 */
function uploadSuccess(file, serverData, response) {
  var path = mini.decode(serverData).value;
  var uploadPath = mini.get('uploadPath').getValue();
  mini.get('uploadPath').setValue(path);
  if(uploadPath == ""){
	  mini.get('uploadPath').setValue(path);
  }else{
	  mini.get('uploadPath').setValue(uploadPath+";"+path);
  }
  $("#tsxx").text("图片上传成功");
  
 /* var item = $("#appUploadLog");
  item.find('div.progress').css('width', '100%');
  item.find('span.progressValue').css('color', 'blue').text('100%');

  item.addClass('success').find('span.status').html('上传完成!');*/
}

/**
 * 在一个上传周期结束后触发(uploadError及uploadSuccess均触发)
 * 在此可以开始下一个文件上传(通过上传组件的uploadStart()方法)
 * @param file 上传完成的文件对象
 */
function uploadComplete(file) {
	 try {   
		 /*  I want the next upload to continue automatically so I'll call startUpload here */  
		 if (this.getStats().files_queued > 0) {   
		    this.startResizedUpload(this.getFile(0).ID, 500, 500, SWFUpload.RESIZE_ENCODING.JPEG, 500);   
		 } else {   
		    var progress = new FileProgress(file,  this.customSettings.upload_target);   
		    progress.setComplete();   
		    progress.setStatus("All images received.");   
		    progress.toggleCancel(false);   
		 }   
	  } catch (ex) {   
		 this.debug(ex);   
	 }   

}