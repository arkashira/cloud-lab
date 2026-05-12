import logging.config

def configure_logging():
    """Configure logging for Azure logs."""
    logging.config.dictConfig({
        'version': 1,
        'formatters': {
            'default': {
                'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
            }
        },
        'handlers': {
            'console': {
                'class': 'logging.StreamHandler',
                'level': 'INFO',
                'formatter': 'default',
                'stream': 'ext://sys.stdout',
            },
            'file': {
                'class': 'logging.FileHandler',
                'level': 'INFO',
                'formatter': 'default',
                'filename': 'azure_logs.log',
            },
        },
        'root': {
            'level': 'INFO',
            'handlers': ['console', 'file']
        }
    })

configure_logging()