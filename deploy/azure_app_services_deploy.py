import subprocess
import logging
import yaml
from dataclasses import dataclass
from pathlib import Path
from typing import Any


class DeploymentError(Exception):
    """Raised when an Azure deployment command fails with a user‑friendly message."""
    pass


@dataclass
class AzureAppServiceConfig:
    resource_group: str
    location: str
    app_service_plan: str
    sku: str
    runtime: str

    @staticmethod
    def load(config_path: str | Path) -> "AzureAppServiceConfig":
        """Load configuration from a YAML file."""
        path = Path(config_path).expanduser()
        if not path.is_file():
            raise FileNotFoundError(f"Azure App Service config not found at {path}")

        with path.open("r", encoding="utf-8") as f:
            data: dict[str, Any] = yaml.safe_load(f) or {}

        required_keys = ["resource_group", "location", "app_service_plan", "sku", "runtime"]
        missing = [k for k in required_keys if k not in data]
        if missing:
            raise ValueError(f"Missing required config keys in {path}: {', '.join(missing)}")

        return AzureAppServiceConfig(
            resource_group=data["resource_group"],
            location=data["location"],
            app_service_plan=data["app_service_plan"],
            sku=data["sku"],
            runtime=data["runtime"],
        )


class AzureAppServiceDeployer:
    """
    Handles creation and deployment of Azure App Service projects using the Azure CLI.
    All commands are executed via ``subprocess.run``; errors are translated into
    ``DeploymentError`` with actionable messages.
    """

    def __init__(self, config_path: str = "/opt/axentx/cloud-lab/deploy/azure_app_services_config.yaml"):
        self.config = AzureAppServiceConfig.load(config_path)
        self.logger = logging.getLogger(self.__class__.__name__)

    # --------------------------------------------------------------------- #
    # Public API
    # --------------------------------------------------------------------- #

    def create_resource_group(self) -> str:
        """Create the Azure resource group defined in the config."""
        cmd = [
            "az", "group", "create",
            "--name", self.config.resource_group,
            "--location", self.config.location,
        ]
        return self._run_cmd(cmd)

    def create_app_service_plan(self) -> str:
        """Create an App Service plan (Linux) as defined in the config."""
        cmd = [
            "az", "appservice", "plan", "create",
            "--name", self.config.app_service_plan,
            "--resource-group", self.config.resource_group,
            "--sku", self.config.sku,
            "--is-linux",
        ]
        return self._run_cmd(cmd)

    def create_web_app(self, app_name: str) -> str:
        """Create a new Web App under the configured resource group and plan."""
        cmd = [
            "az", "webapp", "create",
            "--resource-group", self.config.resource_group,
            "--plan", self.config.app_service_plan,
            "--name", app_name,
            "--runtime", self.config.runtime,
        ]
        return self._run_cmd(cmd)

    def deploy_zip(self, app_name: str, zip_path: str) -> str:
        """
        Deploy a zipped application package to the specified Web App.
        ``zip_path`` must point to a local .zip file.
        """
        cmd = [
            "az", "webapp", "deployment", "source", "config-zip",
            "--resource-group", self.config.resource_group,
            "--name", app_name,
            "--src", zip_path,
        ]
        return self._run_cmd(cmd)

    # --------------------------------------------------------------------- #
    # Internals
    # --------------------------------------------------------------------- #

    def _run_cmd(self, cmd: list[str]) -> str:
        """Execute an Azure CLI command, logging output and translating errors."""
        self.logger.debug(f"Executing command: {' '.join(cmd)}")
        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                check=True,
            )
            self.logger.info(f"Command succeeded: {' '.join(cmd)}")
            return result.stdout.strip()
        except subprocess.CalledProcessError as exc:
            self.logger.error(
                f"Command failed ({exc.returncode}): {' '.join(cmd)}\nStderr: {exc.stderr}"
            )
            raise DeploymentError(self._interpret_error(exc.stderr))

    @staticmethod
    def _interpret_error(stderr: str) -> str:
        """Map common Azure CLI errors to friendly messages."""
        lowered = stderr.lower()
        if "resourcegroupnotfound" in lowered:
            return "Resource group not found. Ensure it exists or create it first."
        if "appserviceplannotfound" in lowered:
            return "App Service plan not found. Verify the plan name in the config."
        if "authenticationfailed" in lowered:
            return "Authentication failed. Run `az login` and verify your credentials."
        if "conflict" in lowered and "already exists" in lowered:
            return "A resource with the same name already exists. Choose a different name."
        if "zip file not found" in lowered:
            return "Deployment package not found. Verify the zip_path points to a valid .zip file."
        # Fallback – return raw stderr for unexpected cases
        return f"Deployment failed: {stderr.strip()}"