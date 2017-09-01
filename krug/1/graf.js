var svg = d3.select("svg"),
width = +svg.attr("width"),
height = +svg.attr("height") ;

	
var color = d3.scaleOrdinal(prop.colorsLeft);

radius = 100 ;
function showPieLeft(data){
	
	g = svg.append('g')
			.attr("transform", "translate(" + width *0.2  + "," + height / 2 + ")") 
			.attr("class" , "donut"); 
	donut = g.append("g")
			.attr("class", "donut");

	var pie = d3.pie().sort(null).value(function(d , i ) {
		return d;
	});
	var path = d3.arc()
					.outerRadius(radius)
					.innerRadius(40);
	var arc = donut.selectAll(".arc")
								.data( pie([  data[0] , 0  ]) ).enter().append("g")
														.attr("class", "arc");

	console.log(  (pie(data))[0]  ); 
	
	
	arc.append("path")
			.attr("d", path)
			.attr("fill", function(d , i ) {
				return color(d.data); });
	
	donut.select(".arc").
	append("text")
		  .attr("transform", function(d) {  return "translate(5, 0)"; })
		  .attr("text-anchor"  , "middle" )
		  .attr("dy", "0.35em")
		  .attr("font-family" , "sans-serif")
		  .attr("font-size" , "20")
//		  .attr("font-weight" , "bold")
		  .text(function(d) {  return  ( (   data [1] / (data[1]+data[0]) ) * 100).toFixed(1)   + '%'; });
	
	
	donut.select(".arc").
	append("text")
		  .attr("transform", function(d) {  return "translate( 0 , "+ (radius+20) + ")"; })
		  .attr("text-anchor"  , "middle" )
		  .attr("dy", "0.35em")
		  .attr("font-family" , "sans-serif")
		  .attr("font-size" , "20")
		  .text("Доходы");
	
	textg = donut.select(".arc").append("g") 
									.attr("class", "textCaprion");
	textg.append("text")
		  .attr("transform", function(d) {  return "translate( 0 , "+ (radius+50) + ")"; })
		  .attr("text-anchor"  , "middle" )
		  .attr("dy", "0.35em")
		  .attr("font-family" , "sans-serif")
		  .attr("font-size" , "20")
		  .text("План"  );
	
	
	textg.append("text")
	  .attr("transform", function(d) {  return "translate( 0 , "+ (radius+70) + ")"; })
	  .attr("text-anchor"  , "middle" )
	  .attr("dy", "0.35em")
	  .attr("font-family" , "sans-serif")
	  .attr("font-size" , "20")
	  .text(currencySwap ( data[0])  );

	textg.append("text")
	  .attr("transform", function(d) {  return "translate( 0 , "+ (radius+90) + ")"; })
	  .attr("text-anchor"  , "middle" )
	  .attr("dy", "0.35em")
	  .attr("font-family" , "sans-serif")
	  .attr("font-size" , "20")
	  .text("Факт"  );

	textg.append("text")
	  .attr("transform", function(d) {  return "translate( 0 , "+ (radius+110) + ")"; })
	  .attr("text-anchor"  , "middle" )
	  .attr("dy", "0.35em")
	  .attr("font-family" , "sans-serif")
	  .attr("font-size" , "20")
	  .text(currencySwap ( data[1])  );

	
}

function currencySwap(d){
    return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")  + " руб" ;
}




showPieLeft(data);









