d3.json("/static/json/Stock_IDs.json").then((newData) => {
    console.log(newData);
    //assign to local variable for processing
    var data = newData;
    //Add test subject id for dropdown menu
    var names = data.names;
    names.forEach(name => {
        d3.select('#selDataset').append('option').text(name);
        
    }); //populate the dropdown menu 
    
    init();
    function init(){
        //show initialized dashboard
        
        var dd_selector = d3.select("#selDataset");
        var subjectID = data.names;
        subjectID.forEach((ID) => {
            dd_selector
            .append('option')
            .text(ID)
            .property('value',ID);
        });
         //choose the first element in the json dataset to set up the dashboard
         const default_data = subjectID[0];
         //console.log("setup charts");
         XsetupCharts(default_data);
         XsetupMetaData(default_data);

    
    }  //init()

});

//init();

function optionChanged(sample){
    samp = sample;
    console.log(samp);
    XsetupCharts(samp);
    XsetupMetaData(samp);

};  
      
function XsetupCharts(sample){
    //sample is the selection from the dropdown list
    //use d3 to access the json file to get the data for the sample subject passed in 
    //console.log("in charts");
    //console.log(sample);
    d3.json("/static/json/Stock_IDs.json").then((data)=>{
        var samples = data.samples;
        //set filter to return the sample by id in the json file
        var filteredDataArray = samples.filter(sampleObject => sampleObject.id == sample);
        //only use one result
        var result = filteredDataArray[0];
        //get values for charts
        var sample_values = result.sample_values;
        console.log(sample_values);
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;

        //Earning bubble
console.log(sample)

var url_string ='https://financialmodelingprep.com/api/v3/earnings-surpises/';
var api_k = '?apikey=3b360a656ab272acfd49d852ee96ea5c';
var queryUrl = url_string + sample + api_k
console.log(queryUrl)
d3.json(queryUrl).then(function(data) {
    console.log(data)

    var date = data.map((date) => {
        return date.date;
      });
      console.log(date)
      
      var symbol = data.map((symbol) => {
        return symbol.symbol;
      });
      console.log(date)
      
      var actualEarningResult = data.map((actualEarningResult) => {
        return actualEarningResult.actualEarningResult
      });
      console.log(actualEarningResult)
      
      var estimatedEarning = data.map((estimatedEarning) => {
        return estimatedEarning.estimatedEarning
      });
      console.log(estimatedEarning)
      
      var trace1 = {
        x: date,
        y: estimatedEarning,
        mode: 'markers',
        type: 'scatter',
        name: 'Estimated Earning',
        marker: { size: 12 }
      };
      
      var trace2 = {
        x: date,
        y: actualEarningResult,
        mode: 'markers',
        type: 'scatter',
        name: 'Actual Earning',
        marker: { size: 12 }
      };
      
      var data = [ trace1, trace2 ];
      
      var layout = {
        xaxis: {
          range: [ data ]
        },
        yaxis: {
          range: [0.2, 2]
        },
        title: `Earnings for ${sample}`
      };
      
      Plotly.newPlot("bubble", data, layout);
    })

       
        var trace_horizontal = {
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(otuID => `Day ::  ${otuID}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        };

        var horizontal_data = [trace_horizontal];
        var horizontal_layout = {
            title: "Top Ten Trading Days for "+sample,
            margin: {l:100, r:100, t:100, b:100},
            font: {color: "#1d30a9", family: "Arial, Helvtetica, sans-serif"},
        };

        Plotly.newPlot("bar", horizontal_data, horizontal_layout);
    })
} //XsetupCharts

function XsetupMetaData(sample){
    d3.json("/static/json/Stock_IDs.json").then((data) => {
        var metadata = data.metadata;
        var filteredMetaDataArray = metadata.filter(sampleObject => sampleObject.id == sample);
        var result = filteredMetaDataArray[0];
        var metadataPanel = d3.select("#sample-metadata");
        metadataPanel.html("");
        Object.entries(result).forEach(([key,value])=>{
            metadataPanel.append("h6").text(`${key.toUpperCase()}: ${value}`)
        })

        //buildPlot(sample)
       var gaugeData = [{
            domain: {x:[0,1], y:[0,1]},
           marker: {size: 28, color:'750000'},
            value: result.wfreq/14,
           title: 'Trades Increasing - Decreasing - Will change to RSI',
           titlefont: {family: "Arial, Helvtetica, sans-serif"},
           type: 'indicator',
           gauge: {axis:{visible:true, range: [0,8]}},
           mode: "number+gauge"
        }];

        var gauge_layout = {
            width: 600,
           height: 450,
           margin: {l:100, r:100, t:100, b:100},
           line:{
               color: '#631da9'
           },
            font: {color: "#1d30a9", family: "Arial, Helvtetica, sans-serif"},
        };



        Plotly.newPlot("gauge", gaugeData,gauge_layout);
        //Plotly.newPlot("plot", data, layout);
    });
   
} //XetupMetaData


