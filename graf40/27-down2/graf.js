function drawGraph41(data , prop  , idgraf) {
    // init block
    div = d3.select("#hid42").append("div").attr("class", "tooltip").style("opacity", 0);
    var svg = d3.select("#"+idgraf);
    svg.selectAll("*").remove();

    widthSvg = +svg.attr("width");
    heightSvg = +svg.attr("height");
    width = +svg.attr("width") ;
    height = +svg.attr("height");

    center = svg.append("g")
        .attr("class", "center")
        .attr("transform", "translate("+[ width/2 , height/2]+")")
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

            let html  =     " <strong> " + d3.keys(data[i]) + ' </strong><br>' +
                        nameLegend + " : " + currencySwapWithText(d3.values(data[i])) + ' '  ; 
                        // " Доля в общем объеме долга : " + ((t.data / d3.sum(dat)).toFixed(3) * 100).toFixed(1) + '%'
            t.outerRadius = prop.radius ;  t.innerRadius = 55;
            te.append("path")
                .attr("fill" ,  prop.colorsKrug[i] )
                .attr("d", arc(t))
                .on("mousemove", function(d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html(html)
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
                                .on("mousemove", function(d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html(html)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                })

                .text( txt )
            ;
        });

    }



    function drawLegend(canvas) {
        te = canvas.append("g")
            .attr("transform" , "translate("+[ 50 ,  0]+")")
        ;

        data.forEach(function (d , i ) {
            leg = te.append("g").attr("transform" , "translate("+[ 0, i*55  ]+")");

            leg.append("text")
                .attr("class", "krugLegText").html( breakLongText(Object.keys(data[i]) ,0) )
            // .attr("class", "krugLegText").text( Object.keys(data[i])  )
            ;


            leg.append("rect")
                .attr("class" , "krugRectLeg")
                .attr("transform" , "translate("+[ -35,0 ]+")")
                .attr("fill", prop.colorsKrug[i])
            ;

        })
    }

    function currencySwapWithText(d) {
        d= parseInt(parseFloat(d)*0.000001 );
        return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " млн. руб.";
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

    function currencySwapNoCut(d) {
        d= parseInt(parseFloat(d) );
        return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")  ;
    }

    summ = 0;
    data.forEach(function (t, number) {
        summ+= parseFloat(d3.values(t));
    })
    svg.append("text")
        .attr('transform','translate('+[25,15]+')' )
        .attr("class","captionTop")
        .text("Всего доходов на текущую дату : " +currencySwapNoCut ( summ )  + " млн. руб.")
    ;


    le = d3.select("#grafLegend") ;
    legend = le.append("g").attr("transform" , "translate("+[50 , 50]+")");
    // drawLegend(legend   );
    drawBase(center);
}




function showTableLeg(data , prop , path) {

    if (path == 1 )
        d3.select('#pageStart').attr("value", (parseInt(d3.select('#pageStart')._groups["0"]["0"].value ) - 1 )) ;
    if (path == 2 )
        d3.select('#pageStart').attr("value", (parseInt(d3.select('#pageStart')._groups["0"]["0"].value ) +1 )) ;

    pageStart = parseInt(d3.select('#pageStart')._groups["0"]["0"].value ) ;
    pageSize = +prop.pageSize ;

    s="";
    len  = pageStart * pageSize  ;
    lenStart  = (pageStart-1) * pageSize ;
    pageCount  = Math.ceil(data.length/pageSize) ;
    if (pageStart >= pageCount ) len  = (pageStart-1) * pageSize + (data.length%pageSize) ;

    s+='<table class="pagerTable">';
    for (i=lenStart ; i<len ; i++){
        t= data[i];
        s+='<tr>';
        s+='<td>';
        s+='<svg width="25" height="25" >\n'+
            '<rect width="25" height="25" fill="'+ prop.colorsKrug[i] +'"></rect>\n'+
            '</svg>\n' ;
        s+='</td>';
        s+='<td style="text-align: left; ">';
        s+=d3.keys(t) ;
        s+='</td>';
        s+='</tr>';
    }
    s+='</table>';
    s+='<br>';
    if (pageStart==1)
        s+='<a"> <i class="arrow up"></i>  </a> ';
    else
        s+='<a onclick="showTableLeg(data42,prop42  , 1 ); "> <i class="arrow up"></i>  </a> ';
    s+=pageStart+ '/' + pageCount;

    if (pageStart<pageCount)
        s+=' <a onclick="showTableLeg(data42,prop42  , 2 ); ">   <i class="arrow down"></i> <a> ';
    else
        s+=' <a onclick="">  <i class="arrow down"></i> <a> ';
    s+='';
    s+='';
    d3.select("#str").html(s);



}



