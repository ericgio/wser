import React from 'react';
import { Media } from 'react-bootstrap';

import secondsToTime from '../../utils/secondsToTime';

import styles from './RunnerList.module.scss';

// Capitalize the first letter of a string.
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Normalize city names to title case.
function getCity(city) {
  return city
    .toLowerCase()
    .split(' ')
    .map(capitalize)
    .join(' ');
}

function getCountry(country) {
  switch (country) {
    case 'USA':
    case 'CAN':
      return null;
    default:
      return country;
  }
}

function getState({ country, state }) {
  switch (country) {
    case 'USA':
    case 'CAN':
      return state;
    default:
      return null;
  }
}

const RunnerListItem = ({ finishTime, ...props }) => {
  const country = getCountry(props.country);
  const state = getState(props);
  const city = getCity(props.city);

  let place = props.overallPlace;
  let time = secondsToTime(finishTime);
  if (!finishTime) {
    place = 'DNF';
    time = '--:--';
  }

  return (
    <Media
      className={styles.runnerListItem}
      onMouseOut={props.onMouseOut}
      onMouseOver={props.onMouseOver}>
      <div className={styles.place}>
        {place}
      </div>
      <Media.Body>
        <h4 className={styles.row}>
          <div className={styles.rowLeft}>
            {props.name} <small className={styles.bib}>#{props.bib}</small>
          </div>
          <div>
            {time}
          </div>
        </h4>
        <div className={styles.row}>
          <div className={styles.rowLeft}>
            {props.gender}{props.age}
            {!!finishTime && `, GP: ${props.genderPlace}`}
          </div>
          <div>
            {city}, {state} {country}
          </div>
        </div>
      </Media.Body>
    </Media>
  );
};

const RunnerList = ({ onMouseOut, onMouseOver, runners, width }) => {
  const contents = runners.length ?
    runners.map((data) => (
      // Gordy and Cowman apparently both get bib #0, so add first name
      // to the key to create a unique identifier.
      <RunnerListItem
        {...data}
        key={`${data.bib}-${data.firstName}`}
        onMouseOut={onMouseOut}
        onMouseOver={() => onMouseOver(data)}
      />
    )) :
    <div className={styles.noResults}>
      No results.
    </div>;

  return (
    <div
      className={styles.runnerList}
      style={{ width: `${width}px` }}>
      {contents}
    </div>
  );
};

export default RunnerList;
