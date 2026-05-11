const express = require('express');
const sandboxesRouter = require('./routes/sandboxes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use('/api/sandboxes', sandboxesRouter);
app.use(errorHandler);