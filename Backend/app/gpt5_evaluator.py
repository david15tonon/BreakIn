import os
import json
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from openai import OpenAIError

# ----------------------------
# Load API key
# ----------------------------
load_dotenv()
GPT5_API_KEY = os.getenv("GPT5_API_KEY")
if not GPT5_API_KEY:
    raise ValueError("GPT5_API_KEY not found in environment. Set it in your .env file.")

CONFIG = {"recursion_limit": 100}

# ----------------------------
# Initialize GPT-5 (OpenAI)
# # ----------------------------
# try:
#     llm = ChatOpenAI(
#         model_name="gpt-5",
#         temperature=0,
#         api_key=GPT5_API_KEY
#     )
# except OpenAIError as e:
#     print("OpenAI API error:", e)

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")

# ----------------------------
# System Instructions
# ----------------------------
EVALUATOR_SYSINT = SystemMessage(
    content="""
You are an Expert Talent Evaluator AI for software teams.
You combine quantitative metrics (commits, PRs, bugs, test coverage, refactor acceptance, autonomy) 
with qualitative evaluation (code quality, modularity, creativity, collaboration, documentation). 

Evaluate the team and each developer. Include:

1. Team overview:
   - Overall score (0-100)
   - Breakdown: delivery, code quality, collaboration, creativity
   - Observed limitations
   - Comments/recommendations

2. For each developer:
   - Individual score (0-100)
   - Breakdown: code quality, contribution, collaboration, creativity
   - Strengths
   - Growth recommendations
   - Comments

3. Be bold, provide actionable insights, highlight hidden potential, suggest mentorship or upskilling opportunities.

Respond STRICTLY in JSON format.
"""
)

# ----------------------------
# Evaluator Function
# ----------------------------
def evaluate_team_llm(team_data: dict) -> dict:
    """
    Input: team_data (dict) with team info, developers, features, and metrics
    Output: dict with team_score, team_breakdown, individual_scores with recommendations
    """
    prompt = f"""
Team Data:
{json.dumps(team_data, indent=2)}

Return JSON including:
- team_score (0-100)
- team_breakdown: delivery, code_quality, collaboration, creativity, comments
- individual_scores: name, score, breakdown (code_quality, contribution, collaboration, creativity), strengths, growth_suggestions, comments
- highlight hidden potential and areas for innovation
"""
    try:
        response = llm.invoke([EVALUATOR_SYSINT, HumanMessage(content=prompt)])
        # Clean raw response
        raw = response.content.strip().replace("```json", "").replace("```", "")
        data = json.loads(raw)

        # Optional: enrich data with calculated quantitative weights
        # Example: weight commits, PRs, test coverage into contribution score
        for dev in data.get("individual_scores", []):
            metrics = next((d.get("metrics", {}) for d in team_data.get("developers", []) if d.get("name") == dev.get("name")), {})
            if metrics:
                contribution_score = (
                    metrics.get("commits", 0) * 0.2 +
                    metrics.get("prs_merged", 0) * 0.3 +
                    metrics.get("bugs_fixed", 0) * 0.25 +
                    metrics.get("test_coverage", 0) * 20
                )
                # normalize to 0-100
                dev['breakdown']['contribution'] = min(100, int(contribution_score))
        return data

    except Exception as e:
        return {
            "team_score": 0,
            "team_breakdown": {
                "delivery": 0,
                "code_quality": 0,
                "collaboration": 0,
                "creativity": 0,
                "comments": f"Evaluation failed: {str(e)}"
            },
            "individual_scores": [],
            "error": str(e),
            "raw_response": raw if 'raw' in locals() else ""
        }

