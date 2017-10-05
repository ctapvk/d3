function drawGraph() {

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

function showPieLeft(data){
	
	var pie = d3.pie().sort(null).value(function(d) {
		return d['sum'];
	});
	var path = d3.arc()
					.outerRadius(+prop['радиус'])
					.innerRadius( +prop['белая дырка внутри'] );
	var label = d3.arc()
					.outerRadius( +prop['радиус'] )
					.innerRadius( +prop['радиус'] / 3.5);
	
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
	donut = g.append("g")
				.attr("class", "donut");
	
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
					.outerRadius(+prop['радиус'] + +prop['радиус гребешка'])
					.innerRadius(+prop['радиус'] + 5 ) ;
	var label = d3.arc()
					.outerRadius( +prop['радиус'] )
					.innerRadius( +prop['радиус'] + +prop['белая дырка внутри'] + +prop['радиус легенды гребешка']);
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


for (i in data2)
	data2[i].value.sort(function(x, y){ return d3.ascending(d3.values(y), d3.values(x)); }) ;

data2 = countInnerDataForPie(data2);
g = svg.append('g')
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")") 
		.attr("class" , "donut"); 

innerDonut = g.append("g")
				.attr("class", "innerDonut");


showPieLeft(data2 );
accr() ; 
//showPiePercents(data2  ,0);

function accr(){
	document.write('<div class="accord"> ');
	for (i =0 ; i < data2.length ;i ++) {
		var red = d3.scaleLinear()
						.domain([0 , (data2[i].sum / 6) ]  )
						.range(["white" , prop.colorsLeft[i]  ]);	
		rect5 = '<svg style="  top: 10; position: relative; " width="30" height="30"> '+
		'<rect width="20" height="20" transform="translate(5,5)" style="fill:'+ prop.colorsLeft[i] +'; " /> </svg>';

		document.write('<button class="accordion" count='+i+'>' );
		document.write(' <div class="arrow right" id="arrToog'+ i  +'"> </div>' );
		document.write( rect5 +data2[i].name + '</button> ' );
		document.write('<div class="panel">');
		for (dat in data2[i].value) {
			rect5 = '<svg style="  top: 10; position: relative; " width="30" height="30"> '+
			'<rect width="20" height="20" transform="translate(5,5)" style="fill:'+ red(d3.values( data2[i].value[dat])) +'; " /> </svg>';
			document.write('  <p  > ' + rect5 +  Object.keys(data2[i].value[dat])  + ' </p>');
		}
		document.write('</div>');
	}
	document.write('</div>');
	
	var acc = document.getElementsByClassName("accordion");

	for (i = 0; i < acc.length; i++) {
		
	  acc[i].onclick = function() {
	    this.classList.toggle("active");
	    showPiePercents(data2 , this.getAttribute("count"));

	    console.log(  );
	    document.getElementById("arrToog"+this.getAttribute("count") ).classList.toggle("right");

	    if ( (this.className).indexOf("active") == -1) {
	    	d3.selectAll("g .donut").remove();
	    }

	    
	    var panel = this.nextElementSibling;
	    if (panel.style.maxHeight){
	      panel.style.maxHeight = null;
	    } else {
	      panel.style.maxHeight = panel.scrollHeight + "px";
	    }
	  }
	}
}

}







