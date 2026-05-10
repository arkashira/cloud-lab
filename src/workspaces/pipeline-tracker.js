const axios = require('axios');
const EventEmitter = require('events');

class PipelineTracker extends EventEmitter {
  constructor(gitlabUrl, token) {
    super();
    this.gitlabUrl = gitlabUrl;
    this.token = token;
    // Map<workspaceId, Array<{status, commitSha, ref, timestamp}>>
    this._history = new Map();
  }

  /**
   * Process a GitLab CI webhook payload.
   *
   * @param {Object} payload - The JSON payload from GitLab.
   * @returns {void}
   */
  handleWebhook(payload) {
    if (!payload || !payload.project || !payload.object_attributes) {
      // Invalid payload – ignore
      return;
    }

    const workspaceId = payload.project.id;
    const { status, sha, ref, id: pipelineId } = payload.object_attributes;

    const entry = {
      status,
      commitSha: sha,
      ref,
      pipelineId,
      timestamp: Date.now(),
    };

    // Append to history
    const history = this._history.get(workspaceId) || [];
    history.push(entry);
    // Keep only the latest 100 entries to avoid unbounded growth
    if (history.length > 100) {
      history.shift();
    }
    this._history.set(workspaceId, history);

    // Emit an event for UI or other listeners
    this.emit('pipelineUpdated', workspaceId, entry);
  }

  /**
   * Get the most recent pipeline status for a workspace.
   *
   * @param {number|string} workspaceId
   * @returns {Object|null} Latest pipeline entry or null if none.
   */
  async getStatus(workspaceId) {
    const history = this._history.get(workspaceId);
    if (!history || history.length === 0) return null;
    const response = await axios.get(`${this.gitlabUrl}/api/v4/projects/${workspaceId}/pipelines/${history[history.length - 1].pipelineId}`, {
      headers: {
        'PRIVATE-TOKEN': this.token
      }
    });
    return {
      status: response.data.status,
      commitSha: history[history.length - 1].commitSha,
      ref: history[history.length - 1].ref,
      pipelineId: history[history.length - 1].pipelineId,
    };
  }

  /**
   * Find the last successful pipeline commit SHA for a workspace.
   *
   * @param {number|string} workspaceId
   * @returns {string|null} Commit SHA or null if none found.
   */
  getLastSuccessfulCommit(workspaceId) {
    const history = this._history.get(workspaceId);
    if (!history) return null;
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].status === 'success') {
        return history[i].commitSha;
      }
    }
    return null;
  }

  /**
   * Rollback to the last successful pipeline commit.
   *
   * @param {number|string} workspaceId
   * @returns {string|null} Commit SHA to rollback to, or null if none.
   */
  async rollback(workspaceId) {
    const commitSha = this.getLastSuccessfulCommit(workspaceId);
    if (!commitSha) return null;

    // In a real system, this would trigger a git checkout or deployment.
    // Here we simply emit a rollback event for listeners.
    this.emit('rollbackRequested', workspaceId, commitSha);
    return commitSha;
  }

  /**
   * Clear history for a workspace (useful for tests).
   *
   * @param {number|string} workspaceId
   */
  clearHistory(workspaceId) {
    this._history.delete(workspaceId);
  }
}

module.exports = PipelineTracker;