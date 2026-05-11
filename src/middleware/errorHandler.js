module.exports = (err, req, res, next) => {
  // If you want to expose validation errors differently:
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  // Generic 500
  res.status(500).json({ error: 'Internal server error' });
};