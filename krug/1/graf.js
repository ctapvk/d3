    var width = 200;
    var height = 200;
    var margin = 25;

    var color = d3.scale.ordinal()
		.range(["url(#linear-gradient)" , "#037cd3"]);
    
    var radius = Math.min(width - 2*margin, height - 2*margin)/2;

    var radiusSmall = margin;
    
    var plainName = 'План';
    var doneName = 'Исполнено';
    var executedName = ['Доходы', 'executed'];
    var costsName = ['Расходы', 'costs'];
    var deficitName = ['Дефицит/профицит', 'deficit'];
    
    var diagramRegion = {
           "pz": [20882417000, 19797866000, 20882417000, 18797866000, 20882417000, 17797866000],
		   "ur": [21882417000, 19797866000, 21882417000, 19797866000, 21882417000, 19797866000],
		   "cr": [22882417000, 19797866000, 22882417000, 19797866000, 22882417000, 19797866000],
		   "sa": [23882417000, 19797866000, 23882417000, 19797866000, 23882417000, 19797866000],
		   "so": [24882417000, 19797866000, 24882417000, 19797866000, 24882417000, 19797866000],
		   "kb": [25882417000, 19797866000, 25882417000, 19797866000, 25882417000, 19797866000],
		   "kc": [26882417000, 19797866000, 26882417000, 19797866000, 26882417000, 19797866000],
		   "st": [27882417000, 19797866000, 27882417000, 19797866000, 27882417000, 19797866000],
		   "ks": [28882417000, 19797866000, 28882417000, 19797866000, 28882417000, 19797866000],
		   "ro": [29882417000, 19797866000, 29882417000, 19797866000, 29882417000, 19797866000],
		   "kk": [30882417000, 19797866000, 30882417000, 19797866000, 30882417000, 19797866000],
		   "as": [31882417000, 19797866000, 31882417000, 19797866000, 31882417000, 19797866000],
		   "ad": [32882417000, 19797866000, 32882417000, 19797866000, 32882417000, 19797866000],
		   "vl": [33882417000, 19797866000, 33882417000, 19797866000, 33882417000, 19797866000],  
		   "vn": [34882417000, 19797866000, 34882417000, 19797866000, 34882417000, 19797866000],
		   "bl": [35882417000, 19797866000, 35882417000, 19797866000, 35882417000, 19797866000],
		   "ky": [36882417000, 19797866000, 36882417000, 19797866000, 36882417000, 19797866000],
		   "or": [37882417000, 19797866000, 37882417000, 19797866000, 37882417000, 19797866000],
		   "tl": [38882417000, 19797866000, 38882417000, 19797866000, 38882417000, 19797866000],
		   "bn": [39882417000, 19797866000, 39882417000, 19797866000, 39882417000, 19797866000],
		   "kj": [40882417000, 19797866000, 40882417000, 19797866000, 40882417000, 19797866000],
		   "ul": [41882417000, 19797866000, 41882417000, 19797866000, 41882417000, 19797866000],
		   "sm": [42882417000, 19797866000, 42882417000, 19797866000, 42882417000, 19797866000],
		   "mc": [43882417000, 19797866000, 43882417000, 19797866000, 43882417000, 19797866000],
		   "rz": [44882417000, 19797866000, 44882417000, 19797866000, 44882417000, 19797866000],
		   "tb": [45882417000, 19797866000, 45882417000, 19797866000, 45882417000, 19797866000],
		   "kn": [46882417000, 19797866000, 46882417000, 19797866000, 46882417000, 19797866000],
		   "ps": [47882417000, 19797866000, 47882417000, 19797866000, 47882417000, 19797866000],
		   "no": [48882417000, 19797866000, 48882417000, 19797866000, 48882417000, 19797866000],
		   "tr": [49882417000, 19797866000, 49882417000, 19797866000, 49882417000, 19797866000],
		   "vm": [50882417000, 19797866000, 50882417000, 19797866000, 50882417000, 19797866000],
		   "sr": [51882417000, 19797866000, 51882417000, 19797866000, 51882417000, 19797866000],
		   "mr": [52882417000, 19797866000, 52882417000, 19797866000, 52882417000, 19797866000],
		   "cu": [53882417000, 19797866000, 53882417000, 19797866000, 53882417000, 19797866000],
		   "ss": [54882417000, 19797866000, 54882417000, 19797866000, 54882417000, 19797866000],
    };
    
    var executed = [
        {title: executedName[0], name: plainName, value: Math.max(diagramRegion["pz"][0], diagramRegion["pz"][1])+(Math.max(diagramRegion["pz"][0], diagramRegion["pz"][1]) - Math.min(diagramRegion["pz"][0], diagramRegion["pz"][1]))},
        {title: executedName[1], name: doneName, value: -(Math.max(diagramRegion["pz"][0], diagramRegion["pz"][1]) - Math.min(diagramRegion["pz"][0], diagramRegion["pz"][1]))}
    ];
    console.log(executed);
    
    var costs = [
        {title: costsName[0], name: plainName, value: Math.max(diagramRegion["pz"][2], diagramRegion["pz"][3])+(Math.max(diagramRegion["pz"][2], diagramRegion["pz"][3]) - Math.min(diagramRegion["pz"][2], diagramRegion["pz"][3]))},
        {title: costsName[1], name: doneName, value: -(Math.max(diagramRegion["pz"][2], diagramRegion["pz"][3]) - Math.min(diagramRegion["pz"][2], diagramRegion["pz"][3]))}
    ];
    console.log(costs);
    
    var deficit = [
        {title: deficitName[0], name: plainName, value: Math.max(diagramRegion["pz"][4], diagramRegion["pz"][5])+(Math.max(diagramRegion["pz"][4], diagramRegion["pz"][5]) - Math.min(diagramRegion["pz"][4], diagramRegion["pz"][5]))},
        {title: deficitName[1], name: doneName, value: -(Math.max(diagramRegion["pz"][4], diagramRegion["pz"][5]) - Math.min(diagramRegion["pz"][4], diagramRegion["pz"][5]))}
    ];
    console.log(deficit);

    var arc = d3.svg.arc()
        .outerRadius(radius) 
    
        ;
      
    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.value; });
    
    d3.select('.diagramms').append('div').attr('class', 'pz');


    
