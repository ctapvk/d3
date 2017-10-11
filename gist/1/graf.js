function drawGraph26() {


function findMaxY(entries){
  var max = null;
  var entry = null;
  var key = null;
  var value = 0;
  for(var i in entries){
    entry = entries[i];
    for(var j in keys){
	    key = keys[j];
		  value = entry["value"];
		  if(max==null|| value>max){
		    max = value;
		  }
	  }
  }
  return max;
}

function getNextMax(maxY){
  var next = maxY.substr(0,1);
  var ost  = maxY.substr(1);
  ost = ost.replace(new RegExp("[0-9]", "g"), "0");
  return (parseInt(next)+2)  + ost;
}

function initCoords(data,keys){
  this.data   = data;
  this.keys   = keys;
  var entries = getEntries();
  var maxY = findMaxY(entries);
  var maxX = entries.length;

  x0.domain(data.map(function(d) { return d.State; }));
  x1.domain([0,maxX]);
  y.domain([0, maxY]).nice();  
  var t = y.ticks();
  var delta = t[1] - t[0];
  maxY = delta * 3 + maxY;
  y.domain([0, maxY]);
}

function initKeys(obj){
  var keys = [];
  var sign = false;
  for(var prop in obj) {
    if(sign) keys.push(prop); // key name
  	sign = true;
  }
  return keys;
}

function createViewers() {
  g.append("g").attr("class","pole")
    .selectAll("g")
    .data(data).enter().append("g")
  	.attr("class","viewer")
	  .attr("width","40px")
    .attr("transform", function(d) {
		  return "translate(" + x0(d.State) + ",0)";
	  });
}

function insertBarFields(){
	g.selectAll(".viewer")
    .each(function (row) {
	      var rect = document.createElementNS("http://www.w3.org/2000/svg","rect");
		    this.append(rect);
		    rect.setAttribute("class","bar");
		    var txt = document.createElementNS("http://www.w3.org/2000/svg","text");
		    this.append(txt);
		    txt.setAttribute("class","info");
		    rect = document.createElementNS("http://www.w3.org/2000/svg","rect");
		    this.append(rect);
		    rect.setAttribute("class","bar");
		    txt = document.createElementNS("http://www.w3.org/2000/svg","text");
		    this.append(txt);
		    txt.setAttribute("class","info");
	  });
}

function showXAxis(){
  var lineData = [{ "x": 0,   "y": 0},  { "x": width,  "y": 0}];
  var lineFunction = d3.line()
                          .x(function(d) { return d.x; })
                          .y(function(d) { return d.y; });
  var axisX     = g.append("g").attr("class","axisX");
  var lineGraph = axisX.append("path")
                          .attr("transform", "translate(0," + height + ")")
                          .attr("d", lineFunction(lineData))
                          .attr("stroke", "#CDD5DE")
                          .attr("stroke-width", 5)
                          .attr("fill", "none");
}

function showYAxis(){
	
  var lineData = [ { "x": 0,   "y": 0},  { "x": 0,  "y": -height}];
  var lineFunction = d3.line()
                          .x(function(d) { return d.x; })
                          .y(function(d) { return d.y; });
						  
						  
  var axisY = g.append("g").attr("class","axisY");
  var lineGraph = axisY.append("path")
                          .attr("transform", "translate(0," + height + ")")
                          .attr("d", lineFunction(lineData))
                          .attr("stroke", "#CDD5DE")
                          .attr("stroke-width", 4)
                          .attr("fill", "none");
  
  var ts = y.ticks();
  var jsonCircles = new Array();
  for ( var t in ts) {
	  if (t!=0)
		  jsonCircles.push({ "x_axis": 0, "y_axis":  y(ts[t]), "radius": 6, "color" : "CDD5DE"  , "text": ts[t] });
  }

  var circles = axisY.selectAll("circle")
                          .data(jsonCircles)
                          .enter()
                          .append("circle"); 

  var circleAttributes = circles
                       .attr("cx", function (d) { return d.x_axis; })
                       .attr("cy", function (d) { return d.y_axis; })
                       .attr("r", function (d) { return d.radius; })
                       .style("fill", function(d) { return d.color; }); 

  var text = axisY.selectAll("text")
                        .data(jsonCircles)
                        .enter()
                        .append("text");
  
  var textLabels = text
                 .attr("x", function(d) { return d.x_axis-30; })
                 .attr("y", function(d) { return d.y_axis + 5; })
                 .attr("text-anchor", "end")
                 .text( function (d) { return stringDivide(d.text); })
                 .attr("font-family", "sans-serif")
                 .attr("font-size", "14")
                 .attr("fill", "#CDD5DE");
}

function createEntry(code,key,value){
  return {code: code,  key: key,  value: value};
}

function getEntries(){
  var result = new Array();
  var entry = null;
  var row  = null;
  var key  = null;
  var a   = 0;
  for(var i in data) {
    row = data[i];
    for(var j in keys) {
	    key = keys[j];
	    entry = createEntry(a,key,row[key]);
      result.push(entry);
	    a++;
  	}
  }
  return result;
}

function mapRects(){
	var entries = getEntries();
	var rects = g.selectAll(".bar");
  rects.data(entries);
  d3.selectAll(".info").data(entries);	
}

function showRects(barSize){

  var div = d3.select("body").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

  g.selectAll(".bar")
        .attr("x", function(d) {
            //console.log("x=" + x1(d.code % 6));
            if (d.code % 2 != 0) {
                //tmp = Math.floor(x1(d.code % 6));
                //if (barSize % tmp != 0 && tmp > 0) tmp++;
                xx = barSize;
                console.log(xx);
                return xx;
            } else {
                return (barSize ) / 2;
            };
        })
        .attr("y", function(d) {
            //console.log("y=" + y(d.value));
            return y(d.value);
            })
        .attr("width", barSize)
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", function(d) { return z(d.key); })
        .on("mousemove", function(d) {
                var ind = Math.floor(d.code / 2);
                div.transition()        
                  .duration(200)      
                  .style("opacity", .9);      
                div.html(d.key + " в " +  data[ind]['State'] + " году </br> Объем показателя: </br> " +  stringDivide(d.value) + "руб." )  
                  .style("left", (d3.event.pageX) + "px")     
                  .style("top", (d3.event.pageY - 28) + "px");    
        })                  
        .on("mouseout", function(d) {       
            div.transition()        
                .duration(500)      
                .style("opacity", 0);   
        });
}

function showInfo(barSize){
	g.selectAll(".info")
        .attr("x", function(d) {
              //console.log("x=" + x1(d.code % 2));
              if (d.code % 2 != 0)
                return x1(d.code % 2)  + barSize/ 2;
              else {
                  return (barSize );
              }
        })
        .attr("y", function(d) {
            //console.log("y=" + y(d.value));
            if (d.code % 2 == 0)
                return y(d.value) - 5;
            else
                return y(d.value) + 25;
        })
        .attr("fill", function (d){
            if (d.code % 2 != 0)
                return "#fff"
            else
                return "#000"
        })
        .attr("width", barSize)
        .attr("text-anchor", "middle")
        .text(function (d){return stringDivide(d.value)});
}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
		    x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

function showGridForX(barSize){
  var axisX  = d3.select(".axisX")
                    .append("g")
	                  .attr("class","gridX");
	  
  axisX.selectAll('.tickX').data(data).enter().append("text").attr("class","tickX") ;


  /* d3.selectAll('.tickX').each(function (row) {
			console.log(row.State);
			var txt = document.createElementNS("http://www.w3.org/2000/svg","text");
			this.append(txt);
			txt.setAttribute("class","tickX");
		  
   });
  d3.selectAll(".tickX").data(data);    */


	var tickText = axisX.selectAll(".tickX");
	tickText
	  .attr("x",function(row) {return x0(row.State) + barSize ; })
	  .attr("y",function(row) {return height + 10; })
	  .attr("width",100)
	  .attr("height",50)
	  .attr("dy",1)
	  .text(function (row){ 
		  return row.State;
	  }).each(function (d){
	     d3.select(this).call(wrap,barSize/2);
	  }) 
}

function showLegend() {
	indent = 40 ;
	  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 14)
      .attr("text-anchor", "start")
      .selectAll("g")
      .data(keys.slice() )
      .enter().append("g")
      //.attr("transform", function(d, i) { return "translate(" + (i * 120  - width+ 250 ) + ","+ (height + 10)+" )"; });
	    .attr("transform", function(d, i) { return "translate(" + (i * 80) + ", 0 )"; });

	  
	legend.append("rect")
	      .attr("x", 10)
	      .attr("y", height + indent)
	      .attr("width", 19)
	      .attr("height", 19)
	      .attr("fill", z);

	  legend.append("text")
	      .attr("x", 35)
	      .attr("y", height + 9.5 +indent)
	      .attr("dy", "0.32em")
	      .text(function(d) { return d; });
}


