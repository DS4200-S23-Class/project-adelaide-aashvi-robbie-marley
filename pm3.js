// Create the Frame dimensions
let FRAME_HEIGHT = 500;
let FRAME_WIDTH = 500;
let MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

// Bar Chart: Deaths per County from 2003-2019

let BAR_CHART_FRAME = d3.select('.bar-chart')
                    .append("svg")
                    .attr("width", FRAME_WIDTH)
                    .attr("height", FRAME_HEIGHT)
                    .attr("id", "bar");

// with scale function
const BAR_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const BAR_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

// read in bar chart data
d3.csv("albanyData.csv").then((data) => {

  const xScaleBar = d3.scaleBand().range([0, BAR_WIDTH]).padding(0.3);
  const yScaleBar = d3.scaleLinear().range([BAR_HEIGHT, 0]);

  xScaleBar.domain(data.map((d) => {
    // console.log(d.year)
    return d.year
}));

  yScaleBar.domain([0, d3.max(data, (d) => {
    // console.log(d.deaths)
    return d.deaths
})]);

BAR_CHART_FRAME.selectAll("bars")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
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

        BAR_CHART_FRAME.append("g")
        .attr("transform", "translate(" + MARGINS.top + "," +
            (BAR_HEIGHT + MARGINS.top) + ")")
        .call(d3.axisBottom(xScaleBar).ticks(10))
        .attr("font-size", "11px");

        BAR_CHART_FRAME.append("g")
        .attr("transform", "translate(" +
            (MARGINS.left) + "," + (MARGINS.top) + ")")
        .call(d3.axisLeft(yScaleBar).ticks(10))
        .attr("font-size", "11px");

})

let MAP_FRAME = d3.select('.nys-map')
.append("svg")
.attr("width", FRAME_WIDTH)
.attr("height", FRAME_HEIGHT)
.attr("id", "map");

d3.json("ny_counties.geojson")
  .then(function(data) {
    let nyCounties = data.features.filter(function(feature) {
      return feature.properties.STATE.substring(0, 2) === '36';
    });

    let projection = d3.geoAlbers()
      .center([0, 40])
      .rotate([74, 0])
      .scale(4000)
      .translate([FRAME_WIDTH / 1.5, FRAME_HEIGHT / 1.2]);

    let path = d3.geoPath()
      .projection(projection);

    let g = MAP_FRAME.append("g");

    g.selectAll("path")
      .data(nyCounties)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "lightblue")
      .attr("stroke", "white");

      const TOOLTIP2 = d3.select(".nys-map")
      .append("div")
      .attr("class", "tooltip2")
      .style("opacity", 0);

      // mouse over
    function handleMouseOver(event, d){
      TOOLTIP2.style("opacity", 1);
  }

  // mouse move
  function handleMouseMove(event, d){
      TOOLTIP2.html("County: " + d.properties.NAME)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 50) + "px");
  }

  // mouse leave
  function handleMouseLeave(event, d){
      TOOLTIP2.style("opacity", 0);
  }

      // add event listeners
      FRAME2.selectAll(".bar")
      .on("mouseover", handleMouseOver)
      .on("mousemove", handleMouseMove)
      .on("mouseleave", handleMouseLeave);

  })

  


// New York State Map: Counties

// let width = 500;
// let height = 500;

// d3.json("ny_counties.geojson")
//   .then(function(data) {
//     let nyCounties = data.features.filter(function(feature) {
//       return feature.properties.STATE.substring(0, 2) === '36';
//     });
    
    // let projection = d3.geoAlbers()
    //   .center([0, 40])
    //   .rotate([74, 0])
    //   .scale(4000)
    //   .translate([width / 1.5, height / 1.2]);

    // let path = d3.geoPath()
    //   .projection(projection);

    // let svg = d3.select("body")
    //   .append("svg")
    //   .attr("width", width)
    //   .attr("height", height);

    // let g = svg.append("g");

    // g.selectAll("path")
    //   .data(nyCounties)
    //   .enter()
    //   .append("path")
    //   .attr("d", path)
    //   .attr("fill", "lightgray")
    //   .attr("stroke", "white");
  // });





