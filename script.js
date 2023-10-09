const courseButton = document.getElementById('courseButton');
const documentsButton = document.getElementById('documentsButton');
const pagesButton = document.getElementById('pagesButton');
const resetButton = document.getElementById('resetButton');
const numberOf = document.getElementById('numberOf');

courseButton.addEventListener('click', coursesClicked);
documentsButton.addEventListener('click', documentsClicked);
pagesButton.addEventListener('click', pagesClicked);
resetButton.addEventListener('click', reset);

const scatterPlotDiv = document.getElementById('scatter-plot');
let containerDiv = document.getElementById('scatter-plot');
let padding = containerDiv.offsetWidth * 0.05;
let width = containerDiv.offsetWidth - padding;
let height = containerDiv.offsetHeight - padding;
let radius = width / 1000;

let pointScale = width / 500;

const initialZoomScale = 1;
const referenceSize = 50;

let activeView = 2;
pagesClicked();

const onresize = (dom_elem, callback) => {
  const resizeObserver = new ResizeObserver(() => callback());
  resizeObserver.observe(dom_elem);
};

function coursesClicked() {
  courseButton.style.backgroundColor = '#5300eb';
  documentsButton.style.backgroundColor = '#2C2C32';
  pagesButton.style.backgroundColor = '#2C2C32';
  activeView = 0;
  reset();
}

function documentsClicked() {
  courseButton.style.backgroundColor = '#2C2C32';
  documentsButton.style.backgroundColor = '#5300eb';
  pagesButton.style.backgroundColor = '#2C2C32';
  activeView = 1;
  reset();
}

function pagesClicked() {
  courseButton.style.backgroundColor = '#2C2C32';
  documentsButton.style.backgroundColor = '#2C2C32';
  pagesButton.style.backgroundColor = '#5300eb';
  activeView = 2;
  reset();
}

function reset() {
  width = containerDiv.offsetWidth - padding;
  height = containerDiv.offsetHeight - padding;
  radius = width / 750;
  scatterPlotDiv.innerHTML = '';
  if (activeView == 0) plotAllCourses();
  if (activeView == 1) plotAllDocuments();
  if (activeView == 2) plotAllPages();
}

onresize(containerDiv, function () {
  width = containerDiv.offsetWidth - padding;
  height = containerDiv.offsetHeight - padding;
  radius = width / 750;
  scatterPlotDiv.innerHTML = '';
  if (activeView == 0) plotAllCourses();
  if (activeView == 1) plotAllDocuments();
  if (activeView == 2) plotAllPages();

  pointScale = width / 500;
});

function plotAllCourses() {
  const svg = d3
    .select('#scatter-plot')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const categories = [];

  d3.csv('data/allCourses.csv').then(function (data) {
    data.sort((b, a) => a.size - b.size);

    data.forEach(function (d) {
      d.x = +d.x;
      d.y = +d.y;
      d.size = +d.size;
      if (!categories.includes(d.name)) {
        categories.push(d.name);
      }
    });

    numberOf.textContent = `Number of Courses: ${data.length}`;

    const colorScale = d3
      .scaleOrdinal()
      .domain(categories)
      .range(
        categories.map((d, i) =>
          d3.interpolateRainbow(i / (categories.length - 1))
        )
      );

    const xScale = d3.scaleLinear().domain([-120, 120]).range([0, width]);
    const yScale = d3.scaleLinear().domain([-120, 120]).range([height, 0]);

    const zoom = d3.zoom().scaleExtent([0.5, 5]).on('zoom', zoomed);

    function zoomed(event) {
      const { transform } = event;
      svg.selectAll('circle').attr('transform', transform.toString());

      svg
        .select('.x-axis')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).scale(transform.rescaleX(xScale)));

      svg
        .select('.y-axis')
        .call(d3.axisLeft(yScale).scale(transform.rescaleY(yScale)));
    }

    svg.call(zoom);

    svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.x))
      .attr('cy', (d) => yScale(d.y))
      .attr('r', (d) => (d.size / 50) * pointScale)
      .attr('fill', (d) => colorScale(d.name))
      .classed('drop-shadow', true)
      .on('mouseover', function (d) {
        course = d.toElement.__data__.name;
        page = d.toElement.__data__.size;
        d3.select('#tooltip')
          .style('display', 'block')
          .html(`<strong>${course}</strong><br>Pages: ${page}`);

        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', (d) => (d.size / 50) * pointScale + 10);
      })
      .on('mousemove', function (event) {
        d3.select('#tooltip')
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px');
      })
      .on('mouseout', function () {
        d3.select('#tooltip').style('display', 'none');
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', (d) => (d.size * pointScale) / 50);
      })
      .on('click', function (event) {
        console.log(event);
      });
  });
}

