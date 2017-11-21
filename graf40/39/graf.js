function drawGraph37(data ,prop , id) {

    var svg = d3.select("#" + id);

    widthSvg = +svg.attr("width");
    heightSvg = +svg.attr("height");
    width = +svg.attr("width") - +(prop.paddingLeft)- +(prop.paddingRight);
    height = +svg.attr("height") - +(prop.paddingBottom) - +prop.paddingTop;


    topBar = svg.append("g").attr("transform",'translate('+[30,30]+')');


    data.forEach(function (t, number) {
        te = topBar.append("g").attr("transform",'translate('+[100 + number*220,100]+')') ;
        te.append('circle')
            .attr('r',100)
            .attr('fill','#acc')
        ;
        te.append('circle')
            .attr('r',80)
            .attr('fill','#00f')
        ;
        te.append('circle')
            .attr('r',70)
            .attr('fill','#fff')
        ;

    })

    console.log(data , svg)

}