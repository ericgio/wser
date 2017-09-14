const AID_STATIONS_BASE = [
  {distance: 0, name: 'Squaw Valley (Start)'},
  {distance: 10.3, name: 'Lyon Ridge'},
  {distance: 15.8, name: 'Red Star Ridge'},
  {distance: 24.4, name: 'Duncan Canyon'},
  {distance: 30.3, name: 'Robinson Flat'},
  {distance: 34.4, name: 'Miller\'s Defeat'},
  {distance: 38.0, name: 'Dusty Corners'},
  {distance: 43.3, name: 'Last Chance'},
  {distance: 47.8, name: 'Devil\'s Thumb'},
  {distance: 52.9, name: 'El Dorado Creek'},
  {distance: 55.7, name: 'Michigan Bluff'},
  {distance: 62.0, name: 'Foresthill'},
  {distance: 65.7, name: 'Dardanelles (Cal 1)'},
  {distance: 70.7, name: 'Peachstone (Cal 2)'},
  {distance: 73.0, name: 'Ford\'s Bar (Cal 3)'},
  {distance: 78.0, name: 'Rucky Chucky'},
  {distance: 79.8, name: 'Green Gate'},
  {distance: 85.2, name: 'Auburn Lake Trails'},
  {distance: 89.9, name: 'Brown\'s Bar'},
  {distance: 93.5, name: 'Highway 49'},
  {distance: 96.8, name: 'No Hands Bridge'},
  {distance: 98.9, name: 'Robie Point'},
  {distance: 100.2, name: 'Placer High School (Finish)'},
];

// Brown's Bar and Highway 49 were replaced by Quarry Road and Pointed Rocks.
const AS_2017 = [...AID_STATIONS_BASE];
AS_2017.splice(18, 2,
  {distance: 90.7, name: 'Quarry Road'},
  {distance: 94.3, name: 'Pointed Rocks'}
);

const AID_STATIONS = {
  '2017': AS_2017,
  '2016': AID_STATIONS_BASE,
  '2015': AID_STATIONS_BASE,
  '2014': AID_STATIONS_BASE,
  '2013': AID_STATIONS_BASE,
  '2012': AID_STATIONS_BASE,
};

const GENDER = {
  FEMALE: 'F',
  MALE: 'M',
};

const GENDER_TO_LABEL = {
  [GENDER.MALE]: 'Male',
  [GENDER.FEMALE]: 'Female',
};

const SEC_PER_HR = 3600;
const SILVER_BUCKLE_TIME = 24 * SEC_PER_HR;

module.exports = {
  AID_STATIONS,
  GENDER,
  GENDER_TO_LABEL,
  SEC_PER_HR,
  SILVER_BUCKLE_TIME,
};
