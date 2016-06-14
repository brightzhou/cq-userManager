var grid;

$(function() {
  grid = mini.get("gridData");
//  grid.load();
});


var doQuery = function(){
	debugger;
	var form = new mini.Form("#searchForm");
	var validate = form.validate();
	if(validate){
		var data = form.getData();
		var json = mini.encode(data);
		grid.setUrl("/api/sscx/fpmx");
		grid.load({"jsonStr":json});
	}
};

var onRenderer = function(e){
	var record = e.record;
	var state = record.kjqk;
	if(state == 0){
		return "正常开具";
	}else if(state == 1){
		return "红字发票";
	}else if(state == 2){
		return "作废发票";
	}else{
		return "其它";
	}
};