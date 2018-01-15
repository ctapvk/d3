function drawGraph37(data , prop) {

var svg = d3.select(".graf37");
barSize = +prop.barSize;
widthBar = (barSize+1)*11;


data.sort(function(x, y) { return d3.ascending(x.order, y.order) ;  }) ;

monthNamesShort= ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
        'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']

main = svg.append("g").attr("class" , "main").attr("transform" , "translate("+[ 0 , 30 ]+")") ;

x = d3.scaleLinear()
    .domain([0,11])
    .range([0 , widthBar ])
;
    mounth = main.append("g")
        .attr("transform" , "translate("+[ 0 , -5  ]+")")
        .attr("class" , "gist") ;

monthNamesShort.forEach(function (t, number) {
    m = mounth.append("g")
        .attr("transform","translate("+[x(number)+50 + barSize/2 , 0]+")");

    m.append("text")
        .attr("class","mountthTxt")
        .text(t);
    m.append("rect")
        .attr("transform" , "translate("+[ 0 ,5]+")")
        .attr("width" , 2)
        .attr("height" , 10)
        .attr("fill" ,"#DADFE6" )
})
data.forEach(function (t, i ) {

    gist = main.append("g")
        .attr("transform" , "translate("+[ 0 , i*(+prop.barHeight + 15 )  ]+")")
        .attr("class" , "gist") ;

    for ( j=0; j<12;j++){

    propgress = gist.append("g")
        .attr("transform" , "translate("+[ 50 ,10]+")")
        .attr("class" , "propgress") ;

    propgress.append("rect")
        .attr("transform" , "translate("+[ x(j) ,10]+")")
        .attr("width" , barSize)
        .attr("height" , +prop.barHeight)
        .attr("fill" , function () {
          if (t.vals[j]!=1) return prop.colorPlan; else return prop.colors[i];
        } )
    ;

    }
    propgress.append("text")
        .attr("transform" , "translate("+[ widthBar+ +prop.barSize + 10,+prop.barHeight]+")")
        .attr("class" , "leftTextCap")
        .text(t.name)
    ;

    propgress.append("text")
        .attr("transform" , "translate("+[-15 ,+prop.barHeight +5]+")")
        .attr("class" , "leftBigDigit")
        .text( (i+1))
    ;
    propgress.append("rect")
        .attr("transform" , "translate("+[-15 ,10]+")")
        .attr("width" , 3)
        .attr("height" , +prop.barHeight)
        .attr("fill" ,  prop.colors[i])
    ;






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