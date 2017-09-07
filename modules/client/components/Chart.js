import * as d3 from 'd3';
import React from 'react';

import Axis from './Axis';
import Line from './Line';

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

  render() {
    const {cities, data, height, width} = this.props;

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([0, getInnerWidth(width, MARGIN)]);

    const y = d3.scaleLinear()
      .domain([
        d3.min(cities, c => d3.min(c.values, d => d.temperature)),
        d3.max(cities, c => d3.max(c.values, d => d.temperature)),
      ])
      .range([getInnerHeight(height, MARGIN), 0]);

    const z = d3.scaleOrdinal(d3.schemeCategory10)
      .domain(cities.map(c => c.id));

    return (
      <svg height={height} width={width}>
        <g
          ref={instance => this._instance = instance}
          transform={translate(MARGIN.left, MARGIN.top)}>
          <Axis
            className="x-axis"
            orient="bottom"
            scale={x}
            transform={translate(0, getInnerHeight(height, MARGIN))}
          />
          <Axis
            className="y-axis"
            orient="left"
            scale={y}
            tickFormat={temperature => `${temperature}ºF`}>
            <text
              dy="0.71em"
              fill="#000"
              transform="rotate(-90)"
              y={6}>
              Temperature, ºF
            </text>
          </Axis>
          {cities.map(city => this._renderCityLine(city, x, y, z))}
        </g>
      </svg>
    );
  }

  _renderCityLine = (city, x, y, z) => {
    const last = city.values[city.values.length - 1];

    return (
      <g className="city" key={city.id}>
        <Line
          curve={d3.curveBasis}
          data={city.values}
          style={{stroke: z(city.id)}}
          x={d => x(d.date)}
          y={d => y(d.temperature)}
        />
        <text
          dy="0.35em"
          style={{
            font: '10px sans-serif',
          }}
          transform={translate(x(last.date), y(last.temperature))}
          x={3}>
          {city.id}
        </text>
      </g>
    );
  }
}

export default Chart;
