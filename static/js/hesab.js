!function ($) {
	
	//"use strict"; // jshint ;_;

  $(function(){
    $('section [href^=#]').click(function (e) {
      e.preventDefault()
    })
	
	var chart
	
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
                date, allH = [], allN = [];
                //var obj = jQuery.parseJSON(points)
                $.each(points, function(index, element) {			        
					alert(index)
			    })
                alert(points)

				for (var i = 0; i < points.length; i++) {
					//alert(points[i])
					var startDate = sql2js(points[i][0]) //.valueOf()
					//startDate.setHour(i * 2)
					var i1 = 0;
					if (points[i-1])
						i1 = (1000 * 60 * 60 * 6 * (i-1))
					points[i][0] = startDate.valueOf() + (1000 * 60 * 60 * 3 * i) - i1
					points[i][1] = points[i][1]/10
					var series = chart.series[0],
						shift = series.data.length > 20;					
								
					date = startDate.valueOf() //Date.parse(line[0] +' UTC');
					
					if (points[i][2] == 1) {
						allN.push([
							date,
							parseInt((points[i][1] * 10), 10)
						]);
					} else {
						allH.push([
							date,							
							parseInt((points[i][1]* 10), 10)
						]);
					}
				}	

				if (allN)
					chart.series[0].setData (allN);

				if (allH)
					chart.series[1].setData (allH);
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
                name: 'First',
                lineWidth: 4,
                marker: {
                    radius: 4
                }
            }, {
                name: 'Sec',
				lineWidth: 4,
                marker: {
                    radius: 4
                }
            }]
        });
        
        /*$.ajax({
			url: './data/',			
			data: { date_sum: 1, date_start: $('#startDate').html(), date_end: $('#endDate').html()},
			success: function(data) {
				$("#ntotal").html(data[0][0])
				$("#htotal").html(data[1][0])
				$("#alltotal").html(data[1][0] + data[0][0])
			},
			cache: false
		});

		$.ajax({
			url: './data/',
			dataType: 'json',
			data: { date_cat: 1, date_start: $('#startDate').html(), date_end: $('#endDate').html()},
			success: function(data) {				
				for (var i = 0; i < data[0].length; i++) {					
					$("#n-cat-costs").append("<td>" + data[0][i] + "</td>")
				};
				for (var i = 0; i < data[1].length; i++) {
					$("#h-cat-costs").append("<td>" + data[1][i] + "</td>")
				};
			},
			cache: false
		});*/
	})
  })
}(window.jQuery)