var svg = d3.select("svg"),
width = +svg.attr("width"),
height = +svg.attr("height") ;

	
var color = d3.scaleOrdinal(prop.colorsLeft);


function showDonut(data){
	var pie = d3.pie().sort(null).value(function(d , i ) {	return d; });
	
	var path = d3.arc()
					.outerRadius(radius)
					.innerRadius(40);
	var arc = donut.selectAll(".arc")
								.data( pie([  data[0] , 0  ]) ).enter().append("g")
														.attr("class", "arc");
	arc.append("path")
			.attr("d", path)
			.attr("fill", "url(#linear-gradient)")
	;

	var gradient =  g.append('linearGradient')
		.attr('id', 'linear-gradient')
		.attr('x1', 0)
		.attr('y1', 0)
		.attr('x2', '80%')
		.attr('y2', '100%');

	gradient.append("stop")
	   .attr('class', 'start')
	   .attr("offset", "0%")
	   .attr("stop-color", "#eeeeee")
	   .attr("stop-opacity", 1);

	gradient.append("stop")
	   .attr('class', 'end')
	   .attr("offset", "50%")
	   .attr("stop-color", "#eaeaea")
	   .attr("stop-opacity", 1);

	gradient.append("stop")
	   .attr('class', 'end')
	   .attr("offset", "100%")
	   .attr("stop-color", "#b6b6b6")
	   .attr("stop-opacity", 1);
	
	
}

function legend(){
	textg = donut.select(".arc").append("g") 
									.attr("class", "textCaprion");
	textg.append("text")
		  .attr("transform", function(d) {  return "translate( 0 , "+ (radius+50) + ")"; })
		  .attr("text-anchor"  , "middle" )
		  .attr("dy", "0.35em")
		  .attr("font-family" , "sans-serif")
		  .attr("font-size" , "14")
		  .text("План"  );
	
	
	textg.append("text")
	  .attr("transform", function(d) {  return "translate( 0 , "+ (radius+70) + ")"; })
	  .attr("text-anchor"  , "middle" )
	  .attr("dy", "0.35em")
	  .attr("font-family" , "sans-serif")
	  .attr("font-size" , "20")
	  .attr("fill", "#C0C0C0")
	  .text(currencySwap ( data[0])  );

	textg.append("text")
	  .attr("transform", function(d) {  return "translate( 0 , "+ (radius+90) + ")"; })
	  .attr("text-anchor"  , "middle" )
	  .attr("dy", "0.35em")
	  .attr("font-family" , "sans-serif")
	  .attr("font-size" , "14")
	  .text("Факт"  );

	textg.append("text")
	  .attr("transform", function(d) {  return "translate( 0 , "+ (radius+110) + ")"; })
	  .attr("text-anchor"  , "middle" )
	  .attr("dy", "0.35em")
	  .attr("font-family" , "sans-serif")
	  .attr("font-size" , "20")
	  .attr("fill","#0974C2")
	  .text(currencySwap ( data[1])  );
}

function percentsAndCaption(){

	
	donut.select(".arc").
	append("text")
		  .attr("transform", function(d) {  return "translate( 0 , "+ (radius+20) + ")"; })
		  .attr("text-anchor"  , "middle" )
		  .attr("dy", "0.35em")
		  .attr("font-family" , "sans-serif")
		  .attr("font-size" , "20")
		  .text("Доходы");
}

function overGraph(){
	overGraf = g.append("g")
			.attr("class", "overGraf");
	
	var pie = d3.pie().sort(null).value(function(d , i ) {	return d; })				
	.startAngle(0)
	.endAngle(6.28* ( data[1] / data[0]) );
	
	var path = d3.arc()
				.outerRadius(radius)
				.innerRadius(40);
	var arc = overGraf.selectAll(".arc2")
							.data( pie( [0, 1 ] ) ).enter().append("g")
													.attr("class", "arc2");
	arc.append("path")
		.attr("d", path)
		.attr("fill", function(d , i ) { return prop.colorOverGraph; })
	;
    arc.append("text")
        .attr("transform", function(d) {  return "translate(" + path.centroid(d) + ")";  })
        .attr("text-anchor"  , "middle" )
        .attr("dy", "0.35em")
        .attr("font-family" , "sans-serif")
        .attr("font-size" , "20")
        //		  .attr("font-weight" , "bold")
        .text(function(d) {
        	if (d.data==0) txt = "" ; else txt = ( (   data [1] / data[0] ) * 100).toFixed(1)   + '%' ;
        	return  txt; })
	;


}


function currencySwap(d){
    return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")  + " руб" ;
}


radius = 100 ;
g = svg.append('g')
		.attr("transform", "translate(" + width *0.5  + "," + height *0.5 + ")")
		.attr("class" , "canvas"); 
donut = g.append("g")
			.attr("class", "donut");
showDonut(data);
legend();
percentsAndCaption();
overGraph();









