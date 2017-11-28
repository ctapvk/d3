function drawGraph27(data , prop,  id ) {

    var svg2 = d3.select("#"+id),
        width = +svg2.attr("width"),
        height = +svg2.attr("height") ;


    var color = d3.scaleOrdinal(prop.colorsLeft);
    for (i in data)
        data[i].value.sort(function(x, y){ return d3.ascending(d3.values(y), d3.values(x)); }) ;

    data = countInnerDataForPie(data);
    g_gist4 = svg2.append('g')
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .attr("class" , "donut");

    innerDonut = g_gist4.append("g")
        .attr("class", "innerDonut");


    showPieLeft2(data );
    accr() ;


console.log(data);
svg2.append("text")
    .attr('transform','translate('+[25,15]+')' )
    .attr("class","captionTop")
    .text("Всего доходов на текущую дату : " + (data[0].sum + data[1].sum )  + " млн. руб.")
;



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
        });
        var path = d3.arc()
            .outerRadius(+prop['радиус'])
            .innerRadius( +prop['белая дырка внутри'] );
        var label = d3.arc()
            .outerRadius( +prop['радиус'] )
            .innerRadius( +prop['радиус'] / 3.5);

        var arc = innerDonut.selectAll(".arc")
            .data(pie(data)).enter().append("g")
            .attr("class", "arc");

        arc.append("path")
            .attr("d", path)
            .attr("fill", function(d , i ) {
                data[i].startAngle = d.startAngle ;
                data[i].endAngle = d.endAngle ;
                return color(d.data['name']); });

        arc.append("text")
            .attr("transform", function(d) {  return "translate(" + label.centroid(d) + ")"; })
            .attr('class','captionOnPie')
            .text(function(d) {  return ( (d.endAngle - d.startAngle)/6.28 * 100).toFixed(1)   + '%'; });
    }


    function showPiePercents(data , index){
        donut = g_gist4.append("g")
            .attr("class", "donut"+index);

        var radiusPlus = 40 ;

        var pie = d3.pie()
            .sortValues(function compare(a, b) {
                return b - a;
            })
            .value(function(d) { return d3.values(d);  })
            .startAngle(data[index].startAngle)
            .endAngle(data[index].endAngle) ;

        var path = d3.arc()
            .outerRadius(+prop['радиус'] + +prop['радиус гребешка'])
            .innerRadius(+prop['радиус']  ) ;
        var label = d3.arc()
            .outerRadius( +prop['радиус'] )
            .innerRadius( +prop['радиус'] + +prop['белая дырка внутри'] + +prop['радиус легенды гребешка']);
        var arc = donut.selectAll(".arc")
            .data(pie(data[index].value)).enter().append("g")
            .attr("class", "arc");


        var div = d3.select("#hide27").append("div")
            .attr("class", "tooltipBud")
            .style("opacity", 0);

        var red = d3.scaleLinear()
            .domain([0 , data[index].value.length  ]  )
            .range([ prop.colorsLeft[index] ,prop.gradientColor  ]);


        arc.append("path")
            .attr("d", path)
            .attr("fill", function(d , i ) { return prop.colorsComb[i] })
            .on("mousemove", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html( d3.keys(d.data) + " : "+ currencySwapNoCut(d3.values(d.data))+"</br>"+
                          "Доля в общих расходах :" + ((d.endAngle - d.startAngle)/6.28 * 100).toFixed(1)  +" % </br>   " )
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
        ;

        arc.append("text")
            .attr("transform", function(d) {  return "translate(" + label.centroid(d) + ")"; })
            .attr("text-anchor"  , "middle" )
            .attr("dy", "0.35em")
            .attr("font-family" , "sans-serif")
            .attr("font-size" , "14")
            .attr("fill" , "black")
            .attr("font-weight" , "bold")
            .text(function(d) {
                percfen = ( (d.endAngle - d.startAngle)/6.28 * 100).toFixed(1);
                if (percfen > 3)
                    return percfen + '%';
                else
                    return ""
            });
    }

    function currencySwapNoCut(d) {
        d= parseInt(parseFloat(d) );
        return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " руб.";
    }


    function cutLongText (str) {
        str = str[0];
        if (str.length > 25)
            return str.substr(0,25) + "..." ;
        else
            return str ;
    }


    function accr(){
        str1 = "";
        str1+=('<div class="accord"> ');

        for (i =0 ; i < data.length ;i ++) {

        var red = d3.scaleLinear()
            .domain([0 , data[i].value.length ]  )
            .range([ prop.colorsLeft[i] , prop.gradientColor  ]);

            rect5 = '<svg style="  top: 10; position: relative; " width="30" height="30"> '+
                '<rect width="20" height="20" transform="translate(5,5)" style="fill:'+ prop.colorsLeft[i]+'; " /> </svg>';

            str1+=('<button class="accordion27" count='+i+'>' );
            str1+=(' <div class="arrow right" id="arrToog'+ i  +'"> </div>' );
            str1+=( rect5 +data[i].name + '</button> ' );
            str1+=('<div class="panel">');
            data[i].value.sort(function(x, y){
                return d3.descending( parseFloat(d3.values(x)), parseFloat(d3.values(y)) );
            })
            // console.log(data[i].value);
            for (dat in data[i].value) {
                rect5 = '<svg style="   position: relative; top:3px; " width="30" height="30"   > '+
                    '<rect width="20" height="20" transform="translate(5,5)" style="fill:'+  prop.colorsComb[dat] +'; " /> </svg>';
                str1+=( '<table><tr> <td valign="top">'  + rect5 +
                    '  </td> <td width="200px"  >'+
                    '<p style="  padding: 0px;  text-align: left;"> '   +
                         d3.keys(data[i].value[dat])    +
                    ' </p> </td></tr></table>')
                ;
            }
            str1+=('</div>');
        }
        str1+=('</div>');

        d3.select("#str").html(str1);

        var acc = document.getElementsByClassName("accordion27");

        for (i = 0; i < acc.length; i++) {

            acc[i].onclick = function() {
                this.classList.toggle("active");
                // combleg
                showPiePercents(data , this.getAttribute("count"));


                document.getElementById("arrToog"+this.getAttribute("count") ).classList.toggle("right");

                if ( (this.className).indexOf("active") == -1) {
                    d3.selectAll("g .donut"+this.getAttribute("count")).remove();
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







}







