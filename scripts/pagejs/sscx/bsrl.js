function init(year) {
  $.ajax({
    url: "/api/sscx/queryBsrl",
    type: "post",
    data: { nd: year },
    success: function(text) {
      var jsonObj = mini.decode(text);
      if (jsonObj.success) {
        var data = jsonObj.value;
        setData(data);
      } else {
        alert("没有查询到数据");
      }
    },
    error: function(text) {
      alert("请求出错");
    }
  });

}

function setData(data) {
  var html = "";
  data = mini.decode(data);
  for (var i = 0; i < data.length; i++) {
    var arr = data[i];
    var styleStr = "";
    var mm = i + 1;
    if (mm % 2 != 0) {
      styleStr = '<TD ' +
        'style="BORDER-BOTTOM: windowtext 1pt solid; BORDER-LEFT: windowtext 1pt solid; PADDING-BOTTOM: 0cm; PADDING-LEFT: 5.4pt; WIDTH: 118.55pt; PADDING-RIGHT: 5.4pt; BORDER-TOP: medium none; BORDER-RIGHT: windowtext 1pt solid; PADDING-TOP: 0cm"' +
        'width=158   id="yuefen" rowspan=2> ' +
        '  <P class=MsoNormal>' + arr.yf + '月</P> ' +
        '</TD> ';
    }

    var tr = '<TR style="PAGE-BREAK-INSIDE: avoid">' +
      styleStr +
      '<TD ' +
      'style="BORDER-BOTTOM: windowtext 1pt solid; BORDER-LEFT: medium none; PADDING-BOTTOM: 0cm; PADDING-LEFT: 5.4pt; WIDTH: 18.95pt; PADDING-RIGHT: 5.4pt; BORDER-TOP: medium none; BORDER-RIGHT: windowtext 1pt solid; PADDING-TOP: 0cm" ' +
      'vAlign=top width=25> ' +
      '  <P class=MsoNormal>' + arr.zsqbz + '</P></TD> ' +
      '<TD ' +
      'style="BORDER-BOTTOM: windowtext 1pt solid; BORDER-LEFT: medium none; PADDING-BOTTOM: 0cm; PADDING-LEFT: 5.4pt; WIDTH: 132.8pt; PADDING-RIGHT: 5.4pt; BORDER-TOP: medium none; BORDER-RIGHT: windowtext 1pt solid; PADDING-TOP: 0cm" ' +
      'vAlign=top width=177> ' +
      '  <P class=MsoNormal>' + arr.zzsandxfsZsq + '</P> ' +
      '</TD> ' +
      '<TD ' +
      'style="BORDER-BOTTOM: windowtext 1pt solid; BORDER-LEFT: medium none; PADDING-BOTTOM: 0cm; PADDING-LEFT: 5.4pt; WIDTH: 72pt; PADDING-RIGHT: 5.4pt; BORDER-TOP: medium none; BORDER-RIGHT: windowtext 1pt solid; PADDING-TOP: 0cm" ' +
      'vAlign=top width=96> ' +
      '  <P class=MsoNormal>' + arr.qysdsZsq + '</P>  ' +
      '</TD> ' +
      '<TD ' +
      'style="BORDER-BOTTOM: windowtext 1pt solid; BORDER-LEFT: medium none; PADDING-BOTTOM: 0cm; PADDING-LEFT: 5.4pt; WIDTH: 90pt; PADDING-RIGHT: 5.4pt; BORDER-TOP: medium none; BORDER-RIGHT: windowtext 1pt solid; PADDING-TOP: 0cm" ' +
      'vAlign=top width=120> ' +
      '  <P class=MsoNormal>' + arr.grsdsZsq + '</P>  ' +
      '</TD>' +
      '</TR>';

    html = html + tr;

  }
  $("#TBODY").append(html);
}
window.onload = function() {
  var date = new Date();
  var year = date.getFullYear();
  $("#nd1").append(year);
  $("#nd2").append(year);
  $("#nd3").append(year);
  init(year);
};
