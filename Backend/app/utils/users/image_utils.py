"""Image processing utility functions."""
from typing import Optional, Tuple, Dict
import magic
import aiofiles
from PIL import Image
from fastapi import UploadFile, HTTPException
import io

# Allowed image mime types
ALLOWED_MIME_TYPES = {
    "image/jpeg",
    "image/png",
    "image/gif"
}

# Maximum file size (5MB)
MAX_FILE_SIZE = 5 * 1024 * 1024

# Image dimensions
MAX_WIDTH = 2000
MAX_HEIGHT = 2000
AVATAR_SIZE = (400, 400)
THUMBNAIL_SIZE = (200, 200)

async def validate_image(file: UploadFile) -> bool:
    """Validate uploaded image file."""
    # Check file size
    try:
        contents = await file.read()
        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail="File size too large"
            )
            
        # Check mime type
        mime_type = magic.from_buffer(contents, mime=True)
        if mime_type not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=400,
                detail="Invalid file type"
            )
            
        # Reset file pointer
        await file.seek(0)
        return True
        
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"File validation failed: {str(e)}"
        )

async def process_image(
    file: UploadFile,
    max_size: Tuple[int, int] = (MAX_WIDTH, MAX_HEIGHT)
) -> Tuple[bytes, str]:
    """Process and optimize image."""
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    # Convert RGBA to RGB if needed
    if image.mode == "RGBA":
        background = Image.new("RGB", image.size, "white")
        background.paste(image, mask=image.split()[3])
        image = background
    
    # Resize if larger than max dimensions
    if image.size[0] > max_size[0] or image.size[1] > max_size[1]:
        image.thumbnail(max_size, Image.Resampling.LANCZOS)
    
    # Save optimized image
    output = io.BytesIO()
    image.save(output, format="JPEG", quality=85, optimize=True)
    
    return output.getvalue(), "image/jpeg"

async def create_thumbnail(
    file: UploadFile,
    size: Tuple[int, int] = THUMBNAIL_SIZE
) -> bytes:
    """Create thumbnail from image."""
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    # Convert RGBA to RGB if needed
    if image.mode == "RGBA":
        background = Image.new("RGB", image.size, "white")
        background.paste(image, mask=image.split()[3])
        image = background
    
    # Calculate dimensions preserving aspect ratio
    width, height = image.size
    aspect = width / height
    
    if aspect > 1:
        new_width = size[0]
        new_height = int(size[0] / aspect)
    else:
        new_width = int(size[1] * aspect)
        new_height = size[1]
    
    # Resize and crop to center
    image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
    left = (new_width - size[0]) // 2
    top = (new_height - size[1]) // 2
    right = left + size[0]
    bottom = top + size[1]
    image = image.crop((left, top, right, bottom))
    
    # Save thumbnail
    output = io.BytesIO()
    image.save(output, format="JPEG", quality=85, optimize=True)
    
    return output.getvalue()

def get_image_dimensions(file_path: str) -> Optional[Dict[str, int]]:
    """Get image dimensions."""
    try:
        with Image.open(file_path) as img:
            width, height = img.size
            return {
                "width": width,
                "height": height
            }
    except Exception:
        return None
