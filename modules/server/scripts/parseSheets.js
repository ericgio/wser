'use strict';

/* eslint-disable no-console */
const fs = require('fs');
const google = require('googleapis');

const authClient = require('../google');
const timeToSeconds = require('../../utils/timeToSeconds');

const {AID_STATIONS, GENDER} = require('../../constants');

const DATA_ROW_START = 2;
const SPLIT_COL_START = 10;
const WSER_SHEET_ID = '1qdx6dxAkMOdqDf6SEZMueEJSbEegmqhY6SYLSAh5tNY';

// Pass the year to parse in as an argument. This assumes the year is thr last
// arg, ie: `npm run data -- 2017`. Anything else will break.
const year = process.argv.pop();

// Load client secrets from a local file.
fs.readFile('google_secret.json', (err, content) => (
  authClient(err, content, parseData))
);

function parseData(auth) {
  const sheets = google.sheets('v4');
  const settings = {
    auth,
    spreadsheetId: WSER_SHEET_ID,
    range: year,
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
      'modules/client/data/' + year + '.json',
      JSON.stringify(data)
    );
  });
}

function parseSheet(rows) {
  const data = [];
  const genderPlaces = {
    [GENDER.MALE]: 0,
    [GENDER.FEMALE]: 0,
  };

  for (let ii = DATA_ROW_START; ii < rows.length; ii++) {
    let row = rows[ii];
    let splits = [];

    for (let jj = SPLIT_COL_START; jj < row.length; jj+=2) {
      let index = (jj - SPLIT_COL_START) / 2;

      let aidStation = AID_STATIONS[year][index];

      // Parse the value to get a valid time.
      let time = row[jj].split('-').filter(t => t && t !== ':').pop();
      if (time) {
        splits.push({
          distance: aidStation.distance,
          duration: timeToSeconds(time),
          name: aidStation.name,
          position: row[jj+1],
        });
      }
    }

    const firstName = row[3];
    const lastName = row[4];
    const finishTime = timeToSeconds(row[1]);
    const gender = row[5];

    // Increment gender place.
    genderPlaces[gender] += 1;

    data.push({
      overallPlace: +row[0],
      finishTime,
      bib: row[2],
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      gender,
      genderPlace: finishTime ? genderPlaces[gender] : null,
      age: +row[6],
      city: row[7],
      state: row[8],
      country: row[9],
      splits,
    });
  }

  return data;
}
