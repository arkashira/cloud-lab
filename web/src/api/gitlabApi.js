import axios from 'axios';

const gitlabApi = axios.create({
  baseURL: 'https://gitlab.com/api/v4',
});

gitlabApi.getOAuthToken = async () => {
  // Replace with actual client_id and redirect_uri
  const clientId = 'your_client_id';
  const redirectUri = 'your_redirect_uri';
  const authUrl = `https://gitlab.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token`;

  // Redirect user to GitLab OAuth page
  window.location.href = authUrl;

  // Handle the callback after successful authentication
  const urlParams = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = urlParams.get('access_token');

  return { data: { access_token: accessToken } };
};

gitlabApi.connectRepository = async (accessToken, repoUrl) => {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const response = await gitlabApi.get(repoUrl, { headers });
  // Assuming the response contains the necessary information to pull the code into the workspace
  console.log('Repository details:', response.data);

  // Logic to pull the code into the workspace and display pull requests in the UI
  // This part should be implemented based on the specific requirements of the cloud-lab application
};

export default gitlabApi;