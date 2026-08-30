"""JWT Token verification middleware for Supabase auth."""
from typing import Optional
from fastapi import HTTPException, status, Request, Depends
from fastapi.security import HTTPBearer, HTTPAuthCredentials
from .supabase_auth_service import supabase_auth


security = HTTPBearer()


async def verify_token(credentials: HTTPAuthCredentials = Depends(security)) -> dict:
    """
    Verify JWT token from request header.
    
    Used as a FastAPI dependency:
    @app.get("/protected")
    async def protected_route(current_user = Depends(verify_token)):
        return {"user_id": current_user["id"]}
    """
    token = credentials.credentials
    
    user = await supabase_auth.verify_token(token)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user


async def get_optional_user(request: Request) -> Optional[dict]:
    """
    Get user from token if present, but don't require it.
    
    Used for public endpoints that have optional auth:
    @app.get("/public")
    async def public_route(current_user = Depends(get_optional_user)):
        if current_user:
            return {"message": "Hello " + current_user["email"]}
        return {"message": "Hello Anonymous"}
    """
    auth_header = request.headers.get("Authorization")
    
    if not auth_header:
        return None
    
    try:
        scheme, token = auth_header.split()
        if scheme.lower() != "bearer":
            return None
        
        user = await supabase_auth.verify_token(token)
        return user
    except (ValueError, AttributeError):
        return None


async def require_admin(current_user: dict = Depends(verify_token)) -> dict:
    """
    Verify user has admin role.
    
    @app.delete("/admin/users/{user_id}")
    async def delete_user(user_id: str, admin = Depends(require_admin)):
        # Only admins can access this
        pass
    """
    user_metadata = current_user.get("user_metadata", {})
    role = user_metadata.get("role", "user")
    
    if role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    
    return current_user


async def require_role(allowed_roles: list):
    """
    Create a dependency that checks if user has one of the allowed roles.
    
    Usage:
    @app.get("/government")
    async def government_route(current_user = Depends(require_role(["government", "admin"]))):
        pass
    """
    async def role_checker(current_user: dict = Depends(verify_token)) -> dict:
        user_metadata = current_user.get("user_metadata", {})
        role = user_metadata.get("role", "user")
        
        if role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access requires one of these roles: {allowed_roles}",
            )
        
        return current_user
    
    return role_checker