function stringDivide(val) {
  var v = val.toString();
  var r = v.split('').reverse().join('');
  r = r.replace(/\d{1,3}/g,' $&');
  r = r.split('').reverse().join('');
  return r;
}

var svg = d3.select(".graf26"),
    margin = {top: 20, right: 20, bottom: 70, left: 140},
    width = + svg.attr("width") - margin.left - margin.right,
    height = + svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

var x1 = d3.scaleLinear().rangeRound([0, width]);
var y = d3.scaleLinear().rangeRound([height, 0]);
var z = d3.scaleOrdinal().range([ "#f6bd68", "#009cff"]);



  data26 =   [
        {"State":"2015", "План":760000, "Факт":600000},
        {"State":"2016", "План":850000, "Факт":680000},
        {"State":"2017", "План":800000, "Факт":700000},
        {"State":"2018", "План":900000, "Факт":0},
        {"State":"2019", "План":870000, "Факт":0}
    ];

  var obj = data26[0];
  var keys = [];
  
  keys = initKeys(obj);
  initCoords(data26,keys);
  
  createViewers();
  insertBarFields();
  showXAxis();
  showYAxis();
  mapRects();
  showLegend();
	  
  var barSize = width / (data26.length * 2)
  showRects(barSize);
  showInfo(barSize);
  showGridForX(barSize);


}