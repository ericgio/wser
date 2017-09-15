import React from 'react';
import {Checkbox, ControlLabel, FormControl, FormGroup, Radio} from 'react-bootstrap';

const FINISH_TYPES = ['All', 'Top Ten', 'Silver Buckle', 'Finisher', 'DNF'];

class Toolbar extends React.Component {
  render() {
    const {
      active,
      finishType,
      gender,
      height,
      onChange,
      search,
      width,
      year,
      years,
      ...otherProps
    } = this.props;

    return (
      <div {...otherProps}>
        <FormGroup>
          <ControlLabel>Year</ControlLabel>
          <FormControl
            componentClass="select"
            name="year"
            onChange={onChange}
            value={year}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </FormControl>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Runner Name</ControlLabel>
          <FormControl name="search" onChange={onChange} />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Gender</ControlLabel>
          <div className="gender-radios">
            {['All', 'Male', 'Female'].map(type => (
              <Radio
                checked={gender === type}
                id={type}
                inline
                key={type}
                name="gender"
                onChange={onChange}>
                {type}
              </Radio>
            ))}
          </div>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Finish Place</ControlLabel>
          <div className="gender-radios">
            {FINISH_TYPES.map(label => {
              const value = label.split(' ').join('').toLowerCase();
              return (
                <Checkbox
                  checked={finishType[value]}
                  inline
                  key={value}
                  name={value}
                  onChange={onChange}>
                  {label}
                </Checkbox>
              );
            })}
          </div>
        </FormGroup>
      </div>
    );
  }
}

export default Toolbar;
