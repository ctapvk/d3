svg = d3.select("svg");
W = +svg.attr("width");
H = +svg.attr("height");
width = +svg.attr("width") - 100;
height = +svg.attr("height") -100;

var data = [1, 1, 2, 3, 5, 8, -13, 21, 34, -55, 89];


gist = svg.append("g")
				.attr("class", "gist")
				.attr("transform", "translate("+[ W- width,  height  ]+")")
				.attr("width" , width)
				.attr("height" , height)
;
asisX = svg.append("g")
				.attr("class", "asisX")
				.attr("transform", "translate("+[ W- width,  H  ]+")")
				.attr("width" ,  width)
				.attr("height" , H - height)
				// .append("text").text("asdasd")
;

asisY = svg.append("g")
				.attr("class", "asisY")
				.attr("transform", "translate("+[0,  H  ]+")")
				.attr("width" ,  W- width)
				.attr("height" , height)
;

y = d3.scaleLinear()
				.domain([d3.min(data)  , d3.max(data) ] )
				.range([  H ,H- height   ])
;

drawAsisX(asisX);
drawAsisY(asisY);
drawAsisYLegend(asisY);

function drawAsisX(canvas) {
	line  = d3.line()
					.x(function(d) {return d[0]})
					.y(function(d) {return d[1]})
	;
	canvas.append("path")
					.attr("transform",function(d) { return "translate("+[ 0 , -getElemHeight(canvas)]+")" })
					.attr("d" , line([ [0,0] , [ getElemWidth(canvas), 0 ] ]))
					.attr("stroke-width", 4)
					.attr("stroke", "#CDD5DE")
	;
}

function drawAsisY(canvas) {
	line  = d3.line()
					.x(function(d) {return d[0]})
					.y(function(d) {return d[1]})
	;
	canvas.append("path")
					.attr("transform",function(d) { return "translate("+[ getElemWidth(canvas) , -getElemHeight(asisX)]+")" })
					.attr("d" , line([ [0,0] , [ 0, -getElemHeight(canvas) ] ]))
					.attr("stroke-width", 4)
					.attr("stroke", "#CDD5DE")
	;
}

function drawAsisYLegend(canvas) {
	legend = canvas.append("g") 
						.attr("transform" , "translate("+[ +getElemWidth(canvas) , -(getElemHeight(canvas)  + ) ]+")")
						.attr("class", "text")
	; 
console.log([ +getElemWidth(canvas) , getElemHeight(canvas) ]); 
	y.ticks().forEach(function(dat , i) {
				legend
					.append("text")
					.attr("transform" , function(d) { return "translate(" + [0, y(dat) ] + ")" })
					.text( function(d){console.log(dat); return dat  })
				;
			})
	;
}

function getElemWidth (el){
	return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("width");
}
function getElemHeight (el){
	return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("height");
}