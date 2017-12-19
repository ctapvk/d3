function drawChart32(data,prop) {

	//data = data12;
	//prop = prop12;

	svgHeight = prop.height;
	svgWidth = prop.width;
	fontSize = prop.fontSize;
	segmentColors = prop.segmentColors;

	bubbleSort(data);

	//Расчёт суммарного бюджета
	totalPlanBudget = 0;
	for (var i = 0; i < data.length; i++) {
		totalPlanBudget = totalPlanBudget + data[i]['planBudget'];
	}

	totalExBudget = 0;
	for (var i = 0; i < data.length; i++) {
		totalExBudget = totalExBudget + data[i]['exBudget'];
	}

	//вычисляем суммарный бюджет сегмента "иные" - план
	otherPlanBudget = 0;
	for (var i = 9; i < data.length; i++) {
		otherPlanBudget = otherPlanBudget + data[i]['planBudget'];
	}

	//вычисляем суммарный бюджет сегмента "иные" - исполнение
	otherExBudget = 0;
	for (var i = 9; i < data.length; i++) {
		otherExBudget = otherExBudget + data[i]['exBudget'];
	}

	totalExRate = totalExBudget / totalPlanBudget * 100;

	//определение размера кругового графика
	grafWidth = svgWidth * 0.55;
	grafHeight = svgHeight * 0.55;

	//задаём радиус кругового графика
	radius = Math.min(grafWidth, grafHeight) / 2;
	innerRadius = 100;

	//задаём массив радиусов долей в процентах
	ratio = Array(46,52,58,64,70,76,82,88,94,100);

	//создаём элемент арки с радиусом
	arc = d3.arc()
		.outerRadius(function(d){
			return d.data.outerRadius;
		})
		.innerRadius(innerRadius)
	;

	pie = d3.pie()
		.sort(null)
		.value(10)
	;

	labelArc = d3.arc()
		.outerRadius(function(d){
			return (d.data.outerRadius - 25);
		})
		.innerRadius(function(d){
			return (d.data.outerRadius - 25);
		})
	;

	label = d3.arc()
		.outerRadius(radius*1.45)
		.innerRadius(radius*1.45)
	;

	labelIcon = d3.arc()
		.outerRadius(innerRadius + 30)
		.innerRadius(innerRadius + 30)
	;

	linkStart = d3.arc()
		.outerRadius(function(d){
			return (d.data.outerRadius - 5);
		})
		.innerRadius(function(d){
			return (d.data.outerRadius - 5);
		})
	;

	labelPoint = d3.arc()
		.outerRadius(radius + 15)
		.innerRadius(radius + 15)
	;

	/*---------------------------------------()---------------------------------------*/
	//создаём рабочее поле где будет размещена диаграмма
	chartArea = d3.select('#chart32')
		.append('svg')
		.attr('class', 'chart-area')
		.style('cursor', 'default')
		.attr('width', svgWidth)
		.attr('height', svgHeight)
		.style('font-size', fontSize)
	;

	body = d3.select('body');

	workData = data.slice(0);
	workData.splice(9);
	workData.reverse();
	workData.unshift({
		title: 'Другие госпрограммы',
		planBudget: otherPlanBudget,
		exBudget: otherExBudget,
		icon: 'icon/other.svg'
	});

	//переносим два первых элемента в конец массивов с данными, размерами долей и цветами
	dataBuff = workData[0];
	workData[10] = dataBuff;
	workData.splice(0,1);

	dataBuff = workData[0];
	workData[10] = dataBuff;
	workData.splice(0,1);

	dataBuff = ratio[0];
	ratio[10] = dataBuff;
	ratio.splice(0,1);

	dataBuff = ratio[0];
	ratio[10] = dataBuff;
	ratio.splice(0,1);

	dataBuff = segmentColors[0];
	segmentColors[10] = dataBuff;
	segmentColors.splice(0,1);

	dataBuff = segmentColors[0];
	segmentColors[10] = dataBuff;
	segmentColors.splice(0,1);

	for (var i = 0; i < workData.length; i++) {
		workData[i]['rectBg'] = prop.segmentColors[i]; //определяем цвета сегментов из массива свойств графика
		workData[i]['exRate'] = workData[i].exBudget / workData[i].planBudget *100;
		workData[i]['outerRadius'] = (radius - innerRadius) / 100 * ratio[i] + innerRadius;
	}

	drawGraf(chartArea);

	/*---------------------------------------(functions)---------------------------------------*/
	function drawGraf(canvas) {
		graf = canvas
			.append('g')
			.attr('class', 'graf')
			.attr('transform', 'translate(' + (svgWidth / 2) + ',' + (svgHeight / 2) + ')')
		;

		//отрисовываем доли графика
		g_arc = graf.selectAll('.arc')
			.data(pie(workData))
			.enter()
			.append('g')
			.attr('class', 'arc')
		;

		g_arc
			.append('path')
			.attr('d', arc)
			.style('fill', function(d) {
				return d.data.rectBg;
			})
			.style('stroke', '#fff')
			.style('stroke-width', '10px')
		;

		g_arc
			.append('text')
			.attr('y', '0.35em')
			.style('text-anchor', 'middle')
			.style('fill', '#fff')
			.attr('transform', function(d) {
				return 'translate(' + labelArc.centroid(d) + ')';
			})
			.text(function(d){
				return Math.round(d.data.exRate) + '%'
			})
		;

		//строим соединительные линии между долями и подписями
		line = g_arc
			.append('line')
			.attr('class', 'link')
			.attr('x1', function(d) {
				coords = labelPoint.centroid(d);
				return coords[0];
			})
			.attr('y1', function(d) {
				coords = labelPoint.centroid(d);
				return coords[1];
			})
			.attr('x2', function(d) {
				coords = linkStart.centroid(d);
				return coords[0];
			})
			.attr('y2', function(d) {
				coords = linkStart.centroid(d);
				return coords[1];
			})
			//.attr('transform', 'translate(' + svgWidth / 2 + ',' + svgHeight / 2 + ')')
			.attr('stroke-width', 1)
			.attr('stroke', '#c2bec3')
		;

		//выводим иконки госпрограмм на долях графика
		icon = g_arc
			.append('foreignObject')
			.attr('x', -15)
			.attr('y', -15)
			.attr('width', 30)
			.attr('height', 30)
			.attr('transform', function(d) {
				return 'translate(' + labelIcon.centroid(d) + ')';
			})
			//.append('img')
			//.attr('width', 30)
			//.attr('height', 30)
			//.attr('src', 'icon/shield.svg')
			.html(function(d){
				return '<img width="30" height="30" src=' + d.data.icon + '>';
			})
		;

		//выводим соединительные линии
		point = g_arc
			.append('circle')
			.attr('r', 5)
			.style('fill', function(d){
				return d.data.rectBg;
			})
			.attr('transform', function(d) {

				return 'translate(' + labelPoint.centroid(d) + ')';
			})
		;

		//выводим описание долей
		acrLabel = g_arc
			.append('foreignObject')
			.attr('y', -100)
			.attr('x', -100)
			.style('font-size', fontSize*0.9)
			.attr('width', 200)
			.attr('height', 200)
			.attr('transform', function(d) {
				return 'translate(' + label.centroid(d) + ')';
			})
			.append('xhtml:div')
			.style('display', 'table')
			.style('margin', '0 auto')
			.style('height', '100%')
			.append('xhtml:div')
			.style('display', 'table-cell')
			.style('vertical-align', 'middle')
		;

		acrLabel
			.append('xhtml:div')
			.text(function(d){
				return d.data.title;
			})
		;

		acrLabelPlan = acrLabel
			.append('xhtml:div');
		acrLabelPlan
			.append('span')
			.text('План: ');
		acrLabelPlan
			.append('span')
			.style('font-size', fontSize + 'px')
			.style('font-weight', 'bold')
			.style('color', '#037cd3')
			.text(function(d){return gap(d.data.planBudget/1000);});
		acrLabelPlan
			.append('span')
			.text(' тыс. руб.');

		acrLabelEx = acrLabel
			.append('xhtml:div');
		acrLabelEx
			.append('span')
			.text('Факт: ');
		acrLabelEx
			.append('span')
			.style('font-size', fontSize + 'px')
			.style('font-weight', 'bold')
			.style('color', '#037cd3')
			.text(function(d){return gap(d.data.exBudget/1000);});
		acrLabelEx
			.append('span')
			.text(' тыс. руб.');

		//выводим центральную легенду
		legend = canvas
			.append('g')
			.attr('transform', 'translate(' + svgWidth/2 + ',' + svgHeight/2 + ')')
		;

		legend
			.append('circle')
			.attr('r', (innerRadius-10))
			.style('stroke', '#007ad2')
			.style('fill', '#fff')
			.style('stroke-width', '10px')
		;

		legendText = legend
			.append('g')
			.style('text-anchor', 'middle')
			.attr('transform', 'translate(' + 0 + ',' + -fontSize*3 + ')')
		;
		legendText
			.append('text')
			.attr('y', 0)
			.text('План:')
		;
		legendText
			.append('text')
			.attr('y', fontSize*1.5)
			.style('fill', '#037cd3')
			.style('font-weight', 'bold')
			.style('font-size', fontSize*1.3)
			.text(gap(totalPlanBudget/1000) + ' ')
			.append('tspan')
			.style('fill', '#000')
			.style('font-weight', 'normal')
			.style('font-size', fontSize*0.9)
			.text('тыс. руб.')
		;
		legendText
			.append('text')
			.attr('y', fontSize*3)
			.text('Факт:')
		;
		legendText
			.append('text')
			.attr('y', fontSize*4.5)
			.style('fill', '#037cd3')
			.style('font-weight', 'bold')
			.style('font-size', fontSize*1.3)
			.text(gap(totalExBudget/1000) + ' ')
			.append('tspan')
			.style('fill', '#000')
			.style('font-weight', 'normal')
			.style('font-size', fontSize*0.9)
			.text('тыс. руб.')
		;
		legendText
			.append('text')
			.attr('y', fontSize*6)
			.text('Исполнено:')
		;
		legendText
			.append('text')
			.attr('y', fontSize*7.5)
			.style('fill', '#037cd3')
			.style('font-weight', 'bold')
			.style('font-size', fontSize*1.3)
			.text(Math.round(totalExRate) + '%')
		;

	}

	//добавление отступа после каждого третьего знака
	function gap(d) {
		return d.toString().replace(/\d{0,3}(?=(\d{3})+$)/g, "$& ") ;
	}

	//функция сортировки
	function bubbleSort(A) {
		var n = A.length;
		for (var i = 0; i < n-1; i++) {
			for (var j = 0; j < n-1-i; j++){
				if (A[j+1]['planBudget'] > A[j]['planBudget']){ //сортируем по убыванию
					var t = A[j+1];
					A[j+1] = A[j];
					A[j] = t;
				}
			}
		}
		return A;    // На выходе сортированный по возрастанию массив A.
	}

	console.log(workData);
	console.log(data);

}