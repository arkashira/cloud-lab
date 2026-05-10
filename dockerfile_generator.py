import os

class DockerfileGenerator:
    def __init__(self, base_image, requirements):
        self.base_image = base_image
        self.requirements = requirements

    def generate_dockerfile(self):
        dockerfile_content = f"FROM {self.base_image} AS builder\n"
        dockerfile_content += "WORKDIR /app\n"

        for req in self.requirements:
            dockerfile_content += f"RUN {req}\n"

        dockerfile_content += "\nFROM scratch\n"
        dockerfile_content += "WORKDIR /app\n"
        dockerfile_content += "COPY --from=builder /app .\n"

        return dockerfile_content

    def preview_dockerfile(self):
        print("Generated Dockerfile Preview:")
        print(self.generate_dockerfile())

    def save_dockerfile(self, filename="Dockerfile"):
        with open(filename, 'w') as file:
            file.write(self.generate_dockerfile())
        print(f"Dockerfile saved as {filename}")

def main():
    base_image = "python:3.8-slim"
    requirements = [
        "apt-get update && apt-get install -y gcc",
        "pip install flask"
    ]
    
    generator = DockerfileGenerator(base_image, requirements)
    generator.preview_dockerfile()
    generator.save_dockerfile()

if __name__ == "__main__":
    main()