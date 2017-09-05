svg = d3.select("svg");
width = +svg.attr("width");
height = +svg.attr("height");

dataArray = [ [50, 50], [50 , 180] ,   [ 70 , 200] , [200, 200] ];

canvas = svg.append("g")
			.attr("transform", "translate(40,40) ")
			.attr("width",100)
			.attr("height",100)
			.attr("class","canvas");


function drawLineConnection(x,y, xEnd , yEnd ,  canvas) {
	dif =20 ; 
	dat =[ [ x , y ],  [x, yEnd - dif ]   , [ x + dif, yEnd]  ,  [xEnd , yEnd]  ];
	var line = d3.line()
	.x(function(d) { return d[0] ; })
	.y(function(d) { return d[1] ; })
	.curve(d3.curveCardinal.tension(0.5));
										
canvas.append("path")
	.style("fill","none")
	.style("stroke","gray")
	.style("stroke-width","2px")
	.attr("class", "curveLine")
	.attr("d",function(d,i){ return line(dat); })
	;
}

drawLineConnection( 5,5, 200,80 ,canvas);