import React from 'react';
import {findDOMNode} from 'react-dom';
import {Media} from 'react-bootstrap';

import SplitsChart from './SplitsChart';
import Toolbar from './Toolbar';

import data from '../data/2017.json';
import secondsToTime from '../../utils/secondsToTime';

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

const GENDER = {
  FEMALE: 'F',
  MALE: 'M',
};
const SEC_PER_HR = 3600;
const SILVER_BUCKLE = 24 * SEC_PER_HR;

const PADDING_H = 20;
const PADDING_V = 10;
const SIDEBAR_WIDTH = 350;

function getCountry(country) {
  switch (country) {
    case 'USA':
    case 'CAN':
      return null;
    default:
      return country;
  }
}

function getState({country, state}) {
  switch (country) {
    case 'USA':
    case 'CAN':
      return state;
    default:
      return null;
  }
}

const Runner = props => {
  const country = getCountry(props.country);
  const state = getState(props);
  const time = props.finishTime ? secondsToTime(props.finishTime) : 'DNF';

  return (
    <Media className="runner">
      <Media.Left>
        {props.overallPlace}
      </Media.Left>
      <Media.Body>
        <h4 className="clearfix">
          <div className="pull-left">{props.name}</div>
          <div className="pull-right">{time}</div>
        </h4>
        <div className="clearfix">
          <div className="pull-left">
            Bib #{props.bib} {props.gender}, {props.age}
          </div>
          <div className="pull-right">
            {props.city}, {state} {country}
          </div>
        </div>
      </Media.Body>
    </Media>
  );
};

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
    const filteredData = data.filter(this._filterData);

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
            <SplitsChart {...this.state} data={filteredData} />
          </div>
          <div
            className="app-sidebar"
            ref={i => this._sidebar = i}
            style={{width: `${SIDEBAR_WIDTH}px`}}>
            {filteredData.map(data => <Runner {...data} key={data.bib} />)}
          </div>
        </div>
      </div>
    );
  }

  /**
   * Progressively filter out data.
   */
  _filterData = row => {
    const {finishType, gender, search} = this.state;
    const searchString = search.toLowerCase();
    const name = row.name.toLowerCase();

    if (name.indexOf(searchString) === -1) {
      return false;
    }

    switch (gender) {
      case 'Male':
        if (row.gender !== GENDER.MALE) {
          return false;
        }
        break;
      case 'Female':
        if (row.gender !== GENDER.FEMALE) {
          return false;
        }
        break;
    }

    const {all, dnf, finisher, silverbuckle, topten} = finishType;

    if (
      all ||
      (dnf && !row.finishTime) ||
      (finisher && row.finishTime) ||
      (silverbuckle && !!row.finishTime && row.finishTime < SILVER_BUCKLE) ||
      (topten && (
        (row.gender === GENDER.MALE && row.overallPlace <= 10) ||
        (row.gender === GENDER.FEMALE && row.overallPlace <= 36)
      ))
    ) {
      return true;
    }

    return false;
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
    const toolbarNode = findDOMNode(this._toolbar);

    const height =
      parentNode.offsetHeight - toolbarNode.offsetHeight - PADDING_V * 2;
    const width = parentNode.offsetWidth - SIDEBAR_WIDTH - PADDING_H;

    this.setState({height, width});
  }
}

export default Home;