function createCircle(data, plainName, doneName, plain, done) {
    var classCircle = data["1"].title;
    

	    var svg = d3.select("body").select('.pz').append('div')
	    .attr('class', 'circle-' + classCircle + ' circle').append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("overflow", "inherit")
        .append("g")
        .attr("transform", 
                "translate(" +(width / 2) + "," + (height / 2 ) + ")");
        
    var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");  
    
	g.append("path")
		.attr("d", arc)
		.style("fill", function (d){ return color(d.data.value); })
        .attr('transform', 'rotate(15)')
        ;
    
    svg.append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', margin)
    .style('fill','#fff');
    
    var div = d3.select('div.circle-'+classCircle).append('div').attr('class', 'desc');
    
    div.append('h3')
        .attr('class', 'h3-title')
        .text(function (d){return data["0"].title});
    
    div.append('p')
        .attr('class', 'p-name')
        .text(plainName)
        ;
    
    div.append('p')
        .attr('class', 'value plain')
        .text(plain)
        ;
    
    div.append('p')
        .attr('class', 'p-name')
        .text(doneName)
        ;
    
    div.append('p')
        .attr('class', 'value done')
        .text(done)
        ;
    };     
    
    
    
    d3.selectAll('p.value').append('span')
        .attr('class', 'currency')
        .text(' руб')
        ;
    
    
function gradient() {
    var gradient = d3.select('svg').append('linearGradient')
        .attr('id', 'linear-gradient')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', '80%')
        .attr('y2', '100%');

    gradient.append("stop")
       .attr('class', 'start')
       .attr("offset", "0%")
       .attr("stop-color", "#eeeeee")
       .attr("stop-opacity", 1);

    gradient.append("stop")
       .attr('class', 'end')
       .attr("offset", "50%")
       .attr("stop-color", "#eaeaea")
       .attr("stop-opacity", 1);

    gradient.append("stop")
       .attr('class', 'end')
       .attr("offset", "100%")
       .attr("stop-color", "#b6b6b6")
       .attr("stop-opacity", 1);
    
    
    }

function lala() {
	
}
    
    createCircle(executed, plainName, doneName, diagramRegion["pz"][0], diagramRegion["pz"][1]);

    createCircle(costs, plainName, doneName, diagramRegion["pz"][2], diagramRegion["pz"][3]);

    createCircle(deficit, plainName, doneName, diagramRegion["pz"][4], diagramRegion["pz"][5]);
    
    gradient () ; 