import React from 'react';
import {findDOMNode} from 'react-dom';
import {Checkbox, ControlLabel, FormControl, FormGroup, Radio} from 'react-bootstrap';

import SplitsChart from './SplitsChart';

import AID_STATIONS from '../../constants/aidStations';

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
const PADDING = 15;

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
    const finishTypes = ['All', 'Top Ten', 'Silver Buckle', 'Finisher', 'DNF'];

    return (
      <div className="app-page">
        <div
          className="app-toolbar form-inline"
          ref={t => this._toolbar = t}
          style={{
            padding: `${PADDING}px`,
          }}>
          <FormGroup>
            <ControlLabel>Year</ControlLabel>
            <FormControl
              componentClass="select"
              name="year"
              onChange={this._handleChange}>
              {Object.keys(AID_STATIONS).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </FormControl>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Runner Name</ControlLabel>
            <FormControl name="search" onChange={this._handleChange} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Gender</ControlLabel>
            <div className="gender-radios">
              {['All', 'Male', 'Female'].map(type => (
                <Radio
                  checked={this.state.gender === type}
                  id={type}
                  inline
                  key={type}
                  name="gender"
                  onChange={this._handleChange}>
                  {type}
                </Radio>
              ))}
            </div>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Finish Place</ControlLabel>
            <div className="gender-radios">
              {finishTypes.map(label => {
                const value = label.split(' ').join('').toLowerCase();

                return (
                  <Checkbox
                    checked={this.state.finishType[value]}
                    inline
                    key={value}
                    name={value}
                    onChange={this._handleChange}>
                    {label}
                  </Checkbox>
                );
              })}
            </div>
          </FormGroup>
        </div>
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
