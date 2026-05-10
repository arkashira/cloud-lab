import unittest
import os
from config.encryption.encryption_config import EncryptionConfig
from config.encryption.encryption_utils import encrypt, decrypt

class TestEncryption(unittest.TestCase):
    def setUp(self):
        self.encryption_config = EncryptionConfig()
        self.test_data = "Sensitive data to be encrypted"

    def test_key_generation(self):
        self.assertIsNotNone(self.encryption_config.key)
        self.assertEqual(len(self.encryption_config.key), 44)

    def test_encryption_decryption(self):
        encrypted_data = self.encryption_config.encrypt_data(self.test_data)
        decrypted_data = self.encryption_config.decrypt_data(encrypted_data)
        self.assertNotEqual(self.test_data, encrypted_data)
        self.assertEqual(self.test_data, decrypted_data)

    def test_encrypt_decrypt_utils(self):
        encrypted_data = encrypt(self.test_data)
        decrypted_data = decrypt(encrypted_data)
        self.assertNotEqual(self.test_data, encrypted_data)
        self.assertEqual(self.test_data, decrypted_data)

    def tearDown(self):
        key_path = '/opt/axentx/cloud-lab/config/encryption/secret.key'
        if os.path.exists(key_path):
            os.remove(key_path)

if __name__ == '__main__':
    unittest.main()