function drawChart14(data,prop) {

	blockHeight = prop.blockHeight;
	svgWidth = prop.width;
	svgHeight = blockHeight * data.length;
	fontSize = prop.fontSize;
	segmentColors = prop.segmentColors;

	grafWidth = svgWidth * 0.8;
	leftPadding = svgWidth * 0.03;

	barHeight = blockHeight * 0.3;

	pie = d3.pie();

	//Расчёт суммарного бюджета из всех источников для каждой госпрограммы
	for (var i = 0; i < data.length; i++) {
		data[i]['progPlanBudget'] = 0;
		for (var j in data[i]['planBudget']) {
			data[i]['progPlanBudget'] += data[i]['planBudget'][j];
		}
	}

	for (var i = 0; i < data.length; i++) {
		data[i]['progExBudget'] = 0;
		for (var j in data[i]['exBudget']) {
			data[i]['progExBudget'] += data[i]['exBudget'][j];
		}
	}

	//определяем массив содержащий плановые бюджеты госпрограмм
	planBudgets = Array(data.length);
	for (var i = 0; i < data.length; i++) {
		planBudgets[i] = data[i].progPlanBudget;
	}

	//определяем массив содержащий исполнение бюджетов госпрограмм
	exBudgets = Array(data.length);
	for (var i = 0; i < data.length; i++) {
		exBudgets[i] = data[i].progExBudget;
	}

	//определяем наибольшее значение бюджета среди госпрограмм
	maxPlanBudget = Math.max.apply(null,planBudgets);
	maxExBudget = Math.max.apply(null,exBudgets);
	greaterBudget = Math.max(maxPlanBudget,maxExBudget);

	for (var i = 0; i < data.length; i++) {
		data[i]['barPlanWidth'] = data[i].progPlanBudget / greaterBudget * grafWidth;
		data[i]['barExWidth'] = data[i].progExBudget / greaterBudget * grafWidth;
		data[i]['exRate'] = {};
		data[i]['exRate']['progExRate'] = data[i].progExBudget / data[i].progPlanBudget * 100;
		data[i]['exRate']['regionalExRate'] = data[i].exBudget.regionalSource / data[i].planBudget.regionalSource * 100;
		data[i]['exRate']['federalExRate'] = data[i].exBudget.federalSource / data[i].planBudget.federalSource * 100;
		data[i]['exRate']['localExRate'] = data[i].exBudget.localSource / data[i].planBudget.localSource * 100;
		data[i]['exRate']['extraExRate'] = data[i].exBudget.extraSource / data[i].planBudget.extraSource * 100;
		data[i]['rectSize'] = {};
		data[i]['rectSize']['regionalPlan'] = data[i].planBudget.regionalSource / data[i].progPlanBudget * data[i].barPlanWidth;
		data[i]['rectSize']['federalPlan'] = data[i].planBudget.federalSource / data[i].progPlanBudget * data[i].barPlanWidth;
		data[i]['rectSize']['localPlan'] = data[i].planBudget.localSource / data[i].progPlanBudget * data[i].barPlanWidth;
		data[i]['rectSize']['extraPlan'] = data[i].planBudget.extraSource / data[i].progPlanBudget * data[i].barPlanWidth;
		data[i]['rectSize']['regionalEx'] = data[i].exBudget.regionalSource / data[i].progPlanBudget * data[i].barPlanWidth;
		data[i]['rectSize']['federalEx'] = data[i].exBudget.federalSource / data[i].progPlanBudget * data[i].barPlanWidth;
		data[i]['rectSize']['localEx'] = data[i].exBudget.localSource / data[i].progPlanBudget * data[i].barPlanWidth;
		data[i]['rectSize']['extraEx'] = data[i].exBudget.extraSource / data[i].progPlanBudget * data[i].barPlanWidth;
	}

	/*---------------------------------------()---------------------------------------*/
	//создаём рабочее поле где будет размещена диаграмма
	chartArea = d3.select('#chart14')
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
			.attr('transform', 'translate(' + leftPadding + ',' + 0 + ')')
		;

		progPos = -blockHeight;
		program = graf
			.selectAll('.program')
			.data(pie(data))
			.enter()
			.append('g')
			.attr('class', 'program')
			.attr('transform', function(d){
				progPos = progPos + blockHeight;
				return 'translate(' + 0 + ',' + progPos + ')';
			})
		;

		programLabel = program
			.append('text')
			.attr('y', '1em')
			.style('font-weight', 'bold')
			.style('fill', '#677d91')
			.text(function(d){
				return d.data.title + ' ';
			})
			.append('tspan')
			.style('font-weight', 'normal')
			.text(function(d){
				return 'срок реализации ' + d.data.start + ' - ' + d.data.finish;
			})
		;

		barPlan = program
			.append('g')
			.attr('class', 'plan')
			.attr('transform', 'translate(' + 0 + ',' + (blockHeight * 0.25) + ')')
		;

		barPlan
			.append('text')
			.style('dominant-baseline', 'central')
			.attr('transform', function(d){
				return 'translate(' + (d.data.barPlanWidth + 10) + ',' + (barHeight / 2) + ')';
			})
			.style('fill', '#888')
			.text('План: ')
			.append('tspan')
			.style('fill', '#000')
			.text(function(d){
				return gap(d.data.progPlanBudget / 1000) + ' тыс. руб.';
			})
		;

		barPlanBlock = barPlan
			.append('g')
		;

		regionalSourcePlan = barPlanBlock
			.append('rect')
			.attr('class', 'regionalSourcePlan')
			.attr('height', barHeight)
			.attr('width', function(d){
				return (d.data.planBudget.regionalSource / d.data.progPlanBudget * d.data.barPlanWidth);
			})
			.style('fill', segmentColors[0])
			.attr('transform', 'translate(' + 0 + ',' + 0 + ')')
			.on('mousemove', function(d){
				tooltip
					.html('Областные средства<br>План: ' + gap(d.data.planBudget.regionalSource) + '  руб<br>Исполнено: ' + gap(d.data.exBudget.regionalSource) + ' руб<br>Процент исполнения: ' + Math.round(d.data.exRate.regionalExRate) + '%')
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

		federalSourcePlan = barPlanBlock
			.append('rect')
			.attr('class', 'federalSourcePlan')
			.attr('height', barHeight)
			.attr('width', function(d){
				return (d.data.planBudget.federalSource / d.data.progPlanBudget * d.data.barPlanWidth);
			})
			.style('fill', segmentColors[1])
			.attr('transform', function(d) {
				return 'translate(' + d.data.rectSize.regionalPlan + ',' + 0 + ')';
			})
			.on('mousemove', function(d){
				tooltip
					.html('Федеральные средства<br>План: ' + gap(d.data.planBudget.federalSource) + '  руб<br>Исполнено: ' + gap(d.data.exBudget.federalSource) + ' руб<br>Процент исполнения: ' + Math.round(d.data.exRate.federalExRate) + '%')
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

		localSourcePlan = barPlanBlock
			.append('rect')
			.attr('class', 'localSourcePlan')
			.attr('height', barHeight)
			.attr('width', function(d){
				return (d.data.planBudget.localSource / d.data.progPlanBudget * d.data.barPlanWidth);
			})
			.style('fill', segmentColors[2])
			.attr('transform', function(d) {
				return 'translate(' + (d.data.rectSize.regionalPlan + d.data.rectSize.federalPlan) + ',' + 0 + ')';
			})
			.on('mousemove', function(d){
				tooltip
					.html('Местный бюджет<br>План: ' + gap(d.data.planBudget.localSource) + '  руб<br>Исполнено: ' + gap(d.data.exBudget.localSource) + ' руб<br>Процент исполнения: ' + Math.round(d.data.exRate.localExRate) + '%')
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

		extraSourcePlan = barPlanBlock
			.append('rect')
			.attr('class', 'extraSourcePlan')
			.attr('height', barHeight)
			.attr('width', function(d){
				return (d.data.planBudget.extraSource / d.data.progPlanBudget * d.data.barPlanWidth);
			})
			.style('fill', segmentColors[3])
			.attr('transform', function(d) {
				return 'translate(' + (d.data.rectSize.regionalPlan + d.data.rectSize.federalPlan + d.data.rectSize.localPlan) + ',' + 0 + ')';
			})
			.on('mousemove', function(d){
				tooltip
					.html('Внебюджетные источники<br>План: ' + gap(d.data.planBudget.extraSource) + '  руб<br>Исполнено: ' + gap(d.data.exBudget.extraSource) + ' руб<br>Процент исполнения: ' + Math.round(d.data.exRate.extraExRate) + '%')
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

		barEx = program
			.append('g')
			.attr('class', 'ex')
			.attr('transform', 'translate(' + 0 + ',' + (blockHeight * 0.5) + ')')
		;

		barEx
			.append('text')
			.style('dominant-baseline', 'central')
			.attr('transform', function(d){
				return 'translate(' + (d.data.barExWidth + 10) + ',' + (barHeight / 2) + ')';
			})
			.style('fill', '#888')
			.text('Исполнение: ')
			.append('tspan')
			.style('fill', '#000')
			.text(function(d){
				return gap(d.data.progExBudget / 1000) + ' тыс. руб.';
			})
		;

		barExBlock = barEx
			.append('g')
			.style('filter', 'url(#dropshadow)')
		;

		regionalSourceEx = barExBlock
			.append('rect')
			.attr('class', 'regionalSourceEx')
			.attr('height', barHeight)
			.attr('width', function(d){
				return (d.data.exBudget.regionalSource / d.data.progExBudget * d.data.barExWidth);
			})
			.style('fill',  d3.rgb(segmentColors[0]).darker(0.5))
			.attr('transform', 'translate(' + 0 + ',' + 0 + ')')
			.on('mousemove', function(d){
				tooltip
					.html('Областные средства<br>План: ' + gap(d.data.planBudget.regionalSource) + ' руб<br>Исполнено: ' + gap(d.data.exBudget.regionalSource) + ' руб<br>Процент исполнения: ' + Math.round(d.data.exRate.regionalExRate) + '%')
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

		federalSourceEx = barExBlock
			.append('rect')
			.attr('class', 'federalSourceEx')
			.attr('height', barHeight)
			.attr('width', function(d){
				return (d.data.exBudget.federalSource / d.data.progExBudget * d.data.barExWidth);
			})
			.style('fill', d3.rgb(segmentColors[1]).darker(0.5))
			.attr('transform', function(d) {
				return 'translate(' + d.data.rectSize.regionalEx + ',' + 0 + ')';
			})
			.on('mousemove', function(d){
				tooltip
					.html('Федеральные средства<br>План: ' + gap(d.data.planBudget.federalSource) + ' руб<br>Исполнено: ' + gap(d.data.exBudget.federalSource) + ' руб<br>Процент исполнения: ' + Math.round(d.data.exRate.federalExRate) + '%')
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

		localSourceEx = barExBlock
			.append('rect')
			.attr('class', 'localSourceEx')
			.attr('height', barHeight)
			.attr('width', function(d){
				return (d.data.exBudget.localSource / d.data.progExBudget * d.data.barExWidth);
			})
			.style('fill', d3.rgb(segmentColors[2]).darker(0.5))
			.attr('transform', function(d) {
				return 'translate(' + (d.data.rectSize.regionalEx + d.data.rectSize.federalEx) + ',' + 0 + ')';
			})
			.on('mousemove', function(d){
				tooltip
					.html('Местный бюджет<br>План: ' + gap(d.data.planBudget.localSource) + ' руб<br>Исполнено: ' + gap(d.data.exBudget.localSource) + ' руб<br>Процент исполнения: ' + Math.round(d.data.exRate.localExRate) + '%')
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

		extraSourceEx = barExBlock
			.append('rect')
			.attr('class', 'extraSourceEx')
			.attr('height', barHeight)
			.attr('width', function(d){
				return (d.data.exBudget.extraSource / d.data.progExBudget * d.data.barExWidth);
			})
			.style('fill', d3.rgb(segmentColors[3]).darker(0.5))
			.attr('transform', function(d) {
				return 'translate(' + (d.data.rectSize.regionalEx + d.data.rectSize.federalEx + d.data.rectSize.localEx) + ',' + 0 + ')';
			})
			.on('mousemove', function(d){
				tooltip
					.html('Внебюджетные источники<br>План: ' + gap(d.data.planBudget.extraSource) + ' руб<br>Исполнено: ' + gap(d.data.exBudget.extraSource) + ' руб<br>Процент исполнения: ' + Math.round(d.data.exRate.extraExRate) + '%')
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
	}

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

	console.log(data);
	console.log(planBudgets);
	console.log(exBudgets);
	console.log(maxPlanBudget);
	console.log(maxExBudget);
	console.log(greaterBudget);

}