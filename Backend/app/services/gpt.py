"""GPT service wrapper with queue support and retries."""

import logging
import time
from typing import Any, Dict, Optional
import openai
from openai import OpenAI
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type
)

from app.config import settings

logger = logging.getLogger(__name__)

client = OpenAI(api_key=settings.GPT_API_KEY)


@retry(
    retry=retry_if_exception_type((openai.RateLimitError, openai.APITimeoutError)),
    wait=wait_exponential(multiplier=1, min=4, max=60),
    stop=stop_after_attempt(5)
)
async def chat_completion(
    messages: list[Dict[str, str]],
    model: str = "gpt-4-turbo-preview",
    temperature: float = 0.7,
    max_tokens: Optional[int] = None,
) -> Dict[str, Any]:
    """Send a chat completion request to GPT with retry logic."""
    try:
        start = time.time()
        response = await client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        duration = time.time() - start
        
        logger.info(
            "GPT request completed",
            extra={
                "duration": duration,
                "model": model,
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
            }
        )
        
        return {
            "text": response.choices[0].message.content,
            "finish_reason": response.choices[0].finish_reason,
            "usage": {
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens,
            }
        }
        
    except Exception as e:
        logger.exception("GPT request failed: %s", str(e))
        raise


class MissionGenerator:
    """Generates coding missions using GPT."""
    
    SYSTEM_PROMPT = """You are an expert software architect designing coding challenges
    for developers. Create detailed, real-world project specifications that test both
    technical skills and collaboration abilities. Focus on practical scenarios a 
    developer might encounter in their job."""
    
    async def generate_mission(
        self,
        theme: str,
        difficulty: str = "intermediate",
        duration_hours: int = 4
    ) -> Dict[str, Any]:
        """Generate a new coding mission based on theme and parameters."""
        messages = [
            {"role": "system", "content": self.SYSTEM_PROMPT},
            {"role": "user", "content": f"""Create a coding challenge with:
            Theme: {theme}
            Difficulty: {difficulty}
            Time: {duration_hours} hours
            
            Include:
            1. Background/context
            2. Technical requirements
            3. Expected deliverables
            4. Evaluation criteria
            5. Collaboration guidance
            """}
        ]
        
        response = await chat_completion(messages, temperature=0.8)
        return {
            "theme": theme,
            "difficulty": difficulty,
            "duration_hours": duration_hours,
            "description": response["text"],
            "metadata": response["usage"]
        }


class CodeReviewer:
    """Provides automated code review using GPT."""
    
    SYSTEM_PROMPT = """You are an expert code reviewer focusing on code quality,
    best practices, and potential improvements. Provide constructive feedback that
    helps developers grow while maintaining a positive, encouraging tone."""
    
    async def review_code(
        self,
        code: str,
        language: str,
        context: Optional[str] = None
    ) -> Dict[str, Any]:
        """Review code submission and provide structured feedback."""
        messages = [
            {"role": "system", "content": self.SYSTEM_PROMPT},
            {"role": "user", "content": f"""Review this {language} code:
            
            Context: {context or 'No additional context provided'}
            
            Code:
            ```{language}
            {code}
            ```
            
            Provide:
            1. Overall assessment
            2. Code quality highlights
            3. Potential improvements
            4. Best practices followed
            5. Security considerations
            """}
        ]
        
        response = await chat_completion(messages, temperature=0.4)
        return {
            "feedback": response["text"],
            "metadata": response["usage"]
        }


# Singleton instances
mission_generator = MissionGenerator()
code_reviewer = CodeReviewer()