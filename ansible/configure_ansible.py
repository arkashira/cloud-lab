import os

def configure_ansible():
    # Create the inventory file
    inventory_file = "/opt/axentx/cloud-lab/ansible/inventory.ini"
    with open(inventory_file, "w") as f:
        f.write("[all]\n")
        f.write("localhost ansible_connection=local\n\n")
        f.write("[web]\n")
        f.write("localhost ansible_host=localhost\n\n")
        f.write("[db]\n")
        f.write("localhost ansible_host=localhost\n\n")
        f.write("[all:vars]\n")
        f.write("ansible_user=root\n")
        f.write("ansible_password=password\n")

    # Configure Ansible
    os.system("ansible --version")

configure_ansible()