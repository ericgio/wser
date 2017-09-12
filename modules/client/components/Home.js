import React from 'react';
import {findDOMNode} from 'react-dom';

import SplitsChart from './SplitsChart';
import Toolbar from './Toolbar';

import './Home.css';

const INITIAL_STATE = {
  finishType: {
    all: true,
    dnf: false,
    finisher: false,
    silverbuckle: false,
    topten: false,
  },
  gender: 'All',
  height: 0,
  search: '',
  width: 0,
  year: '2017',
};
const PADDING = 20;

class Home extends React.Component {
  state = INITIAL_STATE;

  componentDidMount() {
    this._handleResize();
    window.addEventListener('resize', this._handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleResize);
  }

  render() {
    return (
      <div className="app-page">
        <Toolbar
          {...this.state}
          className="app-toolbar form-inline"
          onChange={this._handleChange}
          ref={t => this._toolbar = t}
          style={{
            padding: `${PADDING}px`,
          }}
        />
        <div
          className="app-chart"
          ref={c => this._chart = c}
          style={{
            padding: `0 ${PADDING}px`,
          }}>
          <SplitsChart {...this.state} />
        </div>
      </div>
    );
  }

  _handleChange = e => {
    const {checked, id, name, value} = e.target;
    const newState = {[name]: value};

    switch (name) {
      case 'gender':
        newState[name] = id;
        break;
      case 'all':
        // Reset the finish type filters when clicking 'all'.
        newState.finishType = INITIAL_STATE.finishType;
        break;
      case 'topten':
      case 'silverbuckle':
      case 'finisher':
      case 'dnf':
        const finishType = {
          ...this.state.finishType,
          [name]: checked,
        };

        // Check if any types besides 'all' have been checked.
        let hasChecked = false;
        Object.keys(finishType).forEach(key => {
          if (key === 'all' || hasChecked) {
            return;
          }
          hasChecked = finishType[key];
        });

        newState.finishType = {
          ...finishType,
          all: !hasChecked,
        };
        break;
    }

    this.setState(newState);
  }

  _handleResize = () => {
    const chartNode = findDOMNode(this._chart);
    const parentNode = findDOMNode(this);
    const toolbarNode = findDOMNode(this._toolbar);

    this.setState({
      height: parentNode.offsetHeight - toolbarNode.offsetHeight - PADDING,
      width: chartNode.offsetWidth - PADDING,
    });
  }
}

export default Home;
