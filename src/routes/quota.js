const express = require('express');
const router = express.Router();

// GET quota for workspace
router.get('/:workspaceId/quota', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    
    if (!workspaceId) {
      return res.status(400).json({ error: 'workspaceId is required' });
    }

    const quotaData = await fetchQuotaData(workspaceId);
    
    if (!quotaData) {
      return res.status(404).json({ error: 'Quota data not found' });
    }

    res.json(quotaData);
  } catch (error) {
    console.error('Error fetching quota:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update quota for workspace
router.put('/:workspaceId/quota', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const{ name, value } = req.body;

    if (!workspaceId || !name || value === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const updatedQuota = await updateQuotaData(workspaceId, { name, value });
    res.json(updatedQuota);
  } catch (error) {
    console.error('Error updating quota:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;