type DateObject = import('dayjs').Dayjs;

/**
 * Date time standard format.
 */
type ISOString = string;

/**
 * Unit of time.
 */
type Milliseconds = number;

interface ImportMetaEnv {
  VITE_APEX_LEGENDS_API: string;
  VITE_APEX_LEGENDS_API_SECRET_TOKEN: string;
  VITE_APEX_LEGENDS_API_MAP_ROTATION_ENDPOINT: string;
  VITE_APEX_LEGENDS_LOGO_URL: string;
  VITE_APEX_LEGENDS_MAP_BROKEN_MOON_URL: string;
  VITE_APEX_LEGENDS_MAP_KINGS_CANYON_URL: string;
  VITE_APEX_LEGENDS_MAP_OLYMPUS_URL: string;
  VITE_APEX_LEGENDS_MAP_STORM_POINT_URL: string;
  VITE_APEX_LEGENDS_MAP_WORLDS_EDGE_URL: string;
}
