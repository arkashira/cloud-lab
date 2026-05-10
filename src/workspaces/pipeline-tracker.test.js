const PipelineTracker = require('./pipeline-tracker');
const axios = require('axios');

jest.mock('axios');

describe('PipelineTracker', () => {
  const gitlabUrl = 'https://gitlab.example.com';
  const token = 'test-token';
  const tracker = new PipelineTracker(gitlabUrl, token);
  const workspaceId = 12345;
  const payloadSuccess = {
    project: { id: workspaceId },
    object_attributes: {
      status: 'success',
      sha: 'abc123',
      ref: 'main',
      id: 1,
    },
  };
  const payloadFail = {
    project: { id: workspaceId },
    object_attributes: {
      status: 'failed',
      sha: 'def456',
      ref: 'main',
      id: 2,
    },
  };

  beforeEach(() => {
    tracker.clearHistory(workspaceId);
  });

  it('should handle webhook and updates status', () => {
    tracker.handleWebhook(payloadSuccess);
    const status = tracker.getStatus(workspaceId);
    expect(status).not.toBeNull();
  });

  it('should handle error when fetching pipeline status', async () => {
    const mockResponse = { status: 'success' };
    axios.get.mockRejectedValue(new Error('Network Error'));

    await expect(tracker.getStatus(workspaceId)).rejects.toThrow('Network Error');
  });

  it('should rollback to last successful pipeline', async () => {
    const mockPipelines = [
      { id: 1, status: 'failed' },
      { id: 2, status: 'success' },
      { id: 3, status: 'running' }
    ];
    axios.get.mockResolvedValueOnce({ data: mockPipelines });

    console.log = jest.fn(); // Mock console.log to test output
    const commitSha = await tracker.rollback(workspaceId);
    expect(commitSha).toBe('abc123');
  });

  it('should handle error during rollback', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    await expect(tracker.rollback(workspaceId)).resolves.toBeUndefined();
  });
});