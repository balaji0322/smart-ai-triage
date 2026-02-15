import json
import logging
from typing import Dict, Any, Optional
from google import genai
from google.genai import types

from app.core.config import settings

logger = logging.getLogger(__name__)

class GeminiAIService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model = settings.GEMINI_MODEL
        self.max_retries = 3
    
    def _build_medical_prompt(self, symptoms: Dict[str, Any], vitals: Dict[str, Any], medical_history: Optional[str] = None) -> str:
        prompt = f"""You are a medical AI assistant specialized in patient triage. Analyze the following patient data and provide a structured assessment.

Patient Symptoms: {json.dumps(symptoms, indent=2)}
Vital Signs: {json.dumps(vitals, indent=2)}
Medical History: {medical_history or "None provided"}

Provide your assessment in the following JSON format ONLY (no additional text):
{{
  "risk_level": "critical|high|moderate|low",
  "priority_score": <integer 1-10>,
  "ai_confidence": <float 0.0-1.0>,
  "primary_concerns": ["concern1", "concern2"],
  "recommendations": "Detailed medical recommendations",
  "reasoning": "Brief explanation of the assessment"
}}

Ensure the response is valid JSON."""
        return prompt
    
    def _validate_response(self, response: Dict[str, Any]) -> bool:
        required_fields = ["risk_level", "priority_score", "ai_confidence", "recommendations"]
        valid_risk_levels = ["critical", "high", "moderate", "low"]
        
        for field in required_fields:
            if field not in response:
                logger.error(f"Missing required field: {field}")
                return False
        
        if response["risk_level"] not in valid_risk_levels:
            logger.error(f"Invalid risk_level: {response['risk_level']}")
            return False
        
        if not isinstance(response["priority_score"], int) or not (1 <= response["priority_score"] <= 10):
            logger.error(f"Invalid priority_score: {response['priority_score']}")
            return False
        
        if not isinstance(response["ai_confidence"], (int, float)) or not (0 <= response["ai_confidence"] <= 1):
            logger.error(f"Invalid ai_confidence: {response['ai_confidence']}")
            return False
        
        return True
    
    async def analyze_patient(
        self,
        symptoms: Dict[str, Any],
        vitals: Dict[str, Any],
        medical_history: Optional[str] = None
    ) -> Dict[str, Any]:
        prompt = self._build_medical_prompt(symptoms, vitals, medical_history)
        
        for attempt in range(self.max_retries):
            try:
                logger.info(f"Calling Gemini AI (attempt {attempt + 1}/{self.max_retries})")
                
                response = self.client.models.generate_content(
                    model=self.model,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        temperature=0.3,
                        max_output_tokens=1000,
                    )
                )
                
                response_text = response.text.strip()
                
                if response_text.startswith("```json"):
                    response_text = response_text[7:]
                if response_text.endswith("```"):
                    response_text = response_text[:-3]
                response_text = response_text.strip()
                
                parsed_response = json.loads(response_text)
                
                if self._validate_response(parsed_response):
                    logger.info("Successfully received and validated AI response")
                    return parsed_response
                else:
                    logger.warning(f"Invalid response format on attempt {attempt + 1}")
                    
            except json.JSONDecodeError as e:
                logger.error(f"JSON decode error on attempt {attempt + 1}: {str(e)}")
            except Exception as e:
                logger.error(f"AI service error on attempt {attempt + 1}: {str(e)}")
        
        logger.error("All retry attempts failed, returning fallback response")
        return self._get_fallback_response()
    
    def _get_fallback_response(self) -> Dict[str, Any]:
        return {
            "risk_level": "moderate",
            "priority_score": 5,
            "ai_confidence": 0.0,
            "primary_concerns": ["Unable to analyze - AI service unavailable"],
            "recommendations": "Manual assessment required. AI service temporarily unavailable.",
            "reasoning": "Fallback response due to AI service failure"
        }

gemini_service = GeminiAIService()
