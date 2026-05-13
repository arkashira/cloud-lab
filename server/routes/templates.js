const express = require('express');
const router = express.Router();

// Mocked data store (replace with real DB/service calls as needed)
const templates = [
  { id: '1', name: 'Node.js Starter' },
  { id: '2', name: 'Python Flask Starter' },
];

// Helper to simulate sandbox provisioning
async function provisionSandbox(templateId) {
  // In a real implementation this would trigger async provisioning logic,
  // persist provisioning logs, and return a URL to the sandbox console.
  // Here we mock the behavior with a deterministic URL.
  const sandboxId = `sandbox-${Date.now()}`;
  const consoleUrl = `https://sandbox.example.com/console/${sandboxId}`;
  const logsUrl = `https://sandbox.example.com/logs/${sandboxId}`;
  // Simulate async work
  await new Promise((resolve) => setTimeout(resolve, 100));
  return { consoleUrl, logsUrl };
}

/**
 * GET /api/templates
 * List all templates (existing functionality kept for context)
 */
router.get('/', (req, res) => {
  res.json(templates);
});

/**
 * GET /api/templates/:id
 * Retrieve a single template (existing functionality kept for context)
 */
router.get('/:id', (req, res) => {
  const tmpl = templates.find((t) => t.id === req.params.id);
  if (!tmpl) {
    return res.status(404).json({ error: 'Template not found' });
  }
  res.json(tmpl);
});

/**
 * POST /api/templates/:id/launch
 * Launch a sandbox instance from the specified template.
 *
 * Success response:
 *   200 OK
 *   {
 *     "message": "Sandbox launched successfully",
 *     "sandboxUrl": "<console URL>",
 *     "logsUrl": "<provisioning logs URL>"
 *   }
 *
 * Failure response:
 *   404 Not Found – template does not exist
 *   500 Internal Server Error – provisioning failed
 */
router.post('/:id/launch', async (req, res) => {
  const { id } = req.params;

  // Verify template exists
  const tmpl = templates.find((t) => t.id === id);
  if (!tmpl) {
    return res.status(404).json({ error: 'Template not found' });
  }

  try {
    const { consoleUrl, logsUrl } = await provisionSandbox(id);

    // In a full implementation, provisioning logs would be persisted and
    // associated with the sandbox instance for UI consumption.

    res.status(200).json({
      message: 'Sandbox launched successfully',
      sandboxUrl: consoleUrl,
      logsUrl,
    });
  } catch (err) {
    console.error('Sandbox launch error:', err);
    res.status(500).json({ error: 'Failed to launch sandbox' });
  }
});

module.exports = router;