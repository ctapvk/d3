// # C3 Stacked Bar Chart
// _This example explores a few different types of **stacked** charts._
// _It shows the flexibility in how the data may be organized for stacked visualzations._
// Instead of attaching charts to existing div anchors in the html, this example
// dynamically creates and attached them to the DOM.
var div_selection = d3.select('#stack_example_plots');
//var legend = d3.select('#legend');
// Create **ordinal** scales to manage the _age group_ and _race_ 
// categories provided by the CDC.


var year_scale = d3.scale.ordinal().domain(['2014', '2015', '2016', '2017', '2018']);
// Create scales to select colors for the various causes of death and regions.
var cause_color = d3.scale.category20();
var region_color = d3.scale.category10();

// ## Expanded Bar Chart

var expanded_bar_chart = new c3.Plot({
    anchor: div_selection.append('div').style('display', 'inline-block').node(),
    height: 500,
    width: 960,
    // Sometimes we _don't_ have fully **normalized data**.  Here we have a dataset with one
    // entry per x value (year), and each object contains the values for all of the stacks.
    data: [
        { year: '2014', Россельхоз: 6111, Минпромторг: 29616, Минэнерго: 43688, Росприроднадзор: 81546, Минстрой: 8156, Россвязь: 5146, Минкультуры: 81546, Росавтодор: 81546, Ростелеком: 81546, Росоператор: 81546, Иные: 81546},
        { year: '2015', Россельхоз: 71853, Минпромторг: 375443, Минэнерго: 68215, Росприроднадзор: 328879, Минстрой: 8156, Россвязь: 5146, Минкультуры: 81546, Росавтодор: 81546, Ростелеком: 81546, Росоператор: 81546, Иные: 81546 },
        { year: '2016', Россельхоз: 569686, Минпромторг: 662679, Минэнерго: 1940938, Росприроднадзор: 288980, Минстрой: 8156, Россвязь: 5146, Минкультуры: 81546, Росавтодор: 81546, Ростелеком: 81546, Росоператор: 81546, Иные: 81546 },
        { year: '2017', Россельхоз: 5041763, Минпромторг: 6159459, Минэнерго: 8954636, Росприроднадзор: 4890548, Минстрой: 8156, Россвязь: 5146, Минкультуры: 81546, Росавтодор: 81546, Ростелеком: 81546, Росоператор: 81546, Иные: 81546 },
        { year: '2018', Россельхоз: 569686, Минпромторг: 662679, Минэнерго: 1940938, Росприроднадзор: 288980, Минстрой: 8156, Россвязь: 5146, Минкультуры: 81546, Росавтодор: 81546, Ростелеком: 81546, Росоператор: 81546, Иные: 81546 },
    ],
    // Setup **scales** and **x** accessor.
    // Note we are using an _ordinal_ horizontal scale and the default vertical scale.
    h: year_scale,
    x: function (d) { return d.year; },
    // Create the **stacked bar** layer.
    // Here we manually specify the set of stacks that are present.
    // Because we don't have a `stack_options.key` defined, each layer will get its own copy
    // of the data.However, each stack can have its own **y ** accessor to get its
    // particular value for that stack with the datum.
    layers: [
        new c3.Plot.Layer.Bar({
            name: " ",
            bar_width: '75%',
            stack_options: {
                offset: 'expand',
                styles: { 'fill': function (stack) { return region_color(stack.key); } },
                title: function (stack) { return stack.key; },
                name: function (key) { return key; }
            },
            stacks: [
                new c3.Plot.Layer.Stackable.Stack({
                    key: 'Россельхоз',
                    y: function (d) { return d.Россельхоз; }
                }),
                new c3.Plot.Layer.Stackable.Stack({
                    key: 'Минпромторг',
                    y: function (d) { return d.Минпромторг; }
                }),
                new c3.Plot.Layer.Stackable.Stack({
                    key: 'Минэнерго',
                    y: function (d) { return d.Минэнерго; }
                }),
                new c3.Plot.Layer.Stackable.Stack({
                    key: 'Росприроднадзор',
                    y: function (d) { return d.Росприроднадзор; }
                }),
                new c3.Plot.Layer.Stackable.Stack({
                    key: 'Минстрой',
                    y: function (d) { return d.Минстрой; }
                }),
                new c3.Plot.Layer.Stackable.Stack({
                    key: 'Россвязь',
                    y: function (d) { return d.Россвязь; }
                }),
                new c3.Plot.Layer.Stackable.Stack({
                    key: 'Минкультуры',
                    y: function (d) { return d.Минкультуры; }
                }),
                new c3.Plot.Layer.Stackable.Stack({
                    key: 'Росавтодор',
                    y: function (d) { return d.Росавтодор; }
                }),
                new c3.Plot.Layer.Stackable.Stack({
                    key: 'Ростелеком',
                    y: function (d) { return d.Ростелеком; }
                }),
                new c3.Plot.Layer.Stackable.Stack({
                    key: 'Росоператор',
                    y: function (d) { return d.Росоператор; }
                }),
                new c3.Plot.Layer.Stackable.Stack({
                    key: 'Иные',
                    y: function (d) { return d.Иные; }
                }),

            ]
        }),
    ],
    // _Alternatively_, instead of specifying a y accessor for each stack above,
    // we could have just used this single **y accessor** for the layer:
    //        y: (d, i, stack) -> d[stack.key]
    // Add **margins ** and **axes ** to polish the example
    margins: { top: 10, right: 20 },
    axes: [
        new c3.Axis.X({
            label: null,
            orient: 'top',
            scale: false
        }),
        new c3.Axis.Y({
            label: null,
            tick_label: function (d) { return (d * 100) + '%'; }
        }),
        new c3.Axis.X({
            label: null,
        }),
    ]
}).render();
// Create an associated **legend** for this chart
new c3.Legend.PlotLegend({
    anchor: div_selection.append('div').node(),
    anchor_styles: {
        'display': 'inline-block',
        'vertical-align': '5em'
    },
    plot: expanded_bar_chart
}).render();

