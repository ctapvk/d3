


div = d3.select("#hid41").append("div").attr("class", "tooltip").style("opacity", 0);


    function drawGraph41(data , prop  ) {
// init block
        var svg = d3.select(".graf41");
        svg.selectAll("*").remove();

        widthSvg = +svg.attr("width");
        heightSvg = +svg.attr("height");
        width = +svg.attr("width") ;
        height = +svg.attr("height");

        center = svg.append("g")
            .attr("class", "center")
            .attr("transform", "translate("+[ width/2, +prop.radius+30  ]+")")
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

            dat = [];
            data.forEach(function (t) {
                dat.push((Object.values(t))[0])
            })


            pie( dat ).forEach( function (t, i ) {
                t.outerRadius = prop.radius ;  t.innerRadius = 35;
                te.append("path")
                    .attr("fill" ,  prop.colorsKrug[i] )
                    .attr("d", arc(t))
                    .on("mousemove", function(d) {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html(
                            Object.keys(data[i]) +" : " + ((t.data / d3.sum(dat)).toFixed(3) * 100).toFixed(1) + '%'  )
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
                    .attr("class" , "krugPieTextLegend")
                    .attr("transform" , "translate(" + d3.arc().centroid(t) + ")")
                    .text( txt )
                ;
            });

        }



        function drawLegend(canvas) {
            te = canvas.append("g")
                .attr("transform" , "translate("+[ 50 ,  +prop.radius*2 + 80 ]+")")
            ;
            caps = ["Поступления в ФБ","Поступления в бюджет Волгоградской области"];
            data.forEach(function (d , i ) {
                leg = te.append("g").attr("transform" , "translate("+[ 0, i*40  ]+")");

                leg.append("text")
                    .attr("class", "krugLegText").html( breakLongText(Object.keys(data[i]) , 18) )
                // .attr("class", "krugLegText").text( Object.keys(data[i])  )
                ;


                leg.append("rect")
                    .attr("class" , "krugRectLeg")
                    .attr("transform" , "translate("+[ -35,-18 ]+")")
                    .attr("fill", prop.colorsKrug[i])
                ;

            })
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


        drawLegend(svg);
        drawBase(center);
}





