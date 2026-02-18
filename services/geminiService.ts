
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
              description: "The target view. Options: DASHBOARD, ACTIVITIES, MEDICATIONS, APPOINTMENTS, LIFE_360, SETTINGS, ACCOUNT, INJURY_LOG, PATIENT_PORTAL, GAMES, TODAY_DETAIL" 
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
            date: { type: Type.STRING, description: "The date for the activity. Can be relative like 'today', 'tomorrow', 'next Monday', or a specific date like 'Oct 25'." },
            icon: { type: Type.STRING, description: "Icon name: church, pool, cooking, gardening, exercise, art, music, dog, reading, walking, coffee" },
            location: { type: Type.STRING, description: "Optional location name" }
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
            frequency: { type: Type.STRING, description: "How often (Daily, Weekly, As Needed)" }
          },
          required: ["name", "dosage", "time"]
        }
      },
      {
        name: "add_appointment",
        description: "Book a new medical appointment or doctor visit.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            doctorName: { type: Type.STRING, description: "Name of the doctor (e.g., Dr. Smith)" },
            specialty: { type: Type.STRING, description: "Specialty (e.g., Cardiologist, Dentist)" },
            hospital: { type: Type.STRING, description: "Name of the hospital or clinic" },
            date: { type: Type.STRING, description: "Date of visit (e.g., Oct 24)" },
            time: { type: Type.STRING, description: "Time of visit (e.g., 10:30 AM)" }
          },
          required: ["doctorName", "specialty", "date", "time"]
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const now = new Date();
  const todayStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: tools,
        systemInstruction: `You are Elanor's warm companion and GoodSense co-pilot. 
        You help her manage her life by taking actions directly in the app.
        
        Today is: ${todayStr}.
        
        Rules:
        1. When she wants to go somewhere (e.g., "show my meds", "take me to games"), use navigate_to.
        2. When she mentions a new pill, use add_medication.
        3. When she mentions an activity or plan, use add_activity. If she specifies a relative time like "tomorrow", pass that exactly as the 'date' argument.
        4. When she wants to see a doctor or has an appointment, use add_appointment.
        5. Be empathetic and clear. Mention that medications and appointments need caregiver approval.
        
        Current App Context: ${context}.`,
        safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ],
      },
    });

    const modelText = response.text || "";
    const toolCalls = response.functionCalls || [];

    return { text: modelText, toolCalls };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "I'm having trouble connecting.", toolCalls: [] };
  }
};

export const generateActivityDescription = async (title: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a very short, friendly, personal note about the following activity: "${title}". 
      It should sound like it was written by the user themselves as a reminder or a quick thought. 
      Do NOT sound robotic or use "I will" or "User will". 
      Keep it to one short sentence. 
      Example for "Walking": "Going to take a nice stroll and enjoy the fresh air today."`,
    });
    return response.text || "";
  } catch (e) {
    return "Looking forward to this activity!";
  }
};

export interface GeneratedDoctor {
  name: string;
  hospital: string;
  rating: number;
  reviews: number;
  bio: string;
  gender: 'male' | 'female';
}

export const generateDoctorsForSpecialty = async (
  specialty: string, 
  location?: { lat: number; lng: number }
): Promise<GeneratedDoctor[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const locationContext = location 
    ? `located specifically near coordinates latitude ${location.lat.toFixed(4)}, longitude ${location.lng.toFixed(4)}. Please generate hospital and clinic names that sound like they belong in that specific geographic region.` 
    : "in a general metropolitan area.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a list of 4 realistic, high-quality doctor profiles for a senior citizen looking for a ${specialty} ${locationContext}
      Return the data in a JSON array format. 
      Each object must have: name, hospital, rating (float 4.5-5.0), reviews (int 50-300), bio (short sentence about their care style and empathy for seniors), gender ('male' or 'female').`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              hospital: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              reviews: { type: Type.INTEGER },
              bio: { type: Type.STRING },
              gender: { type: Type.STRING, enum: ["male", "female"] }
            },
            required: ["name", "hospital", "rating", "reviews", "bio", "gender"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Failed to generate doctors", error);
    return [];
  }
};
