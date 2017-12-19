function drawChart12(data12,prop12) {

	data = data12;
	prop = prop12;

	height = prop.height;
	fontSize = prop.fontSize;
	width = 1030;
	legendWidth = 200;
	grafWidth = width - legendWidth;

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

	bubbleSort(data);

	//Расчёт суммарного бюджета
	totalPlanBudget = 0;
	for (var i = 0; i < data.length; i++) {
		totalPlanBudget = totalPlanBudget + data[i]['planBudget'];
	}

	//вычисляем суммарный бюджет сегмента "иные" - план
	otherPlanBudget = 0;
	for (var i = 5; i < data.length; i++) {
		otherPlanBudget = otherPlanBudget + data[i]['planBudget'];
	}

	//вычисляем суммарный бюджет сегмента "иные" - исполнение
	otherExBudget = 0;
	for (var i = 5; i < data.length; i++) {
		otherExBudget = otherExBudget + data[i]['exBudget'];
	}

	//дублируем данные в рабочий массив в который будет помещён элемент "Иные"
	workData = data.slice(0);
	//удаляем из массива данных все элементы после пятого, относящиеся к сегменту "Иные"
	workData.splice(5);
	//добавляем элемент "Иные", содержащий суммарные данные обо всех элементах после пятого
	workData.push({
		name: 'Иные',
		planBudget: otherPlanBudget,
		exBudget: otherExBudget
	});

	/*---------------------------------------()---------------------------------------*/
	body = d3.select('body');

	pie = d3.pie();

	chartArea = d3.select('#chart12')
		.append('svg')
		.attr('width', width)
		.attr('height', height)
		.attr('class', 'chart-area')
		.style('cursor', 'default')
		.style('font-size', fontSize)
	;

	tooltip = body.append('div')
		.attr('class', 'tooltip')
		.style('display', 'none')
		.style('position', 'absolute')
		.style('padding', '10px')
		.style('border', '1px solid #0000ff')
		.style('background-color', 'rgba(255, 255, 255, 0.85)')
		.style('font-size', fontSize + 'px')
	;

	/*---------------------------------------(ОТРИСОВКА ГРАФИКА)---------------------------------------*/
	drawGraf(chartArea);

	function drawGraf(canvas) {
		graf = canvas
			.append('g')
			.attr('class', 'graf')
			.attr('width', grafWidth)
			.attr('height', height)
			.attr('transform', 'translate(' + 0 + ',' + 0 + ')')
		;

		//распределяем доли сегментов от ширины графика в процентном соотношении
		rate = [21,19,18,16,14,12];
		//каждый новый сегмент должен устанавливаться со смещением равным ширине предыдущего сегмента. чтобы вычислить это смещение берём все элементы массива кроме первого и записываем в новый массив
		pos = rate.slice(0,5);
		//добавляем в начало этого массива элемент "0"
		pos.unshift(0);

		for (var i = 0; i < workData.length; i++) {
			workData[i]['displacement'] = grafWidth / 100 * pos[i]; //вычисляем размер смещения позиции каждого элемента
			workData[i]['rectWidth'] = grafWidth / 100 * rate[i]; //вычисляем ширину каждого сегмента
			workData[i]['rectColor'] = prop.segmentColors[i]; //определяем цвета сегментов из массива свойств графика
			workData[i]['exRate'] = workData[i].exBudget / workData[i].planBudget * 100; //расчёт долей исполненного бюджета относительно плана
			workData[i]['rectExWidth'] = workData[i].rectWidth / 100 * workData[i].exRate; ////расчёт ширины внутренного сегмента исполнения
		}

		//обнуляем позицию первого сегмента
		rectPos = 0;
		rectGraf = graf.selectAll('.graf-pie')
			.data(pie(workData))
			.enter()
			.append('g')
			.attr('class', 'graf-pie')
			.attr('transform', function(d){
				rectPos = rectPos + d.data.displacement; //увеличиваем значение позиции на значение смещения для каждого следующего сегмента
				return 'translate(' + rectPos + ',' + 0 + ')';
			})
			.on('mousemove', function(d){
				tooltip
					.html(d.data.name + '<br>план: ' + gap(d.data.planBudget) + ' руб.<br>Факт: ' + gap(d.data.exBudget) + ' руб.<br>Процент исполнения: ' + Math.round(d.data.exRate) + '%')
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

		rectPlan = rectGraf
			.append('rect')
			.attr('class', 'plan')
			.attr('width', function(d){
				return d.data.rectWidth;
			})
			.attr('height', height)
			.style('fill', function(d){
				return d.data.rectColor;
			})
		;

		rectEx = rectGraf
			.append('rect')
			.attr('class', 'ex')
			.attr('width', function(d){
				if (d.data.exRate > 100) {return d.data.rectWidth}
				else {return d.data.rectExWidth;}
			})
			.attr('height', height)
			.style('fill', function(d){
				return d3.rgb(d.data.rectColor).darker(0.4);
			})
		;

		rectLabel = graf.selectAll('.graf-pie')
			.append('text')
			.attr('x', 0)
			.attr('y', '1em')
			.attr('transform', 'translate(' + 5 + ',' + 5 + ')')
			.style('font-size', (fontSize * 0.9) + 'px')
			.style('fill', '#fff')
			.text(function(d){
				return d.data.name;
			})
		;
	}

	/*---------------------------------------(ОТРИСОВКА ЛЕГЕНДЫ)---------------------------------------*/
	drawLegend(chartArea);

	function drawLegend(canvas){
		legend = canvas
			.append('g')
			.attr('class', 'legend')
			.attr('width', legendWidth)
			.attr('height', height)
			.attr('transform', 'translate(' + (grafWidth+10) + ',' + 5 + ')')
		;

		legend
			.append('text')
			.attr('y', '1em')
			.attr('x', 0)
			.style('font-size', (fontSize * 0.9) + 'px')
			.style('fill', '#677d91')
			.text('Всего госпрограмм')
		;

		legend
			.append('text')
			.attr('y', fontSize*3)
			.attr('x', 0)
			.style('font-size', (fontSize * 1.5) + 'px')
			.style('font-weight', 'bold')
			.style('fill', '#3b70a2')
			.text(data.length)
		;

		legend
			.append('text')
			.attr('y', fontSize*5)
			.attr('x', 0)
			.style('font-size', (fontSize * 1.5) + 'px')
			.style('font-weight', 'bold')
			.style('fill', '#3b70a2')
			.text(gap(totalPlanBudget/1000) + ' ')
			.append('tspan')
			.style('font-weight', 'normal')
			.style('font-size', (fontSize * 0.9) + 'px')
			.style('fill', '#677d91')
			.text('тыс. руб.')
		;
	}


	console.log(workData);
	console.log(data);
	console.log(totalPlanBudget);
	console.log(otherPlanBudget);
	console.log(rate);

}