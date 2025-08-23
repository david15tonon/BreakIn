"""Utility functions for text processing and PII redaction."""

import re
from typing import List, Set, Tuple

# Common patterns for PII detection
EMAIL_PATTERN = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
PHONE_PATTERN = r'(\+\d{1,3}[- ]?)?\d{3}[- ]?\d{3}[- ]?\d{4}'
URL_PATTERN = r'https?://(?:www\.)?[\w\d\-._~:/?#\[\]@!$&\'()*+,;=]+'
IP_PATTERN = r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b'

# Load common name lists (example - would need to load from files)
COMMON_NAMES: Set[str] = {
    'john', 'jane', 'smith', 'williams', 'johnson'
    # ... many more names
}

def contains_pii(text: str) -> bool:
    """Check if text contains potential PII.
    
    Args:
        text: The text to check
        
    Returns:
        bool: True if PII is detected
    """
    patterns = [
        EMAIL_PATTERN,
        PHONE_PATTERN,
        URL_PATTERN,
        IP_PATTERN
    ]
    
    # Check all regex patterns
    for pattern in patterns:
        if re.search(pattern, text, re.IGNORECASE):
            return True
            
    # Check for common names
    words = set(re.findall(r'\b\w+\b', text.lower()))
    if words & COMMON_NAMES:
        return True
        
    return False

def redact_pii(text: str) -> Tuple[str, List[str]]:
    """Redact PII from text while preserving readability.
    
    Args:
        text: Text to redact
        
    Returns:
        Tuple of (redacted_text, list of redacted items)
    """
    redacted = text
    redacted_items = []
    
    # Redact emails
    emails = re.finditer(EMAIL_PATTERN, text)
    for match in emails:
        email = match.group()
        redacted = redacted.replace(email, '[EMAIL REDACTED]')
        redacted_items.append(email)
    
    # Redact phone numbers
    phones = re.finditer(PHONE_PATTERN, text)
    for match in phones:
        phone = match.group()
        redacted = redacted.replace(phone, '[PHONE REDACTED]')
        redacted_items.append(phone)
    
    # Redact URLs
    urls = re.finditer(URL_PATTERN, text)
    for match in urls:
        url = match.group()
        redacted = redacted.replace(url, '[URL REDACTED]')
        redacted_items.append(url)
    
    # Redact IPs
    ips = re.finditer(IP_PATTERN, text)
    for match in ips:
        ip = match.group()
        redacted = redacted.replace(ip, '[IP REDACTED]')
        redacted_items.append(ip)
    
    # Redact common names
    words = re.finditer(r'\b\w+\b', text)
    for match in words:
        word = match.group()
        if word.lower() in COMMON_NAMES:
            redacted = redacted.replace(word, '[NAME REDACTED]')
            redacted_items.append(word)
    
    return redacted, redacted_items

def sanitize_markdown(text: str) -> str:
    """Sanitize markdown text to prevent XSS and other injection attacks.
    
    Args:
        text: Markdown text to sanitize
        
    Returns:
        Sanitized markdown text
    """
    # Remove script tags and their content
    text = re.sub(r'<script[\s\S]*?</script>', '', text)
    
    # Remove style tags
    text = re.sub(r'<style[\s\S]*?</style>', '', text)
    
    # Remove potentially dangerous HTML attributes
    text = re.sub(r'(javascript|data):', '', text)
    text = re.sub(r'on\w+="[^"]*"', '', text)
    
    # Remove comments
    text = re.sub(r'<!--[\s\S]*?-->', '', text)
    
    # Escape angle brackets in code blocks
    text = re.sub(r'`([^`]*)`', lambda m: m.group().replace('<', '&lt;').replace('>', '&gt;'), text)
    
    return text

def stylometric_obfuscation(text: str) -> str:
    """Apply stylometric obfuscation to prevent author identification.
    
    This is a basic implementation - a production version would use more
    sophisticated NLP techniques.
    
    Args:
        text: Text to obfuscate
        
    Returns:
        Obfuscated text
    """
    # Normalize contractions
    text = re.sub(r"n't", " not", text)
    text = re.sub(r"'re", " are", text)
    text = re.sub(r"'s", " is", text)
    text = re.sub(r"'ll", " will", text)
    
    # Normalize common intensifiers
    text = re.sub(r'\b(really|very|quite|extremely)\b', 'significantly', text)
    
    # Normalize first person pronouns
    text = re.sub(r'\b(I|me|my|mine)\b', 'the author', text)
    
    # Normalize informal language
    text = re.sub(r'\b(cool|awesome|great)\b', 'good', text)
    text = re.sub(r'\b(bad|terrible|awful)\b', 'poor', text)
    
    # Add some randomness in word choice
    # (In production, this would use synonyms from a thesaurus)
    
    return text
