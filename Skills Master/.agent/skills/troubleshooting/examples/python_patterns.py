from datetime import datetime
import time
from functools import wraps
import logging

logger = logging.getLogger(__name__)

class ApplicationError(Exception):
    """Base exception for all application errors."""
    def __init__(self, message: str, code: str = None, details: dict = None):
        super().__init__(message)
        self.code = code
        self.details = details or {}
        self.timestamp = datetime.utcnow()

def retry(max_attempts=3, backoff_factor=2, exceptions=(Exception,)):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    if attempt == max_attempts - 1:
                        raise
                    time.sleep(backoff_factor ** attempt)
            return None
        return wrapper
    return decorator

@retry(max_attempts=3)
def unstable_service_call():
    # Simulation of a call that might fail
    import random
    if random.random() < 0.7:
        raise ConnectionError("Network jitter")
    return {"status": "success"}
