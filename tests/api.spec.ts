import { describe, expect, test, vi } from 'vitest';
import { MapCode, MapImage, MapName } from 'constants/map';
import {
  ExternalMapCode,
  type ExternalMapResponse,
  type ExternalMapRotationPerModeResponse,
  type ExternalMapRotationResponse,
  getMapRotationPerMode,
  parseExternalMapResponse,
  parseExternalMapRotationPerModeResponse,
  parseExternalMapRotationResponse,
} from 'lib/api';

const mockExternalMapResponse = (data: Partial<ExternalMapResponse> = {}) =>
  ({
    asset: 'Only relevant for fallback value',
    code: 'kings_canyon_rotation',
    DurationInMinutes: -1,
    DurationInSecs: -1,
    end: 1729735200,
    map: 'Only relevant for fallback value',
    readableDate_end: 'Not used',
    readableDate_start: 'Not used',
    remainingMins: -1,
    remainingSecs: -1,
    remainingTimer: 'Not used',
    start: 1729729800,
    ...data,
  }) satisfies ExternalMapResponse;

const mockExternalMapRotationResponse = (
  data: Partial<ExternalMapRotationResponse> = {}
) =>
  ({
    current: mockExternalMapResponse(),
    next: mockExternalMapResponse(),
    ...data,
  }) satisfies ExternalMapRotationResponse;

const mockExternalMapRotationPerModeResponse = (
  data?: ExternalMapRotationPerModeResponse
) =>
  data || {
    battle_royale: mockExternalMapRotationResponse(),
    ranked: mockExternalMapRotationResponse(),
  };

describe('parseExternalMapResponse()', () => {
  test.for(
    Object.entries({
      broken_moon_rotation: MapCode.BrokenMoon,
      edistrict_rotation: MapCode.EDistrict,
      kings_canyon_rotation: MapCode.KingsCanyon,
      olympus_rotation: MapCode.Olympus,
      storm_point_rotation: MapCode.StormPoint,
      worlds_edge_rotation: MapCode.WorldsEdge,
    } satisfies Record<ExternalMapCode, MapCode>) as Array<
      [ExternalMapCode, MapCode]
    >
  )(
    "should map response using external code '%s' to internal code '%s'",
    ([externalCode, internalCode]) => {
      expect(
        parseExternalMapResponse(
          mockExternalMapResponse({ code: externalCode })
        )
      ).toMatchObject({
        code: internalCode,
        image: MapImage[internalCode],
        name: MapName[internalCode],
      });
    }
  );

  test('should fallback to external `asset` and `map` values if mapping is not defined for a new code', () => {
    const response = mockExternalMapResponse({
      asset: '/path/to/remote/asset',
      code: 'invalid_code' as ExternalMapCode,
      map: 'Map Not Mapped',
    });

    expect(parseExternalMapResponse(response)).toMatchObject({
      code: undefined,
      image: response.asset,
      name: response.map,
    });
  });

  test('should parse `end` and `start` values from unix to iso string', () => {
    expect(
      parseExternalMapResponse(
        mockExternalMapResponse({
          end: 1687539600,
          start: 1687534200,
        })
      )
    ).toMatchObject({
      end: '2023-06-23T17:00:00.000Z',
      start: '2023-06-23T15:30:00.000Z',
    });
  });
});

describe('parseExternalMapRotationResponse()', () => {
  test('should parse map rotation response for `current` and `next` maps', () => {
    const current = mockExternalMapResponse();
    const next = mockExternalMapResponse();

    expect(
      parseExternalMapRotationResponse(
        mockExternalMapRotationResponse({ current, next })
      )
    ).toEqual({
      current: parseExternalMapResponse(current),
      next: parseExternalMapResponse(next),
    });
  });
});

describe('parseExternalMapRotationPerModeResponse()', () => {
  test("[edge-case #1] should throw error when `response` is an array (10am o'clock Pacific Time)", () => {
    expect(() =>
      parseExternalMapRotationPerModeResponse(
        mockExternalMapRotationPerModeResponse([])
      )
    ).toThrowError();
  });

  test("[edge-case #2] should throw error when `response.battle_royale` is not defined (any pubs change o'clock)", () => {
    expect(() =>
      parseExternalMapRotationPerModeResponse(
        mockExternalMapRotationPerModeResponse({
          battle_royale: undefined,
          ranked: mockExternalMapRotationResponse(),
        })
      )
    ).toThrowError();
  });

  test('should parse pubs and ranked map rotation responses', () => {
    const battle_royale = mockExternalMapRotationResponse();
    const ranked = mockExternalMapRotationResponse();

    expect(
      parseExternalMapRotationPerModeResponse(
        mockExternalMapRotationPerModeResponse({ battle_royale, ranked })
      )
    ).toEqual({
      pubs: parseExternalMapRotationResponse(battle_royale),
      ranked: parseExternalMapRotationResponse(ranked),
    });
  });
});

describe('getMapRotationPerMode()', () => {
  const api = vi.hoisted(() => ({ get: vi.fn() }));
  const axios = vi.hoisted(() => ({ create: vi.fn(() => api) }));
  vi.mock('axios', () => {
    return { default: axios };
  });

  test('should call map rotation API using an axios instance', () => {
    const data = mockExternalMapRotationPerModeResponse();
    api.get.mockResolvedValueOnce({ data });

    const url = '/api/get-map-rotation';
    expect(getMapRotationPerMode(url)).resolves.toEqual(
      parseExternalMapRotationPerModeResponse(data)
    );
    expect(axios.create).toHaveBeenCalled();
    expect(api.get).toHaveBeenCalledWith(url);
  });
});
