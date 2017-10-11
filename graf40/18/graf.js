function drawGraph18() {

    var svg2 = d3.select(".krug18"),
        width = +svg2.attr("width"),
        height = +svg2.attr("height") ;


    var color = d3.scaleOrdinal(prop18.colorsLeft);
    for (i in data18)
        data18[i].value.sort(function(x, y){ return d3.ascending(d3.values(y), d3.values(x)); }) ;

    data18 = countInnerDataForPie(data18);
    g_gist4 = svg2.append('g')
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .attr("class" , "donut");

    innerDonut = g_gist4.append("g")
        .attr("class", "innerDonut");


    showPieLeft2(data18 );
    accr() ;
    for (w22=0 ; w22<data18.length;w22++)
        showPiePercents(data18 ,w22);







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

    function showPieLeft2(data){

        var pie = d3.pie().sort(null).value(function(d) {
                    return d['sum'];
                })
            .padAngle( 0.04);;
        var path = d3.arc()
            .outerRadius(+prop18['радиус'])
            .innerRadius( +prop18['белая дырка внутри'] );
        var label = d3.arc()
            .outerRadius( +prop18['радиус'] )
            .innerRadius( +prop18['радиус'] / 3.5);

        var arc = innerDonut.selectAll(".arc")
            .data(pie(data)).enter().append("g")
            .attr("class", "arc");

        arc.append("path")
            .attr("d", path)
            .attr("fill", function(d , i ) {
                data18[i].startAngle = d.startAngle ;
                data18[i].endAngle = d.endAngle ;
                // console.log(color(d.data['name']));
                return prop18.colorsLeft[i]; });

        arc.append("text")
            .attr("transform", function(d) {  return "translate(" + label.centroid(d) + ")"; })
            .attr("text-anchor"  , "middle" )
            .attr("dy", "0.35em")
            .attr("font-family" , "sans-serif")
            .attr("font-size" , "14")
            .attr("fill" , "white")
            .attr("font-weight" , "bold")
            .text(function(d) {  return ( (d.endAngle - d.startAngle)/6.28 * 100).toFixed(1)   + '%'; });
    }


    function showPiePercents(data , index){

        donut = g_gist4.append("g")
            .attr("class", "donut"+index);
// console.log(data);
        var radiusPlus = 40 ;
        var red = d3.scaleLinear()
            .domain([0 , (data[index].sum / 6) ]  )
            .range(["white" , prop18.colorsLeft[index]  ]);
        var pie = d3.pie()
            .sortValues(function compare(a, b) {
                return b - a;
            })
            .value(function(d) { return d3.values(d);  })
            .startAngle(data[index].startAngle +0.02)
            .endAngle(data[index].endAngle - 0.02) ;

        var path = d3.arc()
            .outerRadius(+prop18['радиус'] + +prop18['радиус гребешка'])
            .innerRadius(+prop18['радиус'] + 5 ) ;
        var label = d3.arc()
            .outerRadius( +prop18['радиус'] )
            .innerRadius( +prop18['радиус'] + +prop18['белая дырка внутри'] + +prop18['радиус легенды гребешка']);
        var arc = donut.selectAll(".arc")
            .data(pie(data[index].value)).enter().append("g")
            .attr("class", "arc");

        arc.append("path")
            .attr("d", path)
            .attr("fill", function(d , i ) {  return prop18.colorsComb[i] ;  })
        ;

        arc.append("text")
            .attr("transform", function(d) {  return "translate(" + label.centroid(d) + ")"; })
            .attr("text-anchor"  , "middle" )
            .attr("dy", "0.35em")
            .attr("font-family" , "sans-serif")
            .attr("font-size" , "13")
            .attr("fill" , "black")
            .attr("font-weight" , "bold")
            .text(function(d , i) { return ( (d3.values(d.data) / data18[index].sum)* 100).toFixed(1)   + '%'; });
    }

    drawCaption(d3.select(".krug18"));
function drawCaption(canvas) {
    te = canvas.append("g").attr("transform", "translate( " + [ getElemWidth(canvas)/2 ,15]+  ")");

    te.append("text")
        .attr("class", "textCaption18")
        .text(prop18.header)
    ;
}


    function accr(){
        str1 = "";
        str1+=('<div class="accord"> ');
        for (i =0 ; i < data18.length ;i ++) {
            var red = d3.scaleLinear()
                .domain([0 , (data18[i].sum / 6) ]  )
                .range(["white" , prop18.colorsLeft[i]  ]);
            rect5 = '<svg style="  top: 10; position: relative; " width="30" height="30"> '+
                '<rect width="20" height="20" transform="translate(5,5)" style="fill:'+ prop18.colorsLeft[i] +'; " /> </svg>';

            str1+=('<button class="accordion18" count='+i+'>' );
            str1+=(' <div class="arrow right" id="arrToog'+ i  +'"> </div>' );
            str1+=( rect5 +'<div class="g18TextLegHeader">'+data18[i].name + '' );
            str1+=('<p class="g18TextLegHeaderSum"> ' + currencySwap(data18[i].sum) +  '</p> </div> </button> ' );
            str1+=('<div class="panel">');
            for (dat in data18[i].value) {
                rect5 = '<svg style="  top: 20px; position: relative; " width="30" height="30"   > '+
                    '<rect width="20" height="20" transform="translate(5,5)" style="fill:'+ prop18.colorsComb[dat] +'; " /> </svg>';
                str1+=('  <p  class="g18TextLegCaption"> ' + rect5 +  Object.keys(data18[i].value[dat])  + ' </p>');
                str1+=('  <p  class="g18TextLeg"> '  +  currencySwap(Object.values(data18[i].value[dat]) )   + '</p>');
            }
            str1+=('</div>');
        }
        str1+=('</div>');

        d3.select("#str").html(str1);

        var acc = document.getElementsByClassName("accordion18");

        for (i = 0; i < acc.length; i++) {

            acc[i].onclick = function() {
                this.classList.toggle("active");
                showPiePercents(data18 , this.getAttribute("count"));


                document.getElementById("arrToog"+this.getAttribute("count") ).classList.toggle("right");

                if ( (this.className).indexOf("active") == -1) {
                    // d3.selectAll("g .donut"+this.getAttribute("count")).remove();
                }


                var panel = this.nextElementSibling;
                if (panel.style.maxHeight){
                    panel.style.maxHeight = null;
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                }
            }
        }
    }


    function currencySwap(d) {
        // d = parseInt(d * 0.001);
        return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " тыс. руб. ";
    }

    function getElemWidth(el) {
        return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("width");
    }

    function getElemHeight(el) {
        return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("height");
    }




}







