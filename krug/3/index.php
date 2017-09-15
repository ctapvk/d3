<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>


</style>
</head>
<body>
<!-- <label>http://www.cagrimmett.com/til/2016/08/19/d3-pie-chart.html</label> -->
<div id="pie"></div>
<script src="https://d3js.org/d3.v4.min.js"></script>
<script>
var data = [{"letter":"10%", "presses":2, "legend":"Россельхоз",  "summa":"3 674 тыс.руб", "color":"#529ACB", "text" : ["Комитет строительства ВО 10%",
                                                                   "Комитет по обеспечению безопасности жизнедеятельности населения ВО 5%",
																   "Комитет жилищно - комунального хозяйства и топливно энергитического комплекса ВО 15%","блок 4"]},
            {"letter":"18%", "presses":2, "legend":"Минстрой",    "summa":"3 674 тыс.руб", "color":"#8DC2D7", "text" : ["Комитет строительства ВО 10%",
                                                                   "Комитет по обеспечению безопасности жизнедеятельности населения ВО 5%",
																   "Комитет жилищно - комунального хозяйства и топливно энергитического комплекса ВО 15%","блок 4","блок 5","блок 6","блок 7"]},
			{"letter":"20%", "presses":2, "legend":"Минпромторг", "summa":"3 674 тыс.руб", "color":"#2D7BB0", "text" : ["Комитет строительства ВО 10%",
                                                                   "Комитет по обеспечению безопасности жизнедеятельности населения ВО 5%",
																   "Комитет жилищно - комунального хозяйства и топливно энергитического комплекса ВО 15%"]},
		    {"letter":"8%", "presses":2, "legend":"Россвязь",     "summa":"3 674 тыс.руб", "color":"#828BC4", "text" : ["Комитет строительства ВО 10%",
                                                                   "Комитет по обеспечению безопасности жизнедеятельности населения ВО 5%",
																   "Комитет жилищно - комунального хозяйства и топливно энергитического комплекса ВО 15%"]},
		    {"letter":"1", "presses":2, "legend":"Минэнерго",       "summa":"3 674 тыс.руб", "color":"#1E5F9C", "text" : ["Комитет строительства ВО 10%",
                                                                   "Комитет по обеспечению безопасности жизнедеятельности населения ВО 5%",
																   "Комитет жилищно - комунального хозяйства и топливно энергитического комплекса ВО 15%"]},
		    {"letter":"15%", "presses":2, "legend":"Минкультуры России", "summa":"3 674 тыс.руб", "color":"#8BC33C", "text" : ["Комитет строительства ВО 10%",
                                                                   "Комитет по обеспечению безопасности жизнедеятельности населения ВО 5%",
																   "Комитет жилищно - комунального хозяйства и топливно энергитического комплекса ВО 15%"]},
		    {"letter":"22%", "presses":2, "legend":"Росприроднадзор", "summa":"3 674 тыс.руб", "color":"#66977B", "text" : ["Комитет строительства ВО 10%",
                                                                   "Комитет по обеспечению безопасности жизнедеятельности населения ВО 5%",
																   "Комитет жилищно - комунального хозяйства и топливно энергитического комплекса ВО 15%"]},
		    {"letter":"19%", "presses":2, "legend":"Росавтодор", "summa":"3 674 тыс.руб", "color":"#17905B", "text" : ["Комитет строительства ВО 10%",
                                                                   "Комитет по обеспечению безопасности жизнедеятельности населения ВО 5%",
																   "Комитет жилищно - комунального хозяйства и топливно энергитического комплекса ВО 15%"]},
		    {"letter":"9%", "presses":2, "legend":"Минэнерго 2", "summa":"3 674 тыс.руб", "color":"#706FC2", "text" : ["Комитет строительства ВО 10%",
                                                                   "Комитет по обеспечению безопасности жизнедеятельности населения ВО 5%",
																   "Комитет жилищно - комунального хозяйства и топливно энергитического комплекса ВО 15%"]},
		    {"letter":"3", "presses":2, "legend":"Россвязь 2", "summa":"3 674 тыс.руб", "color":"#43CFA2", "text" : ["Комитет строительства ВО 10%",
                                                                   "Комитет по обеспечению безопасности жизнедеятельности населения ВО 5%",
																   "Комитет жилищно - комунального хозяйства и топливно энергитического комплекса ВО 15%"]},
		    {"letter":"2", "presses":2, "legend":"Иные", "summa":"3 674 тыс.руб", "color":"#C2BEC3", "text" : ["Комитет строительства ВО 10%",
                                                                   "Комитет по обеспечению безопасности жизнедеятельности населения ВО 5%",
																   "Комитет жилищно - комунального хозяйства и топливно энергитического комплекса ВО 15%"]}  
																   ];
