function timeToSeconds(time) {
  if (!time) {
    return 0;
  }

  return time
    .split(':')
    .reverse()
    .reduce((seconds, value, idx) => seconds + value * (60 ** idx), 0);
}

module.exports = timeToSeconds;
