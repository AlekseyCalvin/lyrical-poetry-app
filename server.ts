import express from 'express';
import dotenv from 'dotenv';
import { z } from 'zod';
import OpenAI from 'openai';
import Instructor from '@instructor-ai/instructor';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

// CORS — needed for Tauri desktop app
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (_req.method === 'OPTIONS') { res.sendStatus(204); return; }
  next();
});

const DEFAULT_BASE_URL = process.env.LLM_BASE_URL || 'https://openrouter.ai/api/v1';
const DEFAULT_API_KEY = process.env.LLM_API_KEY || '';
const DEFAULT_MODEL = process.env.LLM_MODEL || 'arcee-ai/trinity-large-preview:free';
const PORT = process.env.SERVER_PORT || 3001;

interface LLMConfig { baseUrl: string; apiKey: string; model: string; strictMode?: boolean; }
interface ChatMessage { role: 'system' | 'user' | 'assistant'; content: string; }

function getConfig(body: any): LLMConfig {
  return {
    baseUrl: body.llmBaseUrl || DEFAULT_BASE_URL,
    apiKey: body.llmApiKey || DEFAULT_API_KEY,
    model: body.llmModel || DEFAULT_MODEL,
    strictMode: body.llmStrictMode !== false,
  };
}

async function callLLM(config: LLMConfig, messages: ChatMessage[], temperature = 0.7): Promise<string> {
  console.log(`[LLM] Calling ${config.model} at ${config.baseUrl}`);
  const res = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://lyrical-poetry-app.local',
      'X-Title': 'LYRICAL Poetry App',
    },
    body: JSON.stringify({ model: config.model, messages, temperature, max_tokens: 4096 }),
  });
  if (!res.ok) {
    const errText = await res.text();
    console.error(`[LLM] API error ${res.status}:`, errText.slice(0, 500));
    throw new Error(`LLM API error ${res.status}: ${errText}`);
  }
  const data: any = await res.json();
  const content = data.choices?.[0]?.message?.content || '';
  console.log(`[LLM] Response received (${content.length} chars)`);
  return content;
}

function extractJSON(text: string): any {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  try { return JSON.parse(cleaned); } catch { }
  const codeBlockMatches = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/g);
  if (codeBlockMatches) {
    for (const block of codeBlockMatches) {
      const inner = block.replace(/```(?:json)?\s*\n?/, '').replace(/\n?\s*```$/, '').trim();
      try { return JSON.parse(inner); } catch { }
    }
  }
  let braceDepth = 0, jsonStart = -1;
  for (let i = 0; i < cleaned.length; i++) {
    if (cleaned[i] === '{') { if (braceDepth === 0) jsonStart = i; braceDepth++; }
    else if (cleaned[i] === '}') {
      braceDepth--; if (braceDepth === 0 && jsonStart !== -1) {
        try { return JSON.parse(cleaned.slice(jsonStart, i + 1)); } catch { break; }
      }
    }
  }
  throw new Error('Could not extract valid JSON from LLM response');
}

// ── Poetry Engine ─────────────────────────────────────────────────────────

import {
  loadCmuDict,
  analyzeLineScansion,
  detectRhymeScheme,
  validatePoem,
  countLineSyllables,
  generateRhymeWordSets,
  findRhymesFor,
  scoreMeterAdherence,
  findWordsWithStress,
  getEndPhonemes,
  classifyRhymeMatch,
  type CmuDict,
} from './poetry_engine.js';

const cmuDict: CmuDict = loadCmuDict();

// ── Registries ────────────────────────────────────────────────────────────

import { METER_REGISTRY, FOOT_REGISTRY, FORM_REGISTRY } from './registries.js';

// ── DAG Pipeline Schemas & Helpers ────────────────────────────────────────

import { compileDeterministicBlueprint, extractRequiredRhymeFamilies } from './dag_schemas.js';

