from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_token
from app.models.user import User, UserRole
from app.models.invite import Invite, InviteStatus
from app.schemas.user import InviteRequest, InviteResponse

router = APIRouter()


def get_current_admin_user(token: str = None, db: Session = Depends(get_db)):
    """Verify that the current user is an admin"""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    payload = decode_token(token)
    if not payload or payload.get("role") != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create invites",
        )

    user_id = payload.get("user_id")
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user


@router.post("/send-invite", response_model=InviteResponse, tags=["invites"])
def send_invite(
    invite_request: InviteRequest,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    """Send an invite to a client or fee earner (admin only)"""
    if invite_request.role not in ["client", "fee_earner"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role must be 'client' or 'fee_earner'",
        )

    # Check if user already exists
    existing_user = db.query(User).filter(User.email == invite_request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists",
        )

    # Check if invite already exists and is pending
    existing_invite = (
        db.query(Invite)
        .filter(
            Invite.email == invite_request.email,
            Invite.status == InviteStatus.PENDING,
        )
        .first()
    )
    if existing_invite:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pending invite already exists for this email",
        )

    # Create new invite
    new_invite = Invite(
        email=invite_request.email,
        role=invite_request.role,
        created_by=current_admin.id,
        expires_at=datetime.utcnow() + timedelta(days=7),
    )
    db.add(new_invite)
    db.commit()
    db.refresh(new_invite)

    return new_invite


@router.get("/invite/{invite_token}", response_model=InviteResponse, tags=["invites"])
def verify_invite(invite_token: str, db: Session = Depends(get_db)):
    """Verify that an invite token is valid"""
    invite = db.query(Invite).filter(Invite.invite_token == invite_token).first()

    if not invite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invite not found",
        )

    if invite.status != InviteStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invite is no longer valid",
        )

    if invite.expires_at and datetime.utcnow() > invite.expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invite has expired",
        )

    return invite
