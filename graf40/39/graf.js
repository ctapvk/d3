function drawGraph37(data ,prop , id) {

    var svg = d3.select("#" + id);

    widthSvg = +svg.attr("width");
    heightSvg = +svg.attr("height");
    width = +svg.attr("width") - +(prop.paddingLeft)- +(prop.paddingRight);
    height = +svg.attr("height") - +(prop.paddingBottom) - +prop.paddingTop;

    div = d3.select("#divGraph39").append("div").attr("class", "tooltipGraph39").style("opacity", 0);

    max = 500000000;
    len = max.toString().length;
    if (len <4) { de=1; deText = "руб."; }
    if (len <7 && len>3) {de = 0.001; deText = "тыс. руб."; }
    if (len <10 && len >6) { de=0.000001 ; deText = "млн. руб."; }
    if (len <13 && len >9) { de=0.000000001 ; deText = "млрд. руб."; }
    if (len <16 && len >12) { de=0.000000000001 ; deText = "трлн. руб."; }
    if (len >15)  { de=0.000000000000001 ; deText = "квинт. руб."; }
    de=1 ; deText = "млн. руб.";


    topBar = svg.append("g").attr("transform",'translate('+[widthSvg/2,heightSvg/2]+')');

    drawPie(topBar);


    function drawPie(canvas){
        te = canvas.append("g").attr("class" , "basePie");

        pie = d3.pie()
            .padAngle(.015)
            .startAngle(-Math.PI*0.5)
            .endAngle(Math.PI*0.5 )
        ;
        arc = d3.arc();

        pie([1,1,1,1]).forEach( function (t, i ) {
            t.outerRadius = prop.outerRadius ;
            t.innerRadius = prop.innerRadius;
            te.append("path")
                .attr("fill" , prop.colorPie )
                .attr("d", arc(t))
            ;

            tstart = t.startAngle ;
            touterR = t.outerRadius;

            t.startAngle += -Math.PI*0.23 ;
            t.outerRadius = prop.outerRadius +105 ;
            te.append("circle")
                .attr('transform','translate('+arc.centroid(t) +')')
                .attr("r",prop.infoRadius)
                .attr('fill','white')
            ;

            text = [
                {"сувенции" : "  этото  фыв фыв фыв фыв фыв фыв фыв фыв фыв фыв фыв фыв фыв фыв фыв"} ,
                {"сувенции" : "  этото  фыв фыв фыв фыв фыв фыв фыв фыв фыв фыв фыв фыв фыв фыв фыв"} ,
                {"сувенции" : "  этото  фыв фыв фыв фыв фыв фыв фыв фыв фыв фыв фыв фыв фыв фыв фыв"} ,
                {"иные межбюдженые отношения" : "  этото  фыв фыв фыв фыв фыв фыв фыв фыв фыв фыв фыв фыв фыв фыв фыв"} ,
            ]
            let html = "";
            html+= "<h2>"+d3.keys(text[i])+"</h2>" ;
            html+= "<p>"+d3.values(text[i]) +"</p>" ;
            te.append("circle")
                .attr('transform','translate('+arc.centroid(t) +')')
                .attr('class','cericleHover')
                .attr("r",prop.infoRadius-4)
                .attr('fill','#8FD0FF')
                .on("mousemove", function() {
                    div.transition().duration(200).style("opacity", .9);
                    div.html(  html  )
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 30 ) + "px")
                    ;
                })
                .on("mouseout", function() { div.transition().duration(500).style("opacity", 0); })
            ;

            te.append('text')
                .attr('transform','translate('+arc.centroid(t) +')')
                .attr('class','italicWhite')
                .text('i')
                .on("mousemove", function() {
                    div.transition().duration(200).style("opacity", .9);
                    div.html(  html  )
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 30 ) + "px")
                    ;
                })
                .on("mouseout", function() { div.transition().duration(500).style("opacity", 0); })

            ;

            tt =  tstart.toFixed(2);
            // console.log(tt);
            if (tt >= 0  ) t.startAngle = tstart - 0.3 ;  else t.startAngle =tstart + 0.3 ;
            if (i==0){
                t.outerRadius = touterR -40 ;
                te.append('text')
                    .attr('transform','translate('+arc.centroid(t) +')')
                    .attr('class','pieCaption')
                    .html(breakLongText(data[i].name , 3))
                ;
            }
            if (i==1) {
                t.outerRadius = touterR+20 ;
                te.append('text')
                    .attr('transform','translate('+arc.centroid(t) +')')
                    .attr('class','pieCaption')
                    .html(breakLongText(data[i].name , 3))
                ;

            }

            if (i==2) {
                t.outerRadius = touterR+20 ;
                te.append('text')
                    .attr('transform','translate('+arc.centroid(t) +')')
                    .attr('class','pieCaption')
                    .html(breakLongText(data[i].name , 3))
                ;

            }

            if (i==3) {
                t.outerRadius = touterR+110 ;
                te.append('text')
                    .attr('transform','translate('+arc.centroid(t) +')')
                    .attr('class','pieCaption')
                    .html(breakLongText(data[i].name ,4))
                ;

            }




            // console.log(t)
        });

        pie([1,1,1,1]).forEach( function (t, i ) {
            t.outerRadius = prop.innerRadius + 7 ;
            t.innerRadius = prop.innerRadius;
            te.append("path")
                .attr("fill" , prop.colorPieDown )
                .attr("d", arc(t))
            ;

            // icons = te.append('g').attr('transform','translate('+[]+')')
            tstart = t.startAngle ;
            touterR = t.outerRadius;

            t.startAngle += -Math.PI*0.23 ;
            t.outerRadius = prop.outerRadius +10 ;
            tt =  tstart.toFixed(2);
            // console.log(tt);
            if (tt >= 0  ) t.startAngle = tstart  +0.4 ;  else t.startAngle =tstart - 0.4 ;
            x = arc.centroid(t)[0] ; y = arc.centroid(t)[1];
            te.append("svg:image")
                .attr("transform","translate("+[x-40,y-40]+")")
                .attr('width', 80)
                .attr('height', 80)
                .attr("xlink:href", "pics39/"+(i+1)+".png" )
            ;

        });

        size = 150 ;
        canvas.append("svg:image")
            .attr("transform","translate("+[ -size /2 , -size/2 -size /2]+")")
            .attr('width', size)
            .attr('height', size)
            .attr("xlink:href", "pics39/wallet.png" )
        ;


        // arrUP ==================
        arrUP  = canvas.append('g').attr('transform','translate('+[0,-180]+')')
        arrUP.append("svg:image")
            .attr("transform","translate("+[ -size /2 , -size/2 -size /2]+")")
            .attr('width', size)
            .attr('height', size)
            .attr("xlink:href", "pics39/arrow.png" )
        ;
        arrUP.append('text')
            .attr('class','arrTextUpperCase')
            .attr('transform','translate('+[0,-110]+')')
            .html(breakLongText("из других уровней бюджета" , 10 ))
        ;
        arrUP.append('text')
            .attr('class','arrTextUpperCaseShadow')
            .attr('transform','translate('+[0,10]+')')
            .html(breakLongText("получаемые" , 10 ))
        ;
        // ==================

        // arrDOWN ==================
        arrDOWN = canvas.append('g').attr('transform','translate('+[0,160]+')')
        arrDOWN.append("svg:image")
            .attr("transform","translate("+[ -size /2 , 20-size/2 -size /2]+")")
            .attr('width', size)
            .attr('height', size)
            .attr("xlink:href", "pics39/arrow.png" )
        ;
        arrDOWN.append('text')
            .attr('class','arrTextUpperCaseHead')
            .attr('transform','translate('+[0,-130]+')')
            .html(breakLongText("бюджет волгорадской области" , 33 ))
        ;
        arrDOWN.append('text')
            .attr('class','arrTextUpperCaseShadow')
            .attr('transform','translate('+[0,-100]+')')
            .html(breakLongText("передаваемые" , 10 ))
        ;
        // ==================


        // ==================
        valOut = canvas.append('g').attr('transform','translate('+[0,160]+')') ;
        for (i=0 ;  i<2 ; i++){
            tet = valOut.append('g').attr('transform','translate('+[110* i - prop.innerRadius +90,0] +')') ;
            tet.append("text")
                .attr('class','inner39textVal')
                .text(currencySwap(data[i].valOut) )
            ;
            tet.append("text")
                .attr('transform','translate('+[0,20]+')')
                .attr('class','inner39textCapiton')
                .text(deText)
            ;
        }

        valOut = canvas.append('g').attr('transform','translate('+[0,160]+')') ;
        for (i=0 ;  i<2 ; i++){
            tet = valOut.append('g').attr('transform','translate('+[110* i  +110,0] +')') ;
            tet.append("text")
                .attr('class','inner39textVal')
                .text(currencySwap(data[i+2].valOut) )
            ;
            tet.append("text")
                .attr('transform','translate('+[0,20]+')')
                .attr('class','inner39textCapiton')
                .text(deText)
            ;
        }

        // ==================


        downRect = canvas.append('g')
            .attr('transform','translate('+[0,200]+')')
        ;
        downRect.append('rect')
            .attr('transform','translate('+[-+prop.innerRadius,0]+')')
            .attr('width',+prop.innerRadius*2)
            .attr('height','110')
            .attr('fill','#E9EDF1')
        ;
        downRect.append('text')
            .attr('class','arrTextUpperCaseHead')
            .attr('transform','translate('+[0,50]+')')
            .html(breakLongText("бюджеты муниципальных образований волгорадской области" , 30 ))
        ;








        te2 = canvas.append("g").attr("class" , "te2");
        pie([1,1,1,1]).forEach( function (t, i ) {
            t.outerRadius = prop.innerRadius + 14 ;
            t.innerRadius = prop.innerRadius +7;
            te2.append("path")
                .attr("fill" , prop.colorPieUp)
                .attr("d", arc(t))
            ;


            t.outerRadius = prop.innerRadius +100 ;
            t.innerRadius =50 +7;
            tet = te2.append('g').attr('transform','translate('+arc.centroid(t) +')') ;
            tet.append("text")
                .attr('class','inner39textVal')
                .text(currencySwap(data[i].valIn) )
            ;
            tet.append("text")
                .attr('transform','translate('+[0,20]+')')
                .attr('class','inner39textCapiton')
                .text(deText)
            ;


        });

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


    function currencySwap(d) {
        d = parseInt(d * de) ;
        return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + "";
    }

    // console.log(data , svg)

}