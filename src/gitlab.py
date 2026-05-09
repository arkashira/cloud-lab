
import requests

class GitLabAPI:
    def __init__(self, url, token):
        self.url = url
        self.token = token
        self.headers = {'PRIVATE-TOKEN': self.token}

    def create_project(self, name):
        url = f"{self.url}/api/v4/projects"
        data = {'name': name}
        response = requests.post(url, headers=self.headers, json=data)
        response.raise_for_status()  # Raise an exception for bad status codes
        return response.json()

    def get_project(self, id):
        url = f"{self.url}/api/v4/projects/{id}"
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        return response.json()

    def trigger_pipeline(self, project_id, ref='main'):
        url = f"{self.url}/api/v4/projects/{project_id}/trigger/pipeline"
        data = {'ref': ref}
        response = requests.post(url, headers=self.headers, json=data)
        response.raise_for_status()
        return response.json()