console.log(data);

function drawComplex(startAngle = null, endAngle = null, colo = null, slide = 0) {
	var width = 1200,
		height = 1600,
		// Think back to 5th grade. Radius is 1/2 of the diameter. What is the limiting factor on the diameter? Width or height, whichever is smaller 
		radius = Math.min(width, height) / 8;

	var clr = [];
	var keys = [];
	var summ = 0;
	for(var i in data)	{
		clr.push(data[i].color);
		keys.push(data[i].legend + ":" + data[i].summa);
		summ += data[i].presses;
	}
	var color = d3.scaleOrdinal().range(clr);
	
	var currentIndex = 0;
	if(colo === null) {
		var half = summ / 2;
		summ = 0;
		for(var i = 0; i < data.length; i++)	{
			summ += data[i].presses;
			if(i < data.length - 1 && summ < half && summ + data[i+1].presses > half) currentIndex = i + 1; 
		}
		colo = data[currentIndex].color;
    }
	else 
		for(var i in data)	{
			if(colo == data[i].color) currentIndex = i;
		}
	
	var pie = d3.pie()
		.sort(null)
		.value(function(d) { return d.presses; })(data);

	var outer = radius - 10;
	var rotate = 0;
	if(startAngle != null && endAngle != null) 
		rotate = Math.PI-(startAngle + endAngle)/2;
	var arc = d3.arc()
		.outerRadius(outer)
		.innerRadius(Math.floor(radius/5))
		.startAngle(function(d) { return d.startAngle + rotate; })
        .endAngle(function(d) { return d.endAngle + rotate; });
	
	var labelArc = d3.arc()
		.outerRadius(radius - 40)
		.innerRadius(radius - 55)
		.startAngle(function(d) { return d.startAngle + rotate; })
        .endAngle(function(d) { return d.endAngle + rotate; });

	var center = [width/4,radius];
	var svg = d3.select("#pie")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
			.append("g")
			.attr("transform", "translate(" + center[0] + "," + center[1] +")"); // Moving the center point. 1/2 the width and 1/2 the height
		
	var g = svg.selectAll("arc")
		.data(pie)
		.enter().append("g")
		.attr("class", "arc")
		.attr("font", "10px sans-serif")
		.attr("text-anchor", "middle")
		.on("click",function(d) { 
			if(Math.sqrt(Math.pow((d3.event.clientX - center[0] - 8),2) + Math.pow((d3.event.clientY - center[1] - 8),2)) < outer) {
				document.getElementById("pie").innerHTML = "";
				drawComplex(d.startAngle, d.endAngle, d.data.color);
			}
		});

	var	overlapping = Math.floor(outer * 0.6);
		
	g.append("polygon")
		.style("fill", colo)
		.style("stroke", "white")
		.style("stroke-width", "2")
		.attr("points", "0," + (overlapping + 100) + " "+ radius * 2 + "," + overlapping + " " + radius * 4 + "," + (overlapping + 100))
		.attr("transform", "translate(-" + radius * 2 + ", 50)");	

	var r_width = Math.floor(radius * 4 / 3);

	//------------------------------------------------------------------	

	var bar = []
	for(var i = 0; i < 3; i++) {
		bar[i] = g.append("rect")
					.style("fill", colo)
					.style("stroke", "white")
					.style("stroke-width", "2")
					.attr("x", r_width * i)
					.attr("width", r_width)
					.attr("y", overlapping + 100)
					.attr("height", 150)
					.attr("transform", "translate(-" + radius * 2 + ", 50)");	
		
		rect = {
            x: parseFloat(bar[i].attr("x")),
            y: parseFloat(bar[i].attr("y")),
            width: parseFloat(bar[i].attr("width")),
            height: parseFloat(bar[i].attr("height"))
        };
		
		wrap(g.append("text")
            // Position in the centre of the shape (vertical position is
            // manually set due to cross-browser problems with baseline)
            .attr("x", rect.x - rect.width * 1.5 / 2.5)
            .attr("y", rect.y + 80 )
            .attr("dx", "0em" )
            .attr("dy", "0.32em" )
            // Centre align
            .style("text-anchor", "end")
			.style("overflow-wrap","break-word")
            .style("font-size", "14px")
            .style("font-family", "sans-serif")
            // Make it a little transparent to tone down the black
            .style("opacity", 0.6)
            // Prevent text cursor on hover and allow tooltips
            .style("pointer-events", "none")
			.style("fill","white")
            // Format the number
            //.text(d3.format(",.1f")(data.yValue / 1000) + "k");
			.text(data[currentIndex].text[i + slide]),rect.width * 3 / 4);
	}

	//------------------------------------------------------------------	

	const context_1 = d3.path();
	context_1.moveTo(10, overlapping + 260);
	context_1.lineTo(0,  overlapping + 265);
	context_1.lineTo(10, overlapping + 270);

	const context_2 = d3.path();
	context_2.moveTo(0,  overlapping + 260);
	context_2.lineTo(10, overlapping + 265);
	context_2.lineTo(0,  overlapping + 270);

	var backward = g.append('path')
					.attr('class', 'link')
					.attr("stroke", "blue")
					.attr("stroke-width", 2)
					.attr("fill", "white")
					.attr('d', context_1.toString())
					.attr("transform", "translate(-" + radius * 2 + ", 50)")
					.on("click",function(d) {
						if(slide > 0) {
							document.getElementById("pie").innerHTML = "";
							drawComplex(startAngle, endAngle, colo, slide - 1);
						}
					});							
							
	var forward = g.append('path')
					.attr('class', 'link')
					.attr("stroke", "blue")
					.attr("stroke-width", 2)
					.attr("fill", "white")
					.attr('d', context_2.toString())
					.attr("transform", "translate(" + (radius * 2 - 10) + ", 50)")
					.on("click",function(d) {
						if(slide < data[currentIndex].text.length - 3) {
							document.getElementById("pie").innerHTML = "";
							drawComplex(startAngle, endAngle, colo, slide + 1);
						}
					});							

	var slide_width = 60;
	var step = 0;
	if(data[currentIndex].text.length <= 3) slide_width = radius * 4 - 20;
	else step = (radius * 4 - 20 - slide_width) / (data[currentIndex].text.length - 3);
		
	g.append("rect")
		.style("fill", colo)
		.style("stroke", "white")
		.style("stroke-width", "2")
		.attr("x", 0)
		.attr("width", slide_width)
		.attr("y", overlapping + 255)
		.attr("height", 20)
		.attr("transform", "translate(" + ( -radius * 2 + 10 + step * slide) + ", 50)");	
	
	g.append("path")
		.attr("d", arc)
		.style("fill", function(d) { return color(d.data.letter);});

	g.append("text")
		.attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
		.text(function(d) { return d.data.letter;})	
		.style("fill", "#fff");	

//= = = =		

	color.domain(keys);
	
	var legend = g.append("g")
		.attr("font-family", "sans-serif")
		.attr("font-size", 14)
		.attr("text-anchor", "start")
		.selectAll("g")
		.data(keys.slice())
		.enter().append("g")
		.attr("transform", function(d, i) { if(i < 7) { col = 0; oi = 0;} else { col = 200; oi = 7 } return "translate(" + col + "," + (i - oi) * 60 + ")"; })
		.on("click",function(d) {
			var seach = d.split(':');
			var startAngle = 0;
			var endAngle = 0;
			var cl = 0;
			pie.forEach(function(item, i, pie) {
  				if(item.data.legend == seach[0] && item.data.summa == seach[1]) {
  					startAngle = item.startAngle;
  					endAngle = item.endAngle;
  					cl = item.data.color;
  				}
			});
			if(startAngle != 0 || endAngle != 0) {
				document.getElementById("pie").innerHTML = "";
				drawComplex(startAngle, endAngle, cl);
			}
		});

	legend.append("rect")
		.attr("x", 360)
		.attr("y", -outer)
		.attr("width", 20)
		.attr("height", 20)
		.attr("fill", color );

	legend.append("text")
		.attr("x", 400)
		.attr("y", -outer)
		.attr("dy", "0.32em")
		.text(function(d) { return d.split(":")[0]; })
		.append("svg:tspan")
		.attr('x', 400)
		.attr('dy', 20)
		.text(function(d) { return d.split(":")[1]; });

//= = = =		
		
}	

function wrap(text, width) {
    var words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
		x = text.attr("x"),
        dx = parseFloat(text.attr("dx")),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dx", dx + "em").attr("dy", dy + "em");
    while (word = words.pop()) {
		line.push(word);
		tspan.text(line.join(" "));
		if (tspan.node().getComputedTextLength() > width) {
			line.pop();
			tspan.text(line.join(" "));
			line = [word];
			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		}
    }
}



drawComplex();


</script>
</body>
</html>
