function drawGraph37(data , prop , id ) {

var svg = d3.select("#" + id );
svg.selectAll("*").remove();

main = svg.append('g')
    .attr('class','main')
;

data.forEach(function(d,i){
    bar = main.append('g')
        .attr('class','bar')
        .attr("width",200)
        .attr("height",200)
        .attr('transform','translate('+[0, 80*i +20 ]+')')
    ;

    showBorders(bar);

    bar.append('text')
        .text(d.name)
    console.log(d ) ;
})






    function getElemWidth (el){
        return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("width");
    }
    function getElemHeight (el){
        return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("height");
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
}