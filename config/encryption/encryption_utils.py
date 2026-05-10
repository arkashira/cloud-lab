from .encryption_config import EncryptionConfig

encryption_config = EncryptionConfig()

def encrypt(data):
    return encryption_config.encrypt_data(data)

def decrypt(encrypted_data):
    return encryption_config.decrypt_data(encrypted_data)