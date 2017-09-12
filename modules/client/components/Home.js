import React from 'react';
import {findDOMNode} from 'react-dom';

import SplitsChart from './SplitsChart';

import './Home.css';

const PADDING = 20;

class Home extends React.Component {
  state = {
    filter: '',
    height: 0,
    width: 0,
    year: '2017',
  };

  componentDidMount() {
    this._handleResize();
    window.addEventListener('resize', this._handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleResize);
  }

  render() {
    return (
      <div
        className="app-page"
        style={{
          padding: `${PADDING}px`,
        }}>
        <div className="app-toolbar" ref={t => this._toolbar = t}>
          <div>
            <label>Filter runner name: </label>
            <input onChange={this._handleFilter} />
          </div>
        </div>
        <div className="app-chart" ref={c => this._chart = c}>
          <SplitsChart {...this.state} />
        </div>
      </div>
    );
  }

  _handleFilter = e => {
    this.setState({filter: e.target.value});
  }

  _handleResize = () => {
    const chartNode = findDOMNode(this._chart);
    const parentNode = findDOMNode(this);
    const toolbarNode = findDOMNode(this._toolbar);

    this.setState({
      height: parentNode.offsetHeight - toolbarNode.offsetHeight - PADDING * 2,
      width: chartNode.offsetWidth,
    });
  }
}

export default Home;
