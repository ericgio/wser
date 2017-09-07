import * as d3 from 'd3';
import {Axis, Chart, Line} from 'r-d3';
import {getInnerHeight, getInnerWidth, translate} from 'r-d3/lib/utils';
import React from 'react';

const MARGIN = {top: 20, right: 80, bottom: 30, left: 50};

class DataChart extends React.Component {

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
      <Chart height={height} width={width} margin={MARGIN}>
        <Axis
          className="x-axis"
          orient="bottom"
          scale={x}
          ticks={10}
          transform={translate(0, getInnerHeight(height, MARGIN))}
        />
        <Axis
          className="y-axis"
          orient="left"
          scale={y}
          tickFormat={temperature => `${temperature}ºF`}
          ticks={10}>
          <text
            dy="0.71em"
            fill="#000"
            transform="rotate(-90)"
            y={6}>
            Temperature, ºF
          </text>
        </Axis>
        {cities.map(city => this._renderLine(city, x, y, z))}
      </Chart>
    );
  }

  _renderLine = (city, x, y, z) => {
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

export default DataChart;
