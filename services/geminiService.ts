import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, RefactoredFile, Vulnerability, MockFile } from "../types";

const SYSTEM_INSTRUCTION = `
You are "The Legacy Code Archaeologist", a world-class DevOps and Security Refactoring Agent. 
Your mission is to analyze legacy codebases (specifically Python 2.7), identify critical security vulnerabilities (OWASP Top 10), and generate a complete modernization plan to Python 3.12+.
You utilize a massive context window to understand global dependencies.

You MUST return the response in valid JSON format matching the specified schema.
`;

export const analyzeLegacyCode = async (files: MockFile[]): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is set.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Construct the prompt with file contents
  let prompt = "Here is the legacy codebase content:\n\n";
  files.forEach(f => {
    prompt += `--- FILE: ${f.name} ---\n${f.content}\n\n`;
  });
  prompt += `
  Analyze these files.
  1. Identify security vulnerabilities (e.g., SQL injection, pickle usage, obsolete libs).
  2. Refactor the code to Python 3.12 (add type hints, remove python 2 syntax like 'print', replace insecure libs).
  3. Provide a summary of the modernization.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      summary: { type: Type.STRING, description: "Executive summary of the refactoring job." },
      vulnerabilities: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            severity: { type: Type.STRING, enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"] },
            type: { type: Type.STRING },
            description: { type: Type.STRING },
            location: { type: Type.STRING, description: "File and line number approximation" }
          },
          required: ["severity", "type", "description", "location"]
        }
      },
      files: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            filename: { type: Type.STRING },
            originalContent: { type: Type.STRING },
            newContent: { type: Type.STRING, description: "The complete refactored Python 3.12 code" },
            changesSummary: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of specific changes made (e.g., 'Replaced pickle with json')"
            }
          },
          required: ["filename", "originalContent", "newContent", "changesSummary"]
        }
      }
    },
    required: ["summary", "vulnerabilities", "files"]
  };

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using the high-reasoning model for code
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        // High budget for thinking about complex refactoring if needed, though standard inference is usually enough for this demo scale
        thinkingConfig: { thinkingBudget: 1024 }, 
      }
    });

    const text = result.text;
    if (!text) throw new Error("No response from Gemini");

    const parsed = JSON.parse(text);
    
    // Calculate a fake "Tokens Used" for display, as the API doesn't always return usage in the simple response object wrapper in JS SDK immediately accessible in the same way.
    // We can estimate or just mock it for the "2M Window" effect.
    const tokensUsed = prompt.length / 4 + text.length / 4; 

    return {
      ...parsed,
      tokensUsed: Math.floor(tokensUsed)
    };

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};
