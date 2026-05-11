/**
 * Client-side Skill Badge Configuration Helper
 *
 * Fetches the current skill badge configuration from the server.
 * The server should expose an endpoint at `/api/skill-badges-config`
 * that returns the same shape as the server config.
 */

/**
 * Fetch skill badge configuration from the server.
 * @returns {Promise<Object>} Configuration object with enabled, badgeTypes, and thresholds
 */
export async function fetchSkillBadgesConfig() {
  const response = await fetch('/api/skill-badges-config', {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch skill badge config: ${response.status}`);
  }

  return response.json();
}

// Default configuration for fallback/initial render
export const defaultConfig = {
  enabled: true,
  badgeTypes: ['deployment', 'automation', 'security'],
  thresholds: {
    deployment: 5,
    automation: 3,
    security: 2,
  },
};

export default fetchSkillBadgesConfig;