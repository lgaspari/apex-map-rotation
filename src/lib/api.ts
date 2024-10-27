import axios from 'axios';
import { MapCode, MapImage, MapName } from 'constants/map';
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
 * Mapping date: 18/10/24
 */
export type ExternalMapCode =
  | 'broken_moon_rotation'
  | 'edistrict_rotation'
  | 'kings_canyon_rotation'
  | 'olympus_rotation'
  | 'storm_point_rotation'
  | 'worlds_edge_rotation';

/**
 * Mapping date: 3/12/24 (not all modes are considered)
 */
export interface ExternalMapResponse {
  DurationInMinutes: number;
  DurationInSecs: number;
  asset: string;
  code: ExternalMapCode;
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
export type ExternalMapRotationPerModeResponse =
  | {
      battle_royale?: ExternalMapRotationResponse;
      ranked: ExternalMapRotationResponse;
    }
  | [];

const MapCodeMapping: Record<ExternalMapCode, MapCode> = Object.freeze({
  broken_moon_rotation: MapCode.BrokenMoon,
  edistrict_rotation: MapCode.EDistrict,
  kings_canyon_rotation: MapCode.KingsCanyon,
  olympus_rotation: MapCode.Olympus,
  storm_point_rotation: MapCode.StormPoint,
  worlds_edge_rotation: MapCode.WorldsEdge,
});

export const parseExternalMapResponse = (map: ExternalMapResponse): Map => {
  const code: MapCode | undefined = MapCodeMapping[map.code];

  return {
    code,
    end: getDateFromUnix(map.end).toISOString(),
    start: getDateFromUnix(map.start).toISOString(),
    // If internal code exists, we use internal asset, otherwise we rely on external asset.
    image: code ? MapImage[code] : map.asset,
    // If internal code exists, we use internal name, otherwise we rely on external name.
    name: code ? MapName[code] : map.map,
  };
};

export const parseExternalMapRotationResponse = (
  mapRotation: ExternalMapRotationResponse
): MapRotation => ({
  current: parseExternalMapResponse(mapRotation.current),
  next: parseExternalMapResponse(mapRotation.next),
});

export const parseExternalMapRotationPerModeResponse = (
  response: ExternalMapRotationPerModeResponse
) => {
  /**
   * Edge-cases that only happen when the data is requested in the very same
   * second the map has changed.
   *
   * 1. On PUBS & RANKED schedule: `[]`
   * 2. On PUBS schedule: `{ ranked: { current, next } }`
   * 3. On RANKED schedule: N/A
   *
   * @todo report this issue to the API Maintainers so they can correct it.
   */
  if (Array.isArray(response) || !response.battle_royale) {
    throw new Error(
      `API returned data with invalid format (response: ${JSON.stringify(
        response
      )})`
    );
  }

  return {
    pubs: parseExternalMapRotationResponse(response.battle_royale),
    ranked: parseExternalMapRotationResponse(response.ranked),
  };
};

export const getMapRotationPerMode = (
  url: string
): Promise<MapRotationPerMode> => {
  return apexLegendsApi
    .get<ExternalMapRotationPerModeResponse>(url)
    .then(({ data }) => parseExternalMapRotationPerModeResponse(data));
};
