import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserSettings() {
  const [notificationPreferences, setNotificationPreferences] = useState({
    sharedEnvironmentUpdates: true
  });

  useEffect(() => {
    axios.get('/api/user/notification-preferences')
      .then(response => {
        setNotificationPreferences(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handlePreferenceChange = (event) => {
    const { name, checked } = event.target;
    setNotificationPreferences((prevPreferences) => ({
      ...prevPreferences,
      [name]: checked
    }));
    axios.patch('/api/user/notification-preferences', {
      [name]: checked
    })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      <h2>Notification Preferences</h2>
      <label>
        <input
          type="checkbox"
          name="sharedEnvironmentUpdates"
          checked={notificationPreferences.sharedEnvironmentUpdates}
          onChange={handlePreferenceChange}
        />
        Receive notifications for shared environment updates
      </label>
    </div>
  );
}

export default UserSettings;