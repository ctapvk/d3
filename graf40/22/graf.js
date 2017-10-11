function drawGraph21() {

var svg = d3.select(".graf21"),
width = +svg.attr("width"),
height = +svg.attr("height") ;

	
var color = d3.scaleOrdinal(prop21.colorsLeft);


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

function outerPie(data){
	var pie = d3.pie().sort(null).value(function(d) {
		//console.log(d['sum']);
		return d['sum'];
	}).padAngle( +prop21.paddingOuterPie);
	var path = d3.arc()
					.outerRadius(prop21.outerPieRadius)
					.innerRadius(0);
	var label = d3.arc()
					.outerRadius( prop21.outerPieRadius )
					.innerRadius(prop21.outerPieInnerRadius);
	
	var arc = outerDonut.selectAll(".arc")
								.data(pie(data)).enter().append("g")
														.attr("class", "arc");

	arc.append("path")
			.attr("d", path)
			.attr("fill", function(d , i ) {
				data21[i].startAngle = d.startAngle ;  
				data21[i].endAngle = d.endAngle ;  
				return color(d.data['name']); 
			})
			.on("click" , function (d,i) {
				d3.select(".lineConn").remove();
				d3.select(".dots").remove();
				d3.selectAll(".legend21").remove();
                innerPie(data21 , i);
                drawWhiteInside( innerDonat ) ;
			})
	;

	arc.append("text")
		  .attr("transform", function(d) {  return "translate(" + label.centroid(d) + ")"; })
		  .attr("text-anchor"  , "middle" )
		  .attr("dy", "0.35em")
		  .attr("font-family" , "sans-serif")
		  .attr("font-size" , "14")
		  .attr("fill" , "white")
//		  .attr("font-weight" , "bold")
		  .text(function(d) {  return ( (d.endAngle - d.startAngle)/6.28 * 100).toFixed(1)   + '%'; });
}



function innerPie(data , index ){
	var red = d3.scaleLinear()
					.domain([0 , (data[index].sum / +prop21['количество градиента']) ]  )
					.range(["white" , prop21.colorsLeft[index]  ]);	

	donut = innerDonat.append("g").attr("class", "donut");

	var pie = d3.pie()
				.sortValues(function compare(a, b) {   return a - b; 	})
				.value(function(d) { return d3.values(d);  })
				// .startAngle(data[index].startAngle  +  +prop21.paddingInnerPieAngle)
				// .endAngle(data[index].endAngle - +prop21.paddingInnerPieAngle)
	;

	var path = d3.arc()
					.outerRadius(prop21.innerPieRadius)
					.innerRadius(prop21.innerPieInnerRaius  )
	;
	donut.append("circle").attr("r",prop21.innerPieRadius + 5 ).attr("fill","white");
	var arc = donut.selectAll(".arc")
						.data(pie(data[index].value)).enter()
							.append("g")
							.attr("class", "arc")
	;

	arc.append("path")
			.attr("d", path)
			.attr("fill", function(d) { return red(d3.values(d.data)); })
			.on("mousemove", function(d) {
				// console.log(d3.event.clientX);
					d3.select("#tooltip")
						.style("left", d3.event.pageX + "px")
						.style("top", d3.event.pageY + "px")
						.select("#value")
						.text(currencySwap( d3.values(d.data)) )
					;
					d3.select("#tooltip")
						.select("#tipCaption")
						.text( d3.keys(d.data));
					//Show the tooltip
					d3.select("#tooltip").classed("hidden", false);
			   })
			.on("mouseout",function() { d3.select("#tooltip").classed("hidden", true);  })
	;



	label = d3.arc() .outerRadius(prop21.innerPieRadius ) .innerRadius(prop21.innerPieRadius -25 ) ;
	legend = arc.append("g").attr("class" , "legend21") ;
	g3 = donut.append("g").attr("class" , "lineConn");
	whiteG = donut.append("g").attr("class" , "dots");

    lcount =0 ; rcount=0;
	legend.data().forEach(function (d , i) {
        cordStart = label.centroid(d ) ;
        if (d.startAngle> 3)
			cordEnd=[-250, label.centroid(d)[1] + 22* lcount++ ];
		else
			cordEnd=[ 250, label.centroid(d)[1]  + 22* rcount++  ];

        te = whiteG.append("g").attr("transform", "translate("+cordStart+")");
        drawDots(te ,index );

		drawLineConnection( cordStart[0],  cordStart[1] , cordEnd[0] , cordEnd[1] - 9 ,  g3);

		tr = legend.append("g").attr("transform", "translate("+ cordEnd +")").attr("class" , "legG21");
		if (d.startAngle> 3) legendaLeft(index , tr, d); else legenda(index ,tr , d);

    });
}

function drawDots(canvas , index) {
    canvas.append("circle")
        .attr("r", + prop21["радиус белых кружков"])
        .attr("class", "whiteDot")
        .attr("fill", "white")
    ;
    canvas.append("circle")
        .attr("r", + prop21["радиус белых кружков"]-2)
        .attr("fill", function(d) {   return prop21.colorsLeft[index]; })
    ;

}

function legenda(index , canvas ,d ){
	var red = d3.scaleLinear()
				.domain([0 , (data21[index].sum / +prop21['количество градиента']) ]  )
				.range(["white" , prop21.colorsLeft[index]  ])
	;
    canvas.append("text")
			.attr("transform",   "translate( 30,-4)" )
			.attr("class" , "legendText")
			.text(cutLongText(d3.keys(d.data).toString() ) )
	;
    canvas.append("text")
			.attr("transform", "translate( 30,10)")
			.attr("class" , "legendTextSum")
			.text( currencySwap(d3.values(d.data)) )
	;
    canvas.append("rect")
		  .attr("transform",   "translate( 0,-10)" )
		  .attr("fill" , red(d3.values(d.data)) )
		  .attr("width" ,prop21.rect)
		  .attr("height"  , prop21.rect)
	;

}

function legendaLeft(index , canvas ,d ){
	var red = d3.scaleLinear()
				.domain([0 , (data21[index].sum / +prop21['количество градиента']) ]  )
				.range(["white" , prop21.colorsLeft[index]  ])
	;

    canvas.append("text")
			.attr("transform",  "translate( -30,-4)" )
			.attr("class" , "legendTextLeft")
			.text(cutLongText(d3.keys(d.data).toString()))
	;

    canvas.append("text")
			.attr("transform","translate( -30,10)" )
			.attr("class" , "legendTextSumLeft")
			.text( currencySwap(d3.values(d.data)))
	;
    canvas.append("rect")
		  .attr("transform", "translate( "+-prop21.rect+",-10)" )
		  .attr("fill" ,   red(d3.values(d.data)))
		  .attr("width" ,prop21.rect)
		  .attr("height"  , prop21.rect)
	;

}


function drawLineConnection(x,y, xEnd , yEnd ,  canvas) {
	dif = 5 ;

    if (y < yEnd )
        dat =[ [ x , y ],  [x, yEnd - dif ]   , [ x + dif, yEnd]  ,  [xEnd , yEnd]  ];
    else {
        dat =[ [ x , y ],  [x , yEnd + dif]   , [ x + dif , yEnd]  ,  [xEnd , yEnd]  ];
    }

	var line = d3.line()
					.x(function(d) { return d[0] ; })
					.y(function(d) { return d[1] ; })
					// .curve(d3.curveCardinal.tension(0.5))
					.curve(d3.curveBasis)
	;
	gg = canvas.append("g").attr("class", "conn") ; 
	gg.append("path")
		.style("fill","none")
		.style("stroke","gray")
		.style("stroke-width","2px")
		.attr("class", "curveLine")
		.attr("d",function(d,i){ return line(dat); })
	;
}


function currencySwap(d){
    return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")  + " тыс. руб." ;
}

function currencySwap2(d){
    return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")   ;
}

function cutLongText (str) { 
	if (str.length > 25)
		return str.substr(0,25) + "..." ;
	else
		return str ;
}


function drawWhiteInside(canvas) {

	te = canvas.append("g").attr("class" ,"legDonut");

	te.append("circle")
		.attr("r" , "60")
		.attr("fill" , "white")
	;
	te.append("text")
		.attr("text-anchor" , "middle")
		.attr("font-weight" , "bold")
		.attr("font-family" , "sans-serif")
		.attr("font-size" , "16px")
		.attr("fill" , "gray")
		.attr("transform" , "translate(0,-20)")
		.text("Всего")
	;

	sum =0;
	for (i in data21)
		sum+=data21[i].sum;
	te.append("text")
		.attr("text-anchor" , "middle")
		.attr("font-weight" , "bold")
		.attr("font-family" , "sans-serif")
		.attr("font-size" , "18px")
		.attr("transform" , "translate(0,5)")
		.text(currencySwap2(sum))
	;
	te.append("text")
		.attr("text-anchor" , "middle")
		.attr("font-weight" , "bold")
		.attr("font-family" , "sans-serif")
		.attr("font-size" , "16px")
        .attr("fill" , "gray")
		.attr("transform" , "translate(0,25)")
		.text(" тыс. руб.")
	;
}

function drawLegend(canvas) {
	data21.forEach(function (d , i) {
    te = canvas.append("g")
		.attr("transform" , "translate("+[ 150 + i*250 , height-20 ]+")")
	;
        te.append("text")
            .attr("transform", "translate( 30,-4)")
            .attr("class", "legendText")
            .text(cutLongText(d.name))
        ;
        te.append("text")
            .attr("transform", "translate( 30,10)")
            .attr("class", "legendTextSum")
            .text(currencySwap(d.sum))
        ;
        te.append("rect")
            .attr("transform", "translate( 0,-10)")
            .attr("fill", prop21.colorsLeft[i] )
            .attr("width", prop21.rect)
            .attr("height", prop21.rect)
        ;
	console.log(d.name);
    })
}

data21 = countInnerDataForPie(data21); 

innerDonat = svg.append('g')
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
		.attr("class" , "pie"); 
outerDonut = innerDonat.append("g")
				.attr("class", "outerDonut");


for (i in data21)
	data21[i].value.sort(function(x, y){ return d3.ascending(d3.values(x), d3.values(y)); }) ;

	data21[1].value.sort(function(x, y){ return  d3.values(y) - d3.values(x) }) ;
	data21[2].value.sort(function(x, y){ return  d3.values(y) - d3.values(x) }) ;



outerPie(data21 );
drawWhiteInside( innerDonat ) ;

drawLegend(svg);


}