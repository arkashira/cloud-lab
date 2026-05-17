import yaml
import re

class AzureAppServicesSearch:
    def __init__(self, config_path):
        with open(config_path, 'r') as f:
            self.config = yaml.safe_load(f)
        self.resources = self.config.get('resources', [])

    def search(self, query):
        """Search resources by title, tags, and content with case-insensitive matching"""
        results = []
        normalized_query = query.lower()
        
        for resource in self.resources:
            # Check if query appears in title, tags, or content
            if (self._matches_query(resource.get('title', ''), normalized_query) or
                any(self._matches_query(tag, normalized_query) for tag in resource.get('tags', [])) or
                self._matches_query(resource.get('content', ''), normalized_query)):
                results.append(resource)
        
        return results

    def _matches_query(self, text, query):
        """Check if query appears in text using case-insensitive partial match"""
        return query in text.lower()

# Test case
import unittest

class TestAzureAppServicesSearch(unittest.TestCase):
    def test_search_functionality(self):
        test_config = {
            'resources': [
                {
                    'title': 'Azure App Service Basics',
                    'tags': ['beginner', 'azure', 'app-service'],
                    'content': 'Learn the fundamentals of Azure App Services...'
                },
                {
                    'title': 'Advanced App Service Configuration',
                    'tags': ['advanced', 'configuration', 'azure'],
                    'content': 'Master advanced configuration options...'
                }
            ]
        }
        
        with open('/tmp/test_config.yaml', 'w') as f:
            yaml.dump(test_config, f)
            
        searcher = AzureAppServicesSearch('/tmp/test_config.yaml')
        
        # Test exact match in title
        results = searcher.search('Azure App Service Basics')
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['title'], 'Azure App Service Basics')
        
        # Test partial match in tags
        results = searcher.search('advanced')
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['title'], 'Advanced App Service Configuration')
        
        # Test case-insensitive search
        results = searcher.search('APP')
        self.assertEqual(len(results), 2)

if __name__ == '__main__':
    unittest.main()