!function ($) {
	
	//"use strict"; // jshint ;_;

  $(function(){
    $('section [href^=#]').click(function (e) {
      e.preventDefault();
    })
	
	var chart;
	
	var requestData = function() {
		$.ajax({
			url: '/data/',
			crossDomain: false,
			type: 'post',
			data: { date_chart: 1, date_start: $('#startDate').html(), date_end: $('#endDate').html()},
			success: function(points) {
				var min = 100000000
				var max = 0
				
				var lines = [],
                listen = false,
                date, first = [], second = [];

                
                //var prev = 0
                var _points = []
                var firstName, secondName

                $.each(points.costs1, function(index, element) {
                	var startDate = sql2js(element.date)
					firstName = element.name

					var i1 = 0
					if (index > 0)
						i1 = (1000 * 60 * 60 * 6 * (index-1) )

					_points[index] = []
					_points[index][0] = startDate.valueOf() + (1000 * 60 * 60 * 3 * index) - i1
					_points[index][1] = element.sum/10					
								
					date = startDate.valueOf()
					
					first.push([
						date,
						parseInt((_points[index][1] * 10), 10)
					]);

                })

                _points = []

                $.each(points.costs2, function(index, element) {                
                	var startDate = sql2js(element.date)
                	secondName = element.name

					var i1 = 0
					if (index)
						i1 = (1000 * 60 * 60 * 6 * (index-1) )					

					_points[index] = []
					_points[index][0] = startDate.valueOf() + (1000 * 60 * 60 * 3 * index) - i1
					_points[index][1] = element.sum/10
								
					date = startDate.valueOf()
					
					second.push([
						date,							
						parseInt((_points[i][1]* 10), 10)
					]);

                })


                chart.series[0].name = firstName
                chart.series[1].name = secondName

				if (first)
					chart.series[0].setData (first);

				if (second)
					chart.series[1].setData (second);

				var series = chart.series[0];
				chart.shift = series.data.length > 20;

				$(chart.legend.allItems[0].legendItem.element.childNodes).text(firstName)
                $(chart.legend.allItems[1].legendItem.element.childNodes).text(secondName)
			},

			cache: false
		});
	}
	
	var sql2js = function(timestamp) {
		var regex=/^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9]) (?:([0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/		
		timestamp = '' + timestamp + '';
		//alert(timestamp);
		var parts = timestamp.replace(regex,"$1 $2 $3 $4 $5 $6").split(' ')
		//alert(parts[0])
		return new Date(parts[0])
	}
	
	$('#showDateChart').click(function(e)  {
		chart = new Highcharts.Chart({
    
            chart: {
                renderTo: 'dateChart',
				events: {
					load: requestData
				}
            },
    
            title: {
                text: 'Daily Pays'
            },
			
            subtitle: {
                text: 'Beta'
            },
    
            xAxis: {
                type: 'datetime',
                //tickInterval: 7 * 24 * 3600 * 1000, // one week
				tickInterval: 24 * 3600 * 1000, // one day
                tickWidth: 0,
                gridLineWidth: 1,
                labels: {
                    align: 'left',
                    x: 3,
                    y: -3
                }
            },
    
            yAxis: [{ // left y axis
                title: {
                    text: 'Cost'
                },
                labels: {
                    align: 'left',
                    x: 3,
                    y: 16,
                    formatter: function() {
                        return Highcharts.numberFormat(this.value, 0);
                    }
                },
                showFirstLabel: false
            }, { // right y axis
                linkedTo: 0,
                gridLineWidth: 0,
                opposite: true,
                title: {
                    text: null
                },
                labels: {
                    align: 'right',
                    x: -3,
                    y: 16,
                    formatter: function() {
                        return Highcharts.numberFormat(this.value, 0);
                    }
                },
                showFirstLabel: false
            }],
    
            legend: {
                align: 'left',
                verticalAlign: 'top',
                y: 20,
                floating: true,
                borderWidth: 0
            },
    
            tooltip: {
                shared: true,
                crosshairs: true,				
            },			

    	    credits: {
		enabled: true,
		href: "http://www.soulless.ir/",
		text: "Soulless"
	    },
    
            series: [{
                //name: 'First',
                lineWidth: 4,
                marker: {
                    radius: 4
                }
            }, {
                //name: 'Sec',
				lineWidth: 4,
                marker: {
                    radius: 4
                }
            }]
        });


		$.ajax({
			url: '/data/',
			crossDomain: false,
			type: 'post',
			data: { date_sum: 1, date_start: $('#startDate').html(), date_end: $('#endDate').html()},
			success: function(data) {				
				$("#ntotal").html(data.first_sum)
				$("#htotal").html(data.second_sum)
				$("#alltotal").html(data.first_sum + data.second_sum)
			},
			cache: false
		});

		$.ajax({
			url: '/data/',
			crossDomain: false,
			type: 'post',
			//dataType: 'json',
			data: { date_cat: 1, date_start: $('#startDate').html(), date_end: $('#endDate').html()},
			success: function(data) {
				$('#h-cat-costs td:not(:first)').remove()
				$('#n-cat-costs td:not(:first)').remove()
				$.each(data.second_cats, function(index, element) {
					$.each(element, function(index2, element2) {
						$("#n-cat-costs").append("<td>" + element2 + "</td>")
					})
				})

				$.each(data.first_cats, function(index, element) {
					$.each(element, function(index2, element2) {
						$("#h-cat-costs").append("<td>" + element2 + "</td>")
					})
				})				
			},
			cache: false
		});
        
	})
  })
}(window.jQuery)