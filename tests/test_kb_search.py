import unittest
from backend.routes.kb_search import app

class KbSearchTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_kb_search_empty_query(self):
        response = self.app.get('/api/kb_search?query=')
        self.assertEqual(response.status_code, 400)

    def test_kb_search_valid_query(self):
        response = self.app.get('/api/kb_search?query=error')
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json, list)

if __name__ == '__main__':
    unittest.main()