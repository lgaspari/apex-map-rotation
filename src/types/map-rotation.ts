/**
 * Mapping date: 6/24/24
 */
export default interface MapRotation {
  asset?: string;
  code: string;
  DurationInMinutes: number;
  DurationInSecs: number;
  end: number;
  map: string;
  readableDate_start: string;
  readableDate_end: string;
  remainingMins?: number;
  remainingSecs?: number;
  remainingTimer?: string;
  start: number;
}
