/**
 * Skill Badge Configuration Module
 *
 * Provides runtime configuration for skill-badge certification.
 * Configuration can be overridden via environment variables.
 *
 * Environment Variables:
 *   SKILL_BADGES_ENABLED            - 'true' or 'false'
 *   SKILL_BADGES_TYPES              - comma-separated list of badge types
 *   SKILL_BADGES_<TYPE>_THRESHOLD   - integer threshold per type (e.g., SKILL_BADGES_DEPLOYMENT_THRESHOLD)
 */

const DEFAULT_CONFIG = {
  enabled: true,
  badgeTypes: ['deployment', 'automation', 'security'],
  thresholds: {
    deployment: 5,
    automation: 3,
    security: 2,
  },
};

function parseBoolean(value, defaultValue) {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
}

function parseArray(value, defaultArray) {
  if (!value) return defaultArray;
  return value.split(',').map((v) => v.trim()).filter(Boolean);
}

function parseIntOrDefault(value, defaultValue) {
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Load configuration from environment variables with fallback to defaults.
 * @returns {Object} configuration object
 */
function loadConfig() {
  const enabled = parseBoolean(process.env.SKILL_BADGES_ENABLED, DEFAULT_CONFIG.enabled);
  const badgeTypes = parseArray(process.env.SKILL_BADGES_TYPES, DEFAULT_CONFIG.badgeTypes);

  // Load thresholds: first check for per-type env vars, then fall back to defaults
  const thresholds = {};
  badgeTypes.forEach((type) => {
    const envKey = `SKILL_BADGES_${type.toUpperCase()}_THRESHOLD`;
    const defaultThreshold = DEFAULT_CONFIG.thresholds[type] ?? 1;
    thresholds[type] = parseIntOrDefault(process.env[envKey], defaultThreshold);
  });

  return { enabled, badgeTypes, thresholds };
}

module.exports = loadConfig();