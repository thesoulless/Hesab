!function ($) {
	
	//"use strict"; // jshint ;_;

  $(function(){
    $('section [href^=#]').click(function (e) {
      e.preventDefault()
    })
	
	var chart
	
	var requestData = function() {
		$.ajax({
			url: './request.php',			
			data: { date_chart: 1, date_start: $('#startDate').html(), date_end: $('#endDate').html()},
			success: function(points) {
				var min = 100000000
				var max = 0
				
				var lines = [],
                listen = false,
                date, allH = [], allN = [];
                    
				for (var i = 0; i < points.length; i++) {
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
				//headerFormat: '<b>{series.name}</b><br />',
				//headerFormat: '<b>{point.key}</b><br />{series.name}<br />',
                //pointFormat: 'x = {point.x}, y = {point.y}'
            },
			/*
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function() {
                                hs.htmlExpand(null, {
                                    pageOrigin: {
                                        x: this.pageX,
                                        y: this.pageY
                                    },
                                    headingText: this.series.name,
                                    maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', this.x) +':<br/> '+
                                        this.y +' visits',
                                    width: 200
                                });
                            }
                        }
                    },
                    marker: {
                        lineWidth: 1
                    }
                }
            },*/

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
        
        $.ajax({
			url: './request.php',			
			data: { date_sum: 1, date_start: $('#startDate').html(), date_end: $('#endDate').html()},
			success: function(data) {
				$("#ntotal").html(data[0][0])
				$("#htotal").html(data[1][0])
				$("#alltotal").html(data[1][0] + data[0][0])
			},
			cache: false
		});

		$.ajax({
			url: './request.php',
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
		});
	})
  })
}(window.jQuery)

/*	
		chart = new Highcharts.StockChart({
			chart: {
				renderTo: 'dateChart',
				events: {
					load: requestData
				}
			},			
			rangeSelector : {
				buttons: [{
					type: 'day',
					count: 1,
					text: '1d'
				}, {
					type: 'month',
					count: 1,
					text: '1m'
				}, {
					type: 'month',
					count: 3,
					text: '3m'
				}, {
					type: 'month',
					count: 6,
					text: '6m'
				}, {
					type: 'year',
					count: 1,
					text: '1y'
				}, {
					type: 'all',
					text: 'All'
				}],
                selected : 5
            },
			title: {
				text: 'Costs'
			},
			xAxis: {
				type: 'Cost',
				tickPixelInterval: 100,
				maxZoom: 60 * 60 * 60 * 6 * 1000
			},
			yAxis: {				
				minRange: 100,
				min : 0,				
				title: {
					text: 'Cost / 10',
					margin: 80
				}
			},
			credits: {
				enabled: true,
				href: "http://www.soulless.ir/",
				text: "Soulless"
			},
			
			series: [{
				name: 'Value',
				
				data: []
			}]
			
			,
			series: [{
				name: 'Tokyo',
				data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
			}, {
				name: 'New York',
				data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
			}, {
				name: 'Berlin',
				data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
			}, {
				name: 'London',
				data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
			}]
			
			
			chart = new Highcharts.Chart({
			chart: {
				renderTo: 'dateChart',
				type: 'line',
				marginRight: 130,
				marginBottom: 25
			},
			title: {
				text: 'Pays',
				x: -20 //center
			},
			xAxis: {
				categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
					'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
			},
			yAxis: {
				title: {
					text: 'Cost'
				},
				plotLines: [{
					value: 0,
					width: 1,
					color: '#808080'
				}]
			},
			tooltip: {
				formatter: function() {
						return '<b>'+ this.series.name +'</b><br/>'+
						this.x +': '+ this.y +'°C';
				}
			},
			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'top',
				x: -10,
				y: 100,
				borderWidth: 0
			},
			series: [{
				name: 'Tokyo',
				data: [(10000, 7.0), 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
			}, {
				name: 'New York',
				data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
			}, {
				name: 'Berlin',
				data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
			}, {
				name: 'London',
				data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
			}]
		});
		})*/