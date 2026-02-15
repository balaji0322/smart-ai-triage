import { GoogleGenAI, Type } from "@google/genai";
import { PatientData, AnalysisResult } from "../types";

// Initialize Gemini Client
// NOTE: API Key is assumed to be in process.env.API_KEY per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzePatientTriage = async (patient: PatientData): Promise<AnalysisResult> => {
  const modelId = "gemini-3-flash-preview";
  
  const prompt = `
    You are an expert medical triage AI system designed to analyze patient data and provide risk classification for emergency department triage. You have been trained on millions of patient cases and clinical protocols.

    ═══════════════════════════════════════════════════════════════════════════════
    CORE MISSION
    ═══════════════════════════════════════════════════════════════════════════════

    Analyze patient information and provide:
    1. Risk Level Classification (HIGH, MEDIUM, LOW)
    2. Priority Assignment (P1-IMMEDIATE, P2-URGENT, P3-ROUTINE)
    3. Department Recommendation
    4. Explainable Clinical Reasoning
    5. Confidence Scores
    6. Recommended Actions

    PATIENT DATA INPUT:
    - ID: ${patient.id}
    - Age: ${patient.age}
    - Gender: ${patient.gender}
    - Arrival Time: ${patient.arrivalTime}
    - Symptoms: ${patient.symptoms}
    - Vitals: BP ${patient.vitals.systolic}/${patient.vitals.diastolic}, HR ${patient.vitals.heartRate}, Temp ${patient.vitals.temperature}F, SpO2 ${patient.vitals.spo2}%, RR ${patient.vitals.respiratoryRate}
    - Pre-existing Conditions: ${patient.conditions.join(", ")}

    ═══════════════════════════════════════════════════════════════════════════════
    CRITICAL DECISION RULES
    ═══════════════════════════════════════════════════════════════════════════════
    AUTOMATIC HIGH RISK - IMMEDIATE (P1) IF ANY OF THESE DETECTED:
    1. CARDIAC EMERGENCIES (Chest pain + risk factors, HR <40 or >130, BP >180/120)
    2. STROKE/NEUROLOGICAL (Sudden weakness, speech difficulty, altered mental status)
    3. RESPIRATORY EMERGENCIES (SpO2 <92%, RR >28 or <10)
    4. SEPSIS INDICATORS (Fever + HR >90 + RR >20)
    5. TRAUMA (Severe bleeding, unstable vitals)

    MEDIUM RISK - URGENT (P2):
    - Moderate pain, Fever 100.4-103F, SpO2 92-95%, Moderate abdominal pain.

    LOW RISK - ROUTINE (P3):
    - Minor injuries, Mild symptoms <48h, Stable vitals.

    Provide a structured JSON output with:
    1. Risk Level (HIGH/MEDIUM/LOW)
    2. Confidence Score (0-100)
    3. Priority Code (e.g., P1, P2)
    4. Primary & Secondary Department Recommendations
    5. Top 5 Contributing Factors with influence score (0.0-1.0)
    6. Clinical Reasoning (3-5 bullet points)
    7. Probabilities for High/Medium/Low risk
    8. Recommended immediate actions (checklist)
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: ["HIGH", "MEDIUM", "LOW"] },
            confidence: { type: Type.NUMBER },
            priority: { type: Type.STRING },
            department: {
              type: Type.OBJECT,
              properties: {
                primary: { type: Type.STRING },
                secondary: { type: Type.STRING },
                reasoning: { type: Type.STRING },
                actionTimeline: { type: Type.STRING }
              }
            },
            contributingFactors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  factor: { type: Type.STRING },
                  influence: { type: Type.NUMBER }
                }
              }
            },
            clinicalReasoning: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            probabilities: {
              type: Type.OBJECT,
              properties: {
                high: { type: Type.NUMBER },
                medium: { type: Type.NUMBER },
                low: { type: Type.NUMBER }
              }
            },
            recommendedActions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const result = JSON.parse(text);
    return {
        ...result,
        timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("AI Analysis Failed:", error);
    throw error;
  }
};

export const searchMedicalProtocols = async (query: string) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Search for the latest clinical protocols for: ${query}. Return a short summary of key actions.`,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });
        
        // Extracting text and sources
        const text = response.text;
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        
        const sources = chunks?.map((c: any) => ({
            uri: c.web?.uri,
            title: c.web?.title
        })) || [];

        return { text, sources };
    } catch (e) {
        console.error("Search failed", e);
        return { text: "Unable to fetch protocols at this time.", sources: [] };
    }
}

export const findNearbySpecialists = async (specialty: string, lat: number, long: number) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Find the nearest ${specialty} departments or clinics.`,
            config: {
                tools: [{ googleMaps: {} }],
                toolConfig: {
                    retrievalConfig: {
                        latLng: {
                            latitude: lat,
                            longitude: long
                        }
                    }
                }
            }
        });
        
        return response.text;
    } catch (e) {
        console.error("Maps search failed", e);
        return "Unable to locate specialists at this time.";
    }
}