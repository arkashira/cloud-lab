const mongoose = require('mongoose');

const sandboxSchema = new mongoose.Schema({
    templateType: {
        type: String,
        required: true,
        enum: ['VPC-only', '3-tier app', 'microservices']
    },
    status: {
        type: String,
        default: 'creating',
        enum: ['creating', 'ready', 'active']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Sandbox', sandboxSchema);