function drawChart15(data,prop) {

	svgWidth = prop.width;
	svgHeight = prop.height;
	fontSize = prop.fontSize;
	colorPlan = prop.colorPlan;
	colorEx = prop.colorEx;
	selected = prop.selected;

	grafWidth = svgWidth * 0.95;
	grafHeight = svgHeight * 0.65;

	barHeight = grafHeight * 0.55;

	leftPadding = (svgWidth - grafWidth) / 2;
	topPadding = (svgHeight - grafHeight) / 2;

	//Расчёт суммарного бюджета
	totalPlanBudget = 0;
	for (var i = 0; i < data.length; i++) {
		totalPlanBudget = totalPlanBudget + data[i]['planBudget'];
	}

	totalExBudget = 0;
	for (var i = 0; i < data.length; i++) {
		totalExBudget = totalExBudget + data[i]['exBudget'];
	}

	greaterBudget = Math.max(totalPlanBudget,totalExBudget);

	planBudget = data[selected].planBudget;
	exBudget = data[selected].exBudget;
	title = data[selected].title;

	barPlanProportion = totalPlanBudget / greaterBudget * 100;
	barExProportion = totalExBudget / greaterBudget * 100;

	barPlanWidth = grafWidth / 100 * barPlanProportion;
	barExWidth = grafWidth / 100 * barExProportion;

	segmentPlanProportion = planBudget / totalPlanBudget * 100;
	segmentExProportion = exBudget / totalExBudget * 100;

	segmentPlanWidth = barPlanWidth / 100 * segmentPlanProportion;
	segmentExWidth = barExWidth / 100 * segmentPlanProportion;

	/*---------------------------------------()---------------------------------------*/
	//создаём рабочее поле где будет размещена диаграмма
	chartArea = d3.select('#chart15')
		.append('svg')
		.attr('class', 'chart-area')
		.style('cursor', 'default')
		.attr('width', svgWidth)
		.attr('height', svgHeight)
		.style('font-size', fontSize)
	;

	/* For the drop shadow filter... */
	svg = d3.select('.chart-area');

	defs = svg
		.append('defs')
	;

	filter = defs
		.append('filter')
		.attr('id', 'dropshadow')
		.attr('height', '150%')
	;

	filter
		.append('feGaussianBlur')
		.attr('in', 'SourceAlpha')
		.attr('stdDeviation', 3)
		.attr('result', 'blur')
	;

	filter
		.append('feOffset')
		.attr('in', 'blur')
		.attr('dx', -2)
		.attr('dy', 2)
		.attr('result', 'offsetBlur')
	;

	filter
		.append('feFlood')
		.attr('flood-color', '#000')
		.attr('flood-opacity', 0.4)
		.attr('result', 'offsetColor')
	;

	filter
		.append('feComposite')
		.attr('in', 'offsetColor')
		.attr('in2', 'offsetBlur')
		.attr('operator', 'in')
		.attr('result', 'offsetBlur')
	;

	feMerge = filter
		.append('feMerge')
	;

	feMerge
		.append('feMergeNode')
		.attr('in', 'offsetBlur')
	;

	feMerge
		.append('feMergeNode')
		.attr('in', 'SourceGraphic')
	;

	body = d3.select('body');

	//задаём параметры тултипа
	tooltip = body.append('div')
		.attr('class', 'tooltip')
		.style('display', 'none')
		.style('position', 'absolute')
		.style('padding', '10px')
		.style('border', '1px solid #0000ff')
		.style('background-color', 'rgba(255, 255, 255, 0.85)')
		.style('font-size', fontSize + 'px')
	;

	drawGraf(chartArea);

	function drawGraf(canvas){
		graf = canvas
			.append('g')
			.attr('class', 'graf')
			.attr('transform', 'translate(' + leftPadding + ',' + topPadding + ')')
		;

		barPlan = graf
			.append('g')
			.attr('class', 'plan')
			.on('mousemove', function(){
				tooltip
					.html('Плановый объём: ' + gap(totalPlanBudget) + ' руб<br>' + title + ' - ' + gap(planBudget) + ' руб<br>Доля в общем объёме: ' + Math.round(segmentPlanProportion) + '%')
					.style('display', 'block')
					.style('left', (d3.event.pageX+15) + 'px')
					.style('top', (d3.event.pageY+5) + 'px')
				;
			})
			.on('mouseout', function(){
				tooltip
					.style('display', 'none')
				;
			})
		;

		barPlan
			.append('rect')
			.attr('width', barPlanWidth)
			.attr('height', barHeight)
			.style('fill', colorPlan)
			.attr('transform', 'translate(' + 0 + ',' + 0 + ')')
		;

		barPlan
			.append('rect')
			.attr('width', segmentPlanWidth)
			.attr('height', barHeight)
			.style('fill', d3.rgb(colorPlan).darker(0.4))
		;

		barPlan
			.append('text')
			.attr('transform', 'translate(' + segmentPlanWidth + ',' + -5 + ')')
			.style('font-size', (fontSize * 1.2))
			.style('text-anchor', 'middle')
			.text(Math.round(segmentPlanProportion) + '%')
		;

		barPlan
			.append('text')
			.attr('transform', 'translate(' + barPlanWidth + ',' + -5 + ')')
			.style('text-anchor', 'end')
			.text(gap(totalPlanBudget/1000) + ' тыс. руб')
		;

		barPlan
			.append('text')
			.attr('transform', 'translate(' + (segmentPlanWidth + 10) + ',' + (barHeight / 2) + ')')
			.style('dominant-baseline', 'central')
			.style('fill', '#fff')
			.text(gap(planBudget/1000) + ' тыс. руб')
		;

		barPlan
			.append('text')
			.attr('transform', 'translate(' + (barPlanWidth - 10) + ',' + (barHeight / 2) + ')')
			.style('text-anchor', 'end')
			.style('fill', '#fff')
			.text('Плановый')
			.append('tspan')
			.attr('x', 0)
			.attr('y', '1em')
			.text('объём')
		;

		barEx = graf
			.append('g')
			.attr('class', 'ex')
			.attr('transform', 'translate(' + 0 + ',' + (grafHeight * 0.45) + ')')
			.on('mousemove', function(){
				tooltip
					.html('Фактический объём: ' + gap(totalExBudget) + ' руб<br>' + title + ' - ' + gap(exBudget) + ' руб<br>Доля в общем объёме: ' + Math.round(segmentExProportion) + '%')
					.style('display', 'block')
					.style('left', (d3.event.pageX+15) + 'px')
					.style('top', (d3.event.pageY+5) + 'px')
				;
			})
			.on('mouseout', function(){
				tooltip
					.style('display', 'none')
				;
			})
		;

		barEx
			.append('rect')
			.attr('width', barExWidth)
			.attr('height', barHeight)
			.style('fill', colorEx)
			.style('filter', 'url(#dropshadow)')
		;

		barEx
			.append('rect')
			.attr('width', segmentExWidth)
			.attr('height', barHeight)
			.style('fill', d3.rgb(colorEx).darker(0.4))
		;

		barEx
			.append('text')
			.attr('transform', 'translate(' + segmentExWidth + ',' + (barHeight + 5) + ')')
			.style('dominant-baseline', 'hanging')
			.style('font-size', (fontSize * 1.2))
			.style('text-anchor', 'middle')
			.text(Math.round(segmentExProportion) + '%')
		;

		barEx
			.append('text')
			.attr('transform', 'translate(' + barExWidth + ',' + (barHeight + 5) + ')')
			.style('dominant-baseline', 'hanging')
			.style('text-anchor', 'end')
			.text(gap(totalExBudget/1000) + ' тыс. руб')
		;

		barEx
			.append('text')
			.attr('transform', 'translate(' + (segmentExWidth + 10) + ',' + (barHeight / 2) + ')')
			.style('dominant-baseline', 'central')
			.style('fill', '#fff')
			.text(gap(exBudget/1000) + ' тыс. руб')
		;

		barEx
			.append('text')
			.attr('transform', 'translate(' + (barExWidth - 10) + ',' + (barHeight / 2) + ')')
			.style('text-anchor', 'end')
			.style('fill', '#fff')
			.text('Фактическое')
			.append('tspan')
			.attr('x', 0)
			.attr('y', '1em')
			.text('исполнение')
		;

	}

	//добавление отступа после каждого третьего знака
	function gap(d) {
		return d.toString().replace(/\d{0,3}(?=(\d{3})+$)/g, "$& ") ;
	}

	console.log(totalPlanBudget);
	console.log(totalExBudget);
	console.log(planBudget);
	console.log(exBudget);

}