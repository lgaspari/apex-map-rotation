import axios from 'axios';
import { MapCode } from 'constants/map';
import { getDateFromUnix } from 'lib/datetime';
import type Map from 'types/map';
import type MapRotation from 'types/map-rotation';

const api = axios.create({
  baseURL: import.meta.env.VITE_APEX_LEGENDS_API,

  /**
   * There's a CORS error when trying to use the `Authorization` header instead
   * of the `auth` param.
   *
   * @todo move to `Authorization` header when available.
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

interface ExternalMapResponse {
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

/**
 * There's an edge-case for the Apex Legends API where if you send a request
 * right when the map changes, it may return an empty array instead of the
 * proper response.
 */
type ExternalMapRotationResponse =
  | {
      current: ExternalMapResponse;
      next: ExternalMapResponse;
    }
  | [];

const MapCodeMapping: Record<keyof typeof ExternalMapCode, MapCode> =
  Object.freeze({
    broken_moon_rotation: MapCode.BrokenMoon,
    kings_canyon_rotation: MapCode.KingsCanyon,
    olympus_rotation: MapCode.Olympus,
    storm_point_rotation: MapCode.StormPoint,
    worlds_edge_rotation: MapCode.WorldsEdge,
  });

export const getMapRotation = (url: string): Promise<MapRotation> => {
  return api.get<ExternalMapRotationResponse>(url).then(({ data }) => {
    if (Array.isArray(data)) {
      throw new Error(
        `API returned data with invalid format (response: ${JSON.stringify(
          data
        )})`
      );
    }

    const { current, next } = data;

    const parseMap = ({ code, end, start }: ExternalMapResponse): Map => ({
      code: MapCodeMapping[code],
      end: getDateFromUnix(end).toISOString(),
      start: getDateFromUnix(start).toISOString(),
    });

    return {
      current: parseMap(current),
      next: parseMap(next),
    };
  });
};
