parameters = {
  "width": 960,
  "height": 500,
  "margin": 100,
  "offset": 100
};

// общая функция для создания графиков
function chart(file_name, parameters) {
  const {width, height, margin, offset} = parameters

  const svg = d3.select("body")
    .append("svg")
    .attr("class", "axis")
    .attr("width", width)
    .attr("height", height);

  // длина оси X= ширина контейнера svg - отступ слева и справа
  const xAxisLength = width -  margin;

  // длина оси Y = высота контейнера svg - отступ сверху и снизу
  const yAxisLength = height - 2 * margin;

// функция интерполяции значений на ось Х
  const scaleX = d3.time.scale()
    .domain([new Date(2017, 0, 1), new Date(2017, 11, 1)])
    .range([0, xAxisLength]);

  // функция интерполяции значений на ось Y
  const scaleY = d3.scale.linear()
    .domain([1000000, 100000])
    .range([0, yAxisLength]);

  // создаем ось X
  const xAxis = d3.svg.axis()
    .scale(scaleX)
    .orient("bottom")
    .ticks(12)
    .tickFormat(d3.time.format("%b"));

  // создаем ось Y
  const yAxis = d3.svg.axis()
    .scale(scaleY)
    .orient("left")
    .ticks(10);

  // отрисовка оси Х
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(" + margin + "," + (height - margin) + ")") // сдвиг оси вниз и вправо
    .call(xAxis);

  // отрисовка оси Y
  svg.append("g")
    .attr("class", "y-axis")
    .attr("transform", "translate(" + margin + "," + margin + ")") // сдвиг оси вниз и вправо на margin
    .call(yAxis);

  d3.json(file_name, function (error, data) {
    if (error) throw error;

    createChart(data.blueData, "#529acb", "blue");
    createChart(data.yellowData, "#f5ba63", "yellow");
  });

  svg.append("rect")
    .attr("width", xAxisLength)
    .attr("height", 35)
    .attr("x", 100)
    .attr("y", 65)
    .style("fill", "#cdd5de")
    .style("opacity", "0.2");

  svg.append("rect")
    .attr("width", xAxisLength)
    .attr("height", 35)
    .attr("x", 100)
    .attr("y", 135)
    .style("fill", "#cdd5de")
    .style("opacity", "0.2");

    svg.append("rect")
    .attr("width", xAxisLength)
    .attr("height", 35)
    .attr("x", 100)
    .attr("y", 205)
    .style("fill", "#cdd5de")
    .style("opacity", "0.2");

    svg.append("rect")
    .attr("width", xAxisLength)
    .attr("height", 35)
    .attr("x", 100)
    .attr("y", 275)
    .style("fill", "#cdd5de")
    .style("opacity", "0.2");

    svg.append("rect")
    .attr("width", xAxisLength)
    .attr("height", 35)
    .attr("x", 100)
    .attr("y", 345)
    .style("fill", "#cdd5de")
    .style("opacity", "0.2");

  svg.append("rect")
    .attr("width", 23)
    .attr("height", 23)
    .style("fill", "#f5ba63")
    .attr("x", 100)
    .attr("y", 460);

  svg.append("rect")
    .attr("width", 23)
    .attr("height", 23)
    .style("fill", "#529acb")
    .attr("x", 250)
    .attr("y", 460);

  svg.append("text")
    .attr("x", 130)
    .attr("y", 478)
    .style("font-size", "14pt")
    .text("План");

  svg.append("text")
    .attr("x", 280)
    .attr("y", 480)
    .style("font-size", "14pt")
    .text("Факт");
  
  function createChart(data, colorStroke, label) {
    // функция, создающая по массиву точек линии
    const line = d3.svg.line()
      .x(function (d) {
        return scaleX(d.date) + margin;
      })
      .y(function (d) {
        return scaleY(d.rate) + margin;
      });

    // функция, создающая область
    var area = d3.svg.area()
      .x(function (d) {
       return scaleX(d.date) + margin;
    })
    .y0(height - margin)
    .y1(function (d) {
       return scaleY(d.rate) + margin;
    });

    // добавляем путь
    const g = svg.append("g")
      g.append("path")
      .attr("d", line(data))
      .style("stroke", colorStroke)
      .style("stroke-width", 2);
      g.append("path")
      .attr("d", area(data))
      .style("fill", colorStroke)
      .style("opacity", .3);

  // добавляем отметки к точкам
   svg.selectAll(".dot " + label)
      .data(data)
      .enter().append("circle")
      .style("fill", colorStroke)
      .attr("class", "dot " + label)
      .attr("r", 6)
      .attr("cx", function (d) {
        return scaleX(d.date) + margin;
      })
      .attr("cy", function (d) {
        return scaleY(d.rate) + margin;
      });
  }; 
}

/*
var legend_keys = ["Austin", "New York", "San Francisco"]

var lineLegend = svg.selectAll(".lineLegend").data(legend_keys)
    .enter().append("g")
    .attr("class","lineLegend")
    .attr("transform", function (d,i) {
            "translate(" + width + "," + (i*20)+")";
        });

lineLegend.append("text").text(function (d) {return d;})
    .attr("transform", "translate(15,9)"); //align texts with boxes

lineLegend.append("rect")
    .attr("fill", function (d, i) {return color_scale(d); })
    .attr("width", 10).attr("height", 10);
    */