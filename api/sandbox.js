const express = require('express');
const SandboxModel = require('../models/sandbox');

const router = express.Router();

// Endpoint to create a new sandbox
router.post('/create', async (req, res) => {
    const { templateType } = req.body;

    // Validate template type
    const validTemplates = ['VPC-only', '3-tier app', 'microservices'];
    if (!validTemplates.includes(templateType)) {
        return res.status(400).json({ error: 'Invalid template type' });
    }

    try {
        // Create a new sandbox instance
        const sandbox = new SandboxModel({ templateType });
        await sandbox.save(); // Save the initial state with status 'creating'

        // Simulate sandbox creation process
        setTimeout(async () => {
            sandbox.status = 'ready'; // Update status to 'ready'
            await sandbox.save(); // Persist the updated status
            res.status(201).json({ id: sandbox._id, status: sandbox.status });
        }, 10000); // Simulating 10 seconds creation time

        // Notify user (in real implementation, this could be a notification system)
        console.log(`Sandbox creation initiated for template: ${templateType}`);
    } catch (error) {
        console.error('Error creating sandbox:', error);
        res.status(500).json({ error: 'Failed to create sandbox' });
    }
});

module.exports = router;