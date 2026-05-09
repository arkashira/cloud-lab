import os
from typing import Optional
from .gitlab import GitLabAPI

class IaCEnvironment:
    """
    Represents a shared Infrastructure-as-Code environment connected to GitLab.
    """
    def __init__(
        self,
        gitlab_project_id: str,
        gitlab_branch: str = "main",
        gitlab_url: str = "https://gitlab.com",
        gitlab_token: Optional[str] = None
    ):
        self.project_id = gitlab_project_id
        self.branch = gitlab_branch
        self.gitlab = GitLabAPI(base_url=gitlab_url, token=gitlab_token)

    def sync_config(self, config_path: str, commit_message: str = "Update IaC configuration"):
        """
        Sync local IaC configuration files to the GitLab repository.
        """
        if not os.path.isdir(config_path):
            raise ValueError(f"Config path {config_path} does not exist or is not a directory")

        actions = []
        for root, _, files in os.walk(config_path):
            for file in files:
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, config_path).replace("\\", "/")
                with open(file_path, 'r') as f:
                    content = f.read()
                actions.append({
                    "action": "update",
                    "file_path": rel_path,
                    "content": content
                })

        # Commit to GitLab
        commit_result = self.gitlab.create_commit(
            project_id=self.project_id,
            branch=self.branch,
            commit_message=commit_message,
            actions=actions
        )
        return commit_result

    def deploy(self, commit_message: str = "Apply infrastructure changes"):
        """
        Deploy current IaC state by syncing config and triggering pipeline.
        """
        # Sync local config
        config_dir = os.getenv("IAC_CONFIG_DIR", "./iac-config")
        commit_result = self.sync_config(config_dir, commit_message)

        # Trigger CI/CD pipeline
        pipeline_result = self.gitlab.trigger_pipeline(
            project_id=self.project_id,
            ref=self.branch,
            variables={
                "TRIGGERED_BY": "cloud-lab",
                "IAC_COMMIT_SHA": commit_result["id"]
            }
        )
        return {
            "commit": commit_result,
            "pipeline": pipeline_result
        }