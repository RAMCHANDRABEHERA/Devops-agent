import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, RefactoredFile, Vulnerability, MockFile } from "../types";

const SYSTEM_INSTRUCTION = `
You are "The Legacy Code Archaeologist", an advanced AI DevOps agent running on Google Cloud Run.
Your capabilities include processing massive context windows (up to 2 million tokens) to understand global project dependencies.

Your goal:
1. Analyze legacy Python 2.7 repositories.
2. Identify security vulnerabilities (OWASP Top 10).
3. Modernize code to Python 3.12+.
4. Generate a professional GitHub Pull Request description explaining your changes.

You MUST return the response in valid JSON format matching the specified schema.
`;

export const analyzeLegacyCode = async (files: MockFile[]): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is set.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Construct the prompt with file contents
  let prompt = "Here is the legacy codebase content (simulating full repo context):\n\n";
  files.forEach(f => {
    prompt += `--- FILE: ${f.name} ---\n${f.content}\n\n`;
  });
  prompt += `
  Perform a deep analysis of these files.
  1. Identify security vulnerabilities (e.g., SQL injection, pickle usage, obsolete libs).
  2. Refactor the code to Python 3.12 (add type hints, remove python 2 syntax, replace insecure libs).
  3. specific attention: Replace 'cPickle' with 'json' or 'pickle' with safety checks.
  4. specific attention: Fix SQL injection in queries.
  
  Generate a Pull Request object with a title, a markdown description, and the refactored files.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      prTitle: { type: Type.STRING, description: "A concise, conventional commit style PR title (e.g., 'refactor: upgrade to python 3.12 and fix vulnerabilities')" },
      prDescription: { type: Type.STRING, description: "A detailed Pull Request description in Markdown format. Include 'Summary of Changes', 'Security Fixes', and 'Verification Steps'." },
      summary: { type: Type.STRING, description: "Short executive summary." },
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
    required: ["prTitle", "prDescription", "summary", "vulnerabilities", "files"]
  };

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', 
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: { thinkingBudget: 1024 }, 
      }
    });

    const text = result.text;
    if (!text) throw new Error("No response from Gemini");

    const parsed = JSON.parse(text);
    
    // Mock token usage to demonstrate "2M Context" scale in the UI
    // In a real app, we would read usageMetadata
    const tokensUsed = 45000 + Math.floor(Math.random() * 5000); 

    return {
      ...parsed,
      tokensUsed
    };

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};