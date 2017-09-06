svg = d3.select("svg");
width = +svg.attr("width");
height = +svg.attr("height");

dat = [ 1,2,3,4 ,5];
color = d3.scaleLinear()
				.domain([d3.min(dat),d3.max(dat)])
				.range( ["blue" , "red"] )
;

g = svg.append("g")
			.attr("class", "canvas")
			.attr("transform" , "translate(0,20)")
;
legend = g.selectAll().data(dat).enter().append("g")
		.attr("transform", function (d,i){ console.log(this); return "translate(0, "+ (  i*30) +")"}) ;

legend.append("rect")
				.attr("transform", function (d,i){   return "translate(0, -15)"})
				.attr("width", 20)
				.attr("height",20)
				.attr("fill", function (d,i) { return color(d); })
;

legend.append("text")
				.attr("transform" , function (d,i) { return "translate(30 , 0 )" ;  } )
				.text(function (d) { return d })
;
