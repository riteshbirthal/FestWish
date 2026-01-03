from typing import Optional
from uuid import UUID, uuid4
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import httpx
from app.core.database import get_supabase_admin
from app.core.config import settings
from app.core.exceptions import StorageException
import logging

logger = logging.getLogger(__name__)


class CardService:
    def __init__(self):
        self.client = get_supabase_admin()
        self.bucket = settings.STORAGE_BUCKET
    
    async def generate_card(
        self,
        background_image_url: str,
        message_text: str,
        recipient_name: Optional[str] = None,
        quote_text: Optional[str] = None,
        output_width: int = 1080,
        output_height: int = 1350
    ) -> bytes:
        """Generate a greeting card with text overlay"""
        try:
            # Download background image
            async with httpx.AsyncClient() as client:
                response = await client.get(background_image_url)
                background_bytes = response.content
            
            # Open and resize background
            background = Image.open(BytesIO(background_bytes))
            background = background.convert("RGBA")
            background = background.resize((output_width, output_height), Image.Resampling.LANCZOS)
            
            # Create overlay for text readability
            overlay = Image.new("RGBA", background.size, (0, 0, 0, 0))
            draw = ImageDraw.Draw(overlay)
            
            # Add semi-transparent overlay at bottom
            overlay_height = int(output_height * 0.4)
            overlay_top = output_height - overlay_height
            draw.rectangle(
                [(0, overlay_top), (output_width, output_height)],
                fill=(0, 0, 0, 140)
            )
            
            # Composite overlay onto background
            background = Image.alpha_composite(background, overlay)
            draw = ImageDraw.Draw(background)
            
            # Use default font (in production, use custom fonts)
            try:
                font_large = ImageFont.truetype("arial.ttf", 48)
                font_medium = ImageFont.truetype("arial.ttf", 36)
                font_small = ImageFont.truetype("arial.ttf", 28)
            except:
                font_large = ImageFont.load_default()
                font_medium = font_large
                font_small = font_large
            
            # Calculate text positions
            padding = 50
            text_area_top = overlay_top + padding
            max_text_width = output_width - (padding * 2)
            
            current_y = text_area_top
            
            # Add recipient name if provided
            if recipient_name:
                greeting = f"Dear {recipient_name},"
                draw.text(
                    (padding, current_y),
                    greeting,
                    font=font_medium,
                    fill=(255, 255, 255, 255)
                )
                current_y += 60
            
            # Add main message with word wrapping
            lines = self._wrap_text(message_text, font_medium, max_text_width, draw)
            for line in lines[:5]:  # Limit to 5 lines
                draw.text(
                    (padding, current_y),
                    line,
                    font=font_medium,
                    fill=(255, 255, 255, 255)
                )
                current_y += 45
            
            # Add quote if provided
            if quote_text:
                current_y += 20
                quote_lines = self._wrap_text(f'"{quote_text}"', font_small, max_text_width, draw)
                for line in quote_lines[:2]:
                    draw.text(
                        (padding, current_y),
                        line,
                        font=font_small,
                        fill=(255, 215, 0, 255)  # Gold color for quotes
                    )
                    current_y += 35
            
            # Convert to bytes
            output = BytesIO()
            background = background.convert("RGB")
            background.save(output, format="JPEG", quality=90)
            output.seek(0)
            
            return output.getvalue()
            
        except Exception as e:
            logger.error(f"Failed to generate card: {e}")
            raise StorageException(f"Failed to generate card: {str(e)}")
    
    def _wrap_text(
        self,
        text: str,
        font,
        max_width: int,
        draw: ImageDraw
    ) -> list:
        """Wrap text to fit within max_width"""
        words = text.split()
        lines = []
        current_line = []
        
        for word in words:
            current_line.append(word)
            line_text = " ".join(current_line)
            bbox = draw.textbbox((0, 0), line_text, font=font)
            line_width = bbox[2] - bbox[0]
            
            if line_width > max_width:
                if len(current_line) == 1:
                    lines.append(current_line[0])
                    current_line = []
                else:
                    current_line.pop()
                    lines.append(" ".join(current_line))
                    current_line = [word]
        
        if current_line:
            lines.append(" ".join(current_line))
        
        return lines
    
    async def save_card(
        self,
        card_bytes: bytes,
        wish_id: UUID
    ) -> str:
        """Save generated card to storage"""
        try:
            storage_path = f"generated_cards/{wish_id}.jpg"
            
            self.client.storage.from_(self.bucket).upload(
                storage_path,
                card_bytes,
                {"content-type": "image/jpeg"}
            )
            
            card_url = self.client.storage.from_(self.bucket).get_public_url(storage_path)
            
            return card_url
            
        except Exception as e:
            logger.error(f"Failed to save card: {e}")
            raise StorageException(f"Failed to save card: {str(e)}")
