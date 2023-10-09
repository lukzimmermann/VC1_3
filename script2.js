// Set a reference size for your data points
const scatterPlotDiv = document.getElementById('scatter-plot');
let containerDiv = document.getElementById('scatter-plot');
let padding = containerDiv.offsetWidth * 0.05;
let width = containerDiv.offsetWidth - padding;
let height = containerDiv.offsetHeight - padding;
let radius = width / 1000;

const initialZoomScale = 1; // Set your initial zoom scale factor
const referenceSize = 50;

const onresize = (dom_elem, callback) => {
  const resizeObserver = new ResizeObserver(() => callback());
  resizeObserver.observe(dom_elem);
};

onresize(containerDiv, function () {
  width = containerDiv.offsetWidth - padding;
  height = containerDiv.offsetHeight - padding;
  radius = width / 750;
  scatterPlotDiv.innerHTML = '';
  plotAllPages();
});

// Create an SVG element

// Load data from a CSV file
function plotAllPages() {
  const svg = d3
    .select('#scatter-plot')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const categories = [];

  d3.csv('data/allPages.csv').then(function (data) {
    // Convert x, y, and size values to numbers
    data.sort((b, a) => a.size - b.size);

    data.forEach(function (d) {
      d.x = +d.x;
      d.y = +d.y;
      if (!categories.includes(d.category)) {
        categories.push(d.category);
      }
    });

    console.log(categories);

    //const colorScale = d3
    //  .scaleLinear()
    //  .domain([0, 100]) // Define the range of values that map to the gradient
    //  .range(['red', 'green']); // Define the gradient colors

    const colorScale = d3
      .scaleOrdinal()
      .domain(categories)
      .range(
        categories.map((d, i) =>
          d3.interpolateRainbow(i / (categories.length - 1))
        )
      );

    // Define scales for x and y axes
    const xScale = d3.scaleLinear().domain([-120, 120]).range([0, width]);
    const yScale = d3.scaleLinear().domain([-120, 120]).range([height, 0]);

    // Create a color scale based on the number of data points

    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 20]) // Set the minimum and maximum zoom scale
      .on('zoom', zoomed);

    function zoomed(event) {
      // Get the current zoom transform
      const { transform } = event;

      // Update the scaling of the scatter plot elements
      svg.selectAll('circle').attr('transform', transform.toString());

      // Update axes if you have them
      // x-axis
      svg
        .select('.x-axis')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).scale(transform.rescaleX(xScale)));

      // y-axis
      svg
        .select('.y-axis')
        .call(d3.axisLeft(yScale).scale(transform.rescaleY(yScale)));
    }

    // Apply the zoom behavior to the SVG container
    svg.call(zoom);

    // Create circles for each data point, with size and color determined by the data
    svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.x))
      .attr('cy', (d) => yScale(d.y))
      .attr('r', radius) // Size of the circles based on the "size" column
      .attr('fill', (d) => colorScale(d.category)) // Color of the circles based on the data point index
      .classed('drop-shadow', true)
      .on('mouseover', function (d) {
        course = d.toElement.__data__.category;
        filename = d.toElement.__data__.name;
        page = d.toElement.__data__.page;
        d3.select('#tooltip')
          .style('display', 'block')
          .html(
            `<strong>${course}</strong><br>File: ${filename}<br>Pages: ${page}`
          );

        // Add animation to increase the size of the circle
        d3.select(this)
          .transition()
          .duration(200) // Set the duration of the animation in milliseconds
          .attr('r', radius + 0.5); // Increase the size as desired
      })
      .on('mousemove', function (event) {
        // Move the tooltip with the mouse
        d3.select('#tooltip')
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px');
      })
      .on('mouseout', function () {
        // Hide the tooltip when mouseout event occurs
        d3.select('#tooltip').style('display', 'none');
        d3.select(this)
          .transition()
          .duration(200) // Set the duration of the animation in milliseconds
          .attr('r', radius); // Increase the size as desired
      })
      .on('click', function (event) {
        console.log(event);
      });
  });
}
