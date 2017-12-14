
function drawGraph41(data , prop  , idgraf , angle) {
div = d3.select("#hid42").append("div").attr("class", "tooltip42").style("opacity", 0);
// init block


	var svg = d3.select("#"+idgraf);
	svg.selectAll("*").remove();

	widthSvg = +svg.attr("width");
	heightSvg = +svg.attr("height");
	width = +svg.attr("width") ;
	height = +svg.attr("height");

	center = svg.append("g")
		.attr("class", "center")
		.attr("transform", "translate("+[ +prop.radius+30 , +prop.radius+30  ]+")")
	;

	x = d3.scaleLinear()
		.domain([0  , 100 ] )
		.range([ 0 ,  +prop.radius   ])
	;

// init block



	function drawBase(canvas){
		te = canvas.append("g").attr("class" , "basePie");


		pie = d3.pie().padAngle(.0).sort(null);
		arc = d3.arc();

		dat1 = procData(data) ;
        dat = [];
        dat1.forEach(function (t) {
            dat.push((Object.values(t))[0])
        })

		pieDataLast = pie( dat )[dat1.length-1];
		raz =   (pieDataLast.endAngle - pieDataLast.startAngle)  + pieDataLast.startAngle*0.5;
		// console.log((raz)) ;

		pie( dat ).forEach( function (t, i ) {
			t.outerRadius = prop.radius ;  t.innerRadius = 55;
			 t.startAngle += raz ; t.endAngle +=raz;
			te.append("path")
				.attr("fill" ,  prop.colorsKrug[i] )
				.attr("d", arc(t))
				.on("mousemove", function(d) {
					div.transition()
						.duration(200)
						.style("opacity", .9);
					div.html(
						" Наименование : " + d3.keys(dat1[i]) + ' <br>' +
						" Объем показателя : " + currencySwapWithText(d3.values(dat1[i])) + ' <br>' +
						" Доля в общем объеме долга : " + ((t.data / d3.sum(dat)).toFixed(3) * 100).toFixed(1) + '%'


					)
						.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY - 28) + "px");
				})
				.on("mouseout", function(d) {
					div.transition()
						.duration(500)
						.style("opacity", 0);
				})
			;

			if ( +(t.data / d3.sum(dat))*100 >11)
				txt=( (t.data / d3.sum(dat)).toFixed(3) * 100).toFixed(1) + '%' ;   else txt="";

			te.append("text")
				.attr("class" , "krugPieTextLegend42")
				.attr("transform" , "translate(" + d3.arc().centroid(t) + ")")
				.text( txt )
			;
		});

	}



	function drawLegend(canvas) {
		te = canvas.append("g")
			.attr("transform" , "translate("+[ 50 ,  0]+")")
		;
		caps = ["Поступления в ФБ","Поступления в бюджет Волгоградской области"];
		data.forEach(function (d , i ) {
			leg = te.append("g").attr("transform" , "translate("+[ 0, i*55  ]+")");

			leg.append("text")
				.attr("class", "krugLegText").html( breakLongText(Object.keys(data[i]) , 60) )
			// .attr("class", "krugLegText").text( Object.keys(data[i])  )
			;
			leg.append("text")
				.attr("transform" , "translate("+[ 0, -15  ]+")")
				.attr("class", "krugLegTextBold").text( currencySwap(Object.values(data[i]) ) )
			// .attr("class", "krugLegText").text( Object.keys(data[i])  )
			;


			leg.append("rect")
				.attr("class" , "krugRectLeg")
				.attr("transform" , "translate("+[ -35,-33 ]+")")
				.attr("fill", prop.colorsKrug[i])
			;

		})
	}

	function currencySwapWithText(d) {
		// d= parseInt(parseFloat(d)* de);
		return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " руб.";
	}
	function currencySwap(d) {
		d= parseInt(parseFloat(d)* de);
		return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " " + deText ;
	}

	function drawInie(canvas) {
		te = canvas.append('g').attr('width',50).attr('height',50)
			.attr('class','drawInie')
			.attr('transform', 'translate('+[0,20]+')')



        te.append("svg:image")
            .attr("transform","translate("+[ 0,-100 ]+")")
            .attr('width', 330)
            .attr('height', 150)
            .attr("xlink:href", "tr.png")
        ;

		scroll = te.append('g')
			.attr('transform','translate('+[0,150]+')')
			.attr('class','scroll')
		;

		scrollBar = te.append('g')
			.attr('transform','translate('+[0,150]+')')
			.attr('class','scrollBar')
		;

        scroll.append("rect")
			.attr('width', 30)
			.attr('height',15)
			.on('click',function (d) {
				console.log(123)
            })
        scroll.append("rect")
			.attr('width', 30)
			.attr('height',15)
			.attr('transform','translate('+[300,0]+')')
			.on('click',function (d) {
				console.log(12333)
            })

        scrollBar.append('circle')
			.attr('id','circleScroll')
			.attr('r',15 )
            .attr("cx", 50 )
            .attr("cy", 7 )
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        function dragstarted(d) {
            d3.select(this).raise().classed("active", true);
        }
        function dragended(d) {
            d3.select(this).classed("active", false);
        }

        maxDrag = 0 ; minDrag = 0 ; flag = 1 ;
        function dragged(d) {
        	if (flag) {
        		flag =0 ;
                maxDrag = d3.event.x + 230;
                minDrag = d3.event.x ;
			}

        	if (d3.event.x < maxDrag  && d3.event.x > minDrag) {

            d3.select("#circleScroll")
				.attr("cx",  d3.event.x)
				// .attr( "cy" , d3.event.y)
			;
            d3.select(".scrollG")
                .attr('transform','translate('+[ d3.event.x,30]+')')
				// .attr( "cy" , d3.event.y)
			;
            // d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
			}
        }


        inSvg = te.append('svg').attr('width',330).attr('height',150) ;
        showBorders(inSvg) ;
        scrollClaa  =inSvg.append('g')
            .attr('class','scrollG')
            .attr('transform','translate('+[0,0]+')')
        // .append("text").text("AS45555555555555555556DA");

        count =0 ;
        for (i=9; i<data.length ; i++){
        	let d = data[i] ;
        	console.log(d3.keys(d)[0])
            bar = scrollClaa.append('g')
				.attr('width', 100)
				.attr('height',150)
                .attr('transform','translate('+[ 10+ 105*count++,0]+')')

			showBorders(bar ) ;

        	bar.append('text')
				.attr('transform','translate('+[ 0,50]+')')
				.text(d3.keys(d)[0])
        }


    }


	function procData(d) {

		arr = [] ;

		for (i=0 ; i<d.length; i++) {
			ob = {} ;
			if (i<10){
				ob[d3.keys(d[i])[0]] = d3.values(d[i])[0];
				arr[i] = ob  ;
			} else{
                ob['Иные'] = d3.values(d[i])[0] + parseFloat(d3.values(arr[9]) ) ;
                arr[9] = ob  ;
			}
		}
		return arr ;
    }

	function breakLongText (str , limit) {
		str = str[0];

		if (str.length > limit){
			s="";
			if (str[limit-1]!=" ") for (i=limit;i< limit+10;i++) {
				if (str[i]==" ") {
					limit=i+1;
					break;
				}
			}
			s = "<tspan y='-20' x='0' dy='1.2em'>" + str.substr(0,limit) + "</tspan>" ;
			s += "<tspan x='0' dy='1.2em'>" + str.substr(limit) + "</tspan>" ;
			return s ;
		}
		else
			return str ;
	}

    function showBorders(canvas ) {
        g = canvas.append("g");
        line = d3.line().x(function(d) {return d[0];} ).y(function(d) { return d[1]} ) ;
        d = [
            [0,0] ,
            [0,getElemHeight(canvas)] ,
            [getElemWidth(canvas),getElemHeight(canvas)] ,
            [getElemWidth(canvas),0] ,
            [0,0] ,
        ]

        g.append("path")
            .attr("d", line(d))
            .attr('class','border')
            .attr("stroke-width", 4)
            .attr("stroke", "#CDD5DE")
        ;

    }

    function getElemWidth(el) {
        return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("width");
    }

    function getElemHeight(el) {
        return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("height");
    }







    min = 200 ;
	data.forEach(function(d,i){
		val = parseFloat(d3.values(d)) ; 
		if (val > min) min = val  ; 
	}) 

	de=1; deText = "руб.";
	min1 = parseFloat(min);
	len = Math.round(min1).toString().length;
	if (len <4) { de=1; deText = "руб."; }
	if (len <7 && len>3) {de = 1; deText = "руб."; }
	if (len <10 && len >6) { de=0.001 ; deText = "тыс. руб."; }
	if (len <13 && len >9) { de=0.000001 ; deText = "млн. руб."; }
	if (len <16 && len >12) { de=0.000000001 ; deText = "млрд. руб."; }
	if (len >15)  { de=0.000000000001 ; deText = "трлн. руб."; }





	
	legend = svg.append("g").attr("transform" , "translate("+[width/2 +150 , 50]+")");
	drawLegend(legend   );
	drawBase(center);


    inie = svg.append("g")
        .attr("class", "inie")
        .attr("transform", "translate("+[20 , 350  ]+")")
    ;
    drawInie(inie) ;
}








