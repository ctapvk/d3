function drawGraph43(data , prop , id ) {

var svg = d3.select("#" + id );
svg.selectAll("*").remove();
div = d3.select("#hideGraph43").append("div").attr("class", "tooltipGraph43").style("opacity", 0);


    data.sort(function(x, y) {
        // console.log(x , y) ;
        return d3.ascending(x.name, y.name) ;
    }) ;
    // console.log(data)

svgWi = +svg.attr("width");

barSize = prop.stripSize ;
barHeight = prop.stripHeight ;
max = findMax(data);

    de=1; deText = "тыс. руб.";

    // console.log(max)
x = d3.scaleLinear()
    .domain([0,max])
    .range([0 , barSize - 160 ])
;


main = svg.append('g')
    .attr('class','main')
;

maxRows = 0 ;
data.forEach(function(d1,i1){
    if (maxRows < d1.vals.length ) maxRows =  d1.vals.length ;
})
maxRows++;

leftSideWidth = svgWi - barSize ;
data.forEach(function(d,i){
    bar = main.append('g')
        .attr('class','bar')
        .attr("width",leftSideWidth)
        .attr("height",maxRows * barHeight)
        .attr('transform','translate('+[0, (maxRows * barHeight + 10)*i +20 ]+')')
    ;

    graf = bar.append('g')
        .attr('class','graf')
        .attr("width",leftSideWidth)
        .attr("height",maxRows * barHeight)
        .attr('transform','translate('+[ leftSideWidth , 0 ]+')')
    ;

    d.vals.forEach(function(dvals, ivals){
        grafBar = graf.append('g')
            .attr('class','grafBar')
            .attr("width",barSize)
            .attr("height",barHeight)
            .attr('transform','translate('+[0, barHeight*ivals  ]+')')
        ;
        grafBar.append('text')
            .attr('transform','translate('+[-10,10 ]+')')
            .attr('class','yearTextCap')
            .text(d3.keys(dvals))
        ;
        reWi = x(d3.values(dvals)) ;
        grafBar.append('rect')
            .attr('transform','translate('+[0,5 ]+')')
            .attr('width', reWi)
            .attr('height',barHeight-5)
            .attr('fill', prop["colors"+(ivals+1)] )
            .on("mousemove", function() {
                div.transition().duration(200).style("opacity", .9);
                div.html(   " " + currencySwapNoCut(d3.values(dvals) ) )
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 30 ) + "px")
                ;
            })
            .on("mouseout", function() { div.transition().duration(500).style("opacity", 0); })
        ;
        grafBar.append('text')
            .attr('transform','translate('+[reWi + 8,10 ]+')')
            .attr('class','barTextCap')
            .text(currencySwap(d3.values(dvals)  ) )
        ;

        // showBorders(grafBar);

    })


    // showBorders(bar);

    bar.append('text')
        .attr('transform','translate('+[0,30 ]+')')
        .attr("class","text43")
        .html(breakLongText(d.name,23) )
})


    max = ( (maxRows * barHeight +10)*(data.length) )  +20  ;
    if (  max > +svg.attr("height") ) {
        svg.attr("height" , max  );
        d3.select('#someId43').attr('viewBox' , "0 0  1000 "+ max+ " ") ;
    }

    g = svg.append("g");
    line = d3.line().x(function(d) {return d[0];} ).y(function(d) { return d[1]} ) ;
    d = [
        [leftSideWidth,0] ,
        [leftSideWidth,svg.attr("height")]
    ]
    g.append("path")
        .attr("d", line(d))
        .attr('class','borders')
        .attr("stroke-width", 4)
        .attr("stroke", "#CDD5DE")
    ;


    function getElemWidth (el){
        return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("width");
    }
    function getElemHeight (el){
        return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("height");
    }

    function currencySwap(d) {
        d= (parseFloat(d) * de ).toFixed(2);
        d = d.toString().replace(".", ",")
        return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " " + deText;
    }

    function currencySwapNoCut(d) {
        d= (parseFloat(d) ).toFixed(2);
        d = d.toString().replace(".", ",")
        return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " " + deText;
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
            .attr('class','borders')
            .attr("stroke-width", 4)
            .attr("stroke", "#CDD5DE")
        ;

    }

    function breakLongText (str , limit) {
        limBack =limit ;
        if (str.length > limit){
            s=""; count=0  ; limitStart=0;
            while (limit < str.length && count < 10 ){
                if (str[limit]!=" ") {
                    for ( i = limitStart; i < str.length  ; i++) {
                        limit = i + 1;
                        if (str[i] == " " && (limit - limitStart) > limBack )  break;
                    }
                } else {
                    for ( i = limitStart; i < str.length  ; i++) {
                        limit = i + 1;
                        if (str[i] == " " && (limit - limitStart) > limBack )  break;
                    }
                }

                s1= str.substr(limitStart, limit - limitStart) ;
                // console.log(count , limitStart , limit ,s1);
                s += "<tspan y='" + (-20 + 20 * count ) + "' x='0' dy='1.2em'>" +s1+ "</tspan>";
                limitStart = limit ;

                count++ ;
            }
            return s ;

        } else  return str ;
    }

    function findMax(d) {
        max = 0 ;
        d.forEach(function(d1,i1){
            d1.vals.forEach(function(d2,i2){
                val = parseFloat(d3.values(d2))  ;
                if (max < val ) max = val ;
            })
        })
        return max ;
    }

}