
function drawGraph28my(data , prop  , idgraf ,  showAll) {
    div = d3.select("#hidGraph28my").append("div").attr("class", "tooltipGraph28my").style("opacity", 0);
// init block


    var svg = d3.select("#"+idgraf);
    svg.selectAll("*").remove();

    widthSvg = +svg.attr("width");
    heightSvg = +svg.attr("height");
    width = +svg.attr("width") ;
    height = +svg.attr("height");

    center = svg.append("g")
        .attr("class", "center")
        .attr("transform", "translate("+[  prop.inieTr, +prop.radius+30  ]+")")
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

if (showAll !=1)  dat1 = procData(data) ; else dat1 = data ; 
        dat = [];
        dat1.forEach(function (t) {
            dat.push((Object.values(t))[0])
        })

        pieDataLast = pie( dat )[dat1.length-1];
        raz =   (pieDataLast.endAngle - pieDataLast.startAngle)  + pieDataLast.startAngle*0.5;

        pie( dat ).forEach( function (t, i ) {
            t.outerRadius = prop.radius ;  t.innerRadius = 55;
            t.startAngle += raz ; t.endAngle +=raz;
            let per =(t.data / d3.sum(dat)).toFixed(3) * 100;

            let html =" Наименование : " + d3.keys(dat1[i]) + ' <br>' +
                " Объем показателя : " + currencySwapWithText(d3.values(dat1[i])) + ' <br>' +
                " Доля в общем объеме долга : " + (per).toFixed(1) + '%' ;

            te.append("path")
                .attr("fill" ,  prop.colorsKrug[i] )
                .attr("d", arc(t))
                .on("mousemove", function(d) {
                    div.transition().duration(200).style("opacity", .9);
                    div.html(html)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    div.transition().duration(500).style("opacity", 0);
                })
            ;


            if ( per >8)
                txt=( per).toFixed(1) + '%' ;   else txt="";

            te.append("text")
                .attr("class" , "krugPieTextLegendGraph28my")
                .attr("transform" , "translate(" + d3.arc().centroid(t) + ")")
                .text( txt )
                .on("mousemove", function(d) {
                    div.transition().duration(200).style("opacity", .9);
                    div.html(html)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    div.transition().duration(500).style("opacity", 0);
                })
            ;
        });

    }




    function drawLegend(canvas) {
        te = canvas.append("g")
            .attr("transform" , "translate("+[ 50 ,  0]+")")
        ;

if (showAll !=1)  dat1 = procData(data) ; else dat1 = data ; 
        yLegend = 0 ;
        dat1.forEach(function (d , i ) {

            strSize = 1 ;
            textLimt = 25 ;
            text = Object.keys(d)[0] ;
            if ((text.length /textLimt ) > 2 ) strSize = parseInt(text.length /textLimt ) - 1  ;
            diffY = 55-55* strSize ;
            yLegend += 55* strSize ;

if (showAll != 1)  ch2 = 5 ; else ch2 = Math.ceil(data.length/2) ; 
            if (i > ch2  ) xCoord = 350 ; else xCoord = 0 ;  ;
            yCoord = -50+ yLegend  ;
            if (i == (ch2+1))  {
                yLegend = 0 ;
                yLegend += 55* strSize ;
                yCoord = -50+ yLegend ;
            }
            // console.log(i, yCoord , diffY , strSize);
            leg = te.append("g").attr("transform" , "translate("+[ xCoord, yCoord  ]+")");


            tspan = currencySwap(Object.values(d) ) ;
            leg.append("text")
                .attr("class", "krugLegText")
                .attr("transform" , "translate("+[ 0,  -25 +diffY  ]+")")
                .html( breakLongTextLegend(text , textLimt ,  tspan )  )
            ;

            leg.append("rect")
                .attr("class" , "krugRectLeg")
                .attr('width',25)
                .attr('height',25)
                .attr("transform" , "translate("+[ -35,-33 +diffY ]+")")
                .attr("fill", prop.colorsKrug[i])
            ;

        })
    }

    function currencySwapWithText(d) {
        // d= parseInt(parseFloat(d)* de);
        return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " руб.";
    }
    function currencySwap(d) {
        d= parseInt(parseFloat(d)* de);
        return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " " + deText ;
    }



    function drawInie(canvas) {
        te = canvas.append('g').attr('width',50).attr('height',50)
            .attr('class','drawInie')
            .attr('transform', 'translate('+[0,20]+')')
        te.append("svg:image")
            .attr("transform","translate("+[ 0,-80 ]+")")
            .attr('width', prop.inieTr * 2)
            .attr('height', 80)
            .attr("xlink:href", "icons28/tr.png")
        ;


        scrollBar = te.append('g')
            .attr('class','scrollBar')
            .attr('transform','translate('+[0,150 + 5 ]+')')
        ;
        scrollBar.append('rect')
            .attr('width', prop.inieTr * 2)
            .attr('height',15)
            .attr('fill','#F1F2F4')

        valDef = -1 ;
        scrollBar.append("svg:image")
            .attr('class','back')
            .attr('width', 30)
            .attr('height',15)
            .attr("xlink:href", "icons28/left.png" )
            .on('click',function (d) {
                el = d3.select("#circleScroll");
                val = el.attr('x');
                moveVal = parseFloat(val)-20;
                // if (valDef ==-1) valDef=val ;

                if (moveVal > 20 ){
                    el.attr('x' , moveVal );
                    diffCount = data.length - 9 ;
                    xScroll = d3.scaleLinear()
                        .domain([valDef, prop.inieTr * 2-90])
                        .range([-90 ,  prop.legendWindth * diffCount - prop.inieTr * 2])
                    ;
                    d3.select(".scrollG")
                        .attr('transform','translate('+[ 10+ -xScroll(moveVal) ,0]+')')
                }
            })
        valDef = -1 ;
        scrollBar.append("svg:image")
            .attr('class','forward')
            .attr('width', 30)
            .attr('height',15)
            .attr("xlink:href", "icons28/right.png" )
            .attr('transform','translate('+[ prop.inieTr * 2 - 30,0]+')')
            .on('click',function (d) {
                el = d3.select("#circleScroll");
                val = el.attr('x');
                moveVal = parseFloat(val)+20;
                // if (valDef ==-1) valDef=val ;

                if (moveVal< prop.inieTr * 2-90 ){
                    el.attr('x' , moveVal );
                    diffCount = data.length - 9 ;
                    xScroll = d3.scaleLinear()
                        .domain([valDef, prop.inieTr * 2-90])
                        .range([-90 ,  prop.legendWindth * diffCount - prop.inieTr * 2])
                    ;
                    d3.select(".scrollG")
                        .attr('transform','translate('+[  -xScroll(moveVal) ,0]+')')
                }
            })





        scrollBar.append('rect')
            .attr('width', 60)
            .attr('height',15)
            .attr('id','circleScroll')
            .attr("x", 35 )
            .attr("y", 0 )
            .attr('fill','#C3C1C1')
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        function dragstarted(d) {
            d3.select(this).raise().classed("active", true);
        }

        valDef = -1 ; prefVal = 0  ; flag =1 ;
        function dragged(d) {
            el = d3.select("#circleScroll");
            val = parseFloat(el.attr('x')) ;

            if (flag ==1) {
                flag= 0  ;
                prefVal = d3.event.x ;
            }

            diffCount = data.length - 9 ;
            xScroll = d3.scaleLinear()
                .domain([valDef, prop.inieTr * 2-90])
                .range([ -90 ,  prop.legendWindth * diffCount - prop.inieTr * 2])
            ;
            diff = d3.event.x - prefVal ;
            cond = val < prop.inieTr * 2-90  && val > 40
                || (diff<0 && val >= prop.inieTr * 2-90 )
                || (diff>0 && val <= 40 )

            ;

            if (cond) {
                moveVal  = val + diff ;
                el.attr("x",  moveVal ) ;
                d3.select(".scrollG")
                    .attr('transform','translate('+[ -xScroll(moveVal)  ,0]+')')
                ;
                prefVal = d3.event.x ;
            }
        }

        function dragended(d) {
            flag =1 ;
            d3.select(this).classed("active", false);
        }


        inSvg = te.append('svg').attr('width',prop.inieTr * 2).attr('height',150) ;
        // showBorders(inSvg) ;
        scrollClaa  =inSvg.append('g')
            .attr('class','scrollG')
            .attr('transform','translate('+[0,0]+')')

        let count =0 ;
        for (let i=9; i<data.length ; i++){
            bar = scrollClaa.append('g')
                .attr('width', prop.legendWindth - 5)
                .attr('height',150)
                .attr('transform','translate('+[ prop.legendWindth *count++,0]+')')

            // showBorders(bar ) ;

            let text =d3.keys(data[i])[0] ;
            bar.append('rect')
                .attr('width',prop.legendWindth - 5)
                .attr('height',150)
                .attr('fill','#E2EDF0')
            bar.append('text')
                .attr('transform','translate('+[ prop.legendWindth / 2 ,20]+')')
                .attr('class','lablesText')
                .html(breakLongText(text , 15 ) )
            // .text(d3.keys(d)[0]  )

            sum = 0 ;
            data.forEach(function (t, number) {
                sum+= d3.values(t)[0];
            })
            curVal = d3.values(data[i])[0] ;
            per =  (curVal /sum *100  ).toFixed(1) + ' %' ;
            bar.append('text')
                .attr('transform','translate('+[ prop.legendWindth / 2 ,150 -15]+')')
                .attr('class','lablesPer')
                .text(per  )
        }

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
                s += "<tspan y='" + (-20 + 20 * count ) + "' x='0' dy='1.2em'>" +s1+ "</tspan>";
                limitStart = limit ;

                count++ ;
            }
            return s ;

        } else  return str ;
    }


    function breakLongTextLegend (str , limit , curr) {
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
                s += "<tspan  class='leg28Name' y='" + ( -20 +   15 * count ) + "' x='0' dy='1.2em'>" +s1+ "</tspan>";
                limitStart = limit ;

                count++ ;
            }
            s += "<tspan class=\"boldClass\" y='" + ( -20+  15 * count ) + "' x='0' dy='1.2em'>" +curr+ "</tspan>";
            return s ;

        } else  return "<tspan class='leg28Name' y='-20' x='0' dy='1.2em'>" +str+ "</tspan>" +
            "<tspan class=\"boldClass\" y='-5' x='0' dy='1.2em'>" +curr+ "</tspan>" ;
    }

    function procData(d) {

        arr = [] ;

        for (i=0 ; i<d.length; i++) {
            ob = {} ;
            if (i<10){
                ob[d3.keys(d[i])[0]] = d3.values(d[i])[0];
                arr[i] = ob  ;
            } else{
                ob['Иные'] = d3.values(d[i])[0] + parseFloat(d3.values(arr[9]) ) ;
                arr[9] = ob  ;
            }
        }
        return arr ;
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
            .attr('class','border')
            .attr("stroke-width", 4)
            .attr("stroke", "#CDD5DE")
        ;

    }

    function getElemWidth(el) {
        return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("width");
    }

    function getElemHeight(el) {
        return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("height");
    }







    min = 200 ;
    data.forEach(function(d,i){
        val = parseFloat(d3.values(d)) ;
        if (val > min) min = val  ;
    })

    de=1; deText = "руб.";
    min1 = parseFloat(min);
    len = Math.round(min1).toString().length;
    if (len <4) { de=1; deText = "руб."; }
    if (len <7 && len>3) {de = 1; deText = "руб."; }
    if (len <10 && len >6) { de=0.001 ; deText = "тыс. руб."; }
    if (len <13 && len >9) { de=0.000001 ; deText = "млн. руб."; }
    if (len <16 && len >12) { de=0.000000001 ; deText = "млрд. руб."; }
    if (len >15)  { de=0.000000000001 ; deText = "трлн. руб."; }






    if (showAll !=1 ){
        legend = svg.append("g").attr("transform" , "translate("+[prop.inieTr*2 +100 , 50]+")");
        drawLegend(legend   );
        drawBase(center);
        inie = svg.append("g")
            .attr("class", "inie")
            .attr("transform", "translate("+[20 , 350  ]+")")
        ;
        if (data.length>9)
            drawInie(inie) ;
    } else {
        legend = svg.append("g").attr("transform" , "translate("+[prop.inieTr*2 +100 , 50]+")");
        drawLegend(legend   );
        drawBase(center);
    }
}








