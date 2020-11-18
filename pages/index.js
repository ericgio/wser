import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';

import RunnerList from '../components/RunnerList';
import SplitsChart from '../components/SplitsChart/index';
import Toolbar from '../components/Toolbar/index';

import dataByYear from '../data';

import { GENDER, SEC_PER_HOUR, SILVER_BUCKLE_TIME } from '../constants';

import '../styles/Index.module.css';

const useResizeObserver = (
  containerRef,
  initialSize = { height: 0, width: 0 }
) => {
  const [size, setSize] = useState(initialSize);

  useEffect(() => {
    const containerElem = containerRef.current;

    if (!containerElem) {
      return;
    }

    const observer = new ResizeObserver(() => {
      setSize({
        height: containerElem.clientHeight,
        width: containerElem.clientWidth,
      });
    });

    observer.observe(containerElem);

    // eslint-disable-next-line consistent-return
    return () => observer.unobserve(containerElem);
  }, [containerRef]);

  return size;
};

const INITIAL_STATE = {
  active: null,
  finish: {
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

const Index = () => {
  const [active, setActive] = useState(null);
  const [finish, setFinish] = useState(INITIAL_STATE.finish);
  const [gender, setGender] = useState('All');
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('2017');

  const resizeRef = useRef(null);
  const { height, width } = useResizeObserver(resizeRef);

  // Progressively filter out data.
  const filterData = (row) => {
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
      default:
        break;
    }

    const { all, dnf, finisher, silverbuckle, topten } = finish;

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
  };

  const handleChange = (e) => {
    const { checked, id, name, value } = e.target;

    let newFinish = {};
    let hasChecked = false;

    switch (name) {
      case 'gender':
        setGender(id);
        break;
      case 'search':
        setSearch(value);
        break;
      case 'year':
        setYear(value);
        break;
      case 'all':
        // Reset the finish type filters when clicking 'all'.
        setFinish(INITIAL_STATE.finish);
        break;
      case 'topten':
      case 'silverbuckle':
      case 'finisher':
      case 'dnf':
        newFinish = {
          ...finish,
          [name]: checked,
        };

        // Check if any types besides 'all' have been checked.
        Object.keys(newFinish).forEach((key) => {
          if (key === 'all' || hasChecked) {
            return;
          }
          hasChecked = newFinish[key];
        });

        setFinish({ ...newFinish, all: !hasChecked });
        break;
      default:
        break;
    }
  };

  const handleRunnerMouseOver = (data) => {
    if (active !== data.bib) {
      setActive(data);
    }
  };

  const dataForYear = dataByYear[year];
  const filteredData = dataForYear.filter(filterData);

  return (
    <div className="app-page">
      <Toolbar
        finish={finish}
        gender={gender}
        onChange={handleChange}
        search={search}
        style={{
          padding: `${PADDING_V}px ${PADDING_H}px`,
        }}
        year={year}
        years={Object.keys(dataByYear).reverse()}
      />
      <div className="app-data" ref={resizeRef}>
        <div
          className="app-chart"
          style={{ padding: `0 0 ${PADDING_V}px ${PADDING_H}px` }}>
          <SplitsChart
            active={active}
            data={filteredData}
            height={height - PADDING_V}
            medianTime={d3.median(
              dataForYear,
              (d) => d.finishTime || 30 * SEC_PER_HOUR
            )}
            width={width - SIDEBAR_WIDTH - PADDING_H}
            year={year}
          />
        </div>
        <RunnerList
          onMouseOut={(e) => setActive(null)}
          onMouseOver={handleRunnerMouseOver}
          runners={filteredData}
          width={SIDEBAR_WIDTH}
        />
      </div>
    </div>
  );
};

export default Index;
