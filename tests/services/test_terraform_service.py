"""
Comprehensive unit tests for TerraformService.validate_template.

These tests cover various scenarios including:
- Valid template names (case-insensitive).
- Invalid template names.
- Non-string inputs.
- Empty strings.
- Detailed template validation.
- Handling Terraform errors.
"""

import pytest
from unittest.mock import Mock, patch

# Import the service under test
try:
    from cloud_lab.services.terraform_service import TerraformService
except ImportError:
    # If the module path differs, adjust the import accordingly.
    # The tests will fail if TerraformService cannot be imported.
    raise

# Known valid template names (case-insensitive)
VALID_TEMPLATES = {"vpc", "rds", "ecs"}

class TestTerraformService:

    def test_validate_template_valid_names(self):
        """
        validate_template should return True for each known template name.
        """
        service = TerraformService()
        for template in VALID_TEMPLATES:
            assert service.validate_template(template) is True, (
                f"validate_template({template!r}) should return True"
            )

    def test_validate_template_valid_names_case_insensitive(self):
        """
        validate_template should accept template names in any case.
        """
        service = TerraformService()
        for template in VALID_TEMPLATES:
            mixed_case = template.upper() if template == "vpc" else template.title()
            assert service.validate_template(mixed_case) is True, (
                f"validate_template({mixed_case!r}) should return True"
            )

    def test_validate_template_invalid_name(self):
        """
        validate_template should raise ValueError for unknown template names.
        """
        service = TerraformService()
        with pytest.raises(ValueError):
            service.validate_template("unknown-template")

    def test_validate_template_non_string_input(self):
        """
        validate_template should raise TypeError when passed a non-string value.
        """
        service = TerraformService()
        with pytest.raises(TypeError):
            service.validate_template(None)

    def test_validate_template_empty_string(self):
        """
        validate_template should raise ValueError for an empty string.
        """
        service = TerraformService()
        with pytest.raises(ValueError):
            service.validate_template("")

    def test_validate_template_valid_template(self):
        """
        validate_template should return True for a valid detailed template.
        """
        template = {
            'name': 'VPC',
            'description': 'A VPC template',
            'resources': [
                {'type': 'aws_vpc', 'properties': {'cidr_block': '10.0.0.0/16'}}
            ]
        }
        service = TerraformService()
        assert service.validate_template(template) is True, "validate_template should return True for a valid template"

    def test_validate_template_invalid_template(self):
        """
        validate_template should return False for an invalid detailed template.
        """
        template = {
            'name': 'Invalid Template',
            'description': 'An invalid template',
            'resources': [
                {'type': 'invalid_resource', 'properties': {}}
            ]
        }
        service = TerraformService()
        assert service.validate_template(template) is False, "validate_template should return False for an invalid template"

    @patch('cloud_lab.services.terraform_service.Terraform')
    def test_validate_template_terraform_error(self, mock_terraform):
        """
        validate_template should raise an exception when Terraform encounters an error.
        """
        template = {
            'name': 'VPC',
            'description': 'A VPC template',
            'resources': [
                {'type': 'aws_vpc', 'properties': {'cidr_block': '10.0.0.0/16'}}
            ]
        }
        service = TerraformService()
        mock_terraform.return_value.apply.side_effect = Exception('Terraform error')
        with pytest.raises(Exception):
            service.validate_template(template)


if __name__ == '__main__':
    pytest.main()