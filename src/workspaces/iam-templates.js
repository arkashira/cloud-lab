const iamTemplates = {
  basic: {
    name: 'Basic Access',
    description: 'Minimal permissions for basic workspace access',
    policy: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: [
            'ec2:DescribeInstances',
            'ec2:DescribeSecurityGroups',
            'ec2:DescribeSubnets',
            'ec2:DescribeVpcs'
          ],
          Resource: '*'
        }
      ]
    }
  },
  developer: {
    name: 'Developer Access',
    description: 'Standard permissions for development work',
    policy: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: [
            'ec2:DescribeInstances',
            'ec2:DescribeSecurityGroups',
            'ec2:DescribeSubnets',
            'ec2:DescribeVpcs',
            'ec2:RunInstances',
            'ec2:TerminateInstances',
            's3:GetObject',
            's3:PutObject',
            's3:DeleteObject'
          ],
          Resource: '*'
        }
      ]
    }
  },
  admin: {
    name: 'Administrator Access',
    description: 'Full administrative permissions',
    policy: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: [
            'ec2:*',
            's3:*',
            'iam:*',
            'cloudformation:*',
            'lambda:*'
          ],
          Resource: '*'
        }
      ]
    }
  },
  readonly: {
    name: 'Read-Only Access',
    description: 'View-only permissions for monitoring',
    policy: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: [
            'ec2:Describe*',
            's3:List*',
            'iam:List*',
            'cloudformation:Describe*'
          ],
          Resource: '*'
        }
      ]
    }
  }
};

module.exports = { iamTemplates };