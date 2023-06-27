import axios from 'axios';
import { MapCode } from 'constants/map';
import { getDateFromUnix } from 'lib/datetime';
import type MapType from 'types/map';

const api = axios.create({
  baseURL: import.meta.env.VITE_APEX_LEGENDS_API,

  /**
   * Move to `Authorization` header when available.
   *
   * @todo revisit.
   */
  params: {
    auth: import.meta.env.VITE_APEX_LEGENDS_API_SECRET_TOKEN,
  },
});

/**
 * Mapping date: 6/27/24
 */
enum ExternalMapCode {
  broken_moon_rotation,
  kings_canyon_rotation,
  olympus_rotation,
  storm_point_rotation,
  worlds_edge_rotation,
}

interface MapResponse {
  asset?: string;
  code: keyof typeof ExternalMapCode;
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

const MapCodeMapping: Record<keyof typeof ExternalMapCode, MapCode> =
  Object.freeze({
    broken_moon_rotation: MapCode.BrokenMoon,
    kings_canyon_rotation: MapCode.KingsCanyon,
    olympus_rotation: MapCode.Olympus,
    storm_point_rotation: MapCode.StormPoint,
    worlds_edge_rotation: MapCode.WorldsEdge,
  });

export const getMapRotation = (url: string) => {
  return api
    .get<{ current: MapResponse; next: MapResponse }>(url)
    .then(({ data: { current, next } }) => {
      const parseMap = ({ code, end, start }: MapResponse): MapType => ({
        code: MapCodeMapping[code],
        end: getDateFromUnix(end),
        start: getDateFromUnix(start),
      });

      return {
        current: parseMap(current),
        next: parseMap(next),
      };
    });
};

export default api;
