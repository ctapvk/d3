function drawGraph37(data , prop) {

var svg = d3.select(".graf37");
barSize = +prop.barSize;
main = svg.append("g").attr("class" , "main").attr("transform" , "translate("+[ 0 , 30 ]+")") ;

x = d3.scaleLinear()
    .domain([0,100])
    .range([0 , barSize ])
;
div = d3.select("#poipup").append("div").attr("class", "tooltip").style("opacity", 0);

data.forEach(function (t, i ) {

    gist = main.append("g").attr("transform" , "translate("+[ 0 , i*80 ]+")").attr("class" , "gist") ;

    text = gist.append("g").attr("transform" , "translate("+[ 20 ,30]+")").attr("class" , "textLegend37") ;
    text.append("text").html(breakLongText(Object.keys(t) , 25));

    propgress = gist.append("g").attr("transform" , "translate("+[ 350 ,10]+")").attr("class" , "propgress") ;

    dat = d3.values(t)[0];
    per = ((dat[0] / dat[1]) *100).toFixed(1) ;
    // console.log(dat) ;

    propgress.append("rect")
        .attr("width" , barSize)
        .attr("height" , +prop.barHeight)
        .attr("fill" , prop.colorPlan )
        .on("mousemove", function() {
            div.transition().duration(200).style("opacity", .9);
            div.html(   "План :  " + currencySwapNoCut(d3.values(t)[0][1] ) )
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 30 ) + "px")
            ;
        })
        .on("mouseout", function() { div.transition().duration(500).style("opacity", 0); })
    ;

    if (per> 100) perW=100;  else perW=per;
    propgress.append("rect")
        .attr("width" , x(perW))
        .attr("height" ,  +prop.barHeight)
        .attr("fill" , prop.colorDone )
        .on("mousemove", function() {
            div.transition().duration(200).style("opacity", .9);
            div.html(   "Исполнено :  " + currencySwapNoCut(d3.values(t)[0][0] ) )
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 30 ) + "px")
            ;
        })
        .on("mouseout", function() { div.transition().duration(500).style("opacity", 0); })
    ;

    if (per !=0 && per<95)
    propgress.append("circle")
        .attr("fill" , prop.colorDone)
        .attr("r", +prop.barHeight/2)
        .attr("transform" , "translate("+[ x(per) ,+prop.barHeight/2]+")")
        .on("mousemove", function() {
            div.transition().duration(200).style("opacity", .9);
            div.html(   "Исполнено :  " + currencySwapNoCut(d3.values(t)[0][0] ) )
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 30 ) + "px")
            ;
        })
        .on("mouseout", function() { div.transition().duration(500).style("opacity", 0); })

    ;

    propgress.append("text")
        .attr("transform" , "translate("+[ 10 ,+prop.barHeight/2]+")")
        .attr("class" , "textBar")
        .text(per + '%')
    ;

    propgress.append("text")
        .attr("transform" , "translate("+[ x(perW) ,  -10]+")")
        .attr("class" , "textUpBar")
        .text(currencySwapWithText( d3.values(t) [0][1] ))
    ;



    text = gist.append("g").attr("transform" , "translate("+[ 350+ barSize +50 ,35]+")").attr("class" , "textLegendRight37") ;
    text.append("text").html(currencySwapWithText( d3.values(t) [0][1] ));


    if (i == data.length-1){
        text= gist.append("g").attr("transform" , "translate("+[ 350   ,80 ]+")");
        te = text.append("g").attr("transform" , "translate("+[ 0   ,0 ]+")");
        te.append("text")
            .attr("class" , "legendText")
            .attr("transform" , "translate(" + [ 35,17] + ")")
            .text("Исполнено")
        ;
        te.append("rect")
            .attr("fill" , prop.colorDone)
            .attr("width" , 25)
            .attr("height" , 25)
        ;
        te = text.append("g").attr("transform" , "translate("+[ 180   ,0 ]+")");
        te.append("text")
            .attr("class" , "legendText")
            .attr("transform" , "translate(" + [ 35,17] + ")")
            .text("План")
        ;
        te.append("rect")
            .attr("fill" , prop.colorPlan)
            .attr("width" , 25)
            .attr("height" , 25)
        ;

    }

})



    function currencySwapWithText(d) {
        d= parseFloat( (parseFloat(d)*0.000001 ).toFixed(1)  ) ;
        d = d.toString().replace(".", ",")
        return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " млн. руб.";
    }


    function currencySwapNoCut(d) {
        d= parseInt(parseFloat(d) );
        d = d.toString().replace(".", ",")
        return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " руб.";
    }


    function breakLongText (str , limit) {
        str = str[0];

        if (str.length > limit){
            s="";
            if (str[limit-1]!=" ") for (i=limit;i< limit+10;i++) {
                if (str[i]==" ") {
                    limit=i;
                    break;
                }
            }
            s = "<tspan y='-40' x='0' dy='1.2em'>" + str.substr(0,limit) + "</tspan>" ;
            if (str[limit]!=' ') sap=1 ; else sap=0;
            s += "<tspan x='0' dy='1.2em'>" + str.substr(limit-sap) + "</tspan>" ;
            return s ;
        }
        else
            return str ;
    }

}