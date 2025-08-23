import os
import requests
import json
from typing import Dict, List, Optional
from app.models.evaluation import TeamEvaluationRequest, TeamEvaluationResponse

class AIEvaluator:
    def __init__(self):
        self.api_key = os.getenv("GPT_API_KEY", "f5d4cb69537da45c692843f")
        self.base_url = os.getenv("AIML_BASE_URL", "https://api.aimlapi.com/v1")
        self.model = os.getenv("AI_MODEL", "gpt-4o")
    
    async def evaluate_team_performance(self, request: TeamEvaluationRequest) -> TeamEvaluationResponse:
        """Sends data to AI for evaluation and returns results"""
        try:
            # Try to use the real AIML API
            return await self._call_aiml_api_evaluation(request)
            
        except Exception as e:
            print(f"AI evaluation failed: {e}")
            return self._local_evaluation_fallback(request)
    
    async def _call_aiml_api_evaluation(self, request: TeamEvaluationRequest) -> TeamEvaluationResponse:
        """Calls the real AIML API for evaluation"""
        prompt = self._create_evaluation_prompt(request)
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "max_tokens": 2000,
            "temperature": 0.3
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                ai_response = json.loads(result["choices"][0]["message"]["content"])
                return self._parse_ai_response(ai_response, request)
            else:
                print(f"AIML API Error: {response.status_code} - {response.text}")
                return self._local_evaluation_fallback(request)
                
        except Exception as e:
            print(f"Exception during AIML API call: {str(e)}")
            return self._local_evaluation_fallback(request)
    
    def _create_evaluation_prompt(self, request: TeamEvaluationRequest) -> str:
        """Creates evaluation prompt for AI"""
        prompt = f"""
        Evaluate team {request.team} performance for sprint {request.sprint_id}.

        CONTEXT:
        - Duration: {request.sprint_duration} weeks
        - Tasks: {request.completed_tasks}/{request.total_tasks} completed
        - Completion: {(request.completed_tasks/request.total_tasks*100):.1f}%

        FEATURES:
        {self._format_features(request.features)}

        DEVELOPERS:
        {self._format_developers(request.developers)}

        Provide JSON response with this structure:
        {{
            "team_score": 85,
            "team_breakdown": {{
                "delivery": 30,
                "code_quality": 25,
                "collaboration": 20,
                "creativity": 25
            }},
            "individual_scores": [
                {{
                    "name": "Developer Name",
                    "pseudonym": "dev1",
                    "score": 88,
                    "breakdown": {{
                        "code_quality": 25,
                        "contribution": 23,
                        "collaboration": 20,
                        "creativity": 20
                    }},
                    "strengths": ["Strength 1", "Strength 2"],
                    "growth_suggestions": ["Suggestion 1", "Suggestion 2"]
                }}
            ],
            "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
        }}
        """
        return prompt
    
    def _format_features(self, features) -> str:
        """Formats features information"""
        feature_text = ""
        for feature in features:
            status = "✓ On time" if feature.on_time else "✗ Delayed"
            feature_text += f"- {feature.name}: {feature.progress:.1f}% ({feature.done}/{feature.tasks}) {status}\n"
        return feature_text
    
    def _format_developers(self, developers) -> str:
        """Formats developers information"""
        dev_text = ""
        for dev in developers:
            dev_text += f"""
            {dev.name} ({dev.pseudonym}) - {dev.role} [{dev.experience_level}]
            Commits: {dev.commits}, PRs: {dev.prs_opened} opened, {dev.prs_merged} merged
            Bugs: {dev.bugs_fixed} fixed, {dev.bugs_reported} reported
            Coverage: {dev.coverage:.1f}%, LOC: {dev.lines_of_code}
            Reviews: {dev.reviews_given} given, {dev.reviews_received} received
            Creativity: {dev.creativity_points} points
            """
        return dev_text
    
    def _parse_ai_response(self, ai_response: Dict, request: TeamEvaluationRequest) -> TeamEvaluationResponse:
        """Parses AI response into TeamEvaluationResponse"""
        individual_scores = []
        
        for individual_data in ai_response.get("individual_scores", []):
            # Find matching developer
            dev = next((d for d in request.developers if d.pseudonym == individual_data["pseudonym"]), None)
            if dev:
                individual_scores.append({
                    "name": dev.name,
                    "pseudonym": dev.pseudonym,
                    "score": individual_data["score"],
                    "breakdown": individual_data["breakdown"],
                    "strengths": individual_data["strengths"],
                    "growth_suggestions": individual_data["growth_suggestions"]
                })
        
        return TeamEvaluationResponse(
            team_score=ai_response["team_score"],
            team_breakdown=ai_response["team_breakdown"],
            individual_scores=individual_scores,
            recommendations=ai_response["recommendations"]
        )
    
    def _local_evaluation_fallback(self, request: TeamEvaluationRequest) -> TeamEvaluationResponse:
        """Local fallback evaluation when AI is not available"""
        # Simplified evaluation logic
        team_score = int(sum(dev.ai_evaluation.maintainability_index 
                           for dev in request.developers) / len(request.developers) * 100)
        
        individual_scores = []
        for dev in request.developers:
            score = int(dev.ai_evaluation.maintainability_index * 100)
            individual_scores.append({
                "name": dev.name,
                "pseudonym": dev.pseudonym,
                "score": score,
                "breakdown": {
                    "code_quality": score,
                    "contribution": dev.commits * 2,
                    "collaboration": dev.reviews_given * 5,
                    "creativity": dev.creativity_points * 10
                },
                "strengths": ["Reliable code delivery", "Good team collaboration"],
                "growth_suggestions": ["Improve code documentation", "Increase test coverage"]
            })
        
        return TeamEvaluationResponse(
            team_score=team_score,
            team_breakdown={
                "delivery": int((request.completed_tasks / request.total_tasks) * 100),
                "code_quality": team_score,
                "collaboration": 75,
                "creativity": 70
            },
            individual_scores=individual_scores,
            recommendations=[
                "Focus on completing pending tasks",
                "Improve code review process",
                "Increase test coverage"
            ]
        )