svg = d3.select("svg");
widthSvg = +svg.attr("width");
heightSvg = +svg.attr("height");
width = +svg.attr("width") - 100;
height = +svg.attr("height") -100;

var data = [15550, 5551551,5588,5151,55222];

monthNamesShort =  ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
				   'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'] ; 


dat = [ {"name":"flfl"} , {}];

gist = svg.append("g")
				.attr("class", "gist")
				.attr("transform", "translate("+[ widthSvg- width,  height  ]+")")
				.attr("width" , width)
				.attr("height" , height)
;
asisX = svg.append("g")
				.attr("class", "asisX")
				.attr("transform", "translate("+[ widthSvg- width,  heightSvg  ]+")")
				.attr("width" ,  width)
				.attr("height" , heightSvg - height)
;
asisY = svg.append("g")
				.attr("class", "asisY")
				.attr("transform", "translate("+[0,  0  ]+")")
				.attr("width" ,  widthSvg- width)
				.attr("height" , height)
;

y = d3.scaleLinear()
		.domain([d3.min(data)*1.2  , d3.max(data) *1.2] )
		.range([  heightSvg ,heightSvg- height   ])
;
x = d3.scaleLinear()
		.domain([0  , 12] )
		.range([ 50 ,  width   ])
;

drawAsisX(asisX);
drawAsisY(asisY);

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

	legend = canvas.append("g")
						.attr("transform" , "translate("+ [ getElemWidth(canvas) , -getElemHeight(asisX) ] +")")
						.attr("class", "text")
	;

	monthNamesShort.reverse().forEach(function(dat , i) {
				text = legend.append("g")
							.attr("transform" , function(d) { return "translate(" + [ -x(i) ,  0 ] + ")" })
				text
					.append("text")
						.attr("text-anchor", "middle")
						.attr("transform" , function(d) { return "translate(" + [ 0 ,  10 ] + ")" })
						.attr("dominant-baseline", "central")
						.text( function(d){ return dat  })
				;

				line = d3.line().x(function(d){return d[0]}).y(function(d){return d[1]});
				text.append("path")
							.attr("d",line( [  [0,0] , [0,-height]  ] ))
							.attr("stroke-width",2)
							.attr("stroke" , "#acc")
				;

			})
	;

}

function drawAsisY(canvas) {
	line  = d3.line()
					.x(function(d) {return d[0]})
					.y(function(d) {return d[1]})
	;
	canvas.append("path")
					.attr("transform",function(d) { return "translate("+[ 0 , 0]+")" })
					.attr("d" , line([ [getElemWidth(canvas),0] , [ getElemWidth(canvas), getElemHeight(canvas) ] ]))
					.attr("stroke-width", 4)
					.attr("stroke", "#CDD5DE")
	;

	legend = canvas.append("g")
						.attr("transform" , "translate("+ [ getElemWidth(canvas) , -getElemHeight(asisX) ] +")")
						.attr("class", "legend")
	;

	y.ticks().forEach(function(dat , i) {
				text = legend.append("g") 
									.attr("transform" , function(d) { return "translate(" + [0,  y(dat) ] + ")" })	
				; 
				text
					.append("text")
						.attr("text-anchor", "end")
						.attr("dominant-baseline", "central")
						.attr("transform" , function(d) { return "translate(" + [-10,  0 ] + ")" })
						.text( function(d){ return currencySwap(dat)  })
				;
				text
					.append("circle")
						.attr("r" , 5)
						.attr("fill",  "#CDD5DE" )
				;
			})
	;

}

function drawGist(canvas){
	
}

function getElemWidth (el){
	return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("width");
}
function getElemHeight (el){
	return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("height");
}

function currencySwap(d){
    return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")  + "" ;
}

