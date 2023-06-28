import dayjs, { type ConfigType, type Dayjs } from 'dayjs';
import duration, { type Duration } from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

// configure extensions
dayjs.extend(duration);
dayjs.extend(relativeTime);

/**
 * Formats the `Dayjs` or `Duration` objects into string.
 */
export function format(date: Dayjs | Duration, format: string) {
  return date.format(format);
}

/**
 * Returns the Dayjs object based on the date sent by parameter.
 */
export function getDate(date?: ConfigType) {
  return dayjs(date);
}

/**
 * Returns the Dayjs object based on the unix timestamp sent by parameter.
 */
export function getDateFromUnix(unix: number) {
  return dayjs.unix(unix);
}

export function getDiffToNow(from: ConfigType) {
  return getDate(from).diff();
}

export function getDuration(time: number) {
  return dayjs.duration(time);
}

export function humanizeDuration(duration: Duration) {
  return duration.humanize();
}
