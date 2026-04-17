/**
 * Poetry analysis engine — TypeScript port.
 *
 * Provides syllable counting, stress pattern analysis, rhyme detection,
 * rhyme scheme identification, and full poem analysis using the CMU
 * Pronouncing Dictionary.
 *
 * Pure functions, no side effects, no external dependencies.
 * Designed to run in Cloudflare Workers (no Node.js APIs).
 */

// ---------------------------------------------------------------------------
// Type definitions
// ---------------------------------------------------------------------------

export type CmuDict = Record<string, string[][]>;

export interface WordAnalysis {
  word: string;
  original: string;
  syllableCounts: number[];
  stressPatterns: string[];
  inDict: boolean;
}

export interface LineAnalysis {
  totalSyllables: [number, number];
  words: WordAnalysis[];
  stressPattern: string;
}

export interface PoemAnalysis {
  meter: string;
  lines: Array<{
    lineNum: number;
    text: string;
    syllables: [number, number];
    target: number | null;
    stressPattern: string;
    targetStress: string | null;
    syllableMatch: boolean;
    stressMatch: "full" | "partial" | "none";
    rhymeLabel: string;
    problems: string[];
    words: WordAnalysis[];
  }>;
  summary: {
    totalLines: number;
    targetLines: number | null;
    syllableMatches: number;
    stressMatches: number;
    rhymeScheme: string;
    targetRhymeScheme: string | null;
    rhymeMatch: boolean;
    problems: string[];
  };
  rhymePairs: Array<{
    label: string;
    words: [string, string];
    type: "perfect" | "near" | "none";
  }>;
  suggestions: string[];
}

export interface RhymeResult {
  word: string;
  perfect: Array<{ word: string; syllables: number }>;
  near: Array<{ word: string; syllables: number }>;
}

