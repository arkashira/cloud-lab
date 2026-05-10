const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

class ConfigVersionControl {
  constructor(dataRoot = './data') {
    this.dataRoot = path.resolve(dataRoot);
    this.ensureDataRoot();
  }

  /**
   * Ensures the data root directory exists
   */
  ensureDataRoot() {
    if (!fs.existsSync(this.dataRoot)) {
      fs.mkdirSync(this.dataRoot, { recursive: true });
    }
  }

  /**
   * Gets the directory for a specific user/config group
   * @param {string} configGroup - User ID or config group identifier
   * @returns {string}
   */
  getConfigDir(configGroup) {
    const dir = path.join(this.dataRoot, configGroup);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  }

  /**
   * Generates a unique version ID combining timestamp and content hash
   * @param {object} config - The configuration object
   * @returns {string}
   */
  generateVersionId(config) {
    const timestamp = Date.now();
    const contentHash = crypto.createHash('sha256')
      .update(JSON.stringify(config))
      .digest('hex')
      .slice(0, 8);
    return `${timestamp}-${contentHash}`;
  }

  /**
   * Saves a configuration with automatic versioning
   * @param {string} configGroup - Identifier for the configuration group
   * @param {object} config - The configuration object to save
   * @param {string} [configName='default'] - Optional name for the config
   * @returns {string} The generated version ID
   */
  saveConfig(configGroup, config, configName = 'default') {
    const configDir = this.getConfigDir(`${configGroup}/${configName}`);
    const versionId = this.generateVersionId(config);
    const filePath = path.join(configDir, `${versionId}.json`);
    
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf8');
    return versionId;
  }

  /**
   * Lists all saved versions for a configuration group
   * @param {string} configGroup - Identifier for the configuration group
   * @param {string} [configName='default'] - Optional name for the config
   * @returns {Array<{versionId: string, timestamp: number, size: number}>}
   */
  listVersions(configGroup, configName = 'default') {
    const configDir = this.getConfigDir(`${configGroup}/${configName}`);
    if (!fs.existsSync(configDir)) return [];

    const files = fs.readdirSync(configDir)
      .filter(f => f.endsWith('.json'))
      .map(f => {
        const [timestampStr] = f.split('-');
        const stats = fs.statSync(path.join(configDir, f));
        return {
          versionId: f.replace('.json', ''),
          timestamp: parseInt(timestampStr, 10),
          size: stats.size
        };
      })
      .sort((a, b) => b.timestamp - a.timestamp);
    
    return files;
  }

  /**
   * Retrieves a specific version of a configuration
   * @param {string} configGroup - Identifier for the configuration group
   * @param {string} versionId - The version ID to retrieve
   * @param {string} [configName='default'] - Optional name for the config
   * @returns {object|null}
   */
  getVersion(configGroup, versionId, configName = 'default') {
    const configDir = this.getConfigDir(`${configGroup}/${configName}`);
    const filePath = path.join(configDir, `${versionId}.json`);
    
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  }

  /**
   * Restores a previous configuration version by creating a new version
   * @param {string} configGroup - Identifier for the configuration group
   * @param {string} versionId - The version ID to restore
   * @param {string} [configName='default'] - Optional name for the config
   * @returns {string|null} New version ID or null if not found
   */
  restoreVersion(configGroup, versionId, configName = 'default') {
    const config = this.getVersion(configGroup, versionId, configName);
    if (!config) return null;
    
    // Create a new version to maintain history
    return this.saveConfig(configGroup, config, configName);
  }

  /**
   * Gets the latest version of a configuration
   * @param {string} configGroup - Identifier for the configuration group
   * @param {string} [configName='default'] - Optional name for the config
   * @returns {object|null}
   */
  getCurrentConfig(configGroup, configName = 'default') {
    const versions = this.listVersions(configGroup, configName);
    if (versions.length === 0) return null;
    
    return this.getVersion(configGroup, versions[0].versionId, configName);
  }

  /**
   * Deletes a specific version
   * @param {string} configGroup - Identifier for the configuration group
   * @param {string} versionId - The version ID to delete
   * @param {string} [configName='default'] - Optional name for the config
   * @returns {boolean}
   */
  deleteVersion(configGroup, versionId, configName = 'default') {
    const configDir = this.getConfigDir(`${configGroup}/${configName}`);
    const filePath = path.join(configDir, `${versionId}.json`);
    
    if (!fs.existsSync(filePath)) return false;
    fs.unlinkSync(filePath);
    return true;
  }

  /**
   * Gets the most recent version ID for a configuration group
   * @param {string} configGroup - Identifier for the configuration group
   * @param {string} [configName='default'] - Optional name for the config
   * @returns {string|null}
   */
  getLatestVersionId(configGroup, configName = 'default') {
    const versions = this.listVersions(configGroup, configName);
    return versions.length > 0 ? versions[0].versionId : null;
  }
}

module.exports = ConfigVersionControl;