
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
let chosenXAxis = 'smokes';
let chosenYAxis = 'poverty';

//a function for updating the x-scale variable upon click of label
function xScale(healthData, chosenXAxis) {
  //scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
    d3.max(healthData, d => d[chosenXAxis]) * 1.2])
    .range([0, width]);

  return xLinearScale;
}
//a function for updating y-scale variable upon click of label
function yScale(healthData, chosenYAxis) {
  //scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
    d3.max(healthData, d => d[chosenYAxis]) * 1.2])
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

//function for updating state labels
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  textGroup.transition()
    .duration(2000)
    .attr('x', d => newXScale(d[chosenXAxis]))
    .attr('y', d => newYScale(d[chosenYAxis]));

  return textGroup
}
//function to stylize x-axis values for tooltips
function styleX(value, chosenXAxis) {

  //style based on variable
  //smokes
  if (chosenXAxis === 'smokes') {
    return `${value}%`;
  }
  //healthcare
  else if (chosenXAxis === 'healthcare') {
    return `${value}%`;
  }
  else {
    return `${value}%`;
  }
}

//funtion for updating circles group
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  // X Labels
  // Smokes
  if (chosenXAxis === 'smokes') {
    var xLabel = 'Smokes';
  }
  // Healthcare
  else if (chosenXAxis === 'healthcare') {
    var xLabel = 'Healthcare:';
  }
  // Obesity
  else {
    var xLabel = 'Obesity';
  }
  //Y label
  //
  if (chosenYAxis === 'poverty') {
    var yLabel = "Poverty:"
  }
  else if (chosenYAxis === 'age') {
    var yLabel = 'Age:';
  }
  //
  else {
    var yLabel = 'Income:';
  }

  //create tooltip
  var toolTip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-8, 0])
    .html(function (d) {
      return (`${d.state}<br>${xLabel} ${styleX(d[chosenXAxis], chosenYAxis)}<br>${yLabel} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  //add
  circlesGroup.on('mouseover', toolTip.show)
    .on('mouseout', toolTip.hide);

  return circlesGroup;
}
//retrieve data
d3.csv('./assets/data/data.csv').then(function (healthData) {

  console.log(healthData);

  //Parse data
  healthData.forEach(function (data) {
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;
    data.healthcare = +data.healthcare;
    data.age = +data.age;
    data.income = +data.income;
    data.poverty = +data.poverty;
  });

  //create linear scales
  var xLinearScale = xScale(healthData, chosenXAxis);
  var yLinearScale = yScale(healthData, chosenYAxis);

  //create x axis
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  //append X
  var xAxis = chartGroup.append('g')
    .classed('x-axis', true)
    .attr('transform', `translate(0, ${height})`)
    .call(bottomAxis);

  //append Y
  var yAxis = chartGroup.append('g')
    .classed('y-axis', true)
    .call(leftAxis);

  //append Circles
  var circlesGroup = chartGroup.selectAll('circle')
    .data(healthData)
    .enter()
    .append('circle')
    .classed('stateCircle', true)
    .attr('cx', d => xLinearScale(d[chosenXAxis]))
    .attr('cy', d => yLinearScale(d[chosenYAxis]))
    .attr('r', 15)
    .attr('opacity', '.5');

  //append Initial Text
  var textGroup = chartGroup.selectAll('.stateText')
    .data(healthData)
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

  var smokesLabel = xLabelsGroup.append('text')
    .classed('aText', true)
    .classed('active', true)
    .attr('x', 0)
    .attr('y', 20)
    .attr('value', 'smokes')
    .text('Smokes(%)');

  var obesityLabel = xLabelsGroup.append('text')
    .classed('aText', true)
    .classed('inactive', true)
    .attr('x', 0)
    .attr('y', 40)
    .attr('value', 'obesity')
    .text('Obesity');

  var healthcareLabel = xLabelsGroup.append('text')
    .classed('aText', true)
    .classed('inactive', true)
    .attr('x', 0)
    .attr('y', 60)
    .attr('value', 'healthcare')
    .text('Healthcare')


  var yLabelsGroup = chartGroup.append('g')
    .attr('transform', `translate(${0 - margin.left / 4}, ${height / 2})`);

  var poverty = yLabelsGroup.append('text')
    .classed('aText', true)
    .classed('inactive', true)
    .attr('x', 0)
    .attr('y', 0 - 40)
    .attr('dy', '1em')
    .attr('transform', 'rotate(-90)')
    .attr('value', 'poverty')
    .text('Poverty (%)');

  var incomeLabel = yLabelsGroup.append('text')
    .classed('aText', true)
    .classed('inactive', true)
    .attr('x', 0)
    .attr('y', 0 - 60)
    .attr('dy', '1em')
    .attr('transform', 'rotate(-90)')
    .attr('value', 'income')
    .text('Income');

  var ageLabel = yLabelsGroup.append('text')
    .classed('aText', true)
    .classed('inactive', true)
    .attr('x', 0)
    .attr('y', 0 - 80)
    .attr('dy', '1em')
    .attr('transform', 'rotate(-90)')
    .attr('value', 'age')
    .text('Age (Median)');

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
        xLinearScale = xScale(healthData, chosenXAxis);

        //update x 
        xAxis = renderXAxis(xLinearScale, xAxis);

        //upate circles with a new x value
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        //update text 
        textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        //update tooltip
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        //change of classes changes text
        if (chosenYAxis === 'poverty') {
          povertyLabel.classed('active', true).classed('inactive', false);
          incomeLabel.classed('active', false).classed('inactive', true);
          ageLabel.classed('active', false).classed('inactive', true);
        }
        else if (chosenYAxis === 'income') {
          povertyLabel.classed('active', false).classed('inactive', true);
          incomeLabel.classed('active', true).classed('inactive', false);
          ageLabel.classed('active', false).classed('inactive', true);
        }
        else {
          povertyLabel.classed('active', false).classed('inactive', true);
          incomeyLabel.classed('active', false).classed('inactive', true);
          ageLabel.classed('active', true).classed('inactive', false);
        }
      }
    });
  //y axis lables event listener
  yLabelsGroup.selectAll('text')
    .on('click', function () {
      var value = d3.select(this).attr('value');

      if (value != chosenYAxis) {
        //replace chosenY with value  
        chosenYAxis = value;

        //update Y scale
        yLinearScale = yScale(healthData, chosenYAxis);

        //update Y axis 
        yAxis = renderYAxis(yLinearScale, yAxis);

        //Udate CIRCLES with new y
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        //update TEXT with new Y values
        textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        //update tooltips
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        //Change of the classes changes text
        if (chosenXAxis === 'smokes') {
          smokesLabel.classed('active', true).classed('active', false);
          obesityLabel.classed('active', false).classed('inactive', true);
          healthcareLabel.classed('active', false).classed('inactive', true);
        }
        else if (chosenXAxis === 'obesity') {
          smokesLabel.classed('active', false).classed('inactive', true);
          obesityLabel.classed('active', true).classed('inactive', false);
          healthcareLabel.classed('active', false).classed('inactive', true);
        }
        else {
          smokesLabel.classed('active', false).classed('inactive', true);
          obesityLabel.classed('active', false).classed('inactive', true);
          healthcareLabel.classed('active', true).classed('inactive', false);
        }
      }
    });
});