interface MeterPreset {
  description: string;
  syllablesPerLine?: number | number[];
  stressPattern?: string | string[];
  rhymeScheme?: string;
  lineCount?: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STRIP_RE = /[^\w'-]/gu;

function cleanWord(word: string): string {
  let w = word.trim().toLowerCase();
  w = w.replace(STRIP_RE, "");
  if (!w || [...w].every((ch) => ch === "-")) {
    return "";
  }
  return w;
}

function isVowelPhoneme(phoneme: string): boolean {
  return phoneme.length > 0 && "012".includes(phoneme[phoneme.length - 1]);
}

function stressDigit(phoneme: string): string {
  return phoneme[phoneme.length - 1];
}

function stripStress(phoneme: string): string {
  if (phoneme.length > 0 && "012".includes(phoneme[phoneme.length - 1])) {
    return phoneme.slice(0, -1);
  }
  return phoneme;
}

// ---------------------------------------------------------------------------
// 1. Syllable count
// ---------------------------------------------------------------------------

export function getSyllableCount(word: string, dict: CmuDict): number[] {
  const cleaned = cleanWord(word);
  if (!cleaned) return [0];

  // Handle hyphenated words by summing parts
  if (cleaned.includes("-")) {
    const parts = cleaned.split("-").filter((p) => p);
    if (parts.length > 1) {
      const partCounts = parts.map((p) => getSyllableCount(p, dict));
      const totalMin = partCounts.reduce((s, c) => s + Math.min(...c), 0);
      const totalMax = partCounts.reduce((s, c) => s + Math.max(...c), 0);
      const range: number[] = [];
      for (let n = totalMin; n <= totalMax; n++) range.push(n);
      return range.length > 0 ? range : [totalMin];
    }
  }

  // Handle contractions: look up as-is first, then without apostrophe
  const lookups = [cleaned];
  if (cleaned.includes("'")) {
    lookups.push(cleaned.replace(/'/g, ""));
  }

  for (const lookup of lookups) {
    if (lookup in dict) {
      const pronunciations = dict[lookup];
      const counts = new Set<number>();
      for (const pron of pronunciations) {
        counts.add(pron.filter(isVowelPhoneme).length);
      }
      return [...counts].sort((a, b) => a - b);
    }
  }

  return [fallbackSyllableCount(cleaned)];
}

// ---------------------------------------------------------------------------
// 2. Stress patterns
// ---------------------------------------------------------------------------

export function getStressPattern(word: string, dict: CmuDict): string[] {
  const cleaned = cleanWord(word);
  if (!cleaned) return [];

  // Hyphenated: concatenate sub-patterns
  if (cleaned.includes("-")) {
    const parts = cleaned.split("-").filter((p) => p);
    if (parts.length > 1) {
      const subPatterns = parts.map((p) => getStressPattern(p, dict));
      const combined = subPatterns
        .map((sp) => (sp.length > 0 ? sp[0] : ""))
        .join("");
      return combined ? [combined] : [];
    }
  }

  const lookups = [cleaned];
  if (cleaned.includes("'")) {
    lookups.push(cleaned.replace(/'/g, ""));
  }

  for (const lookup of lookups) {
    if (lookup in dict) {
      const pronunciations = dict[lookup];
      const patterns = new Set<string>();
      for (const pron of pronunciations) {
        const pattern = pron
          .filter(isVowelPhoneme)
          .map(stressDigit)
          .join("");
        patterns.add(pattern);
      }
      return [...patterns].sort();
    }
  }

  return [];
}

// ---------------------------------------------------------------------------
// 3. Fallback syllable counter
// ---------------------------------------------------------------------------

const VOWEL_DIGRAPHS = new Set([
  "ai", "au", "aw", "ay",
  "ee", "ei", "eu", "ew", "ey",
  "oa", "oe", "oi", "oo", "ou", "ow", "oy",
  "ue", "ui",
]);

const SILENT_ED_ENDINGS = /(sh|ch|[bfgkpsvz])ed$/i;
const VOICED_ED_ENDINGS = /[td]ed$/i;

const IRREGULAR_SYLLABLE_COUNTS: Record<string, number> = {
  colonel: 2,
  wednesday: 2,
  chocolate: 2,
  comfortable: 3,
  vegetable: 3,
  interesting: 3,
  temperature: 3,
  naturally: 3,
  deliberately: 5,
  worcestershire: 3,
  lieutenant: 3,
  business: 2,
  every: 2,
  evening: 2,
  different: 2,
  several: 2,
  generally: 3,
  actually: 3,
  usually: 3,
  especially: 4,
  necessarily: 4,
  extraordinary: 5,
  beautiful: 3,
  family: 2,
  favorite: 2,
  camera: 2,
  jewelry: 2,
  realtor: 2,
  laboratory: 4,
  memory: 2,
  mystery: 2,
  nursery: 2,
  surgery: 2,
  history: 2,
  factory: 2,
  celery: 2,
  grocery: 2,
  scenery: 2,
  battery: 2,
  lottery: 2,
  separate: 2,
  desperate: 3,
  literature: 3,
  miniature: 3,
  preference: 3,
  reference: 3,
  difference: 3,
  conference: 3,
  tolerance: 3,
  excellence: 3,
  ambulance: 3,
  ignorance: 3,
};

interface ReductionPattern {
  pattern: RegExp;
  adjustment: number;
  minLength: number;
}

const REDUCTION_PATTERNS: ReductionPattern[] = [
  { pattern: /[ts]ion$/, adjustment: -1, minLength: 4 },
  { pattern: /[ei]ous$/, adjustment: -1, minLength: 4 },
  { pattern: /ial$/, adjustment: -1, minLength: 3 },
  { pattern: /ual$/, adjustment: -1, minLength: 3 },
  { pattern: /[aeo]ry$/, adjustment: -1, minLength: 4 },
  { pattern: /ally$/, adjustment: -1, minLength: 6 },
];

function applyVowelReductions(w: string, count: number): number {
  for (const { pattern, adjustment, minLength } of REDUCTION_PATTERNS) {
    if (w.length >= minLength && pattern.test(w)) {
      count += adjustment;
      break; // Only apply one reduction
    }
  }
  return count;
}

export function fallbackSyllableCount(word: string): number {
  const cleaned = cleanWord(word);
  if (!cleaned) return 0;

  // Handle hyphenated words
  if (cleaned.includes("-")) {
    const parts = cleaned.split("-").filter((p) => p);
    if (parts.length > 1) {
      return parts.reduce((sum, p) => sum + fallbackSyllableCount(p), 0);
    }
  }

  // Handle contractions
  let w = cleaned;
  if (w.includes("'")) {
    w = w.replace(/'/g, "");
  }
  w = w.toLowerCase();

  // Check irregular words
  if (w in IRREGULAR_SYLLABLE_COUNTS) {
    return IRREGULAR_SYLLABLE_COUNTS[w];
  }

  // Count vowel groups, merging known digraphs
  let count = 0;
  let i = 0;
  while (i < w.length) {
    const ch = w[i];
    if ("aeiouy".includes(ch)) {
      count += 1;
      // If next char forms a known digraph, skip it
      if (i + 1 < w.length && VOWEL_DIGRAPHS.has(w.slice(i, i + 2))) {
        i += 2;
        continue;
      }
      i += 1;
    } else {
      i += 1;
    }
  }

  // Silent-e: trailing 'e' that is not the only vowel
  if (w.endsWith("e") && !w.endsWith("le") && count > 1) {
    if (w.length >= 2 && !"aeiouy".includes(w[w.length - 2])) {
      count -= 1;
    }
  }

  // -ed endings
  if (w.endsWith("ed") && w.length > 3) {
    if (VOICED_ED_ENDINGS.test(w)) {
      // -ted, -ded: the -ed IS a syllable (already counted)
    } else if (SILENT_ED_ENDINGS.test(w)) {
      // -ked, -ped, etc.: -ed is NOT a separate syllable
      if (w.length >= 3 && !"aeiouy".includes(w[w.length - 3])) {
        count -= 1;
      }
    } else {
      // Other cases: if letter before 'ed' is consonant and not t/d, silent
      if (
        w.length >= 3 &&
        !"aeiouy".includes(w[w.length - 3]) &&
        !"td".includes(w[w.length - 3])
      ) {
        count -= 1;
      }
    }
  }

  count = applyVowelReductions(w, count);

  return Math.max(count, 1);
}

// ---------------------------------------------------------------------------
// 4. End phonemes (for rhyme detection)
// ---------------------------------------------------------------------------

function extractEndPhonemes(phonemeList: string[]): string[] | null {
  let lastStressedIdx: number | null = null;
  let lastVowelIdx: number | null = null;

  for (let i = 0; i < phonemeList.length; i++) {
    const p = phonemeList[i];
    if (isVowelPhoneme(p)) {
      lastVowelIdx = i;
      if (p[p.length - 1] === "1") {
        lastStressedIdx = i;
      } else if (p[p.length - 1] === "2" && lastStressedIdx === null) {
        lastStressedIdx = i;
      }
    }
  }

  const idx = lastStressedIdx !== null ? lastStressedIdx : lastVowelIdx;
  if (idx === null) return null;
  return phonemeList.slice(idx);
}

export function getEndPhonemes(word: string, dict: CmuDict): string[][] {
  const cleaned = cleanWord(word);
  if (!cleaned) return [];

  const lookups = [cleaned];
  if (cleaned.includes("'")) {
    lookups.push(cleaned.replace(/'/g, ""));
  }

  let pronunciations: string[][] | null = null;
  for (const lookup of lookups) {
    if (lookup in dict) {
      pronunciations = dict[lookup];
      break;
    }
  }

  if (pronunciations === null) return [];

  const results: string[][] = [];
  for (const pron of pronunciations) {
    const endPhon = extractEndPhonemes(pron);
    if (endPhon !== null) {
      results.push(endPhon);
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// 5. Rhyme finding
// ---------------------------------------------------------------------------

function isNearRhyme(endingA: string[], endingB: string[]): boolean {
  const a = endingA.map(stripStress);
  const b = endingB.map(stripStress);

  if (a.length === b.length) {
    const diffs = a.reduce((n, x, i) => n + (x !== b[i] ? 1 : 0), 0);
    return diffs <= 1;
  } else if (Math.abs(a.length - b.length) === 1) {
    const [longer, shorter] = a.length > b.length ? [a, b] : [b, a];
    let diffs = 0;
    let j = 0;
    for (let i = 0; i < longer.length; i++) {
      if (j < shorter.length && longer[i] === shorter[j]) {
        j++;
      } else {
        diffs++;
      }
      if (diffs > 1) return false;
    }
    return true;
  }
  return false;
}

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function findRhymes(
  word: string,
  dict: CmuDict,
  type: "perfect" | "near"
): string[] {
  const cleaned = cleanWord(word);
  if (!cleaned) return [];

  const wordEndings = getEndPhonemes(cleaned, dict);
  if (wordEndings.length === 0) return [];

  const rhymes = new Set<string>();

  if (type === "perfect") {
    for (const candidate of Object.keys(dict)) {
      if (candidate === cleaned) continue;
      for (const pron of dict[candidate]) {
        const candEnd = extractEndPhonemes(pron);
        if (candEnd === null) continue;
        for (const wEnd of wordEndings) {
          if (arraysEqual(candEnd, wEnd)) {
            rhymes.add(candidate);
            break;
          }
        }
        if (rhymes.has(candidate)) break;
      }
    }
  } else {
    // near
    for (const candidate of Object.keys(dict)) {
      if (candidate === cleaned) continue;
      let found = false;
      for (const pron of dict[candidate]) {
        const candEnd = extractEndPhonemes(pron);
        if (candEnd === null) continue;
        for (const wEnd of wordEndings) {
          if (isNearRhyme(wEnd, candEnd)) {
            rhymes.add(candidate);
            found = true;
            break;
          }
        }
        if (found) break;
      }
    }
  }

  return [...rhymes].sort();
}

// ---------------------------------------------------------------------------
// 6. Line analysis
// ---------------------------------------------------------------------------

function wordInDict(word: string, dict: CmuDict): boolean {
  if (word in dict) return true;
  if (word.includes("'") && word.replace(/'/g, "") in dict) return true;
  return false;
}

export function analyzeLine(line: string, dict: CmuDict): LineAnalysis {
  if (!line || !line.trim()) {
    return {
      totalSyllables: [0, 0],
      words: [],
      stressPattern: "",
    };
  }

  const rawTokens = line.split(/\s+/);
  const words: WordAnalysis[] = [];
  let totalMin = 0;
  let totalMax = 0;
  const combinedStress: string[] = [];

  for (const token of rawTokens) {
    const cleaned = cleanWord(token);
    if (!cleaned) continue;

    const syllableCounts = getSyllableCount(cleaned, dict);
    const stressPatterns = getStressPattern(cleaned, dict);
    const inDict = wordInDict(cleaned, dict);

    words.push({
      word: cleaned,
      original: token,
      syllableCounts,
      stressPatterns,
      inDict,
    });

    totalMin += Math.min(...syllableCounts);
    totalMax += Math.max(...syllableCounts);

    if (stressPatterns.length > 0) {
      combinedStress.push(stressPatterns[0]);
    } else {
      const n = syllableCounts.length > 0 ? syllableCounts[0] : 1;
      combinedStress.push("?".repeat(n));
    }
  }

  return {
    totalSyllables: [totalMin, totalMax],
    words,
    stressPattern: combinedStress.join(""),
  };
}

// ---------------------------------------------------------------------------
// 7. Rhyme scheme detection
// ---------------------------------------------------------------------------

function getLastWord(line: string): string {
  if (!line || !line.trim()) return "";
  const tokens = line.trim().split(/\s+/);
  for (let i = tokens.length - 1; i >= 0; i--) {
    const cleaned = cleanWord(tokens[i]);
    if (cleaned) return cleaned;
  }
  return "";
}

function getLineEndPhonemeOptions(line: string, dict: CmuDict): string[][] {
  if (!line || !line.trim()) return [];

  const tokens = line.trim().split(/\s+/);
  const endWords: string[] = [];
  for (let i = tokens.length - 1; i >= 0; i--) {
    const cleaned = cleanWord(tokens[i]);
    if (cleaned) {
      endWords.push(cleaned);
    }
    if (endWords.length >= 3) break;
  }
  if (endWords.length === 0) return [];

  // Start with single last word endings
  const allEndings: string[][] = [...getEndPhonemes(endWords[0], dict)];

  // Try combining last 2 and last 3 words phonemically
  for (const n of [2, 3]) {
    if (endWords.length < n) continue;

    // Words are in reverse order, so reverse back
    const comboWords = endWords.slice(0, n).reverse();

    const comboProns: string[][][] = [];
    let allFound = true;
    for (const w of comboWords) {
      const lookups = [w];
      if (w.includes("'")) lookups.push(w.replace(/'/g, ""));
      let found: string[][] | null = null;
      for (const lookup of lookups) {
        if (lookup in dict) {
          found = dict[lookup];
          break;
        }
      }
      if (found === null) {
        allFound = false;
        break;
      }
      comboProns.push(found);
    }

    if (!allFound) continue;

    const firstPron = comboProns[0][0];
    const firstEnd = extractEndPhonemes(firstPron);
    if (firstEnd === null) continue;

    const remainingPhonemes: string[] = [];
    for (let pi = 1; pi < comboProns.length; pi++) {
      remainingPhonemes.push(...comboProns[pi][0]);
    }
    const combinedEnding = [...firstEnd, ...remainingPhonemes];
    allEndings.push(combinedEnding);
  }

  return allEndings;
}

function endingsMatchStripped(endingA: string[], endingB: string[]): boolean {
  if (endingA.length !== endingB.length || endingA.length === 0) return false;
  const a = endingA.map(stripStress);
  const b = endingB.map(stripStress);
  let diffs = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) diffs++;
  }
  // Short-ending guard: require exact match for endings <= 2 phonemes
  // to prevent false positives like love/move
  if (a.length <= 2) return diffs === 0;
  return diffs <= 1;
}

function endingsMatch(endingsA: string[][], endingsB: string[][]): boolean {
  for (const ea of endingsA) {
    for (const eb of endingsB) {
      if (arraysEqual(ea, eb)) return true;
      if (endingsMatchStripped(ea, eb)) return true;
    }
  }
  return false;
}

export function detectRhymeScheme(lines: string[], dict: CmuDict): string {
  if (lines.length === 0) return "";

  const lineEndings: Array<{ word: string; endings: string[][] }> = [];
  for (const line of lines) {
    const allEndings = getLineEndPhonemeOptions(line, dict);
    const endWord = getLastWord(line);
    lineEndings.push({ word: endWord, endings: allEndings });
  }

  const scheme: string[] = [];
  let nextLabel = 0;
  const groups: Array<{ endings: string[][]; label: string }> = [];

  for (const { endings } of lineEndings) {
    if (endings.length === 0) {
      scheme.push(
        nextLabel < 26 ? String.fromCharCode(65 + nextLabel) : "?"
      );
      nextLabel++;
      continue;
    }

    let matched = false;
    for (const group of groups) {
      if (endingsMatch(endings, group.endings)) {
        scheme.push(group.label);
        // Add these endings to the group
        for (const e of endings) group.endings.push(e);
        matched = true;
        break;
      }
    }

    if (!matched) {
      const label =
        nextLabel < 26 ? String.fromCharCode(65 + nextLabel) : "?";
      scheme.push(label);
      groups.push({ endings: [...endings], label });
      nextLabel++;
    }
  }

  return scheme.join("");
}

// ---------------------------------------------------------------------------
// 8. Meter presets
// ---------------------------------------------------------------------------

const METER_PRESETS: Record<string, MeterPreset> = {
  free: {
    description: "Free verse (no targets)",
  },
  "iambic-pentameter": {
    description: "10 syllables/line, stress 0101010101",
    syllablesPerLine: 10,
    stressPattern: "0101010101",
  },
  haiku: {
    description: "5-7-5 syllables, exactly 3 lines",
    syllablesPerLine: [5, 7, 5],
    lineCount: 3,
  },
  limerick: {
    description: "8-8-5-5-8 syllables, AABBA rhyme",
    syllablesPerLine: [8, 8, 5, 5, 8],
    rhymeScheme: "AABBA",
    lineCount: 5,
  },
  sonnet: {
    description: "14 lines x 10 syllables, ABAB CDCD EFEF GG rhyme",
    syllablesPerLine: 10,
    stressPattern: "0101010101",
    rhymeScheme: "ABABCDCDEFEFGG",
    lineCount: 14,
  },
};

export { METER_PRESETS };

function parseMeter(meterStr: string): MeterPreset {
  if (!meterStr || meterStr === "free") {
    return METER_PRESETS["free"];
  }

  if (meterStr in METER_PRESETS) {
    return METER_PRESETS[meterStr];
  }

  if (meterStr.startsWith("custom:")) {
    const parts = meterStr.slice("custom:".length).split(",");
    const counts = parts.map((p) => parseInt(p.trim(), 10));
    if (counts.some(isNaN)) {
      return METER_PRESETS["free"];
    }
    return {
      description: `Custom (${counts.join(",")} syllables)`,
      syllablesPerLine: counts,
      lineCount: counts.length,
    };
  }

  return METER_PRESETS["free"];
}

// ---------------------------------------------------------------------------
// 9. Poem analysis helpers
// ---------------------------------------------------------------------------

function syllableTargetForLine(
  meter: MeterPreset,
  lineIdx: number
): number | null {
  if (!meter.syllablesPerLine) return null;
  const spl = meter.syllablesPerLine;
  if (typeof spl === "number") return spl;
  if (Array.isArray(spl) && lineIdx < spl.length) return spl[lineIdx];
  return null;
}

function stressTargetForLine(
  meter: MeterPreset,
  lineIdx: number
): string | null {
  if (!meter.stressPattern) return null;
  const sp = meter.stressPattern;
  if (typeof sp === "string") return sp;
  if (Array.isArray(sp) && lineIdx < sp.length) return sp[lineIdx];
  return null;
}

function stressMatch(
  actual: string,
  target: string | null
): "full" | "partial" | "none" {
  if (!target) return "full";
  if (!actual) return "none";

  function normalize(ch: string): string | null {
    if (ch === "1" || ch === "2") return "1";
    if (ch === "?") return null;
    return ch;
  }

  const minLen = Math.min(actual.length, target.length);
  if (minLen === 0) return "none";

  let matches = 0;
  let total = 0;
  for (let i = 0; i < minLen; i++) {
    const a = normalize(actual[i]);
    const t = normalize(target[i]);
    if (a === null || t === null) continue;
    total++;
    if (a === t) matches++;
  }

  if (total === 0) return "full";

  const ratio = matches / total;
  if (actual.length === target.length && ratio === 1.0) return "full";
  if (ratio >= 0.5) return "partial";
  return "none";
}

function suggestReplacementsOver(
  words: WordAnalysis[],
  excess: number,
  _dict: CmuDict
): string[] {
  const suggestions: string[] = [];
  for (const w of words) {
    const count = w.syllableCounts.length > 0 ? w.syllableCounts[0] : 1;
    if (count > 1 && count > excess) {
      const needed = count - excess;
      suggestions.push(
        `"${w.word}"(${count} syll) could be replaced with a ${needed}-syll word`
      );
    }
  }
  if (suggestions.length === 0) {
    let longest = words[0];
    let longestCount = longest.syllableCounts.length > 0 ? longest.syllableCounts[0] : 1;
    for (const w of words) {
      const c = w.syllableCounts.length > 0 ? w.syllableCounts[0] : 1;
      if (c > longestCount) {
        longest = w;
        longestCount = c;
      }
    }
    if (longestCount > 1) {
      const needed = longestCount - excess;
      if (needed >= 1) {
        suggestions.push(
          `"${longest.word}"(${longestCount} syll) could be replaced with a ${needed}-syll word`
        );
      }
    }
  }
  return suggestions;
}

function suggestReplacementsUnder(
  words: WordAnalysis[],
  deficit: number,
  _dict: CmuDict
): string[] {
  const suggestions: string[] = [];
  for (const w of words) {
    const count = w.syllableCounts.length > 0 ? w.syllableCounts[0] : 1;
    if (count === 1) {
      const needed = count + deficit;
      suggestions.push(
        `"${w.word}"(${count} syll) could be replaced with a ${needed}-syll word`
      );
      break;
    }
  }
  if (suggestions.length === 0) {
    suggestions.push(`Add ${deficit} more syllable(s) to this line`);
  }
  return suggestions;
}

const COMMON_POETRY_WORDS = [
  "fair", "bright", "sweet", "warm", "cold", "dark", "light", "soft",
  "strong", "deep", "clear", "true", "pure", "bold", "rare", "still",
  "wild", "free", "keen", "swift", "vast", "calm", "great", "small",
  "young", "old", "new", "long", "high", "low", "wide", "thin",
  "rich", "poor", "kind", "wise", "brave", "proud", "glad",
  "gentle", "tender", "lovely", "golden", "silver", "quiet",
  "simple", "humble", "graceful", "noble", "sacred", "ancient",
];

function findShortAlternatives(
  _word: string,
  targetSyllables: number,
  dict: CmuDict
): string[] {
  const results: string[] = [];
  for (const w of COMMON_POETRY_WORDS) {
    const counts = getSyllableCount(w, dict);
    if (counts.includes(targetSyllables)) {
      results.push(w);
    }
    if (results.length >= 10) break;
  }
  return results;
}

function buildRhymePairs(
  scheme: string,
  lineResults: PoemAnalysis["lines"],
  dict: CmuDict
): PoemAnalysis["rhymePairs"] {
  if (!scheme) return [];

  const groups: Record<string, number[]> = {};
  for (let i = 0; i < scheme.length; i++) {
    const letter = scheme[i];
    if (!(letter in groups)) groups[letter] = [];
    groups[letter].push(i);
  }

  const pairs: PoemAnalysis["rhymePairs"] = [];
  for (const letter of Object.keys(groups).sort()) {
    const indices = groups[letter];
    if (indices.length < 2) continue;

    const endWords: string[] = [];
    for (const idx of indices) {
      if (idx < lineResults.length) {
        const words = lineResults[idx].words;
        if (words.length > 0) {
          endWords.push(words[words.length - 1].word);
        }
      }
    }

    if (endWords.length >= 2) {
      const firstRhymes = findRhymes(endWords[0], dict, "perfect");
      const isPerfect = endWords
        .slice(1)
        .some((w) => firstRhymes.includes(w));
      const rhymeType = isPerfect ? "perfect" : "near";
      pairs.push({
        label: letter,
        words: [endWords[0], endWords[1]],
        type: rhymeType,
      });
    }
  }

  return pairs;
}

function buildSuggestions(
  lineResults: PoemAnalysis["lines"],
  dict: CmuDict
): string[] {
  const suggestions: string[] = [];
  for (const lr of lineResults) {
    if (lr.problems.length === 0) continue;
    const lineNum = lr.lineNum;

    for (const prob of lr.problems) {
      if (prob.startsWith("syllables_over:")) {
        const diff = parseInt(prob.split(":")[1], 10);
        let base = `Line ${lineNum}: ${diff} syllable(s) over target.`;

        // Find replacement suggestions
        for (const w of lr.words) {
          const count =
            w.syllableCounts.length > 0 ? w.syllableCounts[0] : 1;
          if (count > 1 && count > diff) {
            const needed = count - diff;
            const alts = findShortAlternatives(w.word, needed, dict);
            if (alts.length > 0) {
              base += ` Alternatives for "${w.word}": ${alts.slice(0, 6).join(", ")}`;
            }
            break;
          }
        }
        suggestions.push(base);
      } else if (prob.startsWith("syllables_under:")) {
        const diff = parseInt(prob.split(":")[1], 10);
        suggestions.push(
          `Line ${lineNum}: ${diff} syllable(s) under target.`
        );
      } else if (prob === "stress_mismatch") {
        suggestions.push(
          `Line ${lineNum}: Stress pattern does not match target. ` +
            `Actual: ${lr.stressPattern}, Target: ${lr.targetStress}`
        );
      }
    }
  }
  return suggestions;
}

// ---------------------------------------------------------------------------
// 10. analyzePoem — high-level poem analysis
// ---------------------------------------------------------------------------

export function analyzePoem(
  text: string,
  meter: string,
  dict: CmuDict
): PoemAnalysis {
  const meterPreset = parseMeter(meter);

  // Split into non-empty lines
  const rawLines = text.trim().split("\n");
  const lines = rawLines.filter((l) => l.trim());

  const lineResults: PoemAnalysis["lines"] = [];
  const problemLineNums: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    const lineText = lines[i];
    const analysis = analyzeLine(lineText, dict);
    const [sylMin, sylMax] = analysis.totalSyllables;
    const stress = analysis.stressPattern;

    const targetSyl = syllableTargetForLine(meterPreset, i);
    const targetStress = stressTargetForLine(meterPreset, i);

    // Syllable check
    let sylOk: boolean;
    if (targetSyl !== null) {
      sylOk = sylMin <= targetSyl && targetSyl <= sylMax;
    } else {
      sylOk = true;
    }

    // Stress check
    const stressResult = stressMatch(stress, targetStress);

    // Determine problems
    const problems: string[] = [];
    if (targetSyl !== null && !sylOk) {
      const bestCount = sylMin > targetSyl ? sylMin : sylMax;
      const diff = bestCount - targetSyl;
      if (diff > 0) {
        const wordSuggestions = suggestReplacementsOver(
          analysis.words,
          diff,
          dict
        );
        problems.push(`syllables_over:${diff}`);
        for (const s of wordSuggestions) {
          problems.push(`suggestion:${s}`);
        }
      } else {
        const wordSuggestions = suggestReplacementsUnder(
          analysis.words,
          Math.abs(diff),
          dict
        );
        problems.push(`syllables_under:${Math.abs(diff)}`);
        for (const s of wordSuggestions) {
          problems.push(`suggestion:${s}`);
        }
      }
    }

    if (targetStress && stressResult === "none") {
      problems.push("stress_mismatch");
    }

    if (problems.length > 0) {
      problemLineNums.push(i + 1);
    }

    lineResults.push({
      lineNum: i + 1,
      text: lineText.trim(),
      syllables: [sylMin, sylMax],
      target: targetSyl,
      stressPattern: stress,
      targetStress,
      syllableMatch: sylOk,
      stressMatch: stressResult,
      rhymeLabel: "", // filled in after scheme detection
      problems,
      words: analysis.words,
    });
  }

  // Rhyme scheme detection
  const detectedScheme = detectRhymeScheme(
    lineResults.map((lr) => lr.text),
    dict
  );
  const targetScheme = meterPreset.rhymeScheme ?? null;
  const schemeOk = targetScheme === null || detectedScheme === targetScheme;

  // Fill in rhyme labels
  for (let i = 0; i < lineResults.length; i++) {
    lineResults[i].rhymeLabel =
      i < detectedScheme.length ? detectedScheme[i] : "?";
  }

  // Build rhyme pairs
  const rhymePairs = buildRhymePairs(detectedScheme, lineResults, dict);

  // Line count check
  const targetLineCount = meterPreset.lineCount ?? null;
  const lineCountOk =
    targetLineCount === null || lines.length === targetLineCount;

  // Summary
  const sylMeeting = lineResults.filter((lr) => lr.syllableMatch).length;
  const stressMeeting = lineResults.filter(
    (lr) => lr.stressMatch === "full" || lr.stressMatch === "partial"
  ).length;

  const summaryProblems: string[] = [];
  if (!lineCountOk) {
    summaryProblems.push(
      `Expected ${targetLineCount} lines, got ${lines.length}`
    );
  }
  if (!schemeOk) {
    summaryProblems.push(
      `Rhyme scheme mismatch: detected ${detectedScheme}, target ${targetScheme}`
    );
  }
  if (problemLineNums.length > 0) {
    summaryProblems.push(
      `Problem lines: ${problemLineNums.join(", ")}`
    );
  }

  // Build suggestions
  const suggestions = buildSuggestions(lineResults, dict);

  return {
    meter: meterPreset.description,
    lines: lineResults,
    summary: {
      totalLines: lines.length,
      targetLines: targetLineCount,
      syllableMatches: sylMeeting,
      stressMatches: stressMeeting,
      rhymeScheme: detectedScheme,
      targetRhymeScheme: targetScheme,
      rhymeMatch: schemeOk,
      problems: summaryProblems,
    },
    rhymePairs,
    suggestions,
  };
}

// ---------------------------------------------------------------------------
// 11. findRhymesFor — structured rhyme lookup
// ---------------------------------------------------------------------------

export function findRhymesFor(word: string, dict: CmuDict): RhymeResult {
  const perfect = findRhymes(word, dict, "perfect");
  const nearAll = findRhymes(word, dict, "near");
  const perfectSet = new Set(perfect);
  const near = nearAll.filter((w) => !perfectSet.has(w));

  return {
    word,
    perfect: perfect.map((w) => ({
      word: w,
      syllables: getSyllableCount(w, dict)[0] ?? 1,
    })),
    near: near.map((w) => ({
      word: w,
      syllables: getSyllableCount(w, dict)[0] ?? 1,
    })),
  };
}

// ---------------------------------------------------------------------------
// 12. suggestWords — find words matching stress + syllable criteria
// ---------------------------------------------------------------------------

export function suggestWords(
  stress: string,
  syllables: number,
  dict: CmuDict,
  limit: number = 50
): string[] {
  function normalizePattern(p: string): string {
    return p.replace(/2/g, "1");
  }

  const targetNorm = normalizePattern(stress);
  const matches: string[] = [];

  for (const [word, pronunciations] of Object.entries(dict)) {
    for (const pron of pronunciations) {
      const vowels = pron.filter(isVowelPhoneme);
      if (vowels.length !== syllables) continue;
      const wordStress = vowels.map(stressDigit).join("");
      if (normalizePattern(wordStress) === targetNorm) {
        matches.push(word);
        break;
      }
    }
  }

  matches.sort();
  return matches.slice(0, limit);
}
