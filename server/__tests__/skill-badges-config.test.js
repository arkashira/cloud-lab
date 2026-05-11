/**
 * @jest-environment node
 */
const path = require('path');

describe('Skill Badges Config', () => {
  const ORIGINAL_ENV = { ...process.env };

  afterEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  test('loads default configuration when no env vars set', () => {
    const config = require('../skill-badges-config');
    expect(config.enabled).toBe(true);
    expect(config.badgeTypes).toEqual(['deployment', 'automation', 'security']);
    expect(config.thresholds).toEqual({
      deployment: 5,
      automation: 3,
      security: 2,
    });
  });

  test('overrides enabled flag via environment', () => {
    process.env.SKILL_BADGES_ENABLED = 'false';
    jest.resetModules();
    const config = require('../skill-badges-config');
    expect(config.enabled).toBe(false);
  });

  test('overrides badge types via environment', () => {
    process.env.SKILL_BADGES_TYPES = 'gold,silver,bronze';
    jest.resetModules();
    const config = require('../skill-badges-config');
    expect(config.badgeTypes).toEqual(['gold', 'silver', 'bronze']);
  });

  test('overrides thresholds per badge type via environment', () => {
    process.env.SKILL_BADGES_TYPES = 'deployment,security';
    process.env.SKILL_BADGES_DEPLOYMENT_THRESHOLD = '10';
    process.env.SKILL_BADGES_SECURITY_THRESHOLD = '4';
    jest.resetModules();
    const config = require('../skill-badges-config');
    expect(config.badgeTypes).toEqual(['deployment', 'security']);
    expect(config.thresholds).toEqual({
      deployment: 10,
      security: 4,
    });
  });

  test('uses default threshold for unspecified badge types', () => {
    process.env.SKILL_BADGES_TYPES = 'deployment,custom';
    jest.resetModules();
    const config = require('../skill-badges-config');
    expect(config.thresholds.deployment).toBe(5); // default
    expect(config.thresholds.custom).toBe(1); // fallback default
  });

  test('handles invalid boolean env var gracefully', () => {
    process.env.SKILL_BADGES_ENABLED = 'invalid';
    jest.resetModules();
    const config = require('../skill-badges-config');
    expect(config.enabled).toBe(true); // falls back to default
  });
});