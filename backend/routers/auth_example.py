"""Example authentication router using Supabase."""
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from ..services.supabase_auth_service import supabase_auth
from ..services.auth_middleware import verify_token


router = APIRouter(prefix="/auth", tags=["authentication"])


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str = "startup"  # startup, government, evaluator


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(request: SignupRequest):
    """
    Register new user with Supabase Auth.
    
    Roles: startup, government, evaluator, admin
    """
    result = await supabase_auth.signup(
        email=request.email,
        password=request.password,
        user_data={
            "name": request.name,
            "role": request.role,
        }
    )
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("error", "Signup failed"),
        )
    
    return {
        "message": "User created successfully",
        "user_id": result["user"].id,
        "email": result["user"].email,
        "access_token": result["session"].access_token if result["session"] else None,
    }


@router.post("/login")
async def login(request: LoginRequest):
    """
    Login with email and password.
    
    Returns access_token to use for authenticated requests.
    """
    result = await supabase_auth.login(
        email=request.email,
        password=request.password,
    )
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=result.get("error", "Invalid credentials"),
        )
    
    return {
        "access_token": result["access_token"],
        "token_type": "bearer",
        "user": {
            "id": result["user"].id,
            "email": result["user"].email,
            "metadata": result["user"].user_metadata,
        },
        "refresh_token": result["session"].refresh_token if result["session"] else None,
    }


@router.post("/refresh")
async def refresh_token(request: RefreshRequest):
    """
    Refresh expired access token using refresh token.
    """
    result = await supabase_auth.refresh_session(request.refresh_token)
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    
    return {
        "access_token": result["access_token"],
        "token_type": "bearer",
    }


@router.post("/logout")
async def logout(current_user: dict = Depends(verify_token)):
    """
    Logout current user.
    
    Note: Token should be added to blacklist on frontend/client.
    Supabase doesn't invalidate tokens server-side yet.
    """
    await supabase_auth.logout()
    return {"message": "Logged out successfully"}


@router.get("/me")
async def get_profile(current_user: dict = Depends(verify_token)):
    """
    Get current user profile.
    
    Requires: Authorization: Bearer {token}
    """
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "metadata": current_user.get("user_metadata", {}),
    }


@router.post("/password-reset")
async def request_password_reset(email: EmailStr):
    """
    Send password reset email.
    """
    result = await supabase_auth.send_reset_email(email)
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("error", "Failed to send reset email"),
        )
    
    return {"message": f"Password reset email sent to {email}"}


@router.put("/profile")
async def update_profile(
    updates: dict,
    current_user: dict = Depends(verify_token),
):
    """
    Update user profile/metadata.
    
    Example body:
    {
        "name": "John Doe",
        "company": "My Startup",
        "avatar_url": "https://..."
    }
    """
    result = await supabase_auth.update_user(
        token=current_user["id"],  # Pass user ID
        updates=updates,
    )
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("error", "Failed to update profile"),
        )
    
    return {
        "message": "Profile updated successfully",
        "user": result["user"],
    }
