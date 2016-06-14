
function research(){
	$.ajax({
		url: "/api/sscx/queryNsxydj",
		type: "post",
		data: {nsrsbh:"2016"},
		success: function(text) {
			var jsonObj = mini.decode(text);
			if(jsonObj.success && jsonObj.value.length != 0){
				var data = jsonObj.value.resultList;
				$("#nsrsbh1").text(data[0].nsrsbh);
				$("#nsrmc").text(data[0].nsrmc);
				$("#nsxydj").text(data[0].nsxydj);
			}else{
				alert("没有查询到数据");
			}
		},
		error: function(text) {
			alert("请求出错");
		}
	});

}

