import React from 'react';
import {findDOMNode} from 'react-dom';

import SplitsChart from './SplitsChart';
import Toolbar from './Toolbar';

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

const PADDING_H = 20;
const PADDING_V = 10;
const SIDEBAR_WIDTH = 350;

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
          ref={i => this._toolbar = i}
          style={{
            padding: `${PADDING_V}px ${PADDING_H}px`,
          }}
        />
        <div className="app-data">
          <div
            className="app-chart"
            style={{padding: `0 0 ${PADDING_V}px ${PADDING_H}px`}}>
            <SplitsChart {...this.state} />
          </div>
          <div
            className="app-sidebar"
            ref={i => this._sidebar = i}
            style={{width: `${SIDEBAR_WIDTH}px`}}>
            {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
              <div
                style={{
                  borderBottom: '1px solid #f0f0f0',
                  padding: '30px'
                }}>
                {n}
              </div>
            ))}
          </div>
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
    const parentNode = findDOMNode(this);
    const sidebarNode = findDOMNode(this._sidebar);
    const toolbarNode = findDOMNode(this._toolbar);

    const height =
      parentNode.offsetHeight - toolbarNode.offsetHeight - PADDING_V * 2;
    const width = parentNode.offsetWidth - SIDEBAR_WIDTH - PADDING_H;

    this.setState({height, width});
  }
}

export default Home;
