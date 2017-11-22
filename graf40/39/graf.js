function drawGraph37(data ,prop , id) {

    var svg = d3.select("#" + id);

    widthSvg = +svg.attr("width");
    heightSvg = +svg.attr("height");
    width = +svg.attr("width") - +(prop.paddingLeft)- +(prop.paddingRight);
    height = +svg.attr("height") - +(prop.paddingBottom) - +prop.paddingTop;


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
                .attr("r",16)
                .attr('fill','white')
            ;
            te.append("circle")
                .attr('transform','translate('+arc.centroid(t) +')')
                .attr("r",13)
                .attr('fill','blue')
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
        });

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
                .text(data[i].valIn)
            ;
            tet.append("text")
                .attr('transform','translate('+[0,20]+')')
                .attr('class','inner39textCapiton')
                .text('млн. руб.')
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


    // console.log(data , svg)

}