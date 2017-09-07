import * as d3 from 'd3';
import React from 'react';
import {findDOMNode} from 'react-dom';

const MARGIN = {top: 20, right: 80, bottom: 30, left: 50};

function getInnerHeight(height, margin) {
  return height - margin.top - margin.bottom;
}

function getInnerWidth(width, margin) {
  return width - margin.left - margin.right;
}

function translate(x, y) {
  return `translate(${x}, ${y})`;
}

class Chart extends React.Component {

  componentDidMount() {
    this._draw();
  }

  render() {
    const {height, width} = this.props;

    return (
      <svg height={height} width={width}>
        <g
          ref={instance => this._instance = instance}
          transform={translate(MARGIN.left, MARGIN.top)}>
        </g>
      </svg>
    );
  }

  _draw() {
    const {cities, data, height, width} = this.props;

    const g = d3.select(findDOMNode(this._instance));
    const innerHeight = getInnerHeight(height, MARGIN);
    const innerWidth = getInnerWidth(width, MARGIN);

    const x = d3.scaleTime().range([0, innerWidth]);
    const y = d3.scaleLinear().range([innerHeight, 0]);
    const z = d3.scaleOrdinal(d3.schemeCategory10);

    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.temperature));

    x.domain(d3.extent(data, d => d.date));

    y.domain([
      d3.min(cities, c => d3.min(c.values, d => d.temperature)),
      d3.max(cities, c => d3.max(c.values, d => d.temperature)),
    ]);

    z.domain(cities.map(c => c.id));

    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', translate(0, innerHeight))
      .call(d3.axisBottom(x));

    g.append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(y))
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('fill', '#000')
        .text('Temperature, ºF');

    const city = g.selectAll('.city')
      .data(cities)
      .enter().append('g')
        .attr('class', 'city');

    city
      .append('path')
      .attr('class', 'line')
      .attr('d', d => line(d.values))
      .style('stroke', d => z(d.id));

    city
      .append('text')
      .datum(d => ({
        id: d.id,
        value: d.values[d.values.length - 1]
      }))
      .attr('transform', d => (
        translate(x(d.value.date), y(d.value.temperature))
      ))
      .attr('x', 3)
      .attr('dy', '0.35em')
      .style('font', '10px sans-serif')
      .text(d => d.id);
  }
}

export default Chart;
