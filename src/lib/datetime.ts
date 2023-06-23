import dayjs, { type Dayjs } from 'dayjs';
import duration, { type Duration } from 'dayjs/plugin/duration';

// configure extensions
dayjs.extend(duration);

export function format(date: Dayjs | Duration, format: string) {
  return date.format(format);
}

export function getDuration(from: Dayjs, to: Dayjs) {
  return dayjs.duration(to.diff(from));
}

export function fromMilliseconds(date: number) {
  return dayjs(date);
}

export function fromUnix(unix: number) {
  return dayjs.unix(unix);
}
