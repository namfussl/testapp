from sqlalchemy import Column, Integer, String, DateTime, Enum, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.core.database import Base
import enum
import uuid


class InviteStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"


class Invite(Base):
    __tablename__ = "invites"

    id = Column(Integer, primary_key=True, index=True)
    invite_token = Column(String, unique=True, index=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, index=True, nullable=False)
    role = Column(String, nullable=False)  # 'client' or 'fee_earner'
    status = Column(Enum(InviteStatus), default=InviteStatus.PENDING)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_uuid"), nullable=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.user_uuid"), nullable=False)  # Admin who created invite
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=True)

    def __repr__(self):
        return f"<Invite(id={self.id}, email={self.email}, status={self.status})>"
