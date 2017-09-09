import * as d3 from 'd3';
import PropTypes from 'prop-types';
import {Axis, Chart, Line} from 'r-d3';
import {getInnerHeight, getInnerWidth, translate} from 'r-d3/lib/utils';
import React from 'react';

import data from '../data/temperatures.tsv';

let cities, converted;

class TemperatureChart extends React.Component {

  componentWillMount() {
    converted = data.map((d, _, columns) => {
      d.date = d3.timeParse('%Y%m%d')(d.date);
      for (var i = 1, n = columns.length, c; i < n; ++i) {
        d[c = columns[i]] = +d[c];
      }
      return d;
    });

    cities = data.columns
      .slice(1)
      .map(id => ({
        id,
        values: converted.map(d => ({
          date: d.date,
          temperature: d[id],
        })),
      }));
  }

  render() {
    const {filter, height, margin, width} = this.props;

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([0, getInnerWidth(width, margin)]);

    const y = d3.scaleLinear()
      .domain([
        d3.min(cities, c => d3.min(c.values, d => d.temperature)),
        d3.max(cities, c => d3.max(c.values, d => d.temperature)),
      ])
      .range([getInnerHeight(height, margin), 0]);

    const z = d3.scaleOrdinal(d3.schemeCategory10)
      .domain(cities.map(c => c.id));

    return (
      <Chart height={height} margin={margin} width={width}>
        <Axis
          className="x-axis"
          orient="bottom"
          scale={x}
          ticks={10}
          transform={translate(0, getInnerHeight(height, margin))}
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
    const filter = this.props.filter.toLowerCase();
    const cityName = city.id.toLowerCase();

    if (cityName.indexOf(filter) === -1) {
      return null;
    }

    const last = city.values[city.values.length - 1];

    return (
      <g className="city" key={city.id}>
        <Line
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

TemperatureChart.propTypes = {
  filter: PropTypes.string,
  margin: PropTypes.shape({
    bottom: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
  }),
};

TemperatureChart.defaultProps = {
  filter: '',
  margin: {top: 20, right: 80, bottom: 30, left: 50},
};

export default TemperatureChart;
