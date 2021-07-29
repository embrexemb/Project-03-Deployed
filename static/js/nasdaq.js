
// Set Width and Height
var svgWidth = 1000;
var svgHeight = 750;

// Set Page Margin
var margin = {
  top: 25,
  right: 45,
  bottom: 200,
  left: 100
};

var width = svgWidth - margin.right - margin.left;
var height = svgHeight - margin.top - margin.bottom;

// append a div class to the scatter element
var chart = d3.select('#scatter')
  .append('div')
  .classed('chart', true);

//append an svg element to the chart 
var svg = chart.append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

//append an svg group
var chartGroup = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

//initial parameters; x and y axis
let chosenXAxis = 'd_close';
let chosenYAxis = 'sales';  //volume *d_close

//a function for updating the x-scale variable upon click of label
function xScale(stockData, chosenXAxis) {
  //scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(stockData, d => d[chosenXAxis]) * 0.8,
    d3.max(stockData, d => d[chosenXAxis]) * 1.2])
    .range([0, width]);

  return xLinearScale;
}
//a function for updating y-scale variable upon click of label
function yScale(stockData, chosenYAxis) {
  //scales       
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(stockData, d => d[chosenYAxis]) * 0.8,
    d3.max(stockData, d => d[chosenYAxis]) * 1.2])
    .range([height, 0]);

  return yLinearScale;
}
//a function for updating the xAxis upon click
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(2000)
    .call(bottomAxis);

  return xAxis;
}

//function used for updating yAxis variable upon click
function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(2000)
    .call(leftAxis);

  return yAxis;
}

//function for updating the circles with a transition to new circles 
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(2000)
    .attr('cx', data => newXScale(data[chosenXAxis]))
    .attr('cy', data => newYScale(data[chosenYAxis]))

  return circlesGroup;
}

//function for updating stock labels
function  renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  textGroup.transition()
    .duration(2000)
    .attr('x', d=> newXScale(d[chosenXAxis]))
    .attr('y', d=> newYScale(d[chosenYAxis]))

  return textGroup
}
//function to stylize x-axis values for tooltips
function styleX(value, chosenXAxis){
   //style based on variable
  //d_close
  if (chosenXAxis === 'd_close'){
    return `$${value} per share`;
  }
  //sales
  else if (chosenXAxis === 'sales'){
    return `$${value} per share`;
  }
 else {
   return `$${value} per share`;
 }
}
 
//funtion for updating circles group
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup){
// X Labels
  // d_close
   if (chosenXAxis === 'd_close'){
     var xLabel = 'dailyClose';
   }
  
   //d_high
   else if (chosenXAxis === 'd_high'){
     var xLabel = 'dailyHigh';
   }
   //d_low
   else {
     var xLabel = 'dailyLow';
   }

     //Y label
  if (chosenYAxis === 'sales'){
    var yLabel = 'Sales';
  } 
  else if (chosenYAxis === 'age'){
    var yLabel = 'yearsOperation';
  }
  else {
    var yLabel = 'salesVolume';
  }
  var toolTip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-8,0])
      .html(function (d){
        return (`${d.state}<br>${xLabel} ${styleX(d[chosenXAxis],chosenYAxis)}<br>${yLabel} ${d[chosenYAxis]}`);
      });

    circlesGroup.call(toolTip);

    //add
    circlesGroup.on('mouseover', toolTip.show)
      .on('mouseout', toolTip.hide);

    return circlesGroup;

    }
  
