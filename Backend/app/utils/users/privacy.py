"""Privacy-related utility functions."""
from typing import Dict, Any, List, Set
from copy import deepcopy

# Fields that should never be exposed
SENSITIVE_FIELDS = {
    "hashed_password",
    "failed_login_attempts",
    "last_failed_login",
    "account_locked_until",
    "_id",  # Use id instead
}

# Fields that require special handling based on privacy settings
PRIVACY_CONTROLLED_FIELDS = {
    "email": "display_email",
    "location": "display_location",
    "social_links": "display_social",
    "company": "display_company",
}

def redact_sensitive_fields(data: Dict[str, Any]) -> Dict[str, Any]:
    """Remove sensitive fields from data dictionary."""
    clean_data = deepcopy(data)
    for field in SENSITIVE_FIELDS:
        clean_data.pop(field, None)
    return clean_data

def apply_privacy_settings(
    data: Dict[str, Any],
    privacy_settings: Dict[str, bool]
) -> Dict[str, Any]:
    """Apply privacy settings to data dictionary."""
    clean_data = deepcopy(data)
    
    for field, setting in PRIVACY_CONTROLLED_FIELDS.items():
        # If field exists and privacy setting is False, remove it
        if field in clean_data and not privacy_settings.get(setting, True):
            clean_data.pop(field)
            
    return clean_data

def filter_by_visibility(
    data: Dict[str, Any],
    visibility: str,
    viewer_id: str = None,
    connections: Set[str] = None
) -> Dict[str, Any]:
    """Filter data based on visibility settings."""
    if visibility == "public":
        return data
        
    if visibility == "private":
        if viewer_id and viewer_id == data.get("user_id"):
            return data
        return {"id": data["id"], "visibility": "private"}
        
    if visibility == "connections":
        if viewer_id and (
            viewer_id == data.get("user_id") or
            (connections and viewer_id in connections)
        ):
            return data
        return {
            "id": data["id"],
            "visibility": "connections",
            "name": data.get("name"),
            "avatar_url": data.get("avatar_url")
        }
        
    return data

def anonymize_data(
    data: Dict[str, Any],
    fields_to_anonymize: List[str]
) -> Dict[str, Any]:
    """Anonymize specific fields in data dictionary."""
    anon_data = deepcopy(data)
    
    for field in fields_to_anonymize:
        if field in anon_data:
            value = anon_data[field]
            if isinstance(value, str):
                if "@" in value:  # Email
                    parts = value.split("@")
                    anon_data[field] = f"{parts[0][0]}{'*' * (len(parts[0])-2)}" + \
                                     f"{parts[0][-1]}@{parts[1]}"
                else:  # Other strings
                    anon_data[field] = f"{value[0]}{'*' * (len(value)-2)}{value[-1]}"
                    
    return anon_data

def get_public_profile_fields(visibility: str = "public") -> List[str]:
    """Get list of fields that should be visible based on visibility level."""
    base_fields = ["id", "handle", "name", "avatar_url", "visibility"]
    
    visibility_fields = {
        "public": base_fields + [
            "bio", "tagline", "skills", "endorsement_count",
            "company", "title", "location"
        ],
        "connections": base_fields + ["bio", "tagline", "skills"],
        "private": base_fields
    }
    
    return visibility_fields.get(visibility, base_fields)
