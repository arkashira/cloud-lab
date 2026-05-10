import unittest
from unittest.mock import patch
from terraform import main

class TestTags(unittest.TestCase):
    @patch('terraform.main')
    def test_tags(self, mock_main):
        mock_main.return_value = True
        result = main()
        self.assertEqual(result, True)

if __name__ == '__main__':
    unittest.main()