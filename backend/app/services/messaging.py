"""
Messaging Abstraction Layer
---------------------------
This module provides a channel-agnostic interface for sending wishes.
Actual integrations (WhatsApp, SMS, Email) are stubbed for future implementation.
"""

from abc import ABC, abstractmethod
from typing import Optional
from dataclasses import dataclass
from uuid import UUID
import logging

logger = logging.getLogger(__name__)


@dataclass
class WishContent:
    """Data class representing wish content to be sent"""
    recipient_name: str
    message_text: str
    card_url: Optional[str] = None
    quote_text: Optional[str] = None
    festival_name: Optional[str] = None


@dataclass
class SendResult:
    """Result of a send operation"""
    success: bool
    message_id: Optional[str] = None
    error: Optional[str] = None


class MessageChannel(ABC):
    """Abstract base class for message channels"""
    
    @property
    @abstractmethod
    def channel_type(self) -> str:
        """Return the channel type identifier"""
        pass
    
    @abstractmethod
    async def send(
        self,
        recipient: str,
        content: WishContent
    ) -> SendResult:
        """Send wish to recipient"""
        pass
    
    @abstractmethod
    async def is_available(self) -> bool:
        """Check if channel is available/configured"""
        pass


class WhatsAppChannel(MessageChannel):
    """
    WhatsApp Business API integration (STUB)
    
    Future implementation notes:
    - Use WhatsApp Business API
    - Requires verified business account
    - Template messages need approval
    - Support for media messages
    """
    
    @property
    def channel_type(self) -> str:
        return "whatsapp"
    
    async def send(
        self,
        recipient: str,
        content: WishContent
    ) -> SendResult:
        """
        Send wish via WhatsApp (STUB)
        
        Args:
            recipient: Phone number in international format
            content: WishContent object
        """
        logger.info(f"[STUB] Would send WhatsApp to {recipient}")
        # TODO: Implement WhatsApp Business API integration
        # - Initialize WhatsApp client
        # - Format message according to template
        # - Attach card image if available
        # - Send and capture message ID
        return SendResult(
            success=False,
            error="WhatsApp integration not yet implemented"
        )
    
    async def is_available(self) -> bool:
        """Check if WhatsApp is configured"""
        # TODO: Check for WhatsApp API credentials
        return False


class SMSChannel(MessageChannel):
    """
    SMS integration via Twilio (STUB)
    
    Future implementation notes:
    - Use Twilio API
    - Character limit considerations
    - MMS for images
    - International number support
    """
    
    @property
    def channel_type(self) -> str:
        return "sms"
    
    async def send(
        self,
        recipient: str,
        content: WishContent
    ) -> SendResult:
        """
        Send wish via SMS (STUB)
        
        Args:
            recipient: Phone number
            content: WishContent object
        """
        logger.info(f"[STUB] Would send SMS to {recipient}")
        # TODO: Implement Twilio SMS integration
        # - Initialize Twilio client
        # - Format message for SMS (character limits)
        # - Use MMS if card image available
        # - Send and capture SID
        return SendResult(
            success=False,
            error="SMS integration not yet implemented"
        )
    
    async def is_available(self) -> bool:
        """Check if SMS is configured"""
        # TODO: Check for Twilio credentials
        return False


class EmailChannel(MessageChannel):
    """
    Email integration via SendGrid (STUB)
    
    Future implementation notes:
    - Use SendGrid API
    - HTML email templates
    - Inline card image
    - Tracking and analytics
    """
    
    @property
    def channel_type(self) -> str:
        return "email"
    
    async def send(
        self,
        recipient: str,
        content: WishContent
    ) -> SendResult:
        """
        Send wish via Email (STUB)
        
        Args:
            recipient: Email address
            content: WishContent object
        """
        logger.info(f"[STUB] Would send Email to {recipient}")
        # TODO: Implement SendGrid email integration
        # - Initialize SendGrid client
        # - Build HTML email from template
        # - Embed card image
        # - Send and capture message ID
        return SendResult(
            success=False,
            error="Email integration not yet implemented"
        )
    
    async def is_available(self) -> bool:
        """Check if Email is configured"""
        # TODO: Check for SendGrid API key
        return False


class DownloadChannel(MessageChannel):
    """
    Download-only channel (fully implemented)
    
    This channel doesn't send anything - it just marks
    the wish as "downloaded" for tracking purposes.
    """
    
    @property
    def channel_type(self) -> str:
        return "download"
    
    async def send(
        self,
        recipient: str,
        content: WishContent
    ) -> SendResult:
        """Mark wish as downloaded"""
        logger.info(f"Wish downloaded for {content.festival_name}")
        return SendResult(
            success=True,
            message_id="download"
        )
    
    async def is_available(self) -> bool:
        """Download is always available"""
        return True


class MessageChannelFactory:
    """Factory for creating message channels"""
    
    _channels = {
        "whatsapp": WhatsAppChannel,
        "sms": SMSChannel,
        "email": EmailChannel,
        "download": DownloadChannel
    }
    
    @classmethod
    def get_channel(cls, channel_type: str) -> MessageChannel:
        """Get a channel instance by type"""
        channel_class = cls._channels.get(channel_type.lower())
        if not channel_class:
            raise ValueError(f"Unknown channel type: {channel_type}")
        return channel_class()
    
    @classmethod
    def get_available_channels(cls) -> list:
        """Get list of available channel types"""
        available = []
        for channel_type, channel_class in cls._channels.items():
            channel = channel_class()
            # Note: This is sync check, for async use await in actual usage
            available.append({
                "type": channel_type,
                "name": channel_type.title(),
                "stub": channel_type != "download"
            })
        return available
    
    @classmethod
    async def send_wish(
        cls,
        channel_type: str,
        recipient: str,
        content: WishContent
    ) -> SendResult:
        """Send a wish through the specified channel"""
        channel = cls.get_channel(channel_type)
        
        if not await channel.is_available():
            return SendResult(
                success=False,
                error=f"{channel_type} channel is not configured"
            )
        
        return await channel.send(recipient, content)
