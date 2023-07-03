import type { MapCode } from 'constants/map';

export default interface Map {
  code: MapCode;
  end: ISOString;
  start: ISOString;
}
