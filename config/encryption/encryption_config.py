import os
from cryptography.fernet import Fernet

class EncryptionConfig:
    def __init__(self):
        self.key = self._load_or_generate_key()
        self.cipher_suite = Fernet(self.key)

    def _load_or_generate_key(self):
        key_path = '/opt/axentx/cloud-lab/config/encryption/secret.key'
        if os.path.exists(key_path):
            with open(key_path, 'rb') as key_file:
                key = key_file.read()
        else:
            key = Fernet.generate_key()
            with open(key_path, 'wb') as key_file:
                key_file.write(key)
        return key

    def encrypt_data(self, data):
        if isinstance(data, str):
            data = data.encode('utf-8')
        return self.cipher_suite.encrypt(data)

    def decrypt_data(self, encrypted_data):
        return self.cipher_suite.decrypt(encrypted_data).decode('utf-8')