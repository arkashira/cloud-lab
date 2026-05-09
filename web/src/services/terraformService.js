import axios from 'axios';

let pollInterval = null;

/**
 * Fetch the current Terraform state from the backend API.
 * @returns {Promise<Object>} Resolves with the state object.
 */
export async function getTerraformState() {
  try {
    const response = await axios.get('/api/terraform/state');
    return response.data;
  } catch (error) {
    console.error('Error fetching Terraform state:', error);
    throw error;
  }
}

/**
 * Subscribe to real-time Terraform state updates using polling.
 * @param {function(Object):void} callback Invoked with the latest state on each poll.
 * @param {number} [intervalMs=5000] Polling interval in milliseconds.
 * @returns {function():void} Unsubscribe function to stop polling.
 */
export function subscribeToTerraformState(callback, intervalMs = 5000) {
  // Immediately fetch once
  getTerraformState()
    .then(callback)
    .catch(console.error);

  // Set up periodic polling
  pollInterval = setInterval(() => {
    getTerraformState()
      .then(callback)
      .catch(console.error);
  }, intervalMs);

  // Return unsubscribe function
  return function unsubscribe() {
    if (pollInterval) {
      clearInterval(pollInterval);
      pollInterval = null;
    }
  };
}