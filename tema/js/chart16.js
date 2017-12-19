function drawChart16(data,prop) {

	blockHeight = prop.blockHeight;
	barHeight = blockHeight * 0.3;
	svgWidth = prop.width;
	svgHeight = blockHeight;
	fontSize = prop.fontSize;
	segmentColors = prop.segmentColors;

	grafWidth = svgWidth * 0.8;
	leftPadding = svgWidth * 0.03;

	blockHeightEvent = blockHeight * 0.8;
	barHeightEvent = blockHeightEvent * 0.3;

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

	//Расчёт суммарного бюджета из всех источников для каждого мероприятия
	for (var i = 0; i < data.length; i++) {
		for (var j = 0; j < data[i].events.length; j++) {
			data[i].events[j]['eventPlanBudget'] = 0;
			for (var k in data[i].events[j]['planBudget']) {
				data[i].events[j]['eventPlanBudget'] += data[i].events[j]['planBudget'][k];
			}
		}
	}

	for (var i = 0; i < data.length; i++) {
		for (var j = 0; j < data[i].events.length; j++) {
			data[i].events[j]['eventExBudget'] = 0;
			for (var k in data[i].events[j]['exBudget']) {
				data[i].events[j]['eventExBudget'] += data[i].events[j]['exBudget'][k];
			}
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
		data[i]['rectSize']['regionalEx'] = data[i].exBudget.regionalSource / data[i].progExBudget * data[i].barExWidth;
		data[i]['rectSize']['federalEx'] = data[i].exBudget.federalSource / data[i].progExBudget * data[i].barExWidth;
		data[i]['rectSize']['localEx'] = data[i].exBudget.localSource / data[i].progExBudget * data[i].barExWidth;
		data[i]['rectSize']['extraEx'] = data[i].exBudget.extraSource / data[i].progExBudget * data[i].barExWidth;
	}

	for (var i = 0; i < data.length; i++) {
		for (var j = 0; j < data[i].events.length; j++) {
			data[i].events[j]['barPlanWidth'] = data[i].events[j].eventPlanBudget / greaterBudget * grafWidth;
			data[i].events[j]['barExWidth'] = data[i].events[j].eventExBudget / greaterBudget * grafWidth;
			data[i].events[j]['exRate'] = {};
			data[i].events[j]['exRate']['regionalExRate'] = data[i].events[j].exBudget.regionalSource / data[i].events[j].planBudget.regionalSource * 100;
			data[i].events[j]['exRate']['federalExRate'] = data[i].events[j].exBudget.federalSource / data[i].events[j].planBudget.federalSource * 100;
			data[i].events[j]['exRate']['localExRate'] = data[i].events[j].exBudget.localSource / data[i].events[j].planBudget.localSource * 100;
			data[i].events[j]['exRate']['extraExRate'] = data[i].events[j].exBudget.extraSource / data[i].events[j].planBudget.extraSource * 100;
			data[i].events[j]['rectSize'] = {};
			data[i].events[j]['rectSize']['regionalPlan'] = data[i].events[j].planBudget.regionalSource / data[i].progPlanBudget * data[i].barPlanWidth;
			data[i].events[j]['rectSize']['federalPlan'] = data[i].events[j].planBudget.federalSource / data[i].progPlanBudget * data[i].barPlanWidth;
			data[i].events[j]['rectSize']['localPlan'] = data[i].events[j].planBudget.localSource / data[i].progPlanBudget * data[i].barPlanWidth;
			data[i].events[j]['rectSize']['extraPlan'] = data[i].events[j].planBudget.extraSource / data[i].progPlanBudget * data[i].barPlanWidth;
			data[i].events[j]['rectSize']['regionalEx'] = data[i].events[j].exBudget.regionalSource / data[i].progExBudget * data[i].barExWidth;
			data[i].events[j]['rectSize']['federalEx'] = data[i].events[j].exBudget.federalSource / data[i].progExBudget * data[i].barExWidth;
			data[i].events[j]['rectSize']['localEx'] = data[i].events[j].exBudget.localSource / data[i].progExBudget * data[i].barExWidth;
			data[i].events[j]['rectSize']['extraEx'] = data[i].events[j].exBudget.extraSource / data[i].progExBudget * data[i].barExWidth;
		}
	}

	/*---------------------------------------()---------------------------------------*/

	//создаём рабочее поле где будет размещена диаграмма
	chartArea = d3.select('#chart16')
		.append('div')
		.attr('class', 'chart-area')
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
	drawEvents(chartArea);

	function drawGraf(canvas){
		program = canvas
			.selectAll('.program')
			.data(pie(data))
			.enter()
			.append('div')
			.attr('class', 'program')
			.style('padding', '20px 0 10px')
			.style('margin-bottom', '15px')
			.style('background', '#f4f5f7')
		;

		graf = program
			.append('svg')
			.attr('width', svgWidth)
			.attr('height', svgHeight)
			.style('cursor', 'default')
			.style('font-size', fontSize)
			.append('g')
			.attr('class', 'graf')
			.attr('transform', 'translate(' + leftPadding + ',' + 0 + ')')
		;

		programLabel = graf
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

		barPlan = graf
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
				return d.data.rectSize.regionalPlan;
			})
			.style('fill', segmentColors[0])
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

		federalSourcePlan = barPlanBlock
			.append('rect')
			.attr('class', 'federalSourcePlan')
			.attr('height', barHeight)
			.attr('width', function(d){
				return d.data.rectSize.federalPlan;
			})
			.style('fill', segmentColors[1])
			.attr('transform', function(d) {
				return 'translate(' + d.data.rectSize.regionalPlan + ',' + 0 + ')';
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

		localSourcePlan = barPlanBlock
			.append('rect')
			.attr('class', 'localSourcePlan')
			.attr('height', barHeight)
			.attr('width', function(d){
				return d.data.rectSize.localPlan;
			})
			.style('fill', segmentColors[2])
			.attr('transform', function(d) {
				return 'translate(' + (d.data.rectSize.regionalPlan + d.data.rectSize.federalPlan) + ',' + 0 + ')';
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

		extraSourcePlan = barPlanBlock
			.append('rect')
			.attr('class', 'extraSourcePlan')
			.attr('height', barHeight)
			.attr('width', function(d){
				return d.data.rectSize.extraPlan;
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

		barEx = graf
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
				return d.data.rectSize.regionalEx;
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
				return d.data.rectSize.federalEx;
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
				return d.data.rectSize.localEx;
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
				return d.data.rectSize.extraEx;
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

	function drawEvents (canvas) {

		controlPanel = program
			.append('div')
			.attr('class', 'controlEvent')
			.style('padding', '0 30px 10px')
			.style('display', function(d){
				if (d.data.events.length > 0) {return 'block';}
				else {return 'none';}
			})
		;

		control = controlPanel
			.append('div')
			.attr('data-event-index', function(d) {
				return d.index;
			})
			.attr('class', 'controlEvent__button')
			.style('display', 'table')
			.style('padding-left', '30px')
			.style('font-weight', 'bold')
			.style('color', '#677d91')
			.style('cursor', 'pointer')
			.style('position', 'relative')
			.text('Мероприятия')
		;

		controlArrow = control
			.append('div')
			.attr('class', 'arrow')
			.style('width', '10px')
			.style('height', '10px')
			.style('border-top', '2px solid #9DACB7')
			.style('border-right', '2px solid #9DACB7')
			.style('position', 'absolute')
			.style('left', '5px')
			.style('top', '6px')
			.style('transform', 'rotate(45deg)')
		;

		events = program
			.append('div')
			.attr('data-event-index', function(d) {
				return d.index;
			})
			.attr('class', 'events')
			.style('font-size', fontSize + 'px')
			.style('height', '0px')
			.style('overflow', 'hidden')
		;

		events
			.each(function(d){
				for (var i = 0; i < d.data.events.length; i++) {

					progEvent = d3.select(this)
						.append('div')
						.attr('class', 'event')
					;

					grafEvent = progEvent
						.append('svg')
						.attr('width', svgWidth)
						.attr('height', blockHeightEvent)
						.append('g')
						.attr('class', 'graf')
						.attr('transform', 'translate(' + leftPadding + ',' + 0 + ')')
					;

					labelEvent = grafEvent
						.append('text')
						.attr('y', '1em')
						.style('font-weight', 'bold')
						.style('fill', '#677d91')
						.text(function(d){
							return d.data.events[i].title + ' ';
						})
						.append('tspan')
						.style('font-weight', 'normal')
						.text(function(d){
							return 'срок реализации ' + d.data.events[i].start + ' - ' + d.data.events[i].finish;
						})
					;

					barPlanEvent = grafEvent
						.append('g')
						.attr('class', 'plan')
						.attr('transform', 'translate(' + 0 + ',' + (blockHeight * 0.25) + ')')
					;

					barPlanEvent
						.append('text')
						.style('dominant-baseline', 'central')
						.attr('transform', function(d){
							return 'translate(' + (d.data.events[i].barPlanWidth + 10) + ',' + (barHeightEvent / 2) + ')';
						})
						.style('fill', '#888')
						.text('План: ')
						.append('tspan')
						.style('fill', '#000')
						.text(function(d){
							return gap(d.data.events[i].eventPlanBudget / 1000) + ' тыс. руб.';
						})
					;

					barPlanBlockEvent = barPlanEvent
						.append('g')
					;

					regionalSourcePlanEvent = barPlanBlockEvent
						.append('rect')
						.attr('class', 'regionalSourcePlan')
						.attr('height', barHeightEvent)
						.attr('width', function(d){
							return d.data.events[i].rectSize.regionalPlan;
						})
						.style('fill', segmentColors[0])
						.attr('transform', 'translate(' + 0 + ',' + 0 + ')')
						.on('mousemove', function(d,i){
							tooltip
								.html('Областные средства<br>План: ' + gap(d.data.events[i].planBudget.regionalSource) + ' руб<br>Исполнено: ' + gap(d.data.events[i].exBudget.regionalSource) + ' руб<br>Процент исполнения: ' + Math.round(d.data.events[i].exRate.regionalExRate) + '%')
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

					federalSourcePlanEvent = barPlanBlockEvent
						.append('rect')
						.attr('class', 'federalSourcePlan')
						.attr('height', barHeightEvent)
						.attr('width', function(d){
							return d.data.events[i].rectSize.federalPlan;
						})
						.style('fill', segmentColors[1])
						.attr('transform', function(d) {
							return 'translate(' + d.data.events[i].rectSize.regionalPlan + ',' + 0 + ')';
						})
						.on('mousemove', function(d,i){
							tooltip
								.html('Федеральные средства<br>План: ' + gap(d.data.events[i].planBudget.federalSource) + ' руб<br>Исполнено: ' + gap(d.data.events[i].exBudget.federalSource) + ' руб<br>Процент исполнения: ' + Math.round(d.data.events[i].exRate.federalExRate) + '%')
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

					localSourcePlanEvent = barPlanBlockEvent
						.append('rect')
						.attr('class', 'localSourcePlan')
						.attr('height', barHeightEvent)
						.attr('width', function(d){
							return d.data.events[i].rectSize.localPlan;
						})
						.style('fill', segmentColors[2])
						.attr('transform', function(d) {
							return 'translate(' + (d.data.events[i].rectSize.regionalPlan + d.data.events[i].rectSize.federalPlan) + ',' + 0 + ')';
						})
						.on('mousemove', function(d,i){
							tooltip
								.html('Местный бюджет<br>План: ' + gap(d.data.events[i].planBudget.localSource) + ' руб<br>Исполнено: ' + gap(d.data.events[i].exBudget.localSource) + ' руб<br>Процент исполнения: ' + Math.round(d.data.events[i].exRate.localExRate) + '%')
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

					extraSourcePlanEvent = barPlanBlockEvent
						.append('rect')
						.attr('class', 'extraSourcePlan')
						.attr('height', barHeightEvent)
						.attr('width', function(d){
							return d.data.events[i].rectSize.extraPlan;
						})
						.style('fill', segmentColors[3])
						.attr('transform', function(d) {
							return 'translate(' + (d.data.events[i].rectSize.regionalPlan + d.data.events[i].rectSize.federalPlan + d.data.events[i].rectSize.localPlan) + ',' + 0 + ')';
						})
						.on('mousemove', function(d,i){
							tooltip
								.html('Внебюджетные источники<br>План: ' + gap(d.data.events[i].planBudget.extraSource) + '  руб<br>Исполнено: ' + gap(d.data.events[i].exBudget.extraSource) + ' руб<br>Процент исполнения: ' + Math.round(d.data.events[i].exRate.extraExRate) + '%')
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

					barExEvent = grafEvent
						.append('g')
						.attr('class', 'ex')
						.attr('transform', 'translate(' + 0 + ',' + (blockHeightEvent * 0.55) + ')')
					;

					barExEvent
						.append('text')
						.style('dominant-baseline', 'central')
						.attr('transform', function(d){
							return 'translate(' + (d.data.events[i].barExWidth + 10) + ',' + (barHeightEvent / 2) + ')';
						})
						.style('fill', '#888')
						.text('Исполнение: ')
						.append('tspan')
						.style('fill', '#000')
						.text(function(d){
							return gap(d.data.events[i].eventExBudget / 1000) + ' тыс. руб.';
						})
					;

					barExBlockEvent = barExEvent
						.append('g')
						.style('filter', 'url(#dropshadow)')
					;

					regionalSourceExEvent = barExBlockEvent
						.append('rect')
						.attr('class', 'regionalSourceEx')
						.attr('height', barHeightEvent)
						.attr('width', function(d){
							return d.data.events[i].rectSize.regionalEx;
						})
						.style('fill',  d3.rgb(segmentColors[0]).darker(0.5))
						.attr('transform', 'translate(' + 0 + ',' + 0 + ')')
						.on('mousemove', function(d,i){
							tooltip
								.html('Областные средства<br>План: ' + gap(d.data.events[i].planBudget.regionalSource) + ' руб<br>Исполнено: ' + gap(d.data.events[i].exBudget.regionalSource) + ' руб<br>Процент исполнения: ' + Math.round(d.data.events[i].exRate.regionalExRate) + '%')
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

					federalSourceExEvent = barExBlockEvent
						.append('rect')
						.attr('class', 'federalSourceEx')
						.attr('height', barHeightEvent)
						.attr('width', function(d){
							return d.data.events[i].rectSize.federalEx;
						})
						.style('fill', d3.rgb(segmentColors[1]).darker(0.5))
						.attr('transform', function(d) {
							return 'translate(' + d.data.events[i].rectSize.regionalEx + ',' + 0 + ')';
						})
						.on('mousemove', function(d,i){
							tooltip
								.html('Федеральные средства<br>План: ' + gap(d.data.events[i].planBudget.federalSource) + ' руб<br>Исполнено: ' + gap(d.data.events[i].exBudget.federalSource) + ' руб<br>Процент исполнения: ' + Math.round(d.data.events[i].exRate.federalExRate) + '%')
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

					localSourceExEvent = barExBlockEvent
						.append('rect')
						.attr('class', 'localSourceEx')
						.attr('height', barHeightEvent)
						.attr('width', function(d){
							return d.data.events[i].rectSize.localEx;
						})
						.style('fill', d3.rgb(segmentColors[2]).darker(0.5))
						.attr('transform', function(d) {
							return 'translate(' + (d.data.events[i].rectSize.regionalEx + d.data.events[i].rectSize.federalEx) + ',' + 0 + ')';
						})
						.on('mousemove', function(d,i){
							tooltip
								.html('Местный бюджет<br>План: ' + gap(d.data.events[i].planBudget.localSource) + ' руб<br>Исполнено: ' + gap(d.data.events[i].exBudget.localSource) + ' руб<br>Процент исполнения: ' + Math.round(d.data.events[i].exRate.localExRate) + '%')
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

					extraSourceExEvent = barExBlockEvent
						.append('rect')
						.attr('class', 'extraSourceEx')
						.attr('height', barHeightEvent)
						.attr('width', function(d){
							return d.data.events[i].rectSize.extraEx;
						})
						.style('fill', d3.rgb(segmentColors[3]).darker(0.5))
						.attr('transform', function(d) {
							return 'translate(' + (d.data.events[i].rectSize.regionalEx + d.data.events[i].rectSize.federalEx + d.data.events[i].rectSize.localEx) + ',' + 0 + ')';
						})
						.on('mousemove', function(d,i){
							tooltip
								.html('Внебюджетные источники<br>План: ' + gap(d.data.events[i].planBudget.extraSource) + ' руб<br>Исполнено: ' + gap(d.data.events[i].exBudget.extraSource) + ' руб<br>Процент исполнения: ' + Math.round(d.data.events[i].exRate.extraExRate) + '%')
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
			})
		;

	}

	/* For the drop shadow filter... */
	svg = d3.selectAll('svg');

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

}

document.addEventListener('click', function(event) {

	var el = event.target;

	var eventLists = document.querySelectorAll('.program .events');

	if (el.classList.contains('controlEvent__button')){

		var currentIndex = el.getAttribute('data-event-index');

		if (el.classList.contains('open')){
			el.classList.remove('open');

			var arrow = el.childNodes[1];
			arrow.style.transform = 'rotate(' + 45 + 'deg)';

			for (var key in eventLists) {
				var item = eventLists[key];

				if (!item.classList || !item.classList.contains('events'))
					break;

				if (item.getAttribute('data-event-index') == currentIndex){
					item.style.height = 0 + "px";
				}
			}
		}
		else{
			el.classList.add('open');

			var arrow = el.childNodes[1];
			arrow.style.transform = 'rotate(' + -45 + 'deg)';

			for (var key in eventLists) {
				var item = eventLists[key];

				if (!item.classList || !item.classList.contains('events'))
					break;

				if (item.getAttribute('data-event-index') == currentIndex){
					item.style.height = item.scrollHeight + "px";
				}
			}
		}

	}

});