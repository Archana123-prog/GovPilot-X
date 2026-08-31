"""Auth router — register, login (form & JSON), me."""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

try:
    from ..db.connection import get_db
    from ..db.models import User, UserRole, Department, StartupProfile
    from ..auth import hash_password, verify_password, create_access_token, get_current_user
except (ImportError, ValueError):
    from db.connection import get_db
    from db.models import User, UserRole, Department, StartupProfile
    from auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter()


# ─── Schemas ──────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: UserRole
    # department fields
    department_name: Optional[str] = None
    ministry: Optional[str] = None
    state: Optional[str] = None
    # startup fields
    company_name: Optional[str] = None
    dpiit_id: Optional[str] = None
    tech_stack: list[str] = []
    capability_statement: Optional[str] = None
    sector: Optional[str] = None


class LoginJsonRequest(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: str
    full_name: str


class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True


# ─── Endpoints ────────────────────────────────────────────────────────────────

@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    # Check duplicate email
    existing = await db.execute(select(User).where(User.email == data.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        full_name=data.full_name,
        role=data.role,
    )
    db.add(user)
    await db.flush()  # get user.id before creating profiles

    if data.role == UserRole.department:
        dept = Department(
            user_id=user.id,
            name=data.department_name or "Government Department",
            ministry=data.ministry or "General Administration",
            state=data.state or "National",
        )
        db.add(dept)

    elif data.role == UserRole.startup:
        profile = StartupProfile(
            user_id=user.id,
            company_name=data.company_name or data.full_name,
            dpiit_id=data.dpiit_id or "DPIIT-PENDING",
            tech_stack=data.tech_stack,
            capability_statement=data.capability_statement or "Innovation provider",
            sector=data.sector or "Technology",
        )
        db.add(profile)

    await db.commit()
    await db.refresh(user)

    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return TokenResponse(
        access_token=token,
        role=user.role.value,
        user_id=str(user.id),
        full_name=user.full_name,
    )


@router.post("/login", response_model=TokenResponse)
async def login(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    Accepts both application/x-www-form-urlencoded (OAuth2 standard) and application/json.
    """
    content_type = request.headers.get("content-type", "")
    username = None
    password = None

    if "application/json" in content_type:
        try:
            body = await request.json()
            username = body.get("username") or body.get("email")
            password = body.get("password")
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid JSON payload")
    else:
        try:
            form = await request.form()
            username = form.get("username") or form.get("email")
            password = form.get("password")
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid form payload")

    if not username or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username (or email) and password are required",
        )

    result = await db.execute(select(User).where(User.email == str(username).strip()))
    user = result.scalar_one_or_none()

    if not user or not verify_password(str(password), user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account is deactivated")

    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return TokenResponse(
        access_token=token,
        role=user.role.value,
        user_id=str(user.id),
        full_name=user.full_name,
    )


@router.get("/me", response_model=UserOut)
async def me(current_user: User = Depends(get_current_user)):
    return UserOut(
        id=str(current_user.id),
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role.value,
        is_active=current_user.is_active,
    )
