const express = require('express');
const router = express.Router();
const User = require('../users/models');

router.get('/user/notification-preferences', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.notificationPreferences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve notification preferences' });
  }
});

router.patch('/user/notification-preferences', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.notificationPreferences = req.body;
    await user.save();
    res.json(user.notificationPreferences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update notification preferences' });
  }
});

module.exports = router;