$(function() {
  Form.Max();
  //左侧菜单
  $("#menuList").find("a").on("click", function() {
    $(this).addClass('front-icon color-bg').parent().siblings().children("a").removeClass('front-icon color-bg');
  });
  $('#chartData').highcharts({
    title: {
      text: '发票领用情况'
    },
    xAxis: {
      categories: ['201601', '201602', '201603', '201604', '201605']
    },
    series: [{
      type: 'column',
      name: '月份',
      data: [2, 3, 5, 7, 6]
    },{
      type: 'spline',
      name: 'Average',
      data: [3, 2.67, 3, 6.33, 3.33],
      marker: {
        lineWidth: 2,
        lineColor: Highcharts.getOptions().colors[3],
        fillColor: 'white'
      }
    }]
  });
});