import { SYSTEM_PROMPT_ORGANIC_COMPOSER, SYSTEM_PROMPT_HEALER, buildOrganicCompositionPrompt, buildRepairPrompt, buildMeterGridInfo, BlueprintLine } from './prompt_templates.js';
import { buildOrganicPoemSchema, OrganicPoemResult } from './organic_schema.js';
import { evaluateFabbHalleScansion } from './poetry_engine.js';

import { analyzePoemCliches } from './cliche_filter.js';

// ── Legacy schemas (kept for analyze/compare endpoints) ───────────────────

import { buildDynamicDraftSchema, PoemAnalysisSchema, PoemRevisionSchema } from './schemas.js';

// ── Text Normalization ────────────────────────────────────────────────────

/**
 * Normalize text to remove ALL-CAPS stress notation that LLMs sometimes copy
 * from our meter examples. E.g., "TENderly TWISTing" → "Tenderly twisting"
 */
function normalizeLineText(text: string): string {
  return text.replace(/\b([A-Z]{2,})([a-z]+)/g, (_, caps, rest) => {
    return caps.charAt(0) + caps.slice(1).toLowerCase() + rest;
  }).replace(/\b([A-Z]{2,})\b/g, (match) => {
    if (match.length <= 1) return match;
    return match.charAt(0) + match.slice(1).toLowerCase();
  });
}

// ── Structured LLM Call (OpenRouter response_format) ──────────────────────

/**
 * Call the LLM with OpenRouter structured output enforcement.
 * Uses response_format + response-healing plugin for robust JSON.
 */
async function callLLMStructured<T>(
  config: LLMConfig,
  messages: ChatMessage[],
  responseFormat: any,
  temperature = 0.7,
): Promise<T> {
  console.log(`[LLM-Structured] Calling ${config.model} with schema: ${responseFormat?.json_schema?.name || 'unknown'}`);
  const res = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://lyrical-poetry-app.local',
      'X-Title': 'LYRICAL Poetry App',
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature,
      max_tokens: 8192,
      response_format: responseFormat,
      plugins: [{ id: 'response-healing' }],
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    console.error(`[LLM-Structured] API error ${res.status}:`, errText.slice(0, 500));
    throw new Error(`LLM API error ${res.status}: ${errText}`);
  }
  const data: any = await res.json();
  const content = data.choices?.[0]?.message?.content || '';
  console.log(`[LLM-Structured] Response received (${content.length} chars)`);

  try {
    return JSON.parse(content) as T;
  } catch {
    // Fallback: try extracting JSON from potential wrapper text
    const match = content.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]) as T;
    throw new Error('Failed to parse structured LLM response as JSON');
  }
}

// ── Phonetic Distance (for rhyme family cross-contamination prevention) ───

function stripStress(phoneme: string): string {
  if (phoneme.length > 0 && '012'.includes(phoneme[phoneme.length - 1])) {
    return phoneme.slice(0, -1);
  }
  return phoneme;
}

/**
 * Compute phonetic distance between two end-rhyme patterns.
 * Returns 0 (identical) to 1 (completely different).
 * Used to enforce that rhyme families A and B are distinct.
 */
