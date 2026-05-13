const request = require('supertest');
const express = require('express');
const templatesRouter = require('../../server/routes/templates');

describe('Templates API - Launch Endpoint', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    // Mount the router at the expected base path
    app.use('/api/templates', templatesRouter);
  });

  test('POST /api/templates/:id/launch returns success with sandbox URLs', async () => {
    const response = await request(app).post('/api/templates/1/launch');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Sandbox launched successfully');
    expect(response.body).toHaveProperty('sandboxUrl');
    expect(response.body).toHaveProperty('logsUrl');

    // Basic sanity check on URLs
    expect(response.body.sandboxUrl).toMatch(/^https:\/\/sandbox\.example\.com\/console\/sandbox-/);
    expect(response.body.logsUrl).toMatch(/^https:\/\/sandbox\.example\.com\/logs\/sandbox-/);
  });

  test('POST /api/templates/:id/launch with unknown template returns 404', async () => {
    const response = await request(app).post('/api/templates/999/launch');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Template not found');
  });
});