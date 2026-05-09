// Using Jest for testing

describe('VPC module', () => {
  test('creates a VPC with CIDR /16', () => {
    // Load the Terraform configuration
    const config = loadTerraformConfig('/opt/axentx/cloud-lab/templates/terraform/vpc/');

    // Validate the VPC CIDR block
    expect(config.resources[0].body.cidr_block).toEqual('10.0.0.0/16');
  });

  test('provisions two public and two private subnets', () => {
    // Load the Terraform configuration
    const config = loadTerraformConfig('/opt/axentx/cloud-lab/templates/terraform/vpc/');

    // Validate the number of subnets
    expect(config.resources.filter(r => r.type === 'aws_subnet').length).toEqual(4);
  });

  test('outputs VPC ID, subnet IDs, and route table IDs', () => {
    // Load the Terraform configuration
    const config = loadTerraformConfig('/opt/axentx/cloud-lab/templates/terraform/vpc/');

    // Validate the outputs
    expect(config.outputs).toHaveLength(4);
    expect(config.outputs[0].value_type).toEqual('string');
    expect(config.outputs[1].value_type).toEqual('list');
    expect(config.outputs[2].value_type).toEqual('list');
    expect(config.outputs[3].value_type).toEqual('string');
  });

  test('module passes terraform validate and terraform plan without errors', () => {
    // Run terraform validate and plan
    const validateResult = runTerraformCommand('validate', '/opt/axentx/cloud-lab/templates/terraform/vpc/');
    const planResult = runTerraformCommand('plan', '/opt/axentx/cloud-lab/templates/terraform/vpc/');

    // Validate the results
    expect(validateResult.exitCode).toEqual(0);
    expect(planResult.exitCode).toEqual(0);
  });
});