function computePhoneticDistance(endA: string[][], endB: string[][]): number {
  if (endA.length === 0 || endB.length === 0) return 1;
  let minDist = 1;
  for (const a of endA) {
    for (const b of endB) {
      const aStripped = a.map(stripStress);
      const bStripped = b.map(stripStress);
      const maxLen = Math.max(aStripped.length, bStripped.length);
      if (maxLen === 0) continue;
      let matches = 0;
      const minLen = Math.min(aStripped.length, bStripped.length);
      for (let i = 0; i < minLen; i++) {
        if (aStripped[aStripped.length - 1 - i] === bStripped[bStripped.length - 1 - i]) matches++;
      }
      const dist = 1 - (matches / maxLen);
      if (dist < minDist) minDist = dist;
    }
  }
  return minDist;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMPOSE ENDPOINT — 5-Stage DAG Pipeline
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// Stage 1: Compile Symbolic Blueprint     (deterministic, no LLM)
// Stage 2: Thematic Rhyme Discovery       (1 structured LLM call + CMU filter)
// Stage 3: Line-by-Line Generation        (N structured LLM calls, anchor-first)
// Stage 4: Targeted Repair                (0-2 structured LLM calls per failure)
// Stage 5: Whole-Poem Validation          (deterministic, same response shape)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.post('/api/compose', async (req, res) => {
  try {
    const config = getConfig(req.body);
    const { meter, foot, form, theme, acrostic } = req.body;

    const formDef = FORM_REGISTRY[form];
    const meterDef = METER_REGISTRY[meter];
    const footDef = FOOT_REGISTRY[foot];

    if (!formDef || !meterDef || !footDef) {
      throw new Error("Invalid formulation details requested. Ensure meter, foot, and form match registries.");
    }

    console.log(`\n[Stage 1] Compiling Blueprint for ${form} in ${meter} ${foot}...`);

    const blueprint = compileDeterministicBlueprint(form, meter, foot, theme || 'nature', acrostic || null);
    const { grid: meterGrid, sonicRhythm } = buildMeterGridInfo(meterDef.pattern, footDef.multiplier);
    const syllablesPerLine = blueprint.global_parameters.total_syllables_per_line;

    // Flatten all line slots to construct the chronological layout
    const allSlots = blueprint.stanza_blueprints.flatMap(s => s.line_slots);
    const totalLines = allSlots.length;

    const blueprintLines: BlueprintLine[] = allSlots.map((slot, idx) => ({
      lineId: `L${idx + 1}`,
      rhymeLetter: slot.rhyme_designator,
      isRepeat: slot.semantic_role === 'refrain',
      repeatSourceId: slot.is_exact_repetition_of || undefined,
      acrosticChar: acrostic ? acrostic[idx % acrostic.length] : undefined
    }));

    console.log(`[Stage 1] Blueprint: ${totalLines} lines, ${syllablesPerLine} syl/line`);
    console.log(`[Stage 1] Grid: ${meterGrid}`);

    console.log(`\n[Stage 2] Generating Organic Poem via Schema...`);
    
    const organicPrompt = buildOrganicCompositionPrompt(
      theme || 'nature', form, formDef.rules, meterDef.name, footDef.name,
      meterGrid, sonicRhythm, syllablesPerLine, blueprintLines
    );

    const schema = buildOrganicPoemSchema(totalLines, config.strictMode !== false);

    let poemResult: OrganicPoemResult;
    try {
      poemResult = await callLLMStructured<OrganicPoemResult>(
        config,
        [
          { role: 'system', content: SYSTEM_PROMPT_ORGANIC_COMPOSER },
          { role: 'user', content: organicPrompt }
        ],
        schema,
        0.85
      );
    } catch (err: any) {
      console.error("[Stage 2] Error generating poem:", err);
      return res.status(500).json({ error: "Failed to generate poetry securely. " + err.message });
    }

    console.log(`\n[Stage 3] Evaluating Fabb-Halle Scansion & Assembling Output...`);
    
    const finalLines = [];
    let cumulativeMeterScore = 0;

    for (let i = 0; i < poemResult.lines.length; i++) {
        const line = poemResult.lines[i];
        const slot = allSlots[i];
        
        const evalResult = evaluateFabbHalleScansion(line.text, meterDef.pattern.split(' '), footDef.multiplier, cmuDict);
        
        cumulativeMeterScore += evalResult.meterScore;
        
        // Classify divergence type per syllable for frontend display
        const classifyLocalDivergence = (actual: string, expected: string, isDivergent: boolean): string => {
            if (isDivergent) return 'extrametrical';
            if (actual === expected) return 'none';
            if (actual === '/' && expected === 'u') return 'stress_demotion';
            if (actual === 'u' && expected === '/') return 'stress_promotion';
            if (actual === '\\' && expected === 'u') return 'secondary_on_weak';
            return 'mismatch';
        };
        
        // Map directly from Fabb-Halle explicit syllables. Show ACTUAL lexical stress — including secondary stress.
        const syllables = evalResult.mappedSyllables.map(m => {
            // Preserve the full stress distinction: /, \\, u
            let displayStress = 'u';
            if (m.actualStress === '/') {
                displayStress = '/';
            } else if (m.actualStress === '\\') {
                displayStress = '\\'; // Preserve secondary stress for UI rendering
            } else {
                displayStress = 'u';
            }

            return {
                syllable: m.syllable,
                stress: displayStress,
                isDivergent: m.isDivergent,
                divergenceType: classifyLocalDivergence(m.actualStress, m.expectedStress, m.isDivergent),
                expectedSlot: m.expectedStress === '/' ? 'S' : 'W'
            };
        });
        
        const words = line.text.split(/\s+/).filter(w => w);
        const lastWord = words[words.length - 1]?.replace(/[^a-zA-Z]/g, '').toLowerCase() || '';

        finalLines.push({
            syllables,
            rhymeSound: slot.rhyme_designator,
            rhymeWord: lastWord,
            meterAdherence: evalResult.meterScore,
            rhymeType: line.rhyme_type || 'perfect',
            divergences: evalResult.divergences,
            isBlank: false
        });
        
        console.log(`[FH] L${i+1} Target=${syllablesPerLine} | Ortho=${evalResult.orthographicSyllables} | Poetic=${evalResult.poeticSyllables} | Div=[${evalResult.divergences.join(',')}] | Score=${Math.round(evalResult.meterScore)}`);
        console.log(`     Text: ${line.text}`);
    }

    const validateResult = validatePoem(
        poemResult.lines.map(l => l.text), 
        syllablesPerLine, 
        formDef.rhyme_scheme, 
        meterDef.pattern.split(' '), 
        footDef.multiplier, 
        cmuDict
    );
    const clicheAnalysis = analyzePoemCliches(
        poemResult.lines.map((line) => line.text),
        { theme: theme || '', allowExactLineRepeats: true }
    );

    const avgMeter = finalLines.length > 0 ? Math.round(cumulativeMeterScore / finalLines.length) : 0;

    const payload = {
        lines: finalLines,
        explanation: `${form} in ${meterDef.name} ${footDef.name} (${syllablesPerLine} syllables/line, ${formDef.rhyme_scheme} rhyme scheme)`,
        detectedRhymeScheme: validateResult.actualRhymeScheme || '',
        validationPassed: validateResult.allOk,
        meterAdherence: avgMeter,
        clicheScore: clicheAnalysis.score,
        clicheAnalysis: {
            repeatedEndWords: clicheAnalysis.repeatedEndWords,
            repeatedBigrams: clicheAnalysis.repeatedBigrams,
            repeatedImageWords: clicheAnalysis.repeatedImageWords,
            flaggedLines: clicheAnalysis.lines
                .map((analysis, index) => ({
                    lineNumber: index + 1,
                    score: analysis.score,
                    hits: analysis.hits.map((hit) => ({
                        type: hit.type,
                        snippet: hit.snippet,
                        source: hit.source,
                        score: hit.score
                    }))
                }))
                .filter((line) => line.score > 0)
        },
        rhymeFamiliesUsed: {},
        semanticArc: poemResult.semantic_arc,
        tonalRegister: "Organic Composed"
    };

    res.json(payload);

  } catch (error: any) {
    console.error('[API Compose Error]', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});



app.listen(PORT, () => {
  console.log(`\\n🪶 LYRICAL API server running on http://localhost:\${PORT}`);
  console.log(`   Default Model: \${DEFAULT_MODEL}`);
  console.log(`   Default Base URL: \${DEFAULT_BASE_URL}\\n`);
});
