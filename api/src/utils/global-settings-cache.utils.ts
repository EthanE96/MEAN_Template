import GlobalSettingsModel, { IGlobalSettings } from "../models/global-settings.model";

let cachedSettings: IGlobalSettings | null = null;
let lastLoaded: number | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Get the global settings, using an in-memory cache to reduce DB requests.
 * Will fetch from the DB if cache is empty, expired, or forceRefresh is true.
 * @param forceRefresh If true, always reload from DB.
 * @returns {Promise<IGlobalSettings|null>} The global settings document or null.
 */
export async function getGlobalSettings(
  forceRefresh = false
): Promise<IGlobalSettings | null> {
  const now = Date.now();
  if (cachedSettings && lastLoaded && !forceRefresh && now - lastLoaded < CACHE_TTL_MS) {
    return cachedSettings;
  }

  const settings = await GlobalSettingsModel.findOne().lean();
  if (!settings) {
    return null;
  }

  cachedSettings = settings as IGlobalSettings;
  lastLoaded = now;
  return cachedSettings;
}

/**
 * Clear the in-memory cache for global settings.
 */
export function clearGlobalSettingsCache() {
  cachedSettings = null;
  lastLoaded = null;
}
