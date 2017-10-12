function drawGraph20() {
// init block
    var svg = d3.select(".graf20");

    widthSvg = +svg.attr("width");
    heightSvg = +svg.attr("height");
    width = +svg.attr("width") ;
    height = +svg.attr("height");

    center = svg.append("g")
        .attr("class", "center")
        .attr("transform", "translate("+[ width/2,  height/2  ]+")")
    ;

    x = d3.scaleLinear()
        .domain([0  , 100 ] )
        .range([ 0 ,  +prop20.radius   ])
    ;

// init block



    function drawBase(canvas){
        te = canvas.append("g").attr("class" , "basePie");

        pie = d3.pie().padAngle(.09);
        arc = d3.arc();

        pie(data20.base.value).forEach( function (t, i ) {
            t.outerRadius = 200 ;  t.innerRadius = 30;
            te.append("path")
                .attr("fill" ,  prop20.colorsLeft[i] )
                .attr("d", arc(t))
            ;
        });

    }


drawBase(center);
}