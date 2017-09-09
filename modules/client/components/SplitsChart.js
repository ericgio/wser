import * as d3 from 'd3';
import PropTypes from 'prop-types';
import {Axis, Chart, Line} from 'r-d3';
import {getInnerHeight, getInnerWidth, translate} from 'r-d3/lib/utils';
import React from 'react';

import secondsToTime from '../utils/secondsToTime';

function timeToSeconds(time) {
  if (!time) {
    return 0;
  }

  return time
    .split(':')
    .reverse()
    .reduce((seconds, value, idx) => seconds + value * Math.pow(60, idx), 0);
}

const DISTANCE_MAX = 100.2;
const DISTANCE_MIN = 0;

const SEC_PER_HR = 3600;

const SILVER_BUCKLE = 24 * SEC_PER_HR;
const TIME_MAX = 30 * SEC_PER_HR;
const TIME_MIN = 0;

const AID_STATIONS = [
  {distance: 0, name: 'Squaw Valley (Start)'},
  {distance: 10.3, name: 'Lyon Ridge'},
  {distance: 15.8, name: 'Red Star Ridge'},
  {distance: 24.4, name: 'Duncan Canyon'},
  {distance: 30.3, name: 'Robinson Flat'},
  {distance: 34.4, name: 'Miller\'s Defeat'},
  {distance: 38.0, name: 'Dusty Corners'},
  {distance: 43.3, name: 'Last Chance'},
  {distance: 47.8, name: 'Devil\'s Thumb'},
  {distance: 52.9, name: 'El Dorado Creek'},
  {distance: 55.7, name: 'Michigan Bluff'},
  {distance: 62.0, name: 'Foresthill'},
  {distance: 65.7, name: 'Dardanelles (Cal 1)'},
  {distance: 70.7, name: 'Peachstone (Cal 2)'},
  {distance: 73.0, name: 'Ford\'s Bar (Cal 3)'},
  {distance: 78.0, name: 'Rucky Chucky'},
  {distance: 79.8, name: 'Green Gate'},
  {distance: 85.2, name: 'Auburn Lake Trails'},
  {distance: 90.7, name: 'Quarry Road'},
  {distance: 94.3, name: 'Pointed Rocks'},
  {distance: 96.8, name: 'No Hands Bridge'},
  {distance: 98.9, name: 'Robie Point'},
  {distance: 100.2, name: 'Placer High School (Finish)'},
];

const data = [
  {
    overall: 1,
    finishTime: '16:19:37',
    bib: 46,
    firstName: 'Ryan',
    lastName: 'Sandes',
    gender: 'M',
    age: 35,
    city: 'Cape Town',
    state: 'ZAF',
    country: 'ZAF',
    splits: [
      {duration: 0, position: null},
      {duration: '1:52:11', position: 5},
      {duration: '2:46:00', position: 4},
      {duration: '3:57:00', position: 2},
      {duration: '4:57:00', position: 2},
      {duration: '5:28:00', position: 2},
      {duration: '5:55:00', position: 2},
      {duration: '6:32:00', position: 2},
      {duration: '7:28:00', position: 2},
      {duration: '8:02:00', position: 2},
      {duration: '8:54:00', position: 2},
      {duration: '9:56:58', position: 2},
      {duration: null, position: 2},
      {duration: '11:21:00', position: 2},
      {duration: null, position: 2},
      {duration: '12:26:00', position: 1},
      {duration: '12:53:00', position: 1},
      {duration: '13:48:00', position: 1},
      {duration: '14:39:00', position: 1},
      {duration: '15:20:00', position: 1},
      {duration: null, position: 1},
      {duration: '16:06:00', position: 1},
      {duration: '16:19:37', position: 1},
    ].map((split, idx) => {
      return {
        ...split,
        ...AID_STATIONS[idx],
        duration: timeToSeconds(split.duration || '0'),
      };
    }),
  },
];

class SplitsChart extends React.Component {

  render() {
    const {filter, height, margin, width} = this.props;

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
          tickValues={AID_STATIONS.map(d => d.distance)}
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
};

SplitsChart.defaultProps = {
  filter: '',
  margin: {top: 20, right: 20, bottom: 20, left: 50},
};

export default SplitsChart;
