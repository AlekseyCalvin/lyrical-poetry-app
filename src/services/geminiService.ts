import { GoogleGenAI, Type } from "@google/genai";
import { PoemAnalysis, ComparisonAnalysis, GeneratedPoem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const lineAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    text: { type: Type.STRING },
    syllableCount: { type: Type.INTEGER },
    scansion: { type: Type.STRING, description: "Use 'u' for unstressed, '/' for stressed. e.g. 'u / u /'" },
    feet: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of feet, e.g. ['iamb', 'trochee']" },
    rhymeWord: { type: Type.STRING },
    rhymeSound: { type: Type.STRING, description: "Rhyme label e.g. 'A', 'B', 'C'" },
    devices: { type: Type.ARRAY, items: { type: Type.STRING }, description: "e.g. 'enjambment', 'caesura', 'internal rhyme'" }
  },
  required: ["text", "syllableCount", "scansion", "feet", "rhymeWord", "rhymeSound", "devices"]
};

const stanzaAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    type: { type: Type.STRING, description: "e.g. Quatrain, Tercet" },
    lines: { type: Type.ARRAY, items: lineAnalysisSchema }
  },
  required: ["type", "lines"]
};

const poemAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    theme: { type: Type.STRING },
    mood: { type: Type.STRING },
    suggestedColors: {
      type: Type.OBJECT,
      properties: {
        background: { type: Type.STRING, description: "Hex color code" },
        text: { type: Type.STRING, description: "Hex color code" },
        accent: { type: Type.STRING, description: "Hex color code" }
      },
      required: ["background", "text", "accent"]
    },
    form: { type: Type.STRING },
    rhymeScheme: { type: Type.STRING },
    meter: { type: Type.STRING },
    stanzas: { type: Type.ARRAY, items: stanzaAnalysisSchema },
    overallAnalysis: { type: Type.STRING }
  },
  required: ["theme", "mood", "suggestedColors", "form", "rhymeScheme", "meter", "stanzas", "overallAnalysis"]
};

export async function analyzePoem(text: string): Promise<PoemAnalysis> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Analyze the following poem in deep detail. Pay attention to meter, foot, rhyme scheme, internal rhymes, and poetic devices.
    
Poem:
${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: poemAnalysisSchema,
      systemInstruction: "You are an expert prosodist and poetry analyzer. You understand complex meters (pyrrhic, trochaic, iambic, spondee, dactylic, amphibrachic, anapestis, bacchius, molossus) and forms across multiple languages (especially English and Russian). Provide highly accurate scansion and phonetic analysis."
    }
  });
  
  return JSON.parse(response.text || "{}");
}

export async function compareTranslation(source: string, translation: string): Promise<ComparisonAnalysis> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Compare the source poem and its translation. Analyze both deeply and compare their formal elements (meter, rhyme, syllable count, form).
    
Source:
${source}

Translation:
${translation}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sourceAnalysis: poemAnalysisSchema,
          translationAnalysis: poemAnalysisSchema,
          comparisonNotes: { type: Type.STRING },
          fidelityScore: { type: Type.INTEGER, description: "1-10 score of formal and semantic fidelity" }
        },
        required: ["sourceAnalysis", "translationAnalysis", "comparisonNotes", "fidelityScore"]
      },
      systemInstruction: "You are an expert literary translator and prosodist. Compare the source and translation, noting how well the meter, rhyme, and meaning are preserved or adapted."
    }
  });
  
  return JSON.parse(response.text || "{}");
}

export async function composePoem(
  meter: string,
  foot: string,
  form: string,
  theme: string,
  acrostic: string
): Promise<GeneratedPoem> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Write a poem based on the following constraints.
    
Theme/Topic: ${theme || "Any topic"}
Form: ${form}
Meter: ${meter}
Foot Count: ${foot}
${acrostic ? `Acrostic Word: ${acrostic} (The first letter of each line must spell this word)` : ""}

Provide the poem broken down line by line, and syllable by syllable, with the exact scansion stress mark ('/' for stressed, 'u' for unstressed) for each syllable. Also provide the rhyme sound (e.g., 'A', 'B') and the specific rhyme word for each line. Ensure strict adherence to the requested form's rhyme scheme and line count.

CRITICAL INSTRUCTION: For the \`syllable\` string, you MUST include the trailing space if it is the end of a word (e.g., "sea ", "mid-"). Do NOT add spaces if it is a mid-word syllable. This ensures the words are spaced correctly when rendered side-by-side.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          lines: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                syllables: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      syllable: { type: Type.STRING },
                      stress: { type: Type.STRING, description: "'u' or '/'" }
                    },
                    required: ["syllable", "stress"]
                  }
                },
                rhymeSound: { type: Type.STRING, description: "e.g., 'A', 'B', '-'" },
                rhymeWord: { type: Type.STRING }
              },
              required: ["syllables", "rhymeSound", "rhymeWord"]
            }
          },
          explanation: { type: Type.STRING, description: "Brief explanation of how the form and meter were achieved." }
        },
        required: ["lines", "explanation"]
      },
      systemInstruction: "You are a master poet capable of writing in any strict form and meter. You must strictly follow the requested meter, foot count, and form. Break down the generated text perfectly into syllables and assign the correct stress mark."
    }
  });
  return JSON.parse(response.text || "{}");
}
