'use strict';

const fs = require('fs');
const google = require('googleapis');

const authClient = require('../google');
const timeToSeconds = require('../../utils/timeToSeconds');

const AID_STATIONS = require('../../constants/aidStations');

const DATA_ROW_START = 2;
const NO_TIME = '--:--';
const SPLIT_COL_START = 10;
const WSER_SHEET_ID = '1qdx6dxAkMOdqDf6SEZMueEJSbEegmqhY6SYLSAh5tNY';
const YEAR = '2017';

/* eslint-disable no-console */
function getTime(row, index) {
  const finishTime = row[1];
  const nextSplit = row[index + 2];

  let time = row[index];
  if (time === NO_TIME) {
    if (
      !finishTime &&
      nextSplit &&
      nextSplit === NO_TIME
    ) {
      // The runner DNF'd and neither this, nor the next split has a time.
      // Assume this is where they dropped.
      return null;
    }

    // There's no time data for this split. Recursively find the last valid
    // split and use that so the data doesn't look too noisy.
    time = getTime(row, index - 2);
  }

  return time == null ? time : time.split('-').pop();
}

// Load client secrets from a local file.
fs.readFile('google_secret.json', (err, content) => (
  authClient(err, content, parseData))
);

function parseData(auth) {
  const sheets = google.sheets('v4');
  const settings = {
    auth: auth,
    spreadsheetId: WSER_SHEET_ID,
    range: YEAR,
  };

  sheets.spreadsheets.values.get(settings, (err, response) => {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }

    const rows = response.values;
    if (rows.length === 0) {
      console.log('No data found.');
      return [];
    }

    const data = parseSheet(rows);

    // Write data to file.
    fs.writeFileSync(
      'modules/client/data/' + YEAR + '.json',
      JSON.stringify(data)
    );
  });
}

function parseSheet(rows) {
  const data = [];

  for (var ii = DATA_ROW_START; ii < rows.length; ii++) {
    let row = rows[ii];
    let splits = [];

    for (var jj = SPLIT_COL_START; jj < row.length; jj+=2) {
      let index = (jj - SPLIT_COL_START) / 2;

      let aidStation = AID_STATIONS[YEAR][index];
      let time = getTime(row, jj);

      if (time == null) {
        // The runner dropped.
        break;
      }

      splits.push({
        distance: aidStation.distance,
        duration: timeToSeconds(time),
        name: aidStation.name,
        position: row[jj+1],
      });
    }

    const firstName = row[3];
    const lastName = row[4];

    data.push({
      overallPlace: +row[0],
      finishTime: timeToSeconds(row[1]),
      bib: row[2],
      firstName,
      lastName,
      name: firstName + ' ' + lastName,
      gender: row[5],
      age: +row[6],
      city: row[7],
      state: row[8],
      country: row[9],
      splits,
    });
  }

  return data;
}
