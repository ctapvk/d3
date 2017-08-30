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
var data = [{"letter":"q","presses":1},{"letter":"w","presses":5},{"letter":"e","presses":2}];
console.log(data);

var width = 600,
	height = 600,
	// Think back to 5th grade. Radius is 1/2 of the diameter. What is the limiting factor on the diameter? Width or height, whichever is smaller 
	radius = Math.min(width, height) / 5;

var color = d3.scaleOrdinal()
	.range(["#2C93E8","#838690","#F56C4E"]);

var pie = d3.pie()
	.value(function(d) { return d.presses; })(data);

var arc = d3.arc()
	.outerRadius(radius - 10)
	.innerRadius(Math.floor(radius/5));
	
var labelArc = d3.arc()
	.outerRadius(radius - 40)
	.innerRadius(radius - 40);

var svg = d3.select("#pie")
	.append("svg")
	.attr("width", width)
	.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width/2 + "," + radius +")"); // Moving the center point. 1/2 the width and 1/2 the height
		
var g = svg.selectAll("arc")
	.data(pie)
	.enter().append("g")
	.attr("class", "arc");

g.append("polygon")
    .style("fill", "none")
    .style("stroke", "steelblue")
    .style("stroke-width", "2")
    .attr("points", "0,200 "+ radius * 2 + ",50 " + radius * 4 + ",200")
	.attr("transform", "translate(-" + radius * 2 + ", 50)");	
	
g.append("path")
	.attr("d", arc)
	.style("fill", function(d) { return color(d.data.letter);});

g.append("text")
	.attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
	.text(function(d) { return d.data.letter;})	
	.style("fill", "#fff");	

</script>
</body>
</html>
