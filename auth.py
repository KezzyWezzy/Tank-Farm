# auth.py
from fastapi import Depends, HTTPException, status
from typing import Callable
from functools import wraps

# Simulated user roles (in-memory for now)
def get_current_user():
    # This should be replaced with actual authentication logic (e.g., JWT decoding)
    return {"role": "operator"}  # Default role for testing

def require_role(role: str):
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            user = get_current_user()
            if user.get("role") != role:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Requires {role} role"
                )
            return await func(*args, **kwargs)
        return wrapper
    return decorator