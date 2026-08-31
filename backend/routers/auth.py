"""Auth router — register, login, me."""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..db.connection import get_db
from ..db.models import User, UserRole, Department, StartupProfile
from ..auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter()


# ─── Schemas ──────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: UserRole
    # department fields
    department_name: str | None = None
    ministry: str | None = None
    state: str | None = None
    # startup fields
    company_name: str | None = None
    dpiit_id: str | None = None
    tech_stack: list[str] = []
    capability_statement: str | None = None
    sector: str | None = None


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
        if not data.department_name:
            raise HTTPException(400, "department_name required for department role")
        dept = Department(
            user_id=user.id,
            name=data.department_name,
            ministry=data.ministry,
            state=data.state,
        )
        db.add(dept)

    elif data.role == UserRole.startup:
        if not all([data.company_name, data.dpiit_id, data.capability_statement]):
            raise HTTPException(400, "company_name, dpiit_id, capability_statement required for startup role")
        profile = StartupProfile(
            user_id=user.id,
            company_name=data.company_name,
            dpiit_id=data.dpiit_id,
            tech_stack=data.tech_stack,
            capability_statement=data.capability_statement,
            sector=data.sector,
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
    form: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.email == form.username))
    user = result.scalar_one_or_none()

    if not user or not verify_password(form.password, user.password_hash):
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
