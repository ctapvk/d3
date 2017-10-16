function drawGraph20(prop, data , index) {
// init block
    var svg = d3.select(".graf20");
    svg.selectAll("*").remove();
    d3.selectAll(".tooltip").remove();

    widthSvg = +svg.attr("width");
    heightSvg = +svg.attr("height");
    width = +svg.attr("width") ;
    height = +svg.attr("height");

    center = svg.append("g")
        .attr("class", "center")
        .attr("transform", "translate("+[ width/2,  +prop.radius + 10  ]+")")
    ;

    x = d3.scaleLinear()
        .domain([0  , 100 ] )
        .range([ +prop.radiusOfHole  ,  +prop.radius   ])
    ;

    div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

// init block



    function drawBase(canvas){
        te = canvas.append("g").attr("class" , "basePie");

        pie = d3.pie().padAngle(.0).sort(null);
        arc = d3.arc();

        pie(data.base.value).forEach( function (t, i ) {
            t.outerRadius = +prop.radius;  t.innerRadius = +prop.radiusOfHole ;
            te.append("path")
                .attr("fill" ,  prop.colorsBase[i] )
                .attr("d", arc(t))
                .on("mousemove", function(d) {
                    div.transition().duration(200).style("opacity", .9);
                    div.html( data.base.value[i] )
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    div.transition().duration(500).style("opacity", 0);
                })

            ;
        });

    }

    function drawOverBase(canvas , index){
        te = canvas.append("g").attr("class" , "OverPie");

        pie = d3.pie().padAngle(.0).sort(null);
        arc = d3.arc();
        label = d3.arc();


        pie(data.base.value).forEach( function (t, i ) {
            var per =   (data.vals[index].value[i]/ data.base.value[i]).toFixed(2)*100 ;
            t.outerRadius = x(per) ;  t.innerRadius = +prop.radiusOfHole;
            te.append("path")
                .attr("fill" ,  prop.colorsOverBase[i] )
                .attr("d", arc(t))
                .on("mousemove", function(d) {
                    div.transition().duration(200).style("opacity", .9);
                    div.html( data.vals[index].name+ ' : ' + data.vals[index].value[i]  +' ( '+ per + '% )' )
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    div.transition().duration(500).style("opacity", 0);
                })

            ;
            t.outerRadius = +prop.radiusOfHole+60 ;  t.innerRadius = +prop.radiusOfHole;
            if (per > 50)
            te.append("text")
                .attr("class" , "krugPieTextLegend")
                .attr("transform", "translate("+  label.centroid(t)+")")
                .text(per + '%')
            ;

        });

    }


drawBase(center);
drawOverBase(center , index);
}


te = d3.select("#graf20Legend");
s ='<div class="control-group">' ;
data20.vals.forEach(function(d, i) {
    // console.log(d);
    s+= '<label class="control control--radio" >' + d.name ;
    s+= '<input onclick="drawGraph20(prop20 ,data20 ,'+i +')" type="radio" name="radio"/>';
    s+= '<div class="control__indicator"></div>';
    s+= '</label>';

})
s+= "</div>";

te.html(s);