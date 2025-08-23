"""Text normalization utilities for matching."""
import re
from typing import List, Set
from collections import Counter
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')
    nltk.download('wordnet')

# Initialize lemmatizer
lemmatizer = WordNetLemmatizer()

# Common technology abbreviations/variations
TECH_ALIASES = {
    "js": "javascript",
    "ts": "typescript",
    "py": "python",
    "react.js": "react",
    "reactjs": "react",
    "node.js": "nodejs",
    "nodejs": "node",
    "postgres": "postgresql",
    "k8s": "kubernetes",
    "aws": "amazon web services",
    "gcp": "google cloud platform",
    "ml": "machine learning",
    "ai": "artificial intelligence",
    "ui": "user interface",
    "ux": "user experience",
    "frontend": "front end",
    "backend": "back end",
    "fullstack": "full stack"
}

def normalize_skills(skills: List[str]) -> Set[str]:
    """Normalize skill tokens.
    
    Args:
        skills: List of skill strings
        
    Returns:
        Set of normalized skill tokens
    """
    normalized = set()
    
    for skill in skills:
        # Convert to lowercase
        skill = skill.lower().strip()
        
        # Replace aliases
        skill = TECH_ALIASES.get(skill, skill)
        
        # Split compound terms
        parts = skill.split()
        
        # Add both full and split versions
        normalized.add(skill)
        normalized.update(parts)
        
    return normalized

def normalize_text(text: str) -> str:
    """Normalize free text.
    
    Args:
        text: Input text
        
    Returns:
        Normalized text
    """
    # Convert to lowercase
    text = text.lower()
    
    # Remove punctuation
    text = re.sub(r'[^\w\s]', ' ', text)
    
    # Tokenize
    tokens = word_tokenize(text)
    
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    tokens = [t for t in tokens if t not in stop_words]
    
    # Lemmatize
    tokens = [lemmatizer.lemmatize(t) for t in tokens]
    
    # Join back
    return ' '.join(tokens)

def extract_skills(text: str) -> Set[str]:
    """Extract skill tokens from text.
    
    Args:
        text: Input text
        
    Returns:
        Set of normalized skill tokens
    """
    # Normalize text
    text = normalize_text(text)
    
    # Extract potential skill tokens
    tokens = set(re.findall(r'\b\w+\b', text))
    
    # Normalize each token
    skills = set()
    for token in tokens:
        # Check for technology aliases
        if token in TECH_ALIASES:
            skills.add(TECH_ALIASES[token])
        else:
            skills.add(token)
            
    return skills

def tokenize_role_brief(text: str) -> Dict[str, Set[str]]:
    """Extract structured tokens from role brief.
    
    Args:
        text: Role description text
        
    Returns:
        Dict with skills, domains, and other tokens
    """
    # Normalize text
    text = normalize_text(text)
    
    # Extract sections with regex
    requirements = re.findall(r'requirements?:(.+?)(?:\n\n|\Z)', text, re.I|re.S)
    responsibilities = re.findall(r'responsibilities:(.+?)(?:\n\n|\Z)', text, re.I|re.S)
    qualifications = re.findall(r'qualifications?:(.+?)(?:\n\n|\Z)', text, re.I|re.S)
    
    # Combine sections
    skills = set()
    domains = set()
    other = set()
    
    for section in requirements + responsibilities + qualifications:
        # Extract skills
        section_skills = extract_skills(section)
        skills.update(section_skills)
        
        # Extract domains/industries
        domains.update(re.findall(r'\b(fintech|edtech|healthtech|ecommerce)\b', section.lower()))
        
        # Extract other relevant tokens
        other.update(re.findall(r'\b(junior|senior|lead|architect|manager)\b', section.lower()))
        
    return {
        "skills": skills,
        "domains": domains,
        "other": other
    }

def generate_skill_vector(skills: Set[str], vocab: Set[str]) -> List[float]:
    """Generate TF-IDF style skill vector.
    
    Args:
        skills: Set of skills
        vocab: Full vocabulary of skills
        
    Returns:
        Skill vector
    """
    # Count skill occurrences
    skill_counts = Counter(skills)
    
    # Calculate TF-IDF style weights
    vector = []
    for skill in sorted(vocab):
        if skill in skills:
            # TF = normalized count
            tf = skill_counts[skill] / len(skills)
            # IDF = constant for now
            idf = 1.0
            vector.append(tf * idf)
        else:
            vector.append(0.0)
            
    return vector
