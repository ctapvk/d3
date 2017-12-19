function drawChart10(data10,prop10) {

	data = data10;
	prop = prop10;

	//добавление отступа после каждого третьего знака
	function gap(d) {
		return d.toString().replace(/\d{0,3}(?=(\d{3})+$)/g, "$& ") ;
	}

	function getElemWidth(el) {
		return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("width");
	}

	function getElemHeight(el) {
		return d3.select(el)._groups["0"]["0"]._groups["0"]["0"].getAttribute("height");
	}

	/*---------------------------------------(РАСЧЁТ ПЕРЕМЕННЫХ)---------------------------------------*/
	//переносим параметры диаграммы в соответствующие переменные
	height = prop.height;
	width = prop.height;
	fontSize = prop.fontSize;
	//padding = prop.padding;
	barWidth = prop.columnWidth;

	padding = height*0.13;
	asisXHeight = 30;
	asisYWidth = 80;
	asisYHeight = height-asisXHeight;
	gistTopPadding = 30;
	gistHeight = height-asisXHeight-gistTopPadding;
	gistWidth = width-asisYWidth;

	//Расчёт общего планового бюджета
	totalPlanBudget = 0;
	for (var i = 0; i < data.length; i++) {
		totalPlanBudget = totalPlanBudget + data[i]['planBudget'];
	}

	//Расчёт общего исполненного бюджета
	totalExBudget = 0;
	for (var i = 0; i < data.length; i++) {
		totalExBudget = totalExBudget + data[i]['exBudget'];
	}

	//Расчёт долей бюджета
	for (var i = 0; i < data.length; i++) {
		//Расчёт долей планового бюджета относительно общего
		data[i]['planRate'] = data[i].planBudget / totalPlanBudget * 100;
		//Расчёт долей исполненного бюджета относительно плана
		data[i]['exRate'] = data[i].exBudget / data[i].planBudget * 100;
	}

	//вычисляем наибольший бюджет между планом и исполнением
	greaterBudget = Math.max(totalPlanBudget,totalExBudget);

	y = d3.scaleLinear()
		.domain([0, greaterBudget])
		.range([(gistHeight), 0])
	;

	//определение размера круговых графиков
	grafWidth = width - padding * 2;
	grafHeight = height - padding * 2;

	//задаём радиус кругового графика планового бюджета
	radius = Math.min(grafWidth, grafHeight) / 2;
	innerRadius = radius/100*25;

	//создаём элемент арки с радиусом
	/*-------------(плановый бюджет)-------------*/
	arc = d3.arc()
		.outerRadius(radius)
		.innerRadius(innerRadius);

	pie = d3.pie()
		.sort(null)
		.value(function(d){
			return d.planRate;
		});

	/*-------------(исполненный бюджет)-------------*/
	exArc = d3.arc()
		.outerRadius(function (d) {
			if (d.data.exRate > 133) {return radius*1.33}
			else {return (radius - innerRadius) * (d.data.exRate / 100) + innerRadius;}
		})
		.innerRadius(innerRadius);

	exPie = d3.pie()
		.sort(null)
		.value(function(d) {
			return Math.ceil(d.data.exBudget / d.data.planBudget * 100) + '%';
		});

	/*---------------------------------------()---------------------------------------*/
	//создаём рабочее поле где будет размещена диаграмма
	chartArea = d3.select('#chart10')
		.append('div')
		.attr('class', 'chart-area')
		.style('cursor', 'default')
		.style('display', 'table')
		.style('width', '100%')
	;

	body = d3.select('body');

	tooltip = body.append('div')
		.attr('class', 'tooltip')
		.style('display', 'none')
		.style('position', 'absolute')
		.style('padding', '10px')
		.style('border', '1px solid #0000ff')
		.style('background-color', 'rgba(255, 255, 255, 0.85)')
		.style('font-size', fontSize + 'px')
	;

	/*---------------------------------------(ОТРИСОВКА ГИСТОГРАММЫ)---------------------------------------*/
	/*-------------(столбчатая диаграмма)-------------*/
	//создаём и описываем блок с гистограммой
	gistBlock = chartArea
		.append('div')
		.attr('class', 'chart-area__cell')
		.style('display', 'table-cell')
		.style('vertical-align', 'middle')
		.append('svg')
		.attr('class', 'chart-area__item gist-block')
		.attr('width', (width*0.93))
		.attr('height', height)
		.style('font-size', fontSize + 'px')
	;

	//создаём элемент под ось X
	asisX = gistBlock.append('g')
		.attr('class', 'asisX')
		.attr('width', gistWidth)
		.attr('height', asisYHeight)
		.attr('transform', 'translate(' + asisYWidth + ',' + asisYHeight + ')')
	;

	//создаём элемент под ось X
	asisY = gistBlock.append('g')
		.attr('class', 'asisY')
		.attr('width', asisYWidth)
		.attr('height', (gistHeight+gistTopPadding))
		.attr('transform', 'translate(' + 0 + ',' + 0 + ')')
	;

	//создаём блок под столбцы гистограммы
	gist = gistBlock.append('g')
		.attr('class', 'gist')
		.attr('height', gistHeight)
		.attr('width', gistWidth)
		.attr('transform', 'translate(' + asisYWidth + ',' + (gistHeight+gistTopPadding) + ')');

	drawBack(asisX);
	drawAsisX(asisX);
	drawAsisY(asisY);
	drawGist(gist);
	drawBottomLine(gist);

	function drawBack(canvas) {
		tis = y.ticks();
		backRectHeight = y(tis[0]) - y(tis[1]);
		rects = canvas.append('g')
			.attr('class', 'backRects')
			.attr('transform' , 'translate(0,'+ -backRectHeight +')')
		;
		tis.forEach(function (d, i) {
			if (i % 2 == 0) {
				rects.append('rect')
					.attr('transform', function () {
						return 'translate(' + [0, y(d) - (gistHeight)] + ')';
					})
					.attr('width', gistWidth)
					.attr('height', backRectHeight)
					.attr('fill', '#f5f5f5')
				;
			}
		});
	}

	function drawAsisX(canvas){

	}

	function drawAsisY(canvas){
		line = d3.line()
			.x(function (d) {
			return d[0]
		}).y(function (d) {
			return d[1]
		});
		canvas.append('path')
			.attr("transform", function (d) {
				return "translate(" + [0, 0] + ")"
			})
			.attr("d", line([[getElemWidth(canvas), 0], [getElemWidth(canvas), getElemHeight(canvas)]]))
			.attr("stroke-width", 4)
			.attr("stroke", "#CDD5DE")
			.attr('stroke-linecap','round')
		;

		canvas.append('text')
			.attr('y', '1em')
			.attr('x', -10)
			.style('text-anchor', 'end')
			.attr('transform', 'translate(' + getElemWidth(canvas) + ',' + 5 + ')')
			.style('fill', '#677d91')
			.style('font-weight', 'bold')
			.text('тыс. руб.')
		;

		asisLabel = canvas.append('g')
			.attr('transform', 'translate(' + getElemWidth(canvas) + ',' + gistTopPadding + ')')
			.attr('class', 'label');

		y.ticks(8).forEach(function(dat,i){
			if (dat != 0 && i != 0) {
				asisLabelItem = asisLabel.append('g')
					.attr('transform', function(d){
						return 'translate(' + 0 + ',' + y(dat) + ')';
					})
				;
				asisLabelItem.append('text')
					.attr('class', 'caption')
					.attr('transform', 'translate(' + -10 + ',' + 0 + ')')
					.style('text-anchor', 'end')
					.style('dominant-baseline', 'central')
					.style('fill', '#677d91')
					.text(function(d){
						return gap(dat/1000)
					})
				;
				asisLabelItem.append('circle')
					.attr('r', 7)
					.attr('fill', '#CDD5DE')
				;
			}
		});
	}

	function drawBottomLine(canvas){
		line = d3.line().x(function (d) {
			return d[0]
		}).y(function (d) {
			return d[1]
		});
		canvas.append('path')
			.attr('transform', 'translate(' + 0 + ',' + 0 + ')')
			.attr('d', line([[0, 0], [gistWidth, 0]]))
			.attr('stroke-width', 4)
			.attr('stroke', '#CDD5DE')
			.attr('stroke-linecap','round');
	}

	function drawGist(canvas){
		bars = canvas.append('g')
			.attr('class', 'bars')
			.attr('transform', 'translate(' + [50, -getElemHeight(gist)] + ')');

		//вычисляем высоту сегментов у столбцов гистограммы
		for (var i = 0; i < data.length; i++) {
			//data[i]['rectPlanHeight'] = gistHeight / 100 * data[i].planRate;
			//data[i]['rectExHeight'] = data[i].rectPlanHeight / 100 * data[i].exRate;
			data[i]['rectPlanHeight'] = gistHeight / 100 * (data[i].planBudget / greaterBudget * 100);
			data[i]['rectExHeight'] = gistHeight / 100 * (data[i].exBudget / greaterBudget * 100);
		}

		//вычисляем высоту высоту столбцов
		barPlanHeight = 0;
		for (var i = 0; i < data.length; i++) {
			barPlanHeight = barPlanHeight + data[i]['rectPlanHeight'];
		}
		barExHeight = 0;
		for (var i = 0; i < data.length; i++) {
			barExHeight = barExHeight + data[i]['rectExHeight'];
		}

		//создаём столбец плана
		barPlan = bars.append('g')
			.attr('class', 'bar-plan')
			.attr('transform', 'translate(' + 0 + ',' + 0 + ')');

		barPlan.append('text')
			.attr('x', 0)
			.attr('y', '1.25em')
			.attr('transform', 'translate(' + (barWidth / 2) + ',' + gistHeight + ')')
			.style('fill', '#677d91')
			.style('text-anchor', 'middle')
			.text('План');

		barPlan.append('text')
			.attr('x', 0)
			.attr('y', '-0.25em')
			.attr('transform', 'translate(' + (barWidth / 2) + ',' + (gistHeight-barPlanHeight) + ')')
			.style('fill', '#677d91')
			.style('text-anchor', 'end')
			.text(gap(totalPlanBudget));

		//создаём столбец исполнения
		barEx = bars.append('g')
			.attr('class', 'bar-ex')
			.attr('transform', 'translate(' + (barWidth*.85) + ',' + 0 + ')');

		barEx.append('text')
			.attr('x', 0)
			.attr('y', '1.25em')
			.attr('transform', 'translate(' + (barWidth / 2) + ',' + gistHeight + ')')
			.style('fill', '#677d91')
			.style('text-anchor', 'middle')
			.text('Исполнение');

		barEx.append('text')
			.attr('x', 0)
			.attr('y', '-0.25em')
			.attr('transform', 'translate(' + (barWidth / 2) + ',' + (gistHeight-barExHeight) + ')')
			.style('fill', '#677d91')
			.style('text-anchor', 'start')
			.text(gap(totalExBudget));

		//выстраиваем сегменты столбца плана
		rectPos = gistHeight;
		rectPlan = barPlan.selectAll('.bar-pie')
			.data(pie(data))
			.enter()
			.append('g')
			.attr('class', 'bar-pie')
			.attr('transform', function(d){
				rectPos = rectPos - d.data.rectPlanHeight;
				return 'translate(0, ' + rectPos + ')';
			})
			.on('mousemove', function(d){
				tooltip.html(d.data.source + '<br>план: ' + gap(d.data.planBudget) + ' руб.<br>Доля в общем объёме: ' + Math.round(d.data.planRate) + '%')
					.style('display', 'block')
					.style('left', (d3.event.pageX+15) + 'px')
					.style('top', (d3.event.pageY+5) + 'px')
				;
			})
			.on('mouseout', function(){
				tooltip.style('display', 'none');
			})
			.append('rect')
			.style('fill', function(d){
				return d.data.bg;
			})
			//.style('opacity', .55)
			.style('stroke', '#fff')
			.style('stroke-width', '2px')
			.attr('width', barWidth)
			.attr('class', 'visibility-item')
			.attr('data-pie-index', function(d){
				return d.index;
			})
			.attr('height', function(d){
				return d.data.rectPlanHeight;
			});

		//подписывает проценты к каждому сегменту
		rectPlanLabel = d3.selectAll('.bar-plan .bar-pie')
			.append('text')
			.attr('transform', function(d){
				return 'translate(' + (barWidth / 2) + ',' + (d.data.rectPlanHeight / 2) + ')';
			})
			.attr('x', 0)
			.attr('y', '.35em')
			.style('text-anchor', 'middle')
			.style('fill', '#fff')
			.style('font-size', '0.9em')
			.attr('class', 'visibility-item')
			.attr('data-pie-index', function(d){
				return d.index;
			})
			.text(function(d){
				if (d.data.rectPlanHeight >= fontSize) {return Math.round(d.data.planRate) + '%';}
			});

		//выстраиваем сегменты столбца исполнения
		rectPos = gistHeight;
		rectEx = barEx.selectAll('.bar-pie')
			.data(pie(data))
			.enter()
			.append('g')
			.attr('class', 'bar-pie')
			.attr('transform', function(d){
				rectPos = rectPos - d.data.rectExHeight;
				return 'translate(0,' + rectPos + ')';
			})
			.on('mousemove', function(d){
				tooltip.html(d.data.source + '<br>Исполнение: ' + gap(d.data.planBudget) + ' руб.<br>Процент исполнения: ' + Math.round(d.data.exRate) + '%')
					.style('display', 'block')
					.style('left', (d3.event.pageX+15) + 'px')
					.style('top', (d3.event.pageY+5) + 'px')
				;
			})
			.on('mouseout', function(){
				tooltip.style('display', 'none');
			})
			.append('rect')
			.style('fill', function(d){
				return d3.rgb(d.data.bg).darker(0.4);
			})
			.style('stroke', '#fff')
			.style('stroke-width', '2px')
			.attr('width', barWidth)
			.attr('class', 'visibility-item')
			.attr('data-pie-index', function(d){
				return d.index;
			})
			.attr('height', function(d){
				return d.data.rectExHeight;
			});

		//подписывает проценты к каждому сегменту
		rectExLabel = d3.selectAll('.bar-ex .bar-pie')
			.append('text')
			.attr('transform', function(d){
				return 'translate(' + (barWidth / 2) + ',' + (d.data.rectExHeight / 2) + ')';
			})
			.attr('x', 0)
			.attr('y', '.35em')
			.style('text-anchor', 'middle')
			.style('fill', '#fff')
			.style('font-size', '0.9em')
			.attr('class', 'visibility-item')
			.attr('data-pie-index', function(d){
				return d.index;
			})
			.text(function(d){
				if (d.data.rectExHeight >= fontSize) {return Math.round(d.data.exRate) + '%';}
			});
	}

	/*---------------------------------------(ОТРИСОВКА ЛЕГЕНДЫ)---------------------------------------*/
	legend = chartArea
		.append('div')
		.attr('class', 'chart-area__cell')
		.style('display', 'table-cell')
		.style('vertical-align', 'middle')
		.style('padding', '0 25px')
		.append('div')
		.attr('class', 'chart-area__item legend')
		.style('font-size', fontSize + 'px')
	;

	drawLegend(legend);

	function drawLegend(canvas){
		//создаём и описываем блок с легендой
		legendItem = canvas.selectAll('.legend__item')
			.data(pie(data))
			.enter().append('div')
			.attr('class', 'legend__item')
			.style('display', 'table')
			.style('padding-bottom', '10px')
		;

		legendItem.append('div')
			.style('margin-right', '10px')
			.attr('class', 'visibility-item')
			.attr('data-pie-index', function(d){
				return d.index;
			})
			.style('width', (width/10) + 'px')
			.style('height',(height/10) + 'px')
			.style('background-color', function(d) {
				return d.data.bg;
			});
		legendItemText = legendItem.append('div')
			.attr('class', 'text')
			.style('display', 'table-cell')
			.style('vertical-align', 'top');
		legendItemText.append('div')
			.attr('x', 45)
			.attr('y', '1em')
			.attr('transform', function(d) {})
			.style('font-size', '1em')
			.text(function (d) {
				return d.data.source;
			});
		legendItemText.append('div')
			.attr('x', 45)
			.attr('y', '2.5em')
			.style('font-size', '1em')
			.html(function (d) {
				return '<span style="color: #888;">план</span> '+ gap(d.data.planBudget) + ' руб., доля ' + Math.round(d.data.planRate) + '%';
			});
		legendItemText.append('div')
			.attr('x', 45)
			.attr('y', '4em')
			.style('font-size', '1em')
			.html(function (d) {
				return '<span style="color: #888;">исполнение</span> ' + gap(d.data.exBudget) + ' руб., ' + Math.round(d.data.exRate) + '%';
			});
	}

	/*---------------------------------------(ОТРИСОВКА КРУГОВОГО ГРАФИКА)---------------------------------------*/
	graf = chartArea
		.append('div')
		.attr('class', 'chart-area__cell')
		.style('display', 'table-cell')
		.style('vertical-align', 'middle').append('svg')
		.attr('class', 'chart-area__item graf')
		.style('font-size', fontSize + 'px')
		.attr('width', width)
		.attr('height', height)
		.append('g')
		.attr('class', 'plan')
		.attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

	drawCircleGraf(graf);

	function drawCircleGraf(canvas){
		/*-------------(плановый бюджет)-------------*/
		//рассчитываем и выводим внешнюю круговую диаграмму планового бюджета
		g_arc = graf.selectAll('.arc')
			.data(pie(data))
			.enter().append('g')
			.attr('class', 'arc')
			.on('mousemove', function(d){
				tooltip
					.html(d.data.source + '<br>план: ' + gap(d.data.planBudget) + ' руб.<br>Исполнение: ' + gap(d.data.exBudget) + '<br>Доля в общем объёме: ' + Math.round(d.data.planRate) + '%<br>Процент исполнения: ' + Math.round(d.data.exRate) + '%')
					.style('display', 'block')
					.style('left', (d3.event.pageX+15) + 'px')
					.style('top', (d3.event.pageY+5) + 'px')
				;
			})
			.on('mouseout', function(){
				tooltip.style('display', 'none');
			})
		;

		label = d3.arc()
			.outerRadius(radius)
			.innerRadius(radius+(grafWidth/5))
		;

		g_arc.append('path')
			.attr('d', arc)
			.attr('class', 'visibility-item')
			.attr('data-pie-index', function(d) {
				return d.index;
			})
			//.style('opacity', .55)
			.style('fill', function(d) {
				return d.data.bg;
			})
		;

		/*-------------(исполненный бюджет)-------------*/
		//рассчитываем и выводим внутреннюю круговую диаграмму исполненного бюджета
		exGraf = d3.select('.graf').append('g')
			.attr('class', 'ex')
			.attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')')
		;

		g_exArc = exGraf.selectAll('.arc')
			.data(pie(data))
			.enter().append('g')
			.attr('class', 'arc')
			.on('mousemove', function(d){
				tooltip
					.html(d.data.source + '<br>план: ' + gap(d.data.planBudget) + ' руб.<br>Исполнение: ' + gap(d.data.exBudget) + '<br>Доля в общем объёме: ' + Math.round(d.data.planRate) + '%<br>Процент исполнения: ' + Math.round(d.data.exRate) + '%')
					.style('display', 'block')
					.style('left', (d3.event.pageX+15) + 'px')
					.style('top', (d3.event.pageY+5) + 'px')
				;
			})
			.on('mouseout', function(){
				tooltip.style('display', 'none');
			})
		;

		exLabel = d3.arc()
			.outerRadius(innerRadius+(grafWidth/6))
			.innerRadius(innerRadius)
		;

		g_exArc.append('path')
			.attr('d', exArc)
			.attr('class', 'visibility-item')
			.attr('data-pie-index', function(d) {
				return d.index;
			})
			.style('fill', function(d) {
				return d3.rgb(d.data.bg).darker(0.4);
			})
		;
		g_exArc.append('text')
			.attr('transform', function(d) {
				return 'translate(' + exLabel.centroid(d) + ')';
			})
			.attr('dy', '.5em')
			.style('text-anchor', 'middle')
			.style('fill', '#fff')
			.attr('class', 'visibility-item')
			.attr('data-pie-index', function(d) {
				return d.index;
			})
			.text(function(d) {
				return Math.ceil(d.data.exRate) + '%';
			})
		;
		g_exArc.append('text')
			.attr('transform', function(d) {
				return 'translate(' + label.centroid(d) + ')';
			})
			.attr('dy', '.5em')
			.style('text-anchor', 'middle')
			.text(function (d) {
				return Math.round(d.data.planRate) + '%';
			})
		;
	}

}

//делаем подстветку выделенных долей диаграммы
document.addEventListener("mouseover", function(event) {
	var el = event.target;

	if (el.classList.contains('visibility-item'))
	{
		var pathes = document.getElementsByClassName('visibility-item');
		for (var key in pathes) {
			var item = pathes[key];
			if (item && item.style) {
				item.parentElement.classList.add('opacity');
			}
		}

		var currentPie = document.querySelectorAll('.visibility-item[data-pie-index="' + el.getAttribute('data-pie-index') + '"]');
		for (var key in currentPie) {
			var item = currentPie[key];
			if (item && item.style) {
				item.parentElement.classList.remove('opacity');
				//item.parentElement.style.opacity = 1;
			}
		}
	}
});

document.addEventListener("mouseout", function(event) {
	var pathes = document.getElementsByClassName('visibility-item');
	for (var key in pathes) {
		var item = pathes[key];
		if (item && item.style) {
			item.parentElement.classList.remove('opacity');
		}
	}
});

