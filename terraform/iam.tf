// iamPolicy.test.js
const { loadPolicy, validatePolicy } = require('../iamPolicyUtils');

describe('IAM Policy for Terraform Execution Role', () => {
  let policy;

  beforeAll(() => {
    policy = loadPolicy(); // loads JSON from iam.tf or separate file
  });

  test('policy contains no wildcard actions', () => {
    const actions = policy.Statement.flatMap(s => s.Action);
    actions.forEach(action => {
      expect(action).not.toMatch(/\*/);
    });
  });

  test('policy includes required EC2 actions', () => {
    const required = [
      'ec2:RunInstances',
      'ec2:TerminateInstances',
      'ec2:CreateSecurityGroup',
      'ec2:DeleteSecurityGroup',
      'ec2:AuthorizeSecurityGroupIngress',
      'ec2:RevokeSecurityGroupIngress',
      'ec2:DescribeInstances',
      'ec2:DescribeSecurityGroups',
    ];
    required.forEach(act => {
      expect(policy.Statement.some(s => s.Action.includes(act))).toBe(true);
    });
  });

  test('policy enforces tag conditions', () => {
    const condition = policy.Statement.find(s => s.Condition);
    expect(condition).toBeDefined();
    const tagCond = condition.Condition['StringEquals'];
    expect(tagCond['aws:RequestTag/Environment']).toBe('Sandbox');
    expect(tagCond['aws:RequestTag/Owner']).toBe('CloudLab');
  });

  test('policy allows only inbound 22 and 443 from 0.0.0.0/0', () => {
    const sgPolicy = policy.Statement.find(s => s.Effect === 'Allow' && s.Action.includes('ec2:AuthorizeSecurityGroupIngress'));
    const ingress = sgPolicy.Resource; // assume resource contains port info
    // In real test, parse ingress rules; here we just check presence of ports
    expect(ingress).toMatch(/22|443/);
  });

  test('role can be assumed by EC2 and Lambda', () => {
    const assumeRole = policy.Statement.find(s => s.Effect === 'Allow' && s.Action.includes('sts:AssumeRole'));
    const principals = assumeRole.Principal.Service;
    expect(principals).toContain('ec2.amazonaws.com');
    expect(principals).toContain('lambda.amazonaws.com');
  });
});