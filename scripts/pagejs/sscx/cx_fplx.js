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
		grid.setUrl("/api/sscx/fplx");
		grid.load({"jsonStr":json});
	}
};