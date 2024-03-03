import type Map from 'types/map';

export interface MapRotation {
  current: Map;
  next: Map;
}

export interface MapRotationPerMode {
  pubs: MapRotation;
  ranked: MapRotation;
}
