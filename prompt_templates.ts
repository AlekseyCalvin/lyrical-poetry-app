/**
 * LYRICAL Prompt Templates v4
 *
 * Holistic, Schema-Driven Organic Composition using Multi-Grid Scansion and Optimality Theory (OT).
 */

import { buildClichePromptGuidance, getThematicVocabulary } from './cliche_filter.js';
import { getMeterExemplars, formatExemplarsForPrompt, RHYME_TYPES } from './meter_exemplars.js';

// ── System Prompts ────────────────────────────────────────────────────────

export const SYSTEM_PROMPT_ORGANIC_COMPOSER = `You are ERATO, a master formalist poet and phonetic architect.
You compose complete poems or stanzas organically, flowing chronologically to ensure natural grammar, semantic unity, and rich musicality.

AXIOMS:
1. METRICAL COMPOSITION: You MUST compose each line so that its natural spoken rhythm ALIGNS to the target metrical grid. This means choosing words whose lexical stress patterns fit the W/S slots. Divergences (trochaic_inversion, pyrrhic_substitution, etc.) are legitimate prosodic techniques — but the BASE METER must remain recognizable as the dominant pattern.
2. SYLLABLE-AWARE COMPOSITION: Before writing a line, mentally count its syllables. Your declared syllable_count MUST match the actual syllable count of your text. Use the target syllable count from the blueprint.
3. OPTIMALITY THEORY & MULTI-GRID SCANSION: Strict 1:1 "lexical stress = metrical strong" is naive. Poetry breathes through constraint-based divergences. Use a Multi-Grid System:
   A. conventional_metrical_grid: The pure blueprint (e.g., ["W", "S", "W", "S"] for iambic dimeter).
   B. divergences_used: As a master poet, you naturally weave in named divergences. Declare which you used from the closed vocabulary.
   C. text: Compose the line so that its actual phonological realization aligns with the grid, allowing for the declared divergences.
4. ORGANIC SYNTAX: Do NOT distort sentence structure to hit a rhyme. Grammar must flow naturally across lines (enjambment is encouraged). The rhyme word must feel inevitable, not glued.
5. STRICT RHYME FAMILIES: Lines sharing the same rhyme letter MUST rhyme. Use diverse rhyme types: perfect, slant, feminine, masculine, assonant, consonant, eye, broken, mosaic. Declare each line's rhyme_type.
6. AVOID CLICHÉS: Common words are allowed. What must be avoided is ready-made language: prefab idioms, stale image-pairs, and borrowed emotional shorthand.`;

export const SYSTEM_PROMPT_HEALER = `You are a prosodic repair specialist. You receive failure feedback from the CMU dictionary validation engine based on Fabb-Halle poetic constraints.

AXIOMS:
1. Fix the specified lines without destroying the semantic flow of the stanza.
2. Ensure the rhyme scheme is perfectly restored if it failed cross-line matching.
3. Hit the target syllable count, utilizing valid divergences (elision, feminine endings) if necessary, but tracking them accurately.`;

// ── Organic Composition Prompt ─────────────────────────────────────────────

export interface BlueprintLine {
  lineId: string;
  rhymeLetter: string;
  isRepeat: boolean;
  repeatSourceId?: string;
  acrosticChar?: string | null;
}

export function buildOrganicCompositionPrompt(
  theme: string,
  formName: string,
  formRules: string,
  meterName: string,
  footName: string,
  gridMapping: string,
  sonicRhythm: string,
  targetSyllables: number,
  blueprintLines: BlueprintLine[]
): string {
  const vocab = getThematicVocabulary(theme);
  const vocabHint = vocab.length > 0
    ? `\nFor thematic inspiration, consider this semantic field: ${vocab.slice(0, 10).join(', ')}`
    : '';
  const clicheGuidance = buildClichePromptGuidance(theme);

  // Inject few-shot canonical exemplars for this specific meter+foot combination
  const meterProfile = getMeterExemplars(meterName, footName);
  const exemplarBlock = formatExemplarsForPrompt(meterProfile);

  const lineDescs = blueprintLines.map(s => {
    let desc = `  - ${s.lineId}: Rhyme Family [${s.rhymeLetter}]`;
    if (s.isRepeat && s.repeatSourceId) desc += ` -> MUST BE EXACT COPY OF ${s.repeatSourceId}`;
    if (s.acrosticChar) desc += ` -> MUST START with letter "${s.acrosticChar}"`;
    return desc;
  }).join('\n');

  return `THEME: "${theme}"
FORM: ${formName} — ${formRules}
METER: ${meterName} ${footName} (${targetSyllables} syllables target per line)
W/S GRID MAPPING: ${gridMapping} (e.g., ${sonicRhythm})
${vocabHint}
ANTI-CLICHÉ GUIDANCE: ${clicheGuidance}

${exemplarBlock}

RHYME TYPE PALETTE: You may use any of these rhyme types — declare which one for each line:
${RHYME_TYPES.join(', ')}
Perfect and slant rhymes are always valid. Feminine and masculine give tonal variety. Use assonant/consonant/eye for sophistication.

blueprint structure (Chronological):
${lineDescs}

YOUR TASK:
Compose the entire poetry structure organically in one pass.
1. "semantic_arc": Briefly describe the thematic imagery you will use.
2. "lines": Generate the lines matching the blueprint precisely utilizing the Multi-Grid System.
   For each line:
   - "rhyme_concept": (e.g., "A: winter"). Make sure all 'A' lines rhyme.
   - "syllable_count": EXPLICITLY count the syllables in your text. Must equal ${targetSyllables}.
   - "end_word": The last word of the line.
   - "rhyme_type": What rhyme relationship this end-word has with its family (perfect, slant, feminine, etc.).
   - "conventional_metrical_grid": The pure target blueprint grid.
   - "divergences_used": Name the prosodic divergences you organically embedded (from the closed vocabulary above).
   - "text": The finalized line text. Its SPOKEN RHYTHM must align to the metrical grid.

CRITICAL: The poetry must sound like natural, fluent English. No awkward syntax just to force a rhyme!
CRITICAL: Each line's text MUST contain exactly ${targetSyllables} syllables. Count carefully before writing.
CRITICAL: Each line's SPOKEN RHYTHM must MATCH the W/S grid. Choose words whose natural stress fits the pattern.`;
}

// ── Repair Prompt ─────────────────────────────────────────────────────────

export function buildRepairPrompt(
  failedStanzaData: any,
  errorReport: string,
  theme: string,
  targetSyllables: number,
  gridMapping: string
): string {
  return `REPAIR REQUIRED FOR STANZA:
${errorReport}

PREVIOUS (FAILED) ATTEMPT DATA:
${JSON.stringify(failedStanzaData, null, 2)}

CONSTRAINTS:
- Target syllable count: ${targetSyllables}
- Meter grid: ${gridMapping}
- Theme: "${theme}"

YOUR TASK:
Re-generate the flawed lines (or the whole stanza if the rhymes were glued awkwardly) to fix the errors. Keep the valid lines exactly identical. Ensure perfect semantic flow and adherence to the Multi-Grid Scansion logic.`;
}

// ── Meter Grid Builders ───────────────────────────────────────────────────

export function buildMeterGridInfo(meterPattern: string, footMultiplier: number): {
  grid: string;
  sonicRhythm: string;
} {
  const patternChars = meterPattern.split(' ');
  const fullPattern = Array(footMultiplier).fill(patternChars).flat();

  const grid = fullPattern.map(c => c === '/' ? 'S' : 'W').join(' ');
  // Use slightly more varied sonic mapping for realism
  const sonicRhythm = fullPattern.map(c => c === '/' ? 'DUM' : 'da').join(' ');

  return { grid, sonicRhythm };
}
