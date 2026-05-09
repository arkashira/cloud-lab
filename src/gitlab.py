import os
import requests
from typing import Dict, Optional, List

class GitLabAPI:
    """
    Lightweight wrapper around GitLab REST API for IaC repository operations.
    """
    def __init__(self, base_url: str = "https://gitlab.com", token: Optional[str] = None):
        self.base_url = base_url.rstrip("/")
        self.token = token or os.getenv("GITLAB_TOKEN")
        if not self.token:
            raise ValueError("GITLAB_TOKEN environment variable or explicit token required")
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }

    def get_project(self, project_id: str) -> Dict:
        """
        Fetch project metadata by ID or URL-encoded path.
        """
        url = f"{self.base_url}/api/v4/projects/{project_id}"
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        return response.json()

    def create_commit(self, project_id: str, branch: str, commit_message: str, actions: List[Dict]) -> Dict:
        """
        Create a commit in the specified repository.
        actions = [{ action: 'create|update|delete', file_path: str, content: str }]
        """
        url = f"{self.base_url}/api/v4/projects/{project_id}/repository/commits"
        payload = {
            "branch": branch,
            "commit_message": commit_message,
            "actions": actions
        }
        response = requests.post(url, json=payload, headers=self.headers)
        response.raise_for_status()
        return response.json()

    def trigger_pipeline(self, project_id: str, ref: str, variables: Optional[Dict] = None) -> Dict:
        """
        Trigger a CI/CD pipeline manually for a given branch/tag/ref.
        """
        url = f"{self.base_url}/api/v4/projects/{project_id}/trigger/pipeline"
        payload = {"ref": ref}
        if variables:
            payload["variables"] = variables
        response = requests.post(url, json=payload, headers=self.headers)
        response.raise_for_status()
        return response.json()