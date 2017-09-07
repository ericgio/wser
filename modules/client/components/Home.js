import * as d3 from 'd3';
import React from 'react';

import Chart from './Chart';

import data from '../data/data.tsv';

import './Home.css';

class Home extends React.Component {

  render() {
    const parseTime = d3.timeParse('%Y%m%d');

    const converted = data.map((d, _, columns) => {
      d.date = parseTime(d.date);
      for (var i = 1, n = columns.length, c; i < n; ++i) {
        d[c = columns[i]] = +d[c];
      }
      return d;
    });

    const cities = data.columns
      .slice(1)
      .map(id => ({
        id: id,
        values: converted.map(d => ({
          date: d.date,
          temperature: d[id],
        })),
      }));

    return (
      <Chart
        cities={cities}
        data={converted}
        height={500}
        width={960}
      />
    );
  }
}

export default Home;
