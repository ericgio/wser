import * as d3 from 'd3';
import React from 'react';
import {findDOMNode} from 'react-dom';
import {Media} from 'react-bootstrap';

import SplitsChart from './SplitsChart';
import Toolbar from './Toolbar';

import dataByYear from '../data';
import secondsToTime from '../../utils/secondsToTime';

import {GENDER, SEC_PER_HOUR, SILVER_BUCKLE_TIME} from '../../constants';

const INITIAL_STATE = {
  active: null,
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

const Runner = ({finishTime, ...props}) => {
  const country = getCountry(props.country);
  const state = getState(props);

  let place = props.overallPlace;
  let time = secondsToTime(finishTime);
  if (!finishTime) {
    place = 'DNF';
    time = '--:--';
  }

  return (
    <Media
      className="runner"
      onMouseOut={props.onMouseOut}
      onMouseOver={props.onMouseOver}>
      <Media.Left>{place}</Media.Left>
      <Media.Body>
        <h4 className="clearfix">
          <div className="pull-left">
            {props.name} <small>#{props.bib}</small>
          </div>
          <div className="pull-right">{time}</div>
        </h4>
        <div className="clearfix">
          <div className="pull-left">
            {props.gender}{props.age}
            {!!finishTime && `, GP: ${props.genderPlace}`}
          </div>
          <div className="pull-right">
            {props.city}, {state} {country}
          </div>
        </div>
      </Media.Body>
    </Media>
  );
};

class Main extends React.Component {
  state = INITIAL_STATE;

  componentDidMount() {
    this._handleResize();
    window.addEventListener('resize', this._handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleResize);
  }

  render() {
    const dataForYear = dataByYear[this.state.year];
    const filteredData = dataForYear.filter(this._filterData);

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
          years={Object.keys(dataByYear).reverse()}
        />
        <div className="app-data">
          <div
            className="app-chart"
            style={{padding: `0 0 ${PADDING_V}px ${PADDING_H}px`}}>
            <SplitsChart
              {...this.state}
              data={filteredData}
              medianTime={d3.median(
                dataForYear,
                d => d.finishTime || 30 * SEC_PER_HOUR
              )}
            />
          </div>
          <div
            className="app-sidebar"
            ref={i => this._sidebar = i}
            style={{width: `${SIDEBAR_WIDTH}px`}}>
            {filteredData.map(data => (
              // Gordy and Cowman apparently both get bib #0, so add first name
              // to the key to create a unique identifier.
              <Runner
                {...data}
                key={`${data.bib}-${data.firstName}`}
                onMouseOver={e => this._handleRunnerMouseOver(e, data)}
                onMouseOut={e => this.setState({active: null})}
              />
            ))}
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
      (silverbuckle && row.finishTime && row.finishTime < SILVER_BUCKLE_TIME) ||
      (topten && row.genderPlace && row.genderPlace <= 10)
    ) {
      return true;
    }

    return false;
  }

  _handleChange = e => {
    const {checked, id, name, value} = e.target;
    let newState = {};

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
      default:
        newState[name] = value;
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

  _handleRunnerMouseOver = (e, data) => {
    if (this.state.active !== data.bib) {
      this.setState({active: data});
    }
  }
}

export default Main;
