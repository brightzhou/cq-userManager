var nsrsbh;
var sbzlDm='10102';
var noData_hxzgSuccess = '<li><table cellpadding="0" cellspacing="0" width="100%" align="center"><tr><td width="100%" colspan="3" align="center"><span class="hui">您已成功申报过小规模增值税，但未使用本系统申报,故无法查询申报记录！</span></td></tr></table></li>';
var noData_hxzgFail = '<li><table cellpadding="0" cellspacing="0" width="100%" align="center"><tr><td width="100%" colspan="3" align="center"><span class="hui">暂无申报反馈数据</span></td></tr></table></li>';
var rowData= '<li><table cellpadding="0" cellspacing="0" width="100%" align="center"><tr><td width="5%" align="center"><span class="hui needLoadXh">1</span></td><td width="20%" align="center"><span class="hui needLoadSz">增值税</span></td><td width="20%" align="center"><span class="hui">{skssqq}<br />--<br />{skssqz}</span></td><td width="10%" align="center"><span class="hui">{sbrq}</span></td><td width="15%" align="center"><span class="hui">{sbse}</span></td><td width="25%" align="center"><span class="hui">{sbztms}</span></td> </tr></table></li>';
$(function(){
	init();
});

function init(){
	var sssqArray =getSssq(getSbny(),sbzlDm);

	var resultData = querySbfkxx(sssqArray[0],sssqArray[1],sbzlDm);
	var sbqkVO =resultData.data;
	if (sbqkVO == null) {
		mini.alert("征管查询异常，请稍后再试！");
		return;
	}
	$("#nsrmc").html("企业名称:"+resultData.total);
	if(sbqkVO.sbztDm == 'hxzgSuccess'){
		//TODO 您已成功申报过小规模增值税，但未使用本系统申报,故无法查询申报记录！
		$("#cxjg").append(noData_hxzgSuccess);
	}else if(sbqkVO.sbztDm == 'hxzgFail'){
		//TODO 提示未查询到您的申报记录
		$("#cxjg").append(noData_hxzgFail);
	}else if(sbqkVO.sbztDm == '0000'){
		//TODO 展现结果列表
		$("#cxjg").append(buildReplaceData(sbqkVO,rowData));
	}else {
		//TODO 展现结果列表
		$("#cxjg").append(buildReplaceData(sbqkVO,rowData));
	}
	return;
}


//temp模板 数据重组
function buildReplaceData(objData,temp){
	for(var key in objData){
		temp = temp.replace("{"+key+"}",objData[key]);
	}
	return temp;
}
