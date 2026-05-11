import os
import subprocess

class AnsibleExecutor:
    def __init__(self, playbook_path):
        self.playbook_path = playbook_path

    def run_playbook(self):
        try:
            result = subprocess.run(['ansible-playbook', self.playbook_path], capture_output=True, text=True, check=True)
            return result.stdout
        except subprocess.CalledProcessError as e:
            print(f"Playbook execution failed: {e.stderr}")
            return f"Error: {e.stderr}"