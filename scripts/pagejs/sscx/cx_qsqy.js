var grid;

$(function() {
  grid = mini.get("gridData");
//  grid.load();
});


var doQuery = function(){
	var form = new mini.Form("#searchForm");
	var validate = form.validate();
	if(validate){
		var data = form.getData();
		var json = mini.encode(data);
		grid.setUrl("/api/sscx/qsqy");
		grid.load({"jsonStr":json});
	}
};
var onRenderer = function(e){
	var record = e.record;
	var state = record.qfzt;
	if(state == 1){
		return "是";
	}else{
		return "否";
	}
};