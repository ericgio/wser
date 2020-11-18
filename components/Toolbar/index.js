import cx from 'classnames';
import React, { forwardRef } from 'react';
import { Form } from 'react-bootstrap';

import styles from './Toolbar.module.scss';

const FINISH_TYPES = ['All', 'Top Ten', 'Silver Buckle', 'Finisher', 'DNF'];

const Toolbar = forwardRef(({
  finish,
  gender,
  onChange,
  search,
  year,
  years,
  ...props
}, ref) => {
  return (
    <div
      {...props}
      className={cx(styles.toolbar)}
      ref={ref}>
      <Form.Group>
        <Form.Label>Year</Form.Label>
        <Form.Control
          as="select"
          name="year"
          onChange={onChange}
          value={year}>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Runner Name</Form.Label>
        <Form.Control name="search" onChange={onChange} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Gender</Form.Label>
        <div className={styles.toolbarOptions}>
          {['All', 'Male', 'Female'].map((type) => (
            <Form.Check
              checked={gender === type}
              id={type}
              inline
              key={type}
              label={type}
              name="gender"
              onChange={onChange}
              type="radio"
            />
          ))}
        </div>
      </Form.Group>
      <Form.Group>
        <Form.Label>Finish Place</Form.Label>
        <div className={styles.toolbarOptions}>
          {FINISH_TYPES.map((label) => {
            const value = label.split(' ').join('').toLowerCase();
            return (
              <Form.Check
                checked={finish[value]}
                inline
                key={value}
                label={label}
                name={value}
                onChange={onChange}
                type="checkbox"
              />
            );
          })}
        </div>
      </Form.Group>
    </div>
  );
});

export default Toolbar;
