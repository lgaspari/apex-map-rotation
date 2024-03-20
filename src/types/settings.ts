import { type MapCode } from 'constants/map';
import { type Threshold } from 'constants/threshold';

export default interface Settings {
  notifications: {
    maps: Array<MapCode>;
    prompt?: boolean;
    threshold: Threshold;
  };
}
