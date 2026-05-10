const express = require('express');
const router = express.Router();

// Mock function - replace with actual database call
const fetchQuotaData = async (workspaceId) => {
  // Implement your database logic here
  return { workspaceId, limit: 1000, used: 500 };
};

router.get('/:workspaceId/quota', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    
    if (!workspaceId) {
      return res.status(400).json({ error: 'Workspace ID is required' });
    }

    const quotaData = await fetchQuotaData(workspaceId);
    res.json(quotaData);
  } catch (error) {
    console.error('Error fetching quota:', error);
    res.status(500).json({ error: 'Failed to fetch quota data' });
  }
});

module.exports = router;