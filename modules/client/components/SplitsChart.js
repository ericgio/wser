import cx from 'classnames';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import {Axis, Chart, Line} from 'r-d3';
import {getInnerHeight, getInnerWidth, translate} from 'r-d3/lib/utils';
import React from 'react';

import secondsToTime from '../../utils/secondsToTime';

import {AID_STATIONS, SEC_PER_HR, SILVER_BUCKLE_TIME} from '../../constants';

const DISTANCE_MAX = 100.2;
const DISTANCE_MIN = 0;
const TIME_MAX = 30 * SEC_PER_HR;
const TIME_MIN = 0;

class SplitsChart extends React.Component {
  render() {
    const {data, height, margin, width, year} = this.props;
    const innerHeight = getInnerHeight(height, margin);
    const innerWidth = getInnerWidth(width, margin);

    const x = d3.scaleLinear()
      .domain([DISTANCE_MIN, DISTANCE_MAX])
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([TIME_MIN, TIME_MAX])
      .range([innerHeight, 0]);

    const xTickValues = AID_STATIONS[year].map(d => d.distance);
    const yTickValues = [0, 6, 12, 18, 24, 30].map(t => t * SEC_PER_HR);

    return (
      <Chart
        height={height}
        transform={translate(margin.left, margin.top)}
        width={width}>
        <Axis
          className="x-axis-background"
          orient="top"
          scale={x}
          tickFormat={distance => {}}
          tickSize={innerHeight}
          tickValues={xTickValues}
          transform={translate(0, innerHeight)}
        />
        <Axis
          className="x-axis"
          orient="bottom"
          scale={x}
          tickFormat={distance => distance.toFixed(1)}
          tickSize={5}
          tickValues={xTickValues}
          transform={translate(0, innerHeight)}
        />
        <Axis
          className="y-axis-background"
          orient="right"
          scale={y}
          tickSize={innerWidth}
          tickValues={yTickValues}
        />
        <Axis
          className="y-axis"
          orient="left"
          scale={y}
          tickFormat={seconds => secondsToTime(seconds)}
          tickValues={yTickValues}
        />
        <Line
          className="silver-buckle-cutoff"
          data={[
            {distance: DISTANCE_MIN, duration: SILVER_BUCKLE_TIME},
            {distance: DISTANCE_MAX, duration: SILVER_BUCKLE_TIME},
          ]}
          x={d => x(d.distance)}
          y={d => y(d.duration)}
        />
        {data.map(row => (
          <g
            className={cx('runner-line', row.gender.toLowerCase())}
            key={row.bib}>
            <Line
              data={row.splits}
              x={d => x(d.distance)}
              y={d => y(d.duration)}
            />
          </g>
        ))}
      </Chart>
    );
  }
}

SplitsChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    bib: PropTypes.string.isRequired,
    splits: PropTypes.arrayOf(PropTypes.shape({
      distance: PropTypes.number.isRequired,
      duration: PropTypes.number.isRequired,
    }).isRequired).isRequired,
  }).isRequired).isRequired,
  height: PropTypes.number.isRequired,
  margin: PropTypes.shape({
    bottom: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
  }),
  width: PropTypes.number.isRequired,
  year: PropTypes.string.isRequired,
};

SplitsChart.defaultProps = {
  margin: {top: 20, right: 20, bottom: 20, left: 50},
};

export default SplitsChart;
