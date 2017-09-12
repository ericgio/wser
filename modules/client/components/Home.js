import React from 'react';
import {findDOMNode} from 'react-dom';
import {ControlLabel, Form, FormControl, FormGroup, Radio} from 'react-bootstrap';

import SplitsChart from './SplitsChart';

import AID_STATIONS from '../../constants/aidStations';

import './Home.css';

const PADDING = 15;

class Home extends React.Component {
  state = {
    gender: 'All',
    height: 0,
    search: '',
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
      <div className="app-page">
        <div
          className="app-toolbar"
          ref={t => this._toolbar = t}
          style={{
            padding: `${PADDING}px`,
          }}>
          <Form inline>
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
            </FormGroup>
          </Form>
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
    const {id, name, value} = e.target;
    this.setState({[name]: name === 'gender' ? id : value});
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
