import unittest
from dockerfile_generator import DockerfileGenerator

class TestDockerfileGenerator(unittest.TestCase):
    def setUp(self):
        self.base_image = "python:3.8-slim"
        self.requirements = [
            "apt-get update && apt-get install -y gcc",
            "pip install flask"
        ]
        self.generator = DockerfileGenerator(self.base_image, self.requirements)

    def test_generate_dockerfile(self):
        dockerfile_content = self.generator.generate_dockerfile()
        self.assertIn(f"FROM {self.base_image} AS builder", dockerfile_content)
        self.assertIn("WORKDIR /app", dockerfile_content)
        for req in self.requirements:
            self.assertIn(req, dockerfile_content)
        self.assertIn("FROM scratch", dockerfile_content)
        self.assertIn("COPY --from=builder /app .", dockerfile_content)

    def test_preview_dockerfile(self):
        from io import StringIO
        import sys
        captured_output = StringIO()
        sys.stdout = captured_output

        self.generator.preview_dockerfile()
        output = captured_output.getvalue().strip()

        sys.stdout = sys.__stdout__
        self.assertIn("Generated Dockerfile Preview:", output)
        self.assertIn(f"FROM {self.base_image} AS builder", output)
        self.assertIn("WORKDIR /app", output)
        for req in self.requirements:
            self.assertIn(req, output)
        self.assertIn("FROM scratch", output)
        self.assertIn("COPY --from=builder /app .", output)

    def test_save_dockerfile(self):
        filename = "test_Dockerfile"
        self.generator.save_dockerfile(filename)
        self.assertTrue(os.path.exists(filename))
        os.remove(filename)

if __name__ == '__main__':
    unittest.main()