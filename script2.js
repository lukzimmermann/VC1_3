const width = 600;
const height = 400;

const initialZoomScale = 1; // Set your initial zoom scale factor
const referenceSize = 50; // Set a reference size for your data points

// Create an SVG element
const svg = d3
  .select('#scatter-plot')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

// Load data from a CSV file
d3.csv('data/allPages.csv').then(function (data) {
  // Convert x, y, and size values to numbers
  data.sort((b, a) => a.size - b.size);

  data.forEach(function (d) {
    d.x = +d.x;
    d.y = +d.y;
  });

  // Define scales for x and y axes
  const xScale = d3.scaleLinear().domain([-120, 120]).range([0, width]);
  const yScale = d3.scaleLinear().domain([-120, 120]).range([height, 0]);

  // Create a color scale based on the number of data points
  const colorScale = d3
    .scaleOrdinal()
    .domain(d3.range(data.length))
    .range(d3.schemeCategory10);

  const zoom = d3
    .zoom()
    .scaleExtent([0.5, 20]) // Set the minimum and maximum zoom scale
    .on('zoom', zoomed);

  function zoomed(event) {
    // Get the current zoom transform
    const { transform } = event;

    // Update the scaling of the scatter plot elements
    svg.selectAll('circle').attr('transform', transform.toString());

    svg
      .selectAll('circle')
      .attr(
        'r',
        (d) => (d.size / referenceSize) * (currentZoomScale / initialZoomScale)
      );

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

  const radius = 1;

  // Create circles for each data point, with size and color determined by the data
  svg
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d) => xScale(d.x))
    .attr('cy', (d) => yScale(d.y))
    .attr('r', radius) // Size of the circles based on the "size" column
    .attr('fill', (d, i) => colorScale(i)) // Color of the circles based on the data point index
    .on('mouseover', function (d) {
      name = d.toElement.__data__.name;
      size = d.toElement.__data__.size;
      d3.select('#tooltip')
        .style('display', 'block')
        .html(`<strong>${name}</strong><br>Pages: ${size}`);

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
