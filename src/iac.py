
import os
import yaml
from gitlab import GitLabAPI

class IaCManager:
    def __init__(self, gitlab_api):
        self.gitlab_api = gitlab_api
        self.config_file = 'iac_config.yaml'

    def save_config(self, config, project_id):
        # Save config to a file (e.g., using YAML)
        with open(self.config_file, 'w') as f:
            yaml.dump(config, f)

        # Commit and push changes to GitLab
        os.system(f"git add {self.config_file}")
        os.system(f"git commit -m 'Update IaC config'")
        os.system(f"git push origin main")

        # Trigger GitLab CI/CD pipeline
        self.gitlab_api.trigger_pipeline(project_id)

    def load_config(self):
        # Load config from the file
        with open(self.config_file, 'r') as f:
            return yaml.safe_load(f)