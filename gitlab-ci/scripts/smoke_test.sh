
#!/bin/bash

# Run Terraform validate
terraform init
terraform validate

# Run Terraform apply (auto-approve)
terraform apply -auto-approve

# Execute Ansible playbooks
ansible-playbook -i inventory.ini playbooks/provision.yml

# Run smoke test against sample app
curl -o /dev/null -s -w "%{http_code}" http://sample-app.example.com || exit 1

exit 0