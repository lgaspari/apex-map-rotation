import axios from 'axios';
import { MapCode } from 'constants/map';
import { getDateFromUnix } from 'lib/datetime';
import type Map from 'types/map';
import type { MapRotation, MapRotationPerMode } from 'types/map-rotation';

const apexLegendsApi = axios.create({
  baseURL: import.meta.env.VITE_APEX_LEGENDS_API,

  /**
   * There's a CORS error when trying to use the `Authorization` header instead
   * of the `auth` param.
   *
   * @todo report this issue to the API Maintainers so they can correct it.
   */
  params: {
    auth: import.meta.env.VITE_APEX_LEGENDS_API_SECRET_TOKEN,
  },
});

/**
 * Mapping date: 6/27/23
 */
enum ExternalMapCode {
  broken_moon_rotation,
  kings_canyon_rotation,
  olympus_rotation,
  storm_point_rotation,
  worlds_edge_rotation,
}

/**
 * Mapping date: 3/12/24 (not all modes are considered)
 */
interface ExternalMapResponse {
  DurationInMinutes: number;
  DurationInSecs: number;
  asset: string;
  code: keyof typeof ExternalMapCode;
  end: number;
  map: string;
  readableDate_end: string;
  readableDate_start: string;
  remainingMins?: number;
  remainingSecs?: number;
  remainingTimer?: string;
  start: number;
}

export interface ExternalMapRotationResponse {
  current: ExternalMapResponse;
  next: ExternalMapResponse;
}

/**
 * There's an edge-case for the Apex Legends API where if you send a request
 * right when the map changes, it may return an empty array instead of the
 * proper response.
 */
type ExternalMapRotationPerModeResponse =
  | {
      battle_royale: ExternalMapRotationResponse;
      ranked: ExternalMapRotationResponse;
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

const parseExternalMapResponse = ({
  code,
  end,
  start,
}: ExternalMapResponse): Map => ({
  code: MapCodeMapping[code],
  end: getDateFromUnix(end).toISOString(),
  start: getDateFromUnix(start).toISOString(),
});

const parseExternalMapRotationResponse = ({
  current,
  next,
}: ExternalMapRotationResponse): MapRotation => ({
  current: parseExternalMapResponse(current),
  next: parseExternalMapResponse(next),
});

export const getMapRotationPerMode = (
  url: string
): Promise<MapRotationPerMode> => {
  return apexLegendsApi
    .get<ExternalMapRotationPerModeResponse>(url)
    .then(({ data }) => {
      /**
       * Edge-cases that only happen when the data is requested in the very same
       * second the map has changed.
       *
       * 1. On PUBS & RANKED schedule: `[]`
       * 2. On PUBS schedule: `{ battle_royale: undefined, ranked: { current, next } }`
       * 3. On RANKED schedule: `TBD`
       *
       * @todo report this issue to the API Maintainers so they can correct it.
       */
      if (
        Array.isArray(data) ||
        Array.isArray(data.battle_royale) ||
        Array.isArray(data.ranked)
      ) {
        throw new Error(
          `API returned data with invalid format (response: ${JSON.stringify(
            data
          )})`
        );
      }

      return {
        pubs: parseExternalMapRotationResponse(data.battle_royale),
        ranked: parseExternalMapRotationResponse(data.ranked),
      };
    });
};
