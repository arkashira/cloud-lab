import click
import yaml
import os
from typing import Dict, List, Optional

# --- Configuration Constants ---
VALID_REGIONS = {
    "us-east-1": {"eks_supported": True},
    "us-west-1": {"eks_supported": True},
    "eu-west-1": {"eks_supported": False},
    "ap-southeast-1": {"eks_supported": True},
}

VALID_INSTANCE_TYPES = ["t2.micro", "t3.small", "m5.large", "m5.xlarge"]
VALID_RDS_ENGINES = ["postgres", "mysql", "aurora", "sqlserver"]

CONFIG_FILE = "config.yaml"
DASHBOARD_URL = "https://console.aws.amazon.com/cloudwatch/home?region={region}#dashboards:name=cloud-lab-dashboard"


# --- Click Parameter Validators ---
def validate_region(ctx, param, value):
    if value not in VALID_REGIONS:
        raise click.BadParameter(f"Region '{value}' is not supported.")
    return value


def validate_instance_type(ctx, param, value):
    if value not in VALID_INSTANCE_TYPES:
        raise click.BadParameter(f"Instance type '{value}' is not supported.")
    return value


def validate_rds_engine(ctx, param, value):
    if value not in VALID_RDS_ENGINES:
        raise click.BadParameter(f"RDS engine '{value}' is not supported.")
    return value


def validate_eks_inclusion(region, include_eks):
    if include_eks and not VALID_REGIONS[region]["eks_supported"]:
        raise click.ClickException(
            f"EKS is not supported in region '{region}'."
        )


@click.group()
def cli():
    """Main entry point for the cloud-lab CLI."""
    pass


@cli.command()
@click.option(
    "--wizard",
    is_flag=True,
    help="Run interactive wizard to generate configuration.",
)
def launch(wizard: bool):
    """Launch a mock environment using generated configuration."""
    if not wizard:
        click.echo("Non-wizard launch is not yet implemented.")
        return

    config = {
        "region": None,
        "ec2_instance_type": None,
        "rds_engine": None,
        "include_eks": False,
    }

    # 1. Prompt for AWS region
    config["region"] = prompt_for_region()

    # 2. Prompt for EC2 instance type
    config["ec2_instance_type"] = prompt_for_instance_type()

    # 3. Prompt for RDS engine
    config["rds_engine"] = prompt_for_rds_engine()

    # 4. Prompt for EKS inclusion
    config["include_eks"] = prompt_for_eks_inclusion(config["region"])

    # 5. Validate selections
    if not validate_selections(config):
        click.echo("Validation failed. Please run the wizard again.")
        return

    # 6. Write config to file
    write_config_to_file(config)

    # 7. Display summary URL
    display_summary_url(config["region"])


def prompt_for_region() -> str:
    """Prompt the user to select an AWS region."""
    click.echo("Available AWS regions:")
    for i, (region, data) in enumerate(VALID_REGIONS.items(), 1):
        click.echo(f"{i}. {region} (EKS supported: {data['eks_supported']})")
    choice = click.prompt("Select a region by number", type=int)
    return list(VALID_REGIONS.keys())[choice - 1]


def prompt_for_instance_type() -> str:
    """Prompt the user to select an EC2 instance type."""
    click.echo("Available EC2 instance types:")
    for i, instance_type in enumerate(VALID_INSTANCE_TYPES, 1):
        click.echo(f"{i}. {instance_type}")
    choice = click.prompt("Select an instance type by number", type=int)
    return VALID_INSTANCE_TYPES[choice - 1]


def prompt_for_rds_engine() -> str:
    """Prompt the user to select an RDS engine."""
    click.echo("Available RDS engines:")
    for i, engine in enumerate(VALID_RDS_ENGINES, 1):
        click.echo(f"{i}. {engine}")
    choice = click.prompt("Select an RDS engine by number", type=int)
    return VALID_RDS_ENGINES[choice - 1]


def prompt_for_eks_inclusion(region: str) -> bool:
    """Prompt the user to include EKS in the configuration."""
    if not VALID_REGIONS[region]["eks_supported"]:
        click.echo(f"EKS is not supported in {region}.")
        return False
    choice = click.prompt("Include EKS? (y/n)", type=str).lower()
    return choice == "y"


def validate_selections(config: Dict) -> bool:
    """Validate the user's selections."""
    # Basic validation
    if not all(config.values()):
        return False
    return True


def write_config_to_file(config: Dict):
    """Write the configuration to a YAML file."""
    with open(CONFIG_FILE, "w") as file:
        yaml.dump(config, file, default_flow_style=False)


def display_summary_url(region: str):
    """Display the summary URL to the user."""
    click.echo(f"Configuration complete. Summary URL: {DASHBOARD_URL.format(region=region)}")


if __name__ == "__main__":
    cli()