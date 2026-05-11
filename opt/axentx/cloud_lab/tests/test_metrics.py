import unittest
from ..services.metrics import get_distribution_metrics

class TestMetricsService(unittest.TestCase):
    def test_returns_all_when_no_status(self):
        all_metrics = get_distribution_metrics()
        self.assertTrue(len(all_metrics) > 0)
        for metric in all_metrics:
            self.assertIn("id", metric)
            self.assertIn("status", metric)
            self.assertIn("latency_ms", metric)
            self.assertIn("cache_hit_ratio", metric)
            self.assertIn("created_at", metric)

    def test_filter_by_status(self):
        active = get_distribution_metrics("active")
        inactive = get_distribution_metrics("inactive")

        # Verify we get some results for each status
        self.assertTrue(len(active) > 0)
        self.assertTrue(len(inactive) > 0)

        # Verify case insensitivity
        self.assertEqual(active, get_distribution_metrics("ACTIVE"))
        self.assertEqual(inactive, get_distribution_metrics("INACTIVE"))

        # Verify all returned items match the requested status
        for metric in active:
            self.assertEqual(metric["status"], "active")
        for metric in inactive:
            self.assertEqual(metric["status"], "inactive")

    def test_unknown_status_returns_empty(self):
        self.assertEqual(get_distribution_metrics("unknown"), [])

    def test_data_consistency(self):
        # Verify repeated calls return the same data
        first_call = get_distribution_metrics()
        second_call = get_distribution_metrics()
        self.assertEqual(first_call, second_call)

if __name__ == "__main__":
    unittest.main()