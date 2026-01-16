from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_token
from app.models.user import User, UserRole
from app.schemas.user import UserResponse

router = APIRouter()


def get_current_user(token: str = None, db: Session = Depends(get_db)):
    """Get current user from token"""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    user_id = payload.get("user_id")
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user


@router.get("/client-home", response_model=UserResponse, tags=["home"])
def client_home(current_user: User = Depends(get_current_user)):
    """Client home page - returns client information"""
    if current_user.role != UserRole.CLIENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Only clients can access this page",
        )
    return current_user


@router.get("/fee-earner-home", response_model=UserResponse, tags=["home"])
def fee_earner_home(current_user: User = Depends(get_current_user)):
    """Fee earner home page - returns fee earner information"""
    if current_user.role != UserRole.FEE_EARNER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Only fee earners can access this page",
        )
    return current_user
