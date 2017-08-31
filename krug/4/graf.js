var svg = d3.select("svg"),
width = +svg.attr("width"),
height = +svg.attr("height") ;

	
var color = d3.scaleOrdinal(prop.colorsLeft);


function countInnerDataForPie(d){
	
	for (k in d){
		var sum = 0;
		for ( key in d[k].value) {
			for (dat in d[k].value[key] ) {
				sum+= +(d[k].value[key][dat]) ; 
			}
			d[k].sum = sum ; 
		}
	}
	return d
}
radius = 100 ;
function showPieLeft(data){
	
	var pie = d3.pie().sort(null).value(function(d) {
		return d['sum'];
	});
	var path = d3.arc()
					.outerRadius(radius)
					.innerRadius(40);
	var label = d3.arc()
					.outerRadius( radius )
					.innerRadius(radius / 3.5);
	
	var arc = innerDonut.selectAll(".arc")
								.data(pie(data)).enter().append("g")
														.attr("class", "arc");

	arc.append("path")
			.attr("d", path)
			.attr("fill", function(d , i ) { 
				data2[i].startAngle = d.startAngle ;  
				data2[i].endAngle = d.endAngle ;  
				return color(d.data['name']); });

	arc.append("text")
		  .attr("transform", function(d) {  return "translate(" + label.centroid(d) + ")"; })
		  .attr("text-anchor"  , "middle" )
		  .attr("dy", "0.35em")
		  .attr("font-family" , "sans-serif")
		  .attr("font-size" , "14")
		  .attr("fill" , "white")
		  .attr("font-weight" , "bold")
		  .text(function(d) {  return ( (d.endAngle - d.startAngle)/6.28 * 100).toFixed(1)   + '%'; });
}


function showPiePercents(data , index){
	var radiusPlus = 40 ;
	var red = d3.scaleLinear()
					.domain([0 , (data[index].sum / 6) ]  )
					.range(["white" , prop.colorsLeft[index]  ]);	
	var pie = d3.pie()
				.sortValues(function compare(a, b) {
					  return b - a;
				})
				.value(function(d) { return d3.values(d);  })
				.startAngle(data[index].startAngle)
				.endAngle(data[index].endAngle) ;
	
	var path = d3.arc()
					.outerRadius(radius + radiusPlus)
					.innerRadius(radius + 5 ) ;
	var label = d3.arc()
					.outerRadius( radius )
					.innerRadius(radius +radiusPlus + 90);
	var arc = donut.selectAll(".arc")
						.data(pie(data[index].value)).enter().append("g")
							.attr("class", "arc");

	arc.append("path")
			.attr("d", path)
			.attr("fill", function(d) {  return red(d3.values(d.data)); })
			;

	arc.append("text")
		  .attr("transform", function(d) {  return "translate(" + label.centroid(d) + ")"; })
		  .attr("text-anchor"  , "middle" )
		  .attr("dy", "0.35em")
		  .attr("font-family" , "sans-serif")
		  .attr("font-size" , "14")
		  .attr("fill" , "black")
		  .attr("font-weight" , "bold")
		  .text(function(d) {  return ( (d.endAngle - d.startAngle)/6.28 * 100).toFixed(1)   + '%'; });
}



data2 = countInnerDataForPie(data2);
g = svg.append('g')
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")") 
		.attr("class" , "donut"); 
donut = g.append("g")
			.attr("class", "donut");
innerDonut = g.append("g")
				.attr("class", "innerDonut");


showPieLeft(data2 );
accr() ; 
//showPiePercents(data2  ,0);

function accr(){
	document.write('<div class="accord"> ');
	for (i =0 ; i < data2.length ;i ++) {
		document.write('<button class="accordion" count='+i+'>' +data2[i].name + '</button> ');
		document.write('<div class="panel">');
		for (dat in data2[i].value) {
			document.write('  <p> ' +  Object.keys(data2[i].value[dat])  + ' </p>');
		}
		document.write('</div>');
	}
	document.write('</div>');
	
	var acc = document.getElementsByClassName("accordion");
	var i;

	for (i = 0; i < acc.length; i++) {
		
	  acc[i].onclick = function() {
	    this.classList.toggle("active");
	    showPiePercents(data2 , this.getAttribute("count"));
	    var panel = this.nextElementSibling;
	    if (panel.style.maxHeight){
	      panel.style.maxHeight = null;
	    } else {
	      panel.style.maxHeight = panel.scrollHeight + "px";
	    } 
	  }
	}
}









