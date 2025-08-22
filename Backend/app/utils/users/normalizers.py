"""Utility functions for normalizing and validating data."""
import re
from typing import Optional
import validators
from slugify import slugify

def normalize_skill_name(name: str) -> str:
    """Normalize skill name for consistency."""
    # Convert to lowercase
    normalized = name.lower().strip()
    
    # Handle special cases
    replacements = {
        "javascript": "JavaScript",
        "typescript": "TypeScript",
        "nodejs": "Node.js",
        "react.js": "React",
        "reactjs": "React",
        "vue.js": "Vue",
        "vuejs": "Vue",
        "aws": "AWS",
        "azure": "Azure",
        "gcp": "GCP",
        "c#": "C#",
        ".net": ".NET",
        "dotnet": ".NET",
    }
    
    return replacements.get(normalized, name.strip())

def normalize_url(url: str) -> Optional[str]:
    """Normalize and validate URL."""
    if not url:
        return None
        
    # Add scheme if missing
    if not url.startswith(("http://", "https://")):
        url = f"https://{url}"
        
    # Validate URL
    if not validators.url(url):
        return None
        
    return url

def generate_handle(full_name: str, existing_handles: set) -> str:
    """Generate a unique handle from full name."""
    base_handle = slugify(full_name)
    handle = base_handle
    counter = 1
    
    while handle in existing_handles:
        handle = f"{base_handle}{counter}"
        counter += 1
        
    return handle

def validate_handle(handle: str) -> bool:
    """Validate user handle format."""
    pattern = r"^[a-zA-Z0-9][a-zA-Z0-9_-]{2,29}$"
    return bool(re.match(pattern, handle))

def normalize_location(location: str) -> Optional[str]:
    """Normalize location string."""
    if not location:
        return None
        
    # Remove extra whitespace
    location = " ".join(location.split())
    
    # Convert common abbreviations
    replacements = {
        "nyc": "New York City",
        "sf": "San Francisco",
        "la": "Los Angeles",
        "uk": "United Kingdom",
        "usa": "United States",
    }
    
    return replacements.get(location.lower(), location)

def validate_social_platform(platform: str) -> bool:
    """Validate social media platform."""
    valid_platforms = {
        "github",
        "linkedin",
        "twitter",
        "stackoverflow",
        "medium",
        "dev.to",
        "gitlab",
        "behance",
        "dribbble",
        "youtube"
    }
    
    return platform.lower() in valid_platforms

def extract_social_handle(url: str, platform: str) -> Optional[str]:
    """Extract username/handle from social media URL."""
    patterns = {
        "github": r"github\.com/([^/]+)",
        "linkedin": r"linkedin\.com/in/([^/]+)",
        "twitter": r"twitter\.com/([^/]+)",
        "stackoverflow": r"stackoverflow\.com/users/\d+/([^/]+)",
        "medium": r"medium\.com/@([^/]+)",
        "dev.to": r"dev\.to/([^/]+)",
    }
    
    if platform in patterns:
        match = re.search(patterns[platform], url)
        if match:
            return match.group(1)
            
    return None
