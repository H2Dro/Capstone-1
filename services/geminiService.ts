

import { GoogleGenAI, GenerateContentResponse, Type, Tool, HarmCategory, HarmBlockThreshold } from "@google/genai";

const tools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "navigate_to",
        description: "Navigate to a specific section of the app.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            view: { 
              type: Type.STRING, 
              description: "The target view. Options: DASHBOARD, ACTIVITIES, MEDICATIONS, APPOINTMENTS, LIFE_360, SETTINGS, ACCOUNT, INJURY_LOG, PATIENT_PORTAL" 
            }
          },
          required: ["view"]
        }
      },
      {
        name: "add_activity",
        description: "Schedule a new activity for the user.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Name of the activity" },
            time: { type: Type.STRING, description: "Time of the activity (e.g., 10:00 AM)" },
            icon: { type: Type.STRING, description: "Icon name: church, pool, cooking, gardening, exercise, art, music" }
          },
          required: ["title", "time"]
        }
      },
      {
        name: "add_medication",
        description: "Add a new medication with inventory tracking.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Name of the medication" },
            dosage: { type: Type.STRING, description: "Dosage (e.g., 10mg)" },
            time: { type: Type.STRING, description: "Time to take it (e.g., 8:00 AM)" },
            purpose: { type: Type.STRING, description: "What it's for" },
            type: { type: Type.STRING, description: "Form: Tablet, Capsule, Liquid, Cream" },
            stockQuantity: { type: Type.NUMBER, description: "How many pills/ml are starting in the bottle" },
            refillThreshold: { type: Type.NUMBER, description: "When to remind the user to refill (e.g., when 5 are left)" }
          },
          required: ["name", "dosage", "time"]
        }
      }
    ]
  }
];

export interface AssistantResponseData {
  text: string;
  toolCalls: any[];
}

export const generateAssistantResponse = async (
  prompt: string,
  context: string
): Promise<AssistantResponseData> => {
  // Guideline: Initialize GoogleGenAI right before the call and use named parameter for apiKey
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      // Guideline: Use 'gemini-3-flash-preview' for basic text-based tasks
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: tools,
        systemInstruction: `You are Elanor's warm companion. You help her track her schedule and health.
        
        Inventory tracking: You can help her check how much medication she has left. 
        If she asks about stock, look at the current context.
        Current App Context: ${context}.`,
        safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ],
      },
    });

    // Guideline: Access generated text via the .text property
    const modelText = response.text || "";
    // Guideline: Access function calls via the .functionCalls property
    const toolCalls = response.functionCalls || [];

    return { text: modelText, toolCalls };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "I'm having trouble connecting.", toolCalls: [] };
  }
};