const request = require('supertest');
const app = require('../../app');
const { Template } = require('../../models/template');
const { Sandbox } = require('../../models/sandbox');

describe('POST /api/templates/:id/launch', () => {
  let template;
  let sandbox;

  beforeEach(async () => {
    template = await Template.create({ name: 'Test Template', description: 'A test template' });
    sandbox = await Sandbox.create({ templateId: template.id, status: 'provisioning' });
  });

  afterEach(async () => {
    await Template.deleteMany({});
    await Sandbox.deleteMany({});
  });

  it('should launch a template and return success toast with sandbox console link', async () => {
    const response = await request(app)
      .post(`/api/templates/${template.id}/launch`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('Template launched successfully');
    expect(response.body.sandboxLink).toBeDefined();
  });

  it('should have sandbox provisioning logs visible in the UI', async () => {
    // Assuming there's an endpoint to get sandbox logs
    const response = await request(app)
      .get(`/api/sandboxes/${sandbox.id}/logs`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.logs).toBeDefined();
    expect(response.body.logs.length).toBeGreaterThan(0);
  });
});