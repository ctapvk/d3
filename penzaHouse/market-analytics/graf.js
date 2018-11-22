function drawGraph36(data, prop, id) {

  prop.paddingLeft = 130;
  if (!prop.paddingBottom) prop.paddingBottom = 160;
  prop.paddingTop = 20;
  prop.paddingRight = 30;
  prop.barSize = 70;
  prop.backColor = '#acc';
  prop.backColor = '#eee';

  console.log(data);
  /*
  wiAll = (prop.barSize*2 + prop.spaceBetween )*(data.length-1) +  30 + prop.paddingLeft + prop.paddingRight ;
  if ( wiAll > +svg.attr("width"))
      svg.attr("width" ,wiAll -(30 + prop.paddingLeft + prop.paddingRight) );
*/

  svg = d3.select('#' + id);
  svg.selectAll('*').remove();
  var hideName = '#hide' + id;
  d3.select(hideName).selectAll('*').remove();
  var div = d3.select(hideName).
  append('div').
  attr('class', 'tooltipGraph36').
  style('opacity', 0);

  widthSvg = +svg.attr('width');
  heightSvg = +svg.attr('height');
  width = +svg.attr('width') - +(prop.paddingLeft) - +(prop.paddingRight);
  height = +svg.attr('height') - +(prop.paddingBottom) - +prop.paddingTop;

  asisXtop = svg.append('g').
  attr('class', 'asisXtop').
  attr('transform', 'translate(' + [+prop.paddingLeft, 0] + ')').
  attr('width', width).
  attr('height', +prop.paddingTop)
  ;
  asisY = svg.append('g').
  attr('class', 'asisY').
  attr('transform', 'translate(' + [0, +prop.paddingTop] + ')').
  attr('width', +prop.paddingLeft).
  attr('height', heightSvg - +prop.paddingBottom - +prop.paddingTop)
  ;
  asisYright = svg.append('g').
  attr('class', 'asisYright').
  attr('transform', 'translate(' +
       [widthSvg - +prop.paddingRight, +prop.paddingTop] + ')').
  attr('width', +prop.paddingRight).
  attr('height', heightSvg - +prop.paddingBottom - +prop.paddingTop)
  ;
  gist = svg.append('g').
  attr('class', 'gist').
  attr('transform', 'translate(' + [+prop.paddingLeft, +prop.paddingTop] + ')').
  attr('width', width).
  attr('height', heightSvg - +prop.paddingBottom - +prop.paddingTop)
  ;
  asisX = svg.append('g').
  attr('class', 'asisX').
  attr('transform', 'translate(' +
       [+prop.paddingLeft, heightSvg - +prop.paddingBottom] + ')').
  attr('width', width).
  attr('height', +prop.paddingBottom)
  ;
  // showBorders(asisX);
  // showBorders(gist);
  // showBorders(asisY);
  // showBorders(asisXtop);
  // showBorders(asisYright);

  var diff = 0.05;
  // var min = parseInt(findMin(data)) * (1-diff) ;
  var min = 0;
  var max = parseInt(findMax(data) * (1 + diff));
  var len = max.toString().length;
  let deName = prop.deName;
  let deText = prop.deText == undefined ? '' : prop.deText;
  if (len < 4) {
    de = 1;
    deText = deText;
  }
  if (len < 7 && len > 3) {
    de = 1;
    deText = deText;
  }
  if (len < 10 && len > 6) {
    de = 0.001;
    deText = 'тыс. ' + deText;
  }
  if (len < 13 && len > 9) {
    de = 0.000001;
    deText = 'млн. ' + deText;
  }
  if (len < 16 && len > 12) {
    de = 0.000000001;
    deText = 'млрд. ' + deText;
  }
  if (len > 15) {
    de = 0.000000000000001;
    deText = 'трлн. ' + deText;
  }

  var AsisXLegendLables = {};
  data.forEach(function(t, number) {
    t.vals.forEach(function(t2, number2) {
      let a = d3.keys(t2)[0];
      AsisXLegendLables[a] = 'tst'; // объект всех возможных ключей  в  vals
    });
  });
  // todo Объекты в js хранятся по особому . поэтому нужен массив
  var keysSorted = Object.keys(AsisXLegendLables).sort(function(a, b) {
    var d = a.split('-');
    var a1 = new Date(parseInt(d[0]), parseInt(d[1]) - 1, parseInt(d[2]));
    var d = b.split('-');
    var a2 = new Date(parseInt(d[0]), parseInt(d[1]) - 1, parseInt(d[2]));
    return a1 > a2;
  });

  var maxValsCount = 0;
  for (let k in AsisXLegendLables) {
    AsisXLegendLables[k] = maxValsCount;
    maxValsCount++;
  }

  console.log(maxValsCount, keysSorted);

  var size = ( prop.barSize) * maxValsCount;
  if (size > width) {
    sizeSvg = +prop.paddingLeft + +prop.paddingRight + size;
    svg.attr('width', sizeSvg);
    width = sizeSvg;
    // svg.attr('viewBox' , "0 0 "+ sizeSvg + " " +  svg.attr('height') ) ;
  }

  x = d3.scaleLinear().domain([0, maxValsCount]).range([50, width]);

  /*
  =========================================================================================================
  функции рисования
   */

  function drawLegend(canvas) {
    te = canvas.append('g').
    attr('class', 'valsLabals').
    attr('transform', 'translate(' + [0, 20] + ')');

    keysSorted.forEach(function(d, i) {
      te.append('text').
      attr('transform', 'translate(' + [x(i), 0] + ')').
      html(breakLongText(d, 5));
    });

    legend = canvas.append('g').
    attr('class', 'legend').
    attr('transform', 'translate(' + [0, 55] + ')');

    xPad = 220;
    yPad = 0;
    let countLine = 0;
    data.forEach(function(t, number) {

      if (number % 4 == 0) {
        yPad = 40 * Math.floor(number / 4);
        countLine = 0;
      }
      text = legend.append('g').
      attr('transform', 'translate(' + [xPad * countLine, yPad] + ')');
      text.append('text').text(t.name).attr('transform', 'translate(35,17)');

      text.append('rect').
      attr('width', 25).
      attr('height', 25).
      attr('fill', prop.colors[number]).
      attr('data_number', countLine).
      on('mousemove', function() {
        gist.selectAll('path').classed('transp', true);
        gist.selectAll('circle').classed('transp', true);
        gist.selectAll('.curves_' + number).classed('transp_visible', true);
        div.transition().duration(200).style('opacity', .9);
        let a = data[number], total = 0;
        for (let k in a.vals) total += +d3.values(a.vals[k]);
        div.html('Пользователь ' + a.name + ' был всего ' + total + " раз(а)").
        style('left', (d3.event.pageX) + 'px').
        style('top', (d3.event.pageY - 30 ) + 'px');
      }).
      on('mouseout', function() {
        gist.selectAll('path').classed('transp', false);
        gist.selectAll('circle').classed('transp', false);
        gist.selectAll('.curves_' + number).classed('transp_visible', false);
        div.transition().duration(500).style('opacity', 0);

      });
      countLine++;
    });
  }

  function drawGist(canvas) {

    y = d3.scaleLinear().domain([min, max]).range([0, getElemHeight(canvas)]);

    g = canvas.append('g').
    attr('transform', 'translate(' + [0, getElemHeight(canvas)] + ')')
    ;
    gLables = canvas.append('g').
    attr('class', 'gLables').
    attr('transform', 'translate(' + [0, -prop.paddingTop + 20] + ')')
    ;

    line = d3.line().x(function(d) {
      return d[0];
    }).y(function(d) {
      return d[1];
    });
    lines = g.append('g').attr('class', 'lines');

    keysSorted.forEach(function(d, i) {
      lines.append('path').
      attr('d', line([[x(i), 0], [x(i), -getElemHeight(canvas)]])).
      attr('class', 'dashLine').
      attr('stroke-dasharray', '10, 5');
    });

    data.forEach(function(t, number) {
      margin = 0;
      line = d3.line().x(function(d, i) {
        return x(d[0]);
      }).y(function(d) {
        return -y(d[1]) + margin;
      })
      ;
      area = d3.area().x(function(d, i) {
        return x(i);
      }).y0(0).y1(function(d) {
        return -y(d) + margin;
      })
      ;

      let datGist = [];
      circles = canvas.append('g').attr('class', 'circles');
      t.vals.forEach(function(t2, num2) {
        let val = d3.values(t2)[0];
        let val_key = d3.keys(t2)[0];
        let val_holder = t.name;
        let PositionInAsisXLegendLables = 0;
        keysSorted.forEach(function(d, i) {
          if (val_key == d) PositionInAsisXLegendLables = i;
        });

        if (val != 0) datGist.push([PositionInAsisXLegendLables, val]);
        // gLables.append('text')
        //     .attr("transform", "translate("+[x(index2), 20 * number]+")")
        //     .attr('fill',prop.colors[number])
        //     .text(currencySwap(val))
        // ;
        if (val != 0)
          circles.append('circle').
          attr('r', 6).
          attr('fill', prop.colors[number]).
          attr('class', 'curves_' + number).
          attr('transform', 'translate(' +
               [
                 x(PositionInAsisXLegendLables),
                 getElemHeight(canvas) - y(val)] + ')').
          on('mousemove', function() {
            div.transition().duration(200).style('opacity', .9);
            div.html(val_holder + ' был ' + currencySwapNoCut(val) + '(а) ' +
                 val_key).
            style('left', (d3.event.pageX) + 'px').
            style('top', (d3.event.pageY - 30 ) + 'px');
          }).
          on('mouseout', function() {
            div.transition().duration(500).style('opacity', 0);
          });

      });

      datGist.sort(function(a, b) {
        return a[0] - b[0];
      });
      let a = AsisXLegendLables;
//        if (t.name == '176.9.16.209') debugger; //todo

      g.append('path').
      attr('d', line(datGist)).
      attr('class', 'curves_' + number).
      style('stroke', prop.colors[number]).
      style('stroke-width', 2)
      ;
    });

  }

  function drawAsisX(canvas) {

    line = d3.line().x(function(d) {
      return d[0];
    }).y(function(d) {
      return d[1];
    });
    canvas.append('path').
    attr('d', line([[0, 0], [getElemWidth(canvas), 0]])).
    attr('stroke-width', 4).
    attr('stroke', '#CDD5DE')
    ;
  }

  function drawAsisY(canvas) {

    y = d3.scaleLinear().domain([min, max]).range([height, 0]);

    // back
    rects = canvas.append('g').attr('class', 'backRects');

    tis = y.ticks();
    backHei = y(tis[0]) - y(tis[1]);
    tis.forEach(function(d, i) {
      // console.log(y.ticks());
      if (i % 2 == 0 && i != 0) {
        rectHeight = y(d.planOut);
        rects.append('rect').
        attr('transform', 'translate( ' + [getElemWidth(canvas), y(d)] + ')').
        attr('width', width).
        attr('height', backHei).
        attr('fill', prop.backColor)
        ;
      }
    });
    //asis
    line = d3.line().x(function(d) {
      return d[0];
    }).y(function(d) {
      return d[1];
    });

    canvas.append('path').
    attr('transform', 'translate(' + [0, 0] + ')').
    attr('d', line([
      [getElemWidth(canvas), 0],
      [getElemWidth(canvas), getElemHeight(canvas)],
    ])).
    attr('stroke-width', 4).
    attr('stroke', '#CDD5DE')
    ;

    legend = canvas.append('g').
    attr('transform', 'translate(' + [getElemWidth(canvas), 0] + ')').
    attr('class', 'legendAsisY')
    ;

    y.ticks().forEach(function(dat, i) {
      if (i != y.ticks().length - 1 && i != 0) {
        text = legend.append('g').attr('transform', function(d) {
          return 'translate(' + [0, y(dat)] + ')';
        })
        ;
        text.append('text').
        attr('class', 'asisYcapiton').
        attr('transform', 'translate(' + [-10, 0] + ')').
        text(currencySwapAsis(dat))
        ;
        text.append('circle').attr('r', 5).attr('fill', '#CDD5DE')
        ;

      }
    });

    canvas.append('text').
    attr('class', 'asisYcapiton').
    attr('transform', 'translate(' + [getElemWidth(canvas) - 15, 0] + ')').
    html(breakLongText(deName, 5))
    ;
  }

  function showBorders(canvas) {
    g = canvas.append('g');
    line = d3.line().x(function(d) {
      return d[0];
    }).y(function(d) {
      return d[1];
    });
    d = [
      [0, 0],
      [0, getElemHeight(canvas)],
      [getElemWidth(canvas), getElemHeight(canvas)],
      [getElemWidth(canvas), 0],
      [0, 0],
    ];

    g.append('path').
    attr('d', line(d)).
    attr('class', 'border').
    attr('stroke-width', 4).
    attr('stroke', '#CDD5DE')
    ;

  }

  function currencySwap(d) {
    d = parseFloat(d * de).toFixed(2).toString().replace('.', ',');
    return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + '';
  }

  function currencySwapAsis(d) {
    d = parseInt(d * de);
    return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + '';
  }

  function cutLongText(str) {
    str = str[0];
    if (str.length > 22) {
      return str.substr(0, 22) + '...';
    }
    else
      return str;
  }

  function breakLongText(str, limit) {
    limBack = limit;
    if (str.length > limit) {
      s = '';
      count = 0;
      limitStart = 0;
      while (limit < str.length && count < 10) {
        if (str[limit] != ' ') {
          for (i = limitStart; i < str.length; i++) {
            limit = i + 1;
            if (str[i] == ' ' && (limit - limitStart) > limBack) break;
          }
        } else {
          for (i = limitStart; i < str.length; i++) {
            limit = i + 1;
            if (str[i] == ' ' && (limit - limitStart) > limBack) break;
          }
        }

        s1 = str.substr(limitStart, limit - limitStart);
        // console.log(count , limitStart , limit ,s1);
        s += '<tspan y=\'' + (-20 + 20 * count ) +
             '\' x=\'0\' dy=\'1.2em\'>' + s1 + '</tspan>';
        limitStart = limit;

        count++;
      }
      return s;

    } else return str;
  }

  function currencySwapWithText(d) {
    d = parseInt(parseFloat(d) * de);
    d = d.toString().replace('.', ',');
    return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + deText;
  }

  function currencySwapNoCut(d) {
    d = (parseFloat(d) ).toFixed(2);
    d = d.toString().replace('.', ',');
    return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ' + deText;
  }

  function cutLongSum(d) {
    if (+d > 1000)
      return d.toString().substr(0, 3);
    else
      return d;
  }

  function findMin(d) {
    min = d3.values(d[0]['vals'][0]);
    d.forEach(function(t, number) {
      t.vals.forEach(function(t2, number2) {

        dd = d3.values(t2)[0];
        if (min > dd) min = dd;
        // console.log(dd)
      });
    });

    return min;
  }

  function findMax(d) {
    max = 0;
    d.forEach(function(t, number) {
      // console.log(number, t )
      t.vals.forEach(function(t2, number2) {
        dd = parseFloat(d3.values(t2)[0]);
        if (max < dd) max = dd;
        // console.log(dd)
      });
    });

    return max;
  }

  function getElemWidth(el) {
    return d3.select(el)._groups['0']['0']._groups['0']['0'].getAttribute(
         'width');
  }

  function getElemHeight(el) {
    return d3.select(el)._groups['0']['0']._groups['0']['0'].getAttribute(
         'height');
  }

  drawAsisY(asisY);
  drawAsisX(asisX);

  drawLegend(asisX);
  drawGist(gist);

}