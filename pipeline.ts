import OpenAI from "openai";
import Instructor from "@instructor-ai/instructor";
import { executePoetryMCPTool } from "./mcp_client";
import { METER_REGISTRY, FOOT_REGISTRY, FORM_REGISTRY } from "./registries";
import { buildDynamicDraftSchema, PoemAnalysisSchema, PoemRevisionSchema } from "./schemas";

const openRouterClient = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: { "HTTP-Referer": "https://lyrical.app", "X-Title": "LYRICAL" }
});

const client = Instructor({
  client: openRouterClient,
  mode: "JSON", 
});

const MODEL = "arcee-ai/trinity-large-preview:free";

export async function generateFormalPoem(meterKey: string, footKey: string, formKey: string, theme: string) {
  const formDef = FORM_REGISTRY[formKey];
  const meterDef = METER_REGISTRY[meterKey];
  const footDef = FOOT_REGISTRY[footKey];

  const targetBlueprint = Array(footDef.multiplier).fill(meterDef.pattern).join(" ");
  const targetSyllables = meterDef.pattern.replace(/ /g, "").length * footDef.multiplier;
  const DynamicDraftSchema = buildDynamicDraftSchema(formKey, meterKey, footKey);

  const systemConstraints = `
    You are a master formalist poet executing a strict SCoT constrained-decoding template.
    
    TARGET ARCHITECTURE:
    - Form: ${formKey} (${formDef.lines} lines) | Rhyme Scheme: ${formDef.rhyme_scheme}
    - Rules: ${formDef.rules}
    
    PROSODY RULES (PER LINE):
    - Meter/Foot: ${meterKey} ${footKey}
    - Required Phonetic Blueprint: "${targetBlueprint}" (${targetSyllables} syllables)
    
    IDENTICITY MECHANICS:
    If the form requires a repeated word/line, you MUST explicitly declare the word to repeat in 'exact_word_repetition' or the line number in 'exact_line_repetition'. Otherwise, use null.
  `;

  // ==========================================
  // PHASE 1: DRAFTING (SCoT Enforced)
  // ==========================================
  const draftResponse = await client.chat.completions.create({
    model: MODEL,
    response_model: { schema: DynamicDraftSchema, name: "PoemDraft" },
    messages: [
      { role: "system", content: systemConstraints },
      { role: "user", content: `Compose a poem based on the theme: ${theme}` }
    ],
    extra_body: { reasoning: { enabled: true } } // Triggers OpenRouter reasoning models
  });

  const compiledDraftText = draftResponse.lines.map(l => l.text).join('\n');

  // ==========================================
  // PHASE 2: ANALYSIS (LLM vs Objective CMUdict)
  // ==========================================
  const mcpAnalysisJSON = await executePoetryMCPTool("analyze_poem", { text: compiledDraftText });

  const analysisPrompt = `
    Compare the Draft's intended constraints against the external CMUdict phonetic breakdown.
    Draft Data: ${JSON.stringify(draftResponse, null, 2)}
    External CMUdict Analysis: ${mcpAnalysisJSON}
    Identify any misalignments in syllable count, stress placement, identicity, or end-rhymes.
  `;

  const analysisResponse = await client.chat.completions.create({
    model: MODEL,
    response_model: { schema: PoemAnalysisSchema, name: "PoemAnalysis" },
    messages: [
      { role: "system", content: systemConstraints },
      { role: "user", content: analysisPrompt }
    ],
    extra_body: { reasoning: { enabled: true } }
  });

  if (!analysisResponse.needs_revision) {
    return compiledDraftText; // Succeeded on the first pass
  }

  // ==========================================
  // PHASE 3: REVISION (Dictionary Guided)
  // ==========================================
  let mcpCorrectionContext = "";
  for (const error of analysisResponse.misalignments) {
    const lineDraft = draftResponse.lines.find(l => l.line_number === error.line_number);
    if (!lineDraft) continue;

    mcpCorrectionContext += `\n--- LINE ${error.line_number} FIXES ---\nError: ${error.description}`;

    if (error.error_type === "RHYME_FAILURE") {
      const rhymeData = await executePoetryMCPTool("lookup_rhymes", { target_sound: lineDraft.target_rhyme_sound });
      mcpCorrectionContext += `\nStrict Rhyme Vocabulary (MUST USE ONE): ${rhymeData}`;
    }
    if (error.error_type === "METER_MISMATCH" || error.error_type === "SYLLABLE_COUNT_ERROR") {
      const meterData = await executePoetryMCPTool("suggest_words", { stress_pattern: lineDraft.phonetic_blueprint });
      mcpCorrectionContext += `\nMetrically Compliant Words (MATCHES '${lineDraft.phonetic_blueprint}'): ${meterData}`;
    }
  }

  const revisionPrompt = `
    Your draft failed the constraints. Correct misalignments strictly.
    Analysis: ${JSON.stringify(analysisResponse.misalignments, null, 2)}
    
    EXTERNAL DICTIONARY CONSTRAINTS:
    To fix these lines, you MUST utilize the verified vocabulary provided below. Do not invent rhymes; select from the strict vocabulary list.
    ${mcpCorrectionContext}
    
    Produce the final, flawless poem.
  `;

  const finalResponse = await client.chat.completions.create({
    model: MODEL,
    response_model: { schema: PoemRevisionSchema, name: "PoemRevision" },
    messages: [
      { role: "system", content: systemConstraints },
      { role: "assistant", content: JSON.stringify(draftResponse) }, 
      { role: "user", content: revisionPrompt }
    ],
    extra_body: { reasoning: { enabled: true } }
  });

  return finalResponse.final_poem_lines.join('\n');
}