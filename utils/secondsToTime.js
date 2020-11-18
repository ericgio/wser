export default function secondsToTime(secs) {
  const seconds = parseInt(secs, 10);

  let h = Math.floor(seconds / 3600);
  let m = Math.floor((seconds - (h * 3600)) / 60);
  let s = seconds - (h * 3600) - (m * 60);

  h = h < 10 ? `0${h}` : h;
  m = m < 10 ? `0${m}` : m;
  s = s < 10 ? `0${s}` : s;

  return `${h}:${m}:${s}`;
}
