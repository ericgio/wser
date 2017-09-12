import * as d3 from 'd3';
import PropTypes from 'prop-types';
import {Axis, Chart, Line} from 'r-d3';
import {getInnerHeight, getInnerWidth, translate} from 'r-d3/lib/utils';
import React from 'react';

import secondsToTime from '../../utils/secondsToTime';
import timeToSeconds from '../../utils/timeToSeconds';

import data from '../data/2017.json';

import AID_STATIONS from '../../constants/aidStations';

const DISTANCE_MAX = 100.2;
const DISTANCE_MIN = 0;

const SEC_PER_HR = 3600;

const SILVER_BUCKLE = 24 * SEC_PER_HR;
const TIME_MAX = 30 * SEC_PER_HR;
const TIME_MIN = 0;

class SplitsChart extends React.Component {

  render() {
    const {filter, height, margin, width, year} = this.props;

    const innerHeight = getInnerHeight(height, margin);
    const innerWidth = getInnerWidth(width, margin);

    const x = d3.scaleLinear()
      .domain([DISTANCE_MIN, DISTANCE_MAX])
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([TIME_MIN, TIME_MAX])
      .range([innerHeight, 0]);

    return (
      <Chart
        height={height}
        transform={translate(margin.left, margin.top)}
        width={width}>
        <Axis
          className="x-axis"
          orient="bottom"
          scale={x}
          tickFormat={distance => distance.toFixed(1)}
          tickValues={AID_STATIONS[year].map(d => d.distance)}
          transform={translate(0, innerHeight)}
        />
        <Axis
          className="y-axis"
          orient="left"
          scale={y}
          tickFormat={seconds => secondsToTime(seconds)}
          ticks={30}
          tickValues={[0, 24, 30].map(t => t * SEC_PER_HR)}
        />
        <Line
          className="silver-buckle-cutoff"
          data={[
            {distance: DISTANCE_MIN, duration: SILVER_BUCKLE},
            {distance: DISTANCE_MAX, duration: SILVER_BUCKLE},
          ]}
          x={d => x(d.distance)}
          y={d => y(d.duration)}
        />
        {data.map(row => this._renderLine(row, x, y))}
      </Chart>
    );
  }

  _renderLine = (row, x, y) => {
    const filter = this.props.filter.toLowerCase();
    const name = `${row.firstName} ${row.lastName}`.toLowerCase();

    if (name.indexOf(filter) === -1) {
      return null;
    }

    return (
      <g className="runner" key={row.bib}>
        <Line
          data={row.splits}
          x={d => x(d.distance)}
          y={d => y(d.duration)}
        />
      </g>
    );
  }
}

SplitsChart.propTypes = {
  filter: PropTypes.string,
  margin: PropTypes.shape({
    bottom: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
  }),
  year: PropTypes.string.isRequired,
};

SplitsChart.defaultProps = {
  filter: '',
  margin: {top: 20, right: 20, bottom: 20, left: 50},
};

export default SplitsChart;