//retrieve data
d3.csv('../static/data/nasdaq.csv').then(function (stockData) {  

  console.log(stockData);

  //Parse data
  stockData.forEach(function(data) {
    data.d_close = +data.d_close;
    data.d_low = +data.d_low;
    data.d_high = +data.d_high;
    data.age = +data.age;
    data.volume = +data.volume;
    data.sales = +data.sales;
  });

  //create linear scales
   var xLinearScale = xScale(stockData, chosenXAxis);
   var yLinearScale = yScale(stockData, chosenYAxis);
  //create x axis
   var bottomAxis = d3.axisBottom(xLinearScale);
   var leftAxis = d3.axisLeft(yLinearScale);
  //append X
   var xAxis = chartGroup.append('g')
    .classed('x-axis', true)
    .attr('transform', `translate(0,${height})`)
    .call(bottomAxis);
  //append Y
  var yAxis = chartGroup.append('g')
    .classed('y-axis', true)
    .call(leftAxis);

  //append Circles
  var circlesGroup = chartGroup.selectAll('circle')
  .data(stockData)
  .enter()
  .append('circle')
  .classed('stateCircle', true)
  .attr('cx', d => xLinearScale(d[chosenXAxis]))
  .attr('cy', d => yLinearScale(d[chosenYAxis]))
  .attr('r', 15)
  .attr('opacity', '.5');

  //append Initial Text
  var textGroup = chartGroup.selectAll('.stateText')
    .data(stockData)
    .enter()
    .append('text')
    .classed('stateText', true)
    .attr('x', d => xLinearScale(d[chosenXAxis]))
    .attr('y', d => yLinearScale(d[chosenYAxis]))
    .attr('dy', 3)
    .attr('font-size', '15px')
    .text(function (d) { return d.abbr });

  //create a group for the x axis labels
  var xLabelsGroup = chartGroup.append('g')
    .attr('transform', `translate(${width / 2}, ${height + 10 + margin.top})`);
    var d_closeLabel = xLabelsGroup.append('text')
    .classed('aText', true)
    .classed('active', true)
    .attr('x', 0)
    .attr('y', 20)
    .attr('value', 'd_close')
    .text('Daily Closed($per share)');
     
    var d_lowLabel = xLabelsGroup.append('text')
    .classed('aText', true)
    .classed('inactive', true)
    .attr('x', 0)
    .attr('y', 40)
    .attr('value', 'd_low')
    .text('Daily Low($per share)');

    var d_highLabel = xLabelsGroup.append('text')
    .classed('aText', true)
    .classed('inactive', true)
    .attr('x', 0)
    .attr('y', 60)
    .attr('value', 'd_high')
    .text('Daily High($per share)')
   
    var yLabelsGroup = chartGroup.append('g')
    .attr('transform', `translate(${0 - margin.left / 4}, ${height / 2})`);

  var saleslabel = yLabelsGroup.append('text')
    .classed('aText', true)
    .classed('inactive', true)
    .attr('x', 0)
    .attr('y', 0 - 40)
    .attr('dy', '1em')
    .attr('transform', 'rotate(-90)')
    .attr('value', 'sales')
    .text('Sales $');

  var volumeLabel = yLabelsGroup.append('text')
    .classed('aText', true)
    .classed('inactive', true)
    .attr('x', 0)
    .attr('y', 0 - 60)
    .attr('dy', '1em')
    .attr('transform', 'rotate(-90)')
    .attr('value', 'volume')
    .text('Shares Sold');

  var ageLabel = yLabelsGroup.append('text')
    .classed('aText', true)
    .classed('inactive', true)
    .attr('x', 0)
    .attr('y', 0 - 80)
    .attr('dy', '1em')
    .attr('transform', 'rotate(-90)')
    .attr('value', 'age')
    .text('Yrs in Business');

  //update the toolTip
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
//x axis event listener
xLabelsGroup.selectAll('text')
.on('click', function () {
  var value = d3.select(this).attr('value');

  if (value != chosenXAxis) {

    //replace chosen x with a value
    chosenXAxis = value;

    //update x for new data
    xLinearScale = xScale(stockData, chosenXAxis);

    //update x 
    xAxis = renderXAxis(xLinearScale, xAxis);

    //upate circles with a new x value
    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

    //update text 
    textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

    //update tooltip
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    //change of classes changes text
    if (chosenYAxis === 'sales') {
      salesLabel.classed('active', true).classed('inactive', false);
      volumeLabel.classed('active', false).classed('inactive', true);
      ageLabel.classed('active', false).classed('inactive', true);
    }
    else if (chosenYAxis === 'volume') {
      salesLabel.classed('active', false).classed('inactive', true);
      volumeLabel.classed('active', true).classed('inactive', false);
      ageLabel.classed('active', false).classed('inactive', true);
    }
    else {
      salesLabel.classed('active', false).classed('inactive', true);
      volumeLabel.classed('active', false).classed('inactive', true);
      ageLabel.classed('active', true).classed('inactive', false);
    }
  }
});
        
yLabelsGroup.selectAll('text')
.on('click', function () {
  var value = d3.select(this).attr('value');

  if (value != chosenYAxis) {
    //replace chosenY with value  
    chosenYAxis = value;

    //update Y scale
    yLinearScale = yScale(stockData, chosenYAxis);

    //update Y axis 
    yAxis = renderYAxis(yLinearScale, yAxis);

    //Udate CIRCLES with new y
    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

    //update TEXT with new Y values
    textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

    //update tooltips
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    //Change of the classes changes text
    if (chosenXAxis === 'd_close') {
      d_closeLabel.classed('active', true).classed('active', false);
      d_lowLabel.classed('active', false).classed('inactive', true);
      d_highLabel.classed('active', false).classed('inactive', true);
    }
    else if (chosenXAxis === 'd_low') {
      d_closeLabel.classed('active', false).classed('inactive', true);
      d_lowLabel.classed('active', true).classed('inactive', false);
      d_highLabel.classed('active', false).classed('inactive', true);
    }
    else {
      d_closeLabel.classed('active', false).classed('inactive', true);
      d_lowLabel.classed('active', false).classed('inactive', true);
      d_highLabel.classed('active', true).classed('inactive', false);
    }
  }
});
      
    
})  //from data read from nasdaq.csv