function plotAllDocuments() {
  const svg = d3
    .select('#scatter-plot')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const categories = [];

  d3.csv('data/allDocuments.csv').then(function (data) {
    data.sort((b, a) => a.size - b.size);

    data.forEach(function (d) {
      d.x = +d.x;
      d.y = +d.y;
      d.size = +d.size;
      if (!categories.includes(d.category)) {
        categories.push(d.category);
      }
    });

    numberOf.textContent = `Number of Documents: ${data.length}`;

    const colorScale = d3
      .scaleOrdinal()
      .domain(categories)
      .range(
        categories.map((d, i) =>
          d3.interpolateRainbow(i / (categories.length - 1))
        )
      );

    const xScale = d3.scaleLinear().domain([-120, 120]).range([0, width]);
    const yScale = d3.scaleLinear().domain([-120, 120]).range([height, 0]);

    const zoom = d3.zoom().scaleExtent([0.5, 20]).on('zoom', zoomed);

    function zoomed(event) {
      const { transform } = event;
      svg.selectAll('circle').attr('transform', transform.toString());

      svg
        .select('.x-axis')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).scale(transform.rescaleX(xScale)));

      svg
        .select('.y-axis')
        .call(d3.axisLeft(yScale).scale(transform.rescaleY(yScale)));
    }

    svg.call(zoom);

    svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.x))
      .attr('cy', (d) => yScale(d.y))
      .attr('r', (radius + 1.5) * pointScale)
      .attr('fill', (d) => colorScale(d.category))
      .classed('drop-shadow', true)
      .on('mouseover', function (d) {
        course = d.toElement.__data__.category;
        filename = d.toElement.__data__.name;
        page = d.toElement.__data__.size;
        d3.select('#tooltip')
          .style('display', 'block')
          .html(
            `<strong>${course}</strong><br>File: ${filename}<br>Pages: ${page}`
          );

        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', (radius + 1.5) * pointScale + 0.5);
      })
      .on('mousemove', function (event) {
        d3.select('#tooltip')
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px');
      })
      .on('mouseout', function () {
        d3.select('#tooltip').style('display', 'none');
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', (radius + 1.5) * pointScale);
      })
      .on('click', function (event) {
        console.log(event);
      });
  });
}

function plotAllPages() {
  const svg = d3
    .select('#scatter-plot')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const categories = [];

  d3.csv('data/allPages.csv').then(function (data) {
    data.sort((b, a) => a.size - b.size);

    data.forEach(function (d) {
      d.x = +d.x;
      d.y = +d.y;
      if (!categories.includes(d.category)) {
        categories.push(d.category);
      }
    });

    numberOf.textContent = `Number of Pages: ${data.length}`;

    const colorScale = d3
      .scaleOrdinal()
      .domain(categories)
      .range(
        categories.map((d, i) =>
          d3.interpolateRainbow(i / (categories.length - 1))
        )
      );

    const xScale = d3.scaleLinear().domain([-120, 120]).range([0, width]);
    const yScale = d3.scaleLinear().domain([-120, 120]).range([height, 0]);

    const zoom = d3.zoom().scaleExtent([0.5, 20]).on('zoom', zoomed);

    function zoomed(event) {
      const { transform } = event;
      svg.selectAll('circle').attr('transform', transform.toString());

      svg
        .select('.x-axis')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).scale(transform.rescaleX(xScale)));

      svg
        .select('.y-axis')
        .call(d3.axisLeft(yScale).scale(transform.rescaleY(yScale)));
    }

    svg.call(zoom);

    svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.x))
      .attr('cy', (d) => yScale(d.y))
      .attr('r', radius)
      .attr('fill', (d) => colorScale(d.category))
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

        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', radius + 0.5);
      })
      .on('mousemove', function (event) {
        d3.select('#tooltip')
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px');
      })
      .on('mouseout', function () {
        d3.select('#tooltip').style('display', 'none');
        d3.select(this).transition().duration(200).attr('r', radius);
      })
      .on('click', function (event) {
        console.log(event);
      });
  });
}
