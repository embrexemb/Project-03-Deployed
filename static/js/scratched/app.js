d3.json("/static/json/Stock_IDs.json").then((newData) => {
    console.log(newData);
    //assign to local variable for processing
    var data = newData;
    //Add test subject id for dropdown menu
    var names = data.names;
    names.forEach(name => {
        d3.select('#selDataset').append('option').text(name);
        
    }); //populate the dropdown menu 
    
    
   
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
         setupCharts(default_data);
         setupMetaData(default_data);

    
    }  //init()

    
var samp = "XOM";
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
    d3.json("samples.json").then((data)=>{
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
        var traceBubble = {
            x: otu_ids,
            y:sample_values,
            text: otu_labels,
            mode: 'markers',
            marker:{
                size:sample_values,
                color: otu_ids,
                colorscale:"Electric"
            }
        };

        var bubble_data = [traceBubble];
        var bubble_layout = {
            title: '# Bacteria Cultures per Sample',
            showLegend: true,
            hovermode:'closest',
            xaxis: {title:"OTU (Operational Taxonomic Unit) ID" + sample},
            font: {color: "#49a91d", family: "Arial, Helvtetica, sans-serif"},
            margin: {t:30}

        };

        Plotly.newPlot('bubble',bubble_data, bubble_layout);

        var trace_horizontal = {
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        };

        var horizontal_data = [trace_horizontal];
        var horizontal_layout = {
            title: "Top Ten OTUs for Individual "+sample,
            margin: {l:100, r:100, t:100, b:100},
            font: {color: "#49a91d", family: "Arial, Helvtetica, sans-serif"},
        };

        Plotly.newPlot("bar", horizontal_data, horizontal_layout);
    })
} //XsetupCharts

function XsetupMetaData(sample){
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var filteredMetaDataArray = metadata.filter(sampleObject => sampleObject.id == sample);
        var result = filteredMetaDataArray[0];
        var metadataPanel = d3.select("#sample-metadata");
        metadataPanel.html("");
        Object.entries(result).forEach(([key,value])=>{
            metadataPanel.append("h6").text(`${key.toUpperCase()}: ${value}`)
        })

        var gaugeData = [{
            domain: {x:[0,1], y:[0,1]},
            marker: {size: 28, color:'750000'},
            value: result.wfreq,
            title: 'Belly Button Washing Frequency<br>Scrubs per Week',
            titlefont: {family: "Arial, Helvtetica, sans-serif"},
            type: 'indicator',
            gauge: {axis:{visible:true, range: [0,9]}},
            mode: "number+gauge"
        }];

        var gauge_layout = {
            width: 600,
            height: 450,
            margin: {l:100, r:100, t:100, b:100},
            line:{
                color: '600000'
            },
            font: {color: "#49a91d", family: "Arial, Helvtetica, sans-serif"},
        };

        Plotly.newPlot("gauge", gaugeData,gauge_layout);
    });
} //XetupMetaData


d3.json("samples.json").then((newData) => {
    console.log(newData);
    //assign to local variable for processing
    var data = newData;
    //Add test subject id for dropdown menu
    var names = data.names;
    names.forEach(name => {
        d3.select('#selDataset').append('option').text(name);
        
    }); //populate the dropdown menu 
    
   
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
         setupCharts(default_data);
         setupMetaData(default_data);

    
    }  //init()

      
function setupCharts(sample){
    //sample is the selection from the dropdown list
    //use d3 to access the json file to get the data for the sample subject passed in 
    //console.log("in charts");
    //console.log(sample);
    d3.json("samples.json").then((data)=>{
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
        var traceBubble = {
            x: otu_ids,
            y:sample_values,
            text: otu_labels,
            mode: 'markers',
            marker:{
                size:sample_values,
                color: otu_ids,
                colorscale:"Electric"
            }
        };

        var bubble_data = [traceBubble];
        var bubble_layout = {
            title: '# Bacteria Cultures per Sample',
            showLegend: true,
            hovermode:'closest',
            xaxis: {title:"OTU (Operational Taxonomic Unit) ID" + sample},
            font: {color: "#49a91d", family: "Arial, Helvtetica, sans-serif"},
            margin: {t:30}

        };

        Plotly.newPlot('bubble',bubble_data, bubble_layout);

        var trace_horizontal = {
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        };

        var horizontal_data = [trace_horizontal];
        var horizontal_layout = {
            title: "Top Ten OTUs for Individual "+sample,
            margin: {l:100, r:100, t:100, b:100},
            font: {color: "#49a91d", family: "Arial, Helvtetica, sans-serif"},
        };

        Plotly.newPlot("bar", horizontal_data, horizontal_layout);
    })
} //setupCharts



function setupMetaData(sample){
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var filteredMetaDataArray = metadata.filter(sampleObject => sampleObject.id == sample);
        var result = filteredMetaDataArray[0];
        var metadataPanel = d3.select("#sample-metadata");
        metadataPanel.html("");
        Object.entries(result).forEach(([key,value])=>{
            metadataPanel.append("h6").text(`${key.toUpperCase()}: ${value}`)
        })

        var gaugeData = [{
            domain: {x:[0,1], y:[0,1]},
            marker: {size: 28, color:'750000'},
            value: result.wfreq,
            title: 'Belly Button Washing Frequency<br>Scrubs per Week',
            titlefont: {family: "Arial, Helvtetica, sans-serif"},
            type: 'indicator',
            gauge: {axis:{visible:true, range: [0,9]}},
            mode: "number+gauge"
        }];

        var gauge_layout = {
            width: 600,
            height: 450,
            margin: {l:100, r:100, t:100, b:100},
            line:{
                color: '600000'
            },
            font: {color: "#49a91d", family: "Arial, Helvtetica, sans-serif"},
        };

        Plotly.newPlot("gauge", gaugeData,gauge_layout);
    });
} //setupMetaData


init();




})