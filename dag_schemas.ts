/**
 * LYRICAL DAG Pipeline Schemas
 *
 * Implements the 4-schema Directed Acyclic Graph architecture for structured
 * poetry composition via OpenRouter's `response_format: { type: 'json_schema' }`.
 *
 * Schema 1: PoeticOntologyPlanner  — compile form/meter/foot into a structural DAG
 * Schema 2: ThematicRhymeGraph     — explore theme & discover verified rhyme families
 * Schema 3: LineScansionExecution   — generate a single line with explicit grid mapping
 * Schema 4: ReflectiveCorrection    — repair a failed line with structured diagnostics
 *
 * Each schema exists in two forms:
 *   1. A Zod schema (for Instructor-js / local validation)
 *   2. An OpenRouter response_format object (for native JSON Schema enforcement)
 *
 * References:
 *   - OpenRouterStructuredOutputs.md  (strict: true, additionalProperties: false)
 *   - ZOD_and_InstructorJS_guide.md   (.describe() chain-of-thought pattern)
 *   - Fabb & Halle Bracketed Grid Theory (counting precedes rhythm)
 *   - RETO reflective correction (schema-aware local repair)
 */

import { z } from 'zod';
import { METER_REGISTRY, FOOT_REGISTRY, FORM_REGISTRY } from './registries.js';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPE EXPORTS (for use in server.ts & poetry_engine.ts)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type PoeticOntologyPlan = z.infer<typeof PoeticOntologyPlannerZod>;
export type ThematicRhymePlan = z.infer<typeof ThematicRhymeGraphZod>;
export type LineScansionResult = z.infer<typeof LineScansionExecutionZod>;
export type ReflectiveCorrectionResult = z.infer<typeof ReflectiveCorrectionZod>;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCHEMA 1: Poetic Ontology Planner (The Planner)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// Purpose: Compile selected FORM_REGISTRY, METER_REGISTRY, FOOT_REGISTRY into
// a global structural ontology with stanza blueprints, repetition rules, and
// the Fabb-Halle metrical grid. This is mostly deterministic (backend), but
// the LLM populates the semantic_arc and tonal_direction fields.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const LineSlotZod = z.object({
  line_id: z.string().describe("Unique line identifier, e.g. 'L1', 'A1', 'B2'"),
  rhyme_designator: z.string().describe("Rhyme family letter, e.g. 'A', 'B', 'a', 'b'"),
  is_exact_repetition_of: z.string().nullable().describe(
    "If this line must perfectly replicate a previous line (Madrigal A1=A1, Villanelle refrains), put the source line_id here. Otherwise null."
  ),
  semantic_role: z.string().describe(
    "The narrative function of this line: 'anchor' (establishes a key refrain/image), 'continuation' (advances the argument), 'volta' (thematic turn), 'refrain' (exact structural repetition), 'coda' (closing cadence)."
  ),
});

const StanzaBlueprintZod = z.object({
  stanza_index: z.number().int().describe("0-based stanza number"),
  line_slots: z.array(LineSlotZod).describe("The line slots composing this stanza"),
});

export const PoeticOntologyPlannerZod = z.object({
  global_parameters: z.object({
    theme: z.string().describe("The user-provided theme or starting concept"),
    form_name: z.string().describe("Exact form name from FORM_REGISTRY, e.g. 'Villanelle'"),
    target_meter: z.string().describe("Meter name, e.g. 'Iambic'"),
    target_foot: z.string().describe("Foot name, e.g. 'Pentameter'"),
    total_syllables_per_line: z.number().int().describe("Computed as meter_pattern_length × foot_multiplier"),
    acrostic_word: z.string().nullable().describe("If acrostic mode, the target word; otherwise null"),
  }),
  fabb_halle_metrical_grid: z.string().describe(
    "The abstract Bracketed Grid template repeated for the full line. " +
    "E.g. 'W S W S W S W S W S' for Iambic Pentameter, " +
    "'S W W S W W S W W S W W' for Dactylic Tetrameter."
  ),
  semantic_arc: z.string().describe(
    "A 2-3 sentence arc describing the poem's emotional/narrative trajectory from opening to close. " +
    "This guides tonal coherence across stanzas. Be specific and non-cliché."
  ),
  stanza_blueprints: z.array(StanzaBlueprintZod).describe(
    "The full decomposition of the form into stanzas, each containing ordered line slots."
  ),
});

// OpenRouter response_format version
export const PoeticOntologyPlannerORSchema = {
  type: 'json_schema' as const,
  json_schema: {
    name: 'PoeticOntologyPlanner',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        global_parameters: {
          type: 'object',
          properties: {
            theme: { type: 'string', description: 'The user-provided theme or starting concept' },
            form_name: { type: 'string', description: 'Exact form name from FORM_REGISTRY' },
            target_meter: { type: 'string', description: 'Meter name, e.g. Iambic' },
            target_foot: { type: 'string', description: 'Foot name, e.g. Pentameter' },
            total_syllables_per_line: { type: 'integer', description: 'Computed as meter_pattern_length × foot_multiplier' },
            acrostic_word: { type: ['string', 'null'], description: 'If acrostic mode, the target word; otherwise null' },
          },
          required: ['theme', 'form_name', 'target_meter', 'target_foot', 'total_syllables_per_line', 'acrostic_word'],
          additionalProperties: false,
        },
        fabb_halle_metrical_grid: { type: 'string', description: 'Abstract Bracketed Grid template for the full line, e.g. W S W S W S W S W S for Iambic Pentameter' },
        semantic_arc: { type: 'string', description: 'A 2-3 sentence emotional/narrative trajectory from opening to close' },
        stanza_blueprints: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              stanza_index: { type: 'integer', description: '0-based stanza number' },
              line_slots: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    line_id: { type: 'string', description: "Unique line identifier, e.g. 'L1', 'A1', 'B2'" },
                    rhyme_designator: { type: 'string', description: "Rhyme family letter, e.g. 'A', 'B', 'a', 'b'" },
                    is_exact_repetition_of: { type: ['string', 'null'], description: 'Source line_id for exact repetition, or null' },
                    semantic_role: { type: 'string', description: "anchor, continuation, volta, refrain, or coda" },
                  },
                  required: ['line_id', 'rhyme_designator', 'is_exact_repetition_of', 'semantic_role'],
                  additionalProperties: false,
                },
              },
            },
            required: ['stanza_index', 'line_slots'],
            additionalProperties: false,
          },
        },
      },
      required: ['global_parameters', 'fabb_halle_metrical_grid', 'semantic_arc', 'stanza_blueprints'],
      additionalProperties: false,
    },
  },
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCHEMA 2: Thematic Rhyme Graph (The Explorer)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// Purpose: Force the LLM to explore the semantic space and discover rhyme
// families BEFORE drafting any verse. Each family gets 5-10 candidate
// end-words validated against CMU dict phonetics. Cross-family phonetic
// distance is enforced to prevent "night/light" contamination.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CandidateWordZod = z.object({
  word: z.string().describe("The candidate end-word"),
  syllable_count: z.number().int().describe("Number of syllables in this word"),
  cmu_stress_pattern: z.string().describe("Stress pattern using 1=primary, 2=secondary, 0=unstressed. E.g. '10' for a trochee, '01' for an iamb."),
  is_cliche: z.boolean().describe("Flag as true if the word is a stock poetic cliché (night, light, love, dream, heart, etc.)"),
  semantic_register: z.string().describe("Brief note on the word's register: archaic, literary, colloquial, technical, etc."),
  slant_rhyme_tolerance: z.string().describe("Acceptable near-rhyme phonetic endings for this word, if relevant"),
});

const RhymeFamilyZod = z.object({
  designator: z.string().describe("The rhyme family letter, e.g. 'A', 'B', 'C'"),
  phonetic_anchor: z.string().describe("The target CMU phoneme ending, e.g. 'AY1 T' for '-ight', 'EH1 R' for '-air'. Must be DISTINCT from other families."),
  candidate_lexicon: z.array(CandidateWordZod).min(5).max(12).describe(
    "5-12 unique, thematically rich candidate end-words. " +
    "PREFER polysyllabic words with clear stress patterns. " +
    "AVOID monosyllabic clichés. " +
    "Each word must share the phonetic_anchor ending."
  ),
});

export const ThematicRhymeGraphZod = z.object({
  semantic_domain_mapping: z.string().describe(
    "A vivid, paragraph-length exploration of the theme's semantic field. " +
    "Draw from unexpected sensory imagery, historical allusions, and concrete objects. " +
    "This guides all subsequent word choices."
  ),
  tonal_register: z.string().describe(
    "The dominant linguistic register for this poem: e.g. 'elevated literary', 'vernacular modernist', 'archaic ceremonial', 'conversational lyric'."
  ),
  rhyme_families: z.array(RhymeFamilyZod).describe(
    "One entry per required rhyme letter in the form's scheme. " +
    "Each family's phonetic_anchor MUST be phonetically distinct from all other families. " +
    "E.g., do NOT have Family A = '-ight' and Family B = '-ite'."
  ),
});

// OpenRouter response_format version
export const ThematicRhymeGraphORSchema = {
  type: 'json_schema' as const,
  json_schema: {
    name: 'ThematicRhymeGraph',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        semantic_domain_mapping: {
          type: 'string',
          description: "A vivid paragraph exploring the theme's semantic field with unexpected imagery and concrete objects.",
        },
        tonal_register: {
          type: 'string',
          description: "Dominant linguistic register: 'elevated literary', 'vernacular modernist', 'archaic ceremonial', 'conversational lyric', etc.",
        },
        rhyme_families: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              designator: { type: 'string', description: "Rhyme family letter: A, B, C, etc." },
              phonetic_anchor: { type: 'string', description: "Target CMU phoneme ending, e.g. 'AY1 T', 'EH1 R'. MUST be distinct from other families." },
              candidate_lexicon: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    word: { type: 'string', description: 'The candidate end-word' },
                    syllable_count: { type: 'integer', description: 'Number of syllables' },
                    cmu_stress_pattern: { type: 'string', description: 'Stress: 1=primary, 2=secondary, 0=unstressed' },
                    is_cliche: { type: 'boolean', description: 'True if stock poetic cliché' },
                    semantic_register: { type: 'string', description: 'archaic, literary, colloquial, technical, etc.' },
                    slant_rhyme_tolerance: { type: 'string', description: 'Acceptable near-rhyme endings' },
                  },
                  required: ['word', 'syllable_count', 'cmu_stress_pattern', 'is_cliche', 'semantic_register', 'slant_rhyme_tolerance'],
                  additionalProperties: false,
                },
              },
            },
            required: ['designator', 'phonetic_anchor', 'candidate_lexicon'],
            additionalProperties: false,
          },
        },
      },
      required: ['semantic_domain_mapping', 'tonal_register', 'rhyme_families'],
      additionalProperties: false,
    },
  },
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCHEMA 3: Line Scansion Execution (The Executor)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// Purpose: Governs line-by-line generation. The LLM must explicitly declare
// its syllable count, map each syllable to the metrical grid (W/S), and
// self-check for prosodic violations (*CLASH, *LAPSE, *PEAKPROM) BEFORE
// writing the final line. This implements counting-before-rhythm (Fabb-Halle).
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const SyllableGridMappingZod = z.object({
  syllable_text: z.string().describe("The syllable as it appears in the line"),
  grid_position: z.enum(['W', 'S']).describe("Weak (W) or Strong (S) position in the metrical grid"),
  lexical_stress: z.enum(['1', '2', '0']).describe("CMU stress level: 1=primary, 2=secondary, 0=unstressed"),
});

const ProsodicConstraintCheckZod = z.object({
  violates_CLASH: z.boolean().describe("True if two adjacent Strong positions both carry primary stress"),
  violates_LAPSE: z.boolean().describe("True if three or more consecutive Weak positions all carry zero stress"),
  violates_PEAKPROM: z.boolean().describe("True if a content word's primary stress falls in a W position"),
});

export const LineScansionExecutionZod = z.object({
  line_id: z.string().describe("The line identifier from the blueprint, e.g. 'L3', 'A1'"),
  semantic_intent: z.string().describe("What image, narrative beat, or emotional turn does this line convey?"),
  rhyme_family: z.string().describe("Which rhyme family (A, B, C, etc.) this line's end-word belongs to"),
  selected_end_word: z.string().describe("The chosen end-word from the verified rhyme family pool"),
  syllable_count_verification: z.number().int().describe(
    "EXPLICITLY count every syllable before composing. This number MUST equal the target from the blueprint."
  ),
  target_meter_blueprint: z.string().describe("The expected W/S grid pattern, e.g. 'W S W S W S W S W S'"),
  text_to_grid_mapping: z.array(SyllableGridMappingZod).describe(
    "Map EACH syllable of the composed line to its grid position and lexical stress. " +
    "The array length MUST equal syllable_count_verification."
  ),
  prosodic_constraint_check: ProsodicConstraintCheckZod.describe(
    "Self-check for rhythmic violations. If any are true, revise the line before finalizing."
  ),
  final_composed_line: z.string().describe(
    "The final poetic line. Must match the syllable count, end with the selected end-word, " +
    "and minimize prosodic violations."
  ),
});

// OpenRouter response_format version
export const LineScansionExecutionORSchema = {
  type: 'json_schema' as const,
  json_schema: {
    name: 'LineScansionExecution',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        line_id: { type: 'string', description: "Line identifier from blueprint, e.g. 'L3', 'A1'" },
        semantic_intent: { type: 'string', description: 'What image or narrative beat this line conveys' },
        rhyme_family: { type: 'string', description: "Which rhyme family (A, B, C) this line's end-word belongs to" },
        selected_end_word: { type: 'string', description: 'The chosen end-word from the verified rhyme pool' },
        syllable_count_verification: { type: 'integer', description: 'Explicit syllable count. MUST equal the target.' },
        target_meter_blueprint: { type: 'string', description: "Expected W/S grid pattern, e.g. 'W S W S W S W S W S'" },
        text_to_grid_mapping: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              syllable_text: { type: 'string', description: 'The syllable as written' },
              grid_position: { type: 'string', enum: ['W', 'S'], description: 'Weak or Strong grid position' },
              lexical_stress: { type: 'string', enum: ['1', '2', '0'], description: 'CMU stress: 1=primary, 2=secondary, 0=unstressed' },
            },
            required: ['syllable_text', 'grid_position', 'lexical_stress'],
            additionalProperties: false,
          },
        },
        prosodic_constraint_check: {
          type: 'object',
          properties: {
            violates_CLASH: { type: 'boolean', description: 'True if adjacent S positions both carry primary stress' },
            violates_LAPSE: { type: 'boolean', description: 'True if 3+ consecutive W positions all carry zero stress' },
            violates_PEAKPROM: { type: 'boolean', description: "True if content word's primary stress falls in W position" },
          },
          required: ['violates_CLASH', 'violates_LAPSE', 'violates_PEAKPROM'],
          additionalProperties: false,
        },
        final_composed_line: { type: 'string', description: 'The final poetic line matching all constraints' },
      },
      required: [
        'line_id', 'semantic_intent', 'rhyme_family', 'selected_end_word',
        'syllable_count_verification', 'target_meter_blueprint',
        'text_to_grid_mapping', 'prosodic_constraint_check', 'final_composed_line',
      ],
      additionalProperties: false,
    },
  },
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCHEMA 4: Reflective Correction (The Healer)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// Purpose: When poetry_engine.ts detects a CMU mismatch, this schema forces
// the LLM to acknowledge the EXACT error, reason about a repair strategy,
// classify the healing method, and produce a corrected line. Implements
// RETO's "reflect-then-repair" paradigm for localized error containment.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ReflectiveCorrectionZod = z.object({
  line_id: z.string().describe("Which line is being repaired"),
  engine_error_report: z.string().describe(
    "The EXACT failure trace from the CMU dictionary / poetry_engine.ts validation. " +
    "E.g. 'Line has 11 syllables, expected 10. Word \"radiant\" creates /xx stress, breaking iambic flow.'"
  ),
  diagnostic_reasoning: z.string().describe(
    "Step-by-step reasoning about WHY the phonological or structural alignment failed. " +
    "Identify specific words causing the issue and consider alternative phrasings."
  ),
  healing_strategy: z.enum([
    'SYLLABLE_TRUNCATION',   // Remove/replace words to hit target count
    'STRESS_SHIFT',          // Substitute words to fix meter alignment
    'RHYME_SUBSTITUTION',    // Swap end-word to match required family
    'IDENTICITY_SYNC',       // Fix exact-repetition mismatch
    'WORD_REPLACEMENT',      // General substitution for cliché/register issues
    'SYNTACTIC_INVERSION',   // Reorder words to fix stress alignment
  ]).describe("The chosen method to resolve the constraint failure"),
  words_changed: z.array(z.object({
    original: z.string(),
    replacement: z.string(),
    reason: z.string(),
  })).describe("Explicit log of every word substitution made during repair"),
  healed_line: z.string().describe("The repaired poetic line that resolves all identified errors"),
  expected_syllable_count: z.number().int().describe("The target syllable count this healed line must hit"),
});

// OpenRouter response_format version
export const ReflectiveCorrectionORSchema = {
  type: 'json_schema' as const,
  json_schema: {
    name: 'ReflectiveCorrection',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        line_id: { type: 'string', description: 'Which line is being repaired' },
        engine_error_report: { type: 'string', description: 'Exact failure trace from CMU / poetry_engine validation' },
        diagnostic_reasoning: { type: 'string', description: 'Step-by-step reasoning about WHY the alignment failed' },
        healing_strategy: {
          type: 'string',
          enum: ['SYLLABLE_TRUNCATION', 'STRESS_SHIFT', 'RHYME_SUBSTITUTION', 'IDENTICITY_SYNC', 'WORD_REPLACEMENT', 'SYNTACTIC_INVERSION'],
          description: 'The chosen repair method',
        },
        words_changed: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              original: { type: 'string' },
              replacement: { type: 'string' },
              reason: { type: 'string' },
            },
            required: ['original', 'replacement', 'reason'],
            additionalProperties: false,
          },
        },
        healed_line: { type: 'string', description: 'The repaired line resolving all errors' },
        expected_syllable_count: { type: 'integer', description: 'Target syllable count for the healed line' },
      },
      required: ['line_id', 'engine_error_report', 'diagnostic_reasoning', 'healing_strategy', 'words_changed', 'healed_line', 'expected_syllable_count'],
      additionalProperties: false,
    },
  },
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BATCH SCHEMA: Multi-Line Execution (generates multiple lines in one call)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// For simpler forms (Quatrain, Couplet, etc.) where generating all lines
// in one call is more efficient than line-by-line.

export const BatchLineExecutionZod = z.object({
  lines: z.array(LineScansionExecutionZod).describe(
    "All lines of the poem generated with full scansion grid mapping."
  ),
});

export const BatchLineExecutionORSchema = {
  type: 'json_schema' as const,
  json_schema: {
    name: 'BatchLineExecution',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        lines: {
          type: 'array',
          items: LineScansionExecutionORSchema.json_schema.schema,
        },
      },
      required: ['lines'],
      additionalProperties: false,
    },
  },
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HELPER: Build a deterministic blueprint from registries (Stage 1 backend logic)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function parseRhymeTokens(rhymeScheme: string): string[] {
  return rhymeScheme.match(/([A-Za-z][0-9]*)/g) || [];
}

/**
 * Deterministically compile the form/meter/foot selection into a full
 * PoeticOntologyPlan blueprint. The LLM only needs to fill in the
 * semantic_arc field; everything else is computed locally.
 */
export function compileDeterministicBlueprint(
  formKey: string,
  meterKey: string,
  footKey: string,
  theme: string,
  acrostic: string | null,
): Omit<PoeticOntologyPlan, 'semantic_arc'> {
  const formDef = FORM_REGISTRY[formKey];
  const meterDef = METER_REGISTRY[meterKey];
  const footDef = FOOT_REGISTRY[footKey];

  if (!formDef || !meterDef || !footDef) {
    throw new Error(`Invalid registry keys: form=${formKey}, meter=${meterKey}, foot=${footKey}`);
  }

  const patternUnits = meterDef.pattern.replace(/ /g, '');
  const syllablesPerLine = patternUnits.length * footDef.multiplier;
  
  // Build Fabb-Halle metrical grid
  const gridUnit = meterDef.pattern.split(' ').map(c => c === '/' ? 'S' : 'W').join(' ');
  const fullGrid = Array(footDef.multiplier).fill(gridUnit).join(' ');

  // Parse rhyme scheme into tokens
  const schemeTokens = parseRhymeTokens(formDef.rhyme_scheme);
  const cleanAcrostic = acrostic ? acrostic.replace(/[^A-Za-z]/g, '').toUpperCase() : '';

  // Build stanza blueprints
  const stanzaBreaks = formDef.stanza_breaks || [];
  const stanzas: Array<{ stanza_index: number; line_slots: Array<{
    line_id: string;
    rhyme_designator: string;
    is_exact_repetition_of: string | null;
    semantic_role: string;
  }> }> = [];

  let currentStanza: typeof stanzas[0] = { stanza_index: 0, line_slots: [] };
  
  // Track which numbered tokens we've seen to identify repetitions
  const numberedTokenFirstSeen = new Map<string, string>();  // token -> line_id

  for (let i = 0; i < schemeTokens.length; i++) {
    // Check if this index starts a new stanza
    if (stanzaBreaks.includes(i) && currentStanza.line_slots.length > 0) {
      stanzas.push(currentStanza);
      currentStanza = { stanza_index: stanzas.length, line_slots: [] };
    }

    const token = schemeTokens[i];
    const rhymeLetter = token[0].toUpperCase();
    const hasNumber = /[0-9]/.test(token);
    const lineId = `L${i + 1}`;

    // Determine if this is an exact repetition
    let isRepeatOf: string | null = null;
    if (hasNumber && numberedTokenFirstSeen.has(token)) {
      isRepeatOf = numberedTokenFirstSeen.get(token)!;
    } else if (hasNumber) {
      numberedTokenFirstSeen.set(token, lineId);
    }

    // Determine semantic role
    let semanticRole = 'continuation';
    if (i === 0) semanticRole = 'anchor';
    else if (isRepeatOf) semanticRole = 'refrain';
    else if (hasNumber && !isRepeatOf) semanticRole = 'anchor'; // First occurrence of numbered token
    else if (stanzaBreaks.includes(i)) semanticRole = 'volta';
    else if (i === schemeTokens.length - 1) semanticRole = 'coda';

    currentStanza.line_slots.push({
      line_id: lineId,
      rhyme_designator: token.length === 1 && token === token.toLowerCase() ? token : rhymeLetter,
      is_exact_repetition_of: isRepeatOf,
      semantic_role: semanticRole,
    });
  }
  
  // Push the final stanza
  if (currentStanza.line_slots.length > 0) {
    stanzas.push(currentStanza);
  }

  return {
    global_parameters: {
      theme,
      form_name: formKey,
      target_meter: meterKey,
      target_foot: footKey,
      total_syllables_per_line: syllablesPerLine,
      acrostic_word: cleanAcrostic || null,
    },
    fabb_halle_metrical_grid: fullGrid,
    stanza_blueprints: stanzas,
  };
}

/**
 * Extract the unique rhyme family letters needed for a given form.
 * E.g., "ABAB CDCD EFEF GG" → ['A', 'B', 'C', 'D', 'E', 'F', 'G']
 */
export function extractRequiredRhymeFamilies(formKey: string): string[] {
  const formDef = FORM_REGISTRY[formKey];
  if (!formDef) return [];
  const tokens = parseRhymeTokens(formDef.rhyme_scheme);
  const families = new Set<string>();
  for (const token of tokens) {
    families.add(token[0].toUpperCase());
  }
  return [...families].sort();
}
