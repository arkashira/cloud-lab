def display_troubleshooting_guide():
    print("Accessing Troubleshooting Guide...")
    with open('/opt/axentx/cloud-lab/troubleshooting-guide.md', 'r') as file:
        guide_content = file.read()
    print(guide_content)

if __name__ == "__main__":
    display_troubleshooting_guide()