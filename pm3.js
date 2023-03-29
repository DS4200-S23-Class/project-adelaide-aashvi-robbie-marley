// Create the Frame dimensions
let FRAME_HEIGHT = 500;
let FRAME_WIDTH = 600;
let MARGINS = {left: 50, right: 50, top: 50, bottom: 50};


/*
DS4200
PM-03
Robert Hoyler, Adelaide Bsharah, Aashvi Shah, Marley Ferguson
Consulted resource for basic bar chart: https://www.tutorialsteacher.com/d3js/create-bar-chart-using-d3js
*/

// Bar Chart: Deaths per County from 2003-2019
let BAR_CHART_FRAME = d3.select('.bar-chart')
                    .append("svg")
                    .attr("width", FRAME_WIDTH)
                    .attr("height", FRAME_HEIGHT)
                    .attr("id", "bar");

// with scale function
const BAR_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const BAR_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

d3.csv("countiesData.csv").then((data) => {
  console.log(data)
});

// read in bar chart data
d3.csv("albanyData.csv").then((data) => {

  // create scaling functuons
  const xScaleBar = d3.scaleBand().range([0, BAR_WIDTH]).padding(0.3);
  const yScaleBar = d3.scaleLinear().range([BAR_HEIGHT, 0]);

  // max values for x-axis
  xScaleBar.domain(data.map((d) => {
    return d.year
  }));


  const deathValues = [];
  data.map((d) => {
    deathValues.push(parseInt(d.deaths))
  });
  // console.log(deathValues)
  // console.log(d3.max(deathValues))


  // max values for y-axis
  yScaleBar.domain([0, d3.max(deathValues)]);

// create bar chart
BAR_CHART_FRAME.selectAll("bars")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("fill", "rgb(44, 123, 186)")
        .attr("x", (d) => {
            return (xScaleBar(d.year) + MARGINS.left)
        })
        .attr("y", (d) => {
            return (MARGINS.left + yScaleBar(d.deaths))
        })
        .attr("width", xScaleBar.bandwidth())
        .attr("height", (d) => {
            return BAR_HEIGHT - yScaleBar(d.deaths)
        });

        // create x-axis
        BAR_CHART_FRAME.append("g")
        .attr("transform", "translate(" + MARGINS.top + "," +
            (BAR_HEIGHT + MARGINS.top) + ")")
        .call(d3.axisBottom(xScaleBar).ticks(10))
        .attr("font-size", "11px");

        // create y-axis
        BAR_CHART_FRAME.append("g")
        .attr("transform", "translate(" +
            (MARGINS.left) + "," + (MARGINS.top) + ")")
        .call(d3.axisLeft(yScaleBar).ticks(10))
        .attr("font-size", "11px");

    // create tooltip for the bar-chart
    const TOOLTIP2 = d3.select(".bar-chart")
        .append("div")
        .attr("class", "tooltip2")
        .style("opacity", 0);

    // mouse over
    function handleMouseOver(event, d){
        TOOLTIP2.style("opacity", 1);
    };

    // mouse move
    function handleMouseMove(event, d){
        TOOLTIP2.html("Year: " + d.year + "<br>Death Count: " + d.deaths)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 50) + "px");
    };

    // mouse leave
    function handleMouseLeave(event, d){
        TOOLTIP2.style("opacity", 0);
    };

    // add event listeners
    BAR_CHART_FRAME.selectAll(".bar")
        .on("mouseover", handleMouseOver)
        .on("mousemove", handleMouseMove)
        .on("mouseleave", handleMouseLeave);

});

/*
DS4200
PM-03
Robert Hoyler, Adelaide Bsharah, Aashvi Shah, Marley Ferguson
Consulted resource for creating map from JSON data using d3: https://observablehq.com/@mprasse/week-11-intro-to-d3-js-mapping-data-with-d3
*/


// Map of New York State w/ Counties

let MAP_FRAME = d3.select('.nys-map')
.append("svg")
.attr("width", FRAME_WIDTH)
.attr("height", FRAME_HEIGHT)
.attr("id", "map");

// read in json file 
d3.json("ny_counties.geojson")
  .then(function(data) {

    /*
    DS4200
    PM-03
    Robert Hoyler, Adelaide Bsharah, Aashvi Shah, Marley Ferguson
    Consulted resource for filtering through JSON file: https://stackoverflow.com/questions/33604239/how-to-filter-d3-data
    */
    // data is of all counties of all states in U.S. , must filter only those from NYS
    let nyCounties = data.features.filter(function(feature) {
      return feature.properties.STATE == '36';
    });

    d3.csv("countiesMaxDeath - Sheet1 (1).csv").then(function(csvdata){

      const maxVal = 3337;
      // console.log(maxVal)

      let colorScale = d3.scaleSequentialSqrt()
                      .domain([0,1])
                      .range([0,1]);


      // create dictionary for colors
      let countiesColors = {};
      csvdata.forEach(function(d){
        console.log(d.county)
        countiesColors[d.county] = (d3.interpolateBlues(colorScale(d.deaths / maxVal)));
        // console.log(colorScale(d.deaths / maxVal))
      });
      console.log(countiesColors)

      // create dictionary for deaths
      let countiesDeath = {};
      csvdata.forEach(function(d){
        countiesDeath[d.county] = d.deaths;
      });
      
    // create projection and set location on webpage
    let projection = d3.geoAlbers()
      .center([0, 40])
      .rotate([74, 0])
      .scale(4600)
      .translate([FRAME_WIDTH / 1.5, FRAME_HEIGHT / 1.2]);

    // create path using projection
    let path = d3.geoPath()
      .projection(projection);

    // Add a tooltip div
    let TOOLTIP = d3.select(".nys-map")
            .append("div")
            .attr("id", "tooltip")
            .style("opacity", "0")
            .style("position", "absolute")
            .style("background-color", "grey")
            .style("border", "solid")
            .style("padding", "5px");


    // append new map to frame
    let g = MAP_FRAME.append("g");

    // add all "paths" (NYS Counties) to the object (attached to frame)
    g.selectAll("path")
      .data(nyCounties)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", 
      function(d){
        return countiesColors[d.properties.NAME];
      })
      .attr("stroke", "white")
      .attr("county", function(d) {return d.properties.NAME}) 

      /*
       DS4200
       PM-04
       Robert Hoyler, Adelaide Bsharah, Aashvi Shah, Marley Ferguson
       Consulted resource for highlight counties file: https://stackoverflow.com/questions/46641068/d3-mouseover-and-mouseout
       Consulted resource for tooltip: https://d3-graph-gallery.com/graph/interactivity_tooltip.html  
      */

      .on("mouseover", function() {
        d3.select(this)
          .attr("fill", "orange"); // path (county) will highlight orange when hovered over
        // console.log(d3.select(this).attr("county"))
        d3.select("#tooltip") // make tooltip visible
          .style("opacity", "1");
      })
      .on("mouseout", function() { 
        d3.select(this)
          .attr("fill", function(d){
            return countiesColors[d.properties.NAME];
          }); // path (county) will revert back to map color
        d3.select("#tooltip").style("opacity", "0");
      })
      .on("mousemove", function(event, d){
        d3.select("#tooltip")
        .style("left", (event.pageX + 20) + "px")
        .style("top", (event.pageY - 50) + "px")
        .text("County: " + d.properties.NAME + " || Total Deaths: " + countiesDeath[d.properties.NAME]); // return name of the county
      })


    });

    /*
    DS4200
    PM-04
    Robert Hoyler, Adelaide Bsharah, Aashvi Shah, Marley Ferguson
    Add color legend to NYS Map
    Consulted resource for tooltip: http://using-d3js.com/04_08_legends.html
    */


    let LEGEND = d3.select('.color-legend')
        .append("svg")
        .attr("width", FRAME_WIDTH)
        .attr("height", FRAME_HEIGHT)
        .attr("id", "legend");

    let linear = d3.scaleLinear('.color-legend')
      // .domain([0,3337])
      .range(["rgb(241, 247, 253)", "rgb(8, 48, 107)"]);

    let svg = d3.select("svg");

    MAP_FRAME.append("g")
      .attr("class", "color-legend")
      .attr("transform", "translate(60,90)");

    let legendLinear = d3.legendColor('.color-legend')
      .shapeWidth(30)
      .orient('horizontal')
      .scale(linear);

    MAP_FRAME.select(".color-legend")
      .call(legendLinear);

    d3.select("color-legend").append("svg")

  });



  

