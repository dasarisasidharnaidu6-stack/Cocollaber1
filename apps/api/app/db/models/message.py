"""
Message Entity Model.
Secure 1-to-1 conversation messages strictly bounded by an active connection.
"""
import uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Text, Boolean, ForeignKey, Uuid, Index
from apps.api.app.db.base import Base, IdMixin, TimestampMixin

class Message(Base, IdMixin, TimestampMixin):
    __tablename__ = "messages"

    connection_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("connections.id", ondelete="CASCADE"), index=True, nullable=False)
    sender_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("accounts.id", ondelete="RESTRICT"), index=True, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    connection: Mapped["Connection"] = relationship("Connection", back_populates="messages")

    __table_args__ = (
        Index("ix_messages_connection_created", "connection_id", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<Message(id={self.id}, sender={self.sender_id})>"
