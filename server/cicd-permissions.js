const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// Mock data structure for CI/CD permissions
let cicdPermissions = {
  admins: ['admin@example.com'],
  users: ['user1@example.com', 'user2@example.com'],
  pipelines: {
    'pipeline-1': {
      owners: ['admin@example.com'],
      viewers: ['user1@example.com'],
      editors: ['user2@example.com']
    }
  }
};

// Get all CI/CD permissions (Admin only)
router.get('/permissions', authenticateToken, authorizeAdmin, (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: cicdPermissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch CI/CD permissions',
      error: error.message
    });
  }
});

// Update CI/CD permissions (Admin only)
router.put('/permissions', authenticateToken, authorizeAdmin, (req, res) => {
  try {
    const { admins, users, pipelines } = req.body;
    
    if (admins) cicdPermissions.admins = admins;
    if (users) cicdPermissions.users = users;
    if (pipelines) cicdPermissions.pipelines = pipelines;
    
    res.status(200).json({
      success: true,
      message: 'CI/CD permissions updated successfully',
      data: cicdPermissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update CI/CD permissions',
      error: error.message
    });
  }
});

// Get pipeline-specific permissions
router.get('/permissions/:pipelineId', authenticateToken, (req, res) => {
  try {
    const { pipelineId } = req.params;
    const pipeline = cicdPermissions.pipelines[pipelineId];
    
    if (!pipeline) {
      return res.status(404).json({
        success: false,
        message: 'Pipeline not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: pipeline
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pipeline permissions',
      error: error.message
    });
  }
});

// Update pipeline-specific permissions
router.put('/permissions/:pipelineId', authenticateToken, authorizeAdmin, (req, res) => {
  try {
    const { pipelineId } = req.params;
    const { owners, viewers, editors } = req.body;
    
    if (!cicdPermissions.pipelines[pipelineId]) {
      cicdPermissions.pipelines[pipelineId] = {};
    }
    
    if (owners) cicdPermissions.pipelines[pipelineId].owners = owners;
    if (viewers) cicdPermissions.pipelines[pipelineId].viewers = viewers;
    if (editors) cicdPermissions.pipelines[pipelineId].editors = editors;
    
    res.status(200).json({
      success: true,
      message: `Permissions for pipeline ${pipelineId} updated successfully`,
      data: cicdPermissions.pipelines[pipelineId]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update pipeline permissions',
      error: error.message
    });
  }
});

module.exports = router;