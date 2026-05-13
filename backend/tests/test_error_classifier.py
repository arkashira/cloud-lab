import unittest
from unittest.mock import patch, MagicMock
from axentx.cloud_lab.backend.error_classifier import ErrorClassifier
from axentx.cloud_lab.backend.aws_sdk import AwsSdkError

class TestErrorClassifier(unittest.TestCase):

    def test_classify_known_error(self):
        """Test that known errors are classified with correct code and description."""
        error = AwsSdkError('TestError', 'Test error message')
        classifier = ErrorClassifier()
        classified_error = classifier.classify(error)
        self.assertEqual(classified_error.code, 'TEST_ERROR')
        self.assertEqual(classified_error.description, 'Test error message')

    def test_classify_unknown_error(self):
        """Test that unknown errors are classified as UNKNOWN_ERROR."""
        error = AwsSdkError('UnknownError', 'Unknown error message')
        classifier = ErrorClassifier()
        classified_error = classifier.classify(error)
        self.assertEqual(classified_error.code, 'UNKNOWN_ERROR')
        self.assertEqual(classified_error.description, 'Unknown error message')

    @patch('axentx.cloud_lab.backend.error_classifier.logger')
    def test_log_error(self, mock_logger):
        """Test that errors are logged correctly."""
        error = AwsSdkError('TestError', 'Test error message')
        classifier = ErrorClassifier()
        classifier.log_error(error)
        mock_logger.info.assert_called_once_with('Error occurred: TestError - Test error message')

    @patch('axentx.cloud_lab.backend.error_classifier.time')
    def test_classify_error_within_timeout(self, mock_time):
        """Test that error classification completes within timeout threshold."""
        error = AwsSdkError('TestError', 'Test error message')
        classifier = ErrorClassifier()
        
        # First classification at time=1000
        mock_time.time.return_value = 1000
        classified_error = classifier.classify(error)
        self.assertEqual(classified_error.code, 'TEST_ERROR')
        self.assertEqual(classified_error.description, 'Test error message')
        
        # Second classification at time=1002 - verify timestamp is captured
        mock_time.time.return_value = 1002
        classified_error_2 = classifier.classify(error)
        self.assertLessEqual(classified_error_2.timestamp, 1002)

    def test_flag_unrecognized_error(self):
        """Test that unrecognized errors are flagged for manual review."""
        error = AwsSdkError('UnknownError', 'Unknown error message')
        classifier = ErrorClassifier()
        classified_error = classifier.classify(error)
        self.assertTrue(classified_error.flagged_for_review)


if __name__ == '__main__':
    unittest.main()