var tbody = d3.select("#resultTable")

tableData = [];

d3.csv("pollutants_mean.csv").then(function (data) {
    tableData = data
    console.log("data")
    console.log(data)
});

function optionChanged(selOption) {
    console.log("selOption")
    console.log(selOption)
    
    tbody.html("");
    
    const tbl_header = tbody.append("tr");
    let header = tbl_header.append("th");
    header.text("\xa0\xa0 City \xa0\xa0");
    header = tbl_header.append("th");
    header.text("\xa0 NO2 AQI \xa0");
    header = tbl_header.append("th");
    header.text("\xa0 Ozone AQI \xa0");
    header = tbl_header.append("th");
    header.text("\xa0 SO2 AQI \xa0");
    header = tbl_header.append("th");
    header.text("\xa0 CO AQI \xa0");
    
    label_list = [];
    data_list = [];
    
    for (var i = 0; i < 3; i++) {
        let tbl_row = tbody.append("tr");
        let cell = tbl_row.append("td");
        cell.text(tableData[i]["City"]);
        cell = tbl_row.append("td");
        cell.text(tableData[i]["NO2"]);
        cell = tbl_row.append("td");
        cell.text(tableData[i]["Ozone"]);
        cell = tbl_row.append("td");
        cell.text(tableData[i]["SO2"]);
        cell = tbl_row.append("td");
        cell.text(tableData[i]["CO"]);
    }
    
    if (selOption == "Los Angeles") {
        i = 0
    }
    else if (selOption == "New York") {
        i = 1
    }
    else if (selOption == "Raleigh") {
        i = 2
    }
    
    label_list.push("NO2")
    data_list.push(tableData[i]["NO2"]);
    label_list.push("Ozone")
    data_list.push(tableData[i]["Ozone"]);
    label_list.push("SO2")
    data_list.push(tableData[i]["SO2"]);
    label_list.push("CO")
    data_list.push(tableData[i]["CO"]);
    
    //  doughnut  
    new Chart(document.getElementById("doughnut-chart"), {
        type: 'doughnut',
        data: {
            labels: label_list,
            datasets: [
                {
                    label: "Pollutants (%)",
                    backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9"],
                    data: data_list
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: 'Pollutant Percentages in ' + tableData[i]["City"]
            }
        }
    });

}