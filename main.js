import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const fetchData = async () => {
  const response = await fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  );
  const data = await response.json();

  return data;
};

fetchData().then((dataset) => {
  const svgWidth = 1600;
  const svgHeight = 800;
  const padding = 40;

  const tooltip = d3
    .select("#svg-container")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  const svg = d3
    .select("#svg-container")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  const parseYear = d3.timeParse("%Y");
  const parseTime = d3.timeParse("%M:%S");

  const formatDate = d3.timeFormat("%Y");
  const formatTime = d3.timeFormat("%M:%S");

  const yScaling = d3
    .scaleTime()
    .domain([
      d3.max(dataset, (d) => parseTime(d.Time)),
      d3.min(dataset, (d) => parseTime(d.Time)),
    ])
    .range([svgHeight - padding, padding]);

  const xScaling = d3
    .scaleTime()
    .domain([
      d3.min(dataset, (d) => parseYear(d.Year - 1)),
      d3.max(dataset, (d) => parseYear(d.Year)),
    ])
    .range([padding, svgWidth - padding]);

  const yAxis = d3.axisLeft(yScaling).tickFormat(formatTime);

  const xAxis = d3.axisBottom(xScaling).tickFormat(formatDate);

  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis);

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${svgHeight - padding})`)
    .call(xAxis);

  svg
    .append("circle")
    .attr("cx", 1300)
    .attr("cy", 130)
    .attr("r", 10)
    .style("fill", "#cc5f28");
  svg
    .append("circle")
    .attr("cx", 1300)
    .attr("cy", 160)
    .attr("r", 10)
    .style("fill", "blue");
  svg
    .append("text")
    .attr("x", 1320)
    .attr("y", 130)
    .text("Riders with doping allegations")
    .style("font-size", "15px")
    .style("font-family", "Montserrat")
    .attr("alignment-baseline", "middle");
  svg
    .append("text")
    .attr("x", 1320)
    .attr("y", 160)
    .text("No doping allegations")
    .style("font-size", "15px")
    .style("font-family", "Montserrat")
    .attr("alignment-baseline", "middle");

  svg
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "point")
    .attr("cx", (d) => xScaling(parseYear(d.Year)))
    .attr("cy", (d) => yScaling(parseTime(d.Time)))
    .attr("r", 10)
    .attr("fill", (d) => (d.Doping === "" ? "#cc5f28" : "blue"))
    .on("mouseover", function (e, d) {
      d3.select(this).attr("class", "point");
      const year = d.Year;
      tooltip
        .style("opacity", 0.75)
        .html(
          `${d.Name}: ${d.Nationality}<br>Year: ${d.Year}, Time: ${d.Time}<br><br>${d.Doping}`
        )
        .style("left", e.pageX + 15 + "px")
        .style("top", e.pageY - 100 + "px");
    })
    .on("mouseout", function () {
      d3.select(this).attr("class", "point");
      tooltip.style("opacity", 0);
    });
});
