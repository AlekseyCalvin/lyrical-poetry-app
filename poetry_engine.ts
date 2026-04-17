/**
 * LYRICAL Poetry Engine v3 — CMU Dictionary-grounded prosody.
 *
 * DISPLAY: Uses ACTUAL CMU dict stress per syllable (not imposed patterns).
 * GENERATION: Pre-seeds rhyme word sets and validates line-by-line.
 * VALIDATION: Syllable counts, actual stress vs. meter, rhyme scheme.
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { DivergenceType } from './meter_exemplars.js';

// ── Types ─────────────────────────────────────────────────────────────────

export type CmuDict = Record<string, string[][]>;

export interface SyllableUnit {
    syllable: string;
    stress: string; // '/' (stressed) or 'u' (unstressed) — from ACTUAL CMU dict
}

export interface LineScansion {
    syllables: SyllableUnit[];
    totalSyllables: number;
    actualStressPattern: string; // e.g., "u/u/u/u/u/" — the real stress
    rhymeWord: string;
}

export interface MeterScore {
    adherence: number;          // 0-100 percentage
    expectedPattern: string;    // e.g., "/uu/uu/uu/uu"
    actualPattern: string;      // e.g., "/u//uu/uu/u"
    mismatches: number[];       // positions where stress doesn't match meter
}

export interface PoemValidation {
    lines: Array<{
        lineIndex: number;
        text: string;
        expectedSyllables: number;
        actualSyllables: number;
        syllableOk: boolean;
        meterScore: MeterScore;
    }>;
    expectedRhymeScheme: string;
    actualRhymeScheme: string;
    rhymeOk: boolean;
    allOk: boolean;
    errorReport: string;
    rhymeSuggestions: Record<string, string[]>;
}

// ── CMU Dict loading ──────────────────────────────────────────────────────

let _cmuDict: CmuDict | null = null;

export function loadCmuDict(): CmuDict {
    if (_cmuDict) return _cmuDict;
    const candidates = [
        join(dirname(fileURLToPath(import.meta.url)), 'poetry-mcp-server', 'src', 'cmudict.json'),
        join(dirname(fileURLToPath(import.meta.url)), 'cmudict.json'),
    ];
    for (const p of candidates) {
        try {
            const raw = readFileSync(p, 'utf-8');
            _cmuDict = JSON.parse(raw) as CmuDict;
            console.log(`[Engine] Loaded CMU dict from ${p} (${Object.keys(_cmuDict).length} entries)`);
            return _cmuDict;
        } catch { /* try next */ }
    }
    console.warn('[Engine] No cmudict.json found — using fallback heuristics');
    _cmuDict = {};
    return _cmuDict;
}

// ── Helpers ───────────────────────────────────────────────────────────────

const STRIP_RE = /[^\w'-]/gu;

function cleanWord(word: string): string {
    let w = word.trim().toLowerCase();
    w = w.replace(STRIP_RE, '');
    if (!w || [...w].every(ch => ch === '-')) return '';
    return w;
}

function isVowelPhoneme(phoneme: string): boolean {
    return phoneme.length > 0 && '012'.includes(phoneme[phoneme.length - 1]);
}

function stressDigit(phoneme: string): string {
    return phoneme[phoneme.length - 1];
}

function stripStress(phoneme: string): string {
    if (phoneme.length > 0 && '012'.includes(phoneme[phoneme.length - 1])) {
        return phoneme.slice(0, -1);
    }
    return phoneme;
}

// ── 1. Syllable count ─────────────────────────────────────────────────────

export function getSyllableCount(word: string, dict: CmuDict): number {
    const cleaned = cleanWord(word);
    if (!cleaned) return 0;
    if (cleaned.includes('-')) {
        const parts = cleaned.split('-').filter(p => p);
        if (parts.length > 1) return parts.reduce((sum, p) => sum + getSyllableCount(p, dict), 0);
    }
    const lookups = [cleaned];
    if (cleaned.includes("'")) lookups.push(cleaned.replace(/'/g, ''));
    for (const lookup of lookups) {
        if (lookup in dict) return dict[lookup][0].filter(isVowelPhoneme).length;
    }
    return fallbackSyllableCount(cleaned);
}

// ── 2. Fallback syllable counter ──────────────────────────────────────────

const VOWEL_DIGRAPHS = new Set([
    'ai', 'au', 'aw', 'ay', 'ee', 'ei', 'eu', 'ew', 'ey',
    'oa', 'oe', 'oi', 'oo', 'ou', 'ow', 'oy', 'ue', 'ui',
]);

const IRREGULAR: Record<string, number> = {
    colonel: 2, wednesday: 2, chocolate: 2, comfortable: 3, vegetable: 3,
    interesting: 3, temperature: 3, naturally: 3, deliberately: 5,
    business: 2, every: 2, evening: 2, different: 2, several: 2,
    beautiful: 3, family: 2, favorite: 2, feline: 2, delightful: 3,
    gracefully: 3, intelligence: 4, curious: 3, poetry: 3,
};

export function fallbackSyllableCount(word: string): number {
    const w = cleanWord(word).replace(/'/g, '').toLowerCase();
    if (!w) return 0;
    if (w in IRREGULAR) return IRREGULAR[w];
    if (w.includes('-')) {
        const parts = w.split('-').filter(p => p);
        if (parts.length > 1) return parts.reduce((sum, p) => sum + fallbackSyllableCount(p), 0);
    }

    let count = 0;
    let i = 0;
    while (i < w.length) {
        if ('aeiouy'.includes(w[i])) {
            count += 1;
            if (i + 1 < w.length && VOWEL_DIGRAPHS.has(w.slice(i, i + 2))) { i += 2; continue; }
            i += 1;
        } else { i += 1; }
    }
    if (w.endsWith('e') && !w.endsWith('le') && count > 1) {
        if (w.length >= 2 && !'aeiouy'.includes(w[w.length - 2])) count -= 1;
    }
    if (w.endsWith('ed') && w.length > 3 && !'td'.includes(w[w.length - 3])) {
        if (!'aeiouy'.includes(w[w.length - 3]) && count > 1) count -= 1;
    }
    return Math.max(count, 1);
}

// ── 3. ACTUAL stress pattern from CMU dict ────────────────────────────────

/**
 * Function words that are almost always UNSTRESSED in poetry,
 * even though CMU dict marks them as stressed (stress=1) in isolation.
 * In running verse, these occupy weak metrical positions.
 */
const FUNCTION_WORDS = new Set([
    'a', 'an', 'the',
    'of', 'to', 'in', 'on', 'at', 'by', 'for', 'from', 'with', 'as',
    'and', 'but', 'or', 'nor', 'so', 'yet',
    'is', 'am', 'are', 'was', 'were', 'be', 'been',
    'do', 'does', 'did',
    'has', 'had', 'have',
    'if', 'than', 'that', 'which', 'who',
    'it', 'its', 'his', 'her', 'my', 'our', 'your', 'their',
    'he', 'she', 'we', 'me', 'us', 'them',
    'not', 'no', 'up',
    'can', 'may', 'will', 'shall', 'would', 'could', 'should', 'might', 'must',
]);

/**
 * Get ACTUAL stress for a word from CMU dict.
 * Returns array of '/' (primary '1'), '\\' (secondary '2') or 'u' (unstressed '0').
 * Single-syllable function words are always treated as unstressed in verse.
 */
export function getWordStress(word: string, dict: CmuDict): string[] {
    const cleaned = cleanWord(word);
    if (!cleaned) return [];

    // Single-syllable function words → always unstressed in poetry
    if (FUNCTION_WORDS.has(cleaned)) {
        const sylCount = getSyllableCount(cleaned, dict);
        if (sylCount === 1) return ['u'];
    }

    const lookups = [cleaned];
    if (cleaned.includes("'")) lookups.push(cleaned.replace(/'/g, ''));

    // 1. Direct hit
    for (const lookup of lookups) {
        if (lookup in dict) {
            const phonemes = dict[lookup][0];
            return extractStressArray(phonemes);
        }
    }

    // 2. Stem/suffix truncation hit (e.g. 'refract' missing -> triggers on 'refractive'/'refraction')
    const targetSylCount = fallbackSyllableCount(cleaned);
    const stems = ["s", "es", "ed", "ing", "ly", "ive", "ion", "tion"];
    for (const lookup of lookups) {
        for (const stem of stems) {
            const potentialMatch = lookup + stem;
            if (potentialMatch in dict) {
                const phonemes = dict[potentialMatch][0];
                const fullStress = extractStressArray(phonemes);
                // Truncate the stress array down to our target syllable count (which drops the suffix)
                return fullStress.slice(0, targetSylCount);
            }
        }
    }

    // Fallback: heuristic stress (first syllable stressed for multi-syllable words)
    if (targetSylCount <= 1) return ['/'];
    // Simple heuristic: alternating stress starting with stressed
    return Array.from({ length: targetSylCount }, (_, i) => i % 2 === 0 ? '/' : 'u');
}

function extractStressArray(phonemes: string[]): string[] {
    return phonemes.filter(isVowelPhoneme).map(p => {
        const d = stressDigit(p);
        if (d === '1') return '/';
        if (d === '2') return '\\';
        return 'u';
    });
}

// ── 4. Syllable splitting ─────────────────────────────────────────────────

export function splitWordIntoSyllables(word: string, dict: CmuDict): string[] {
    const sylCount = getSyllableCount(word, dict);
    if (sylCount <= 1) return [word];

    const cleanW = word.replace(/[.,;:!?'"()\-]+$/, '');
    const trailing = word.slice(cleanW.length);
    const lower = cleanW.toLowerCase();

    // 1. Identify true vowel nuclei via character groups
    const vowelGroups: { start: number, end: number }[] = [];
    let inVowel = false;
    let start = -1;
    for (let i = 0; i < lower.length; i++) {
        const isVowel = 'aeiouy'.includes(lower[i]);
        if (isVowel) {
            if (!inVowel) { start = i; inVowel = true; }
        } else {
            if (inVowel) { vowelGroups.push({ start, end: i - 1 }); inVowel = false; }
        }
    }
    if (inVowel) vowelGroups.push({ start, end: lower.length - 1 });

    // 2. Reduce vowel groups to match the phonemic syllable count (e.g., silent 'e')
    while (vowelGroups.length > sylCount && vowelGroups.length > 1) {
        if (lower[vowelGroups[vowelGroups.length - 1].end] === 'e') {
            vowelGroups.pop();
        } else {
            vowelGroups.pop();
        }
    }

    // Fallback block if vowel nuclei count ends up less than syllable count
    if (vowelGroups.length < sylCount) {
        const chunkSize = Math.max(1, Math.floor(cleanW.length / sylCount));
        const parts: string[] = [];
        for (let i = 0; i < sylCount - 1; i++) parts.push(cleanW.slice(i * chunkSize, (i + 1) * chunkSize));
        parts.push(cleanW.slice((sylCount - 1) * chunkSize) + trailing);
        return parts;
    }

    // 3. Phonotactically distribute intervening consonants
    const splits: number[] = [];
    for (let v = 1; v < vowelGroups.length; v++) {
        const prevEnd = vowelGroups[v - 1].end;
        const nextStart = vowelGroups[v].start;
        const consCount = nextStart - prevEnd - 1;

        let splitAt = prevEnd + 1; // Unlikely default unless neighboring vowels were artificially split

        if (consCount === 0) {
            splitAt = nextStart;
        } else if (consCount === 1) {
            splitAt = prevEnd + 1; // e.g., wa-ter
        } else if (consCount === 2) {
            const digraphs = ['th', 'sh', 'ch', 'ph', 'wh'];
            const cons = lower.slice(prevEnd + 1, nextStart);
            if (digraphs.includes(cons)) {
                splitAt = prevEnd + 1; // Keep digraph intact
            } else {
                splitAt = prevEnd + 2; // Split between e.g. star-light
            }
        } else if (consCount >= 3) {
            const digraphs = ['th', 'sh', 'ch', 'ph', 'wh'];
            const firstTwo = lower.slice(prevEnd + 1, prevEnd + 3);
            if (digraphs.includes(firstTwo)) {
                splitAt = prevEnd + 3; // Keep digraph part with onset e.g. ath-lete
            } else {
                splitAt = prevEnd + 2; // e.g. um-brel-la or scul-pting
            }
        }

        splits.push(splitAt);
    }

    const parts: string[] = [];
    let prevIdx = 0;
    for (const idx of splits) {
        parts.push(cleanW.slice(prevIdx, idx));
        prevIdx = idx;
    }
    parts.push(cleanW.slice(prevIdx) + trailing);

    return parts.filter(p => p.length > 0);
}

// ── 5. Line scansion with ACTUAL CMU stress ───────────────────────────────

/**
 * Analyze a line with ACTUAL stress from CMU dict.
 * This is the ground-truth — shows real word stress, not imposed patterns.
 */
export function analyzeLineScansion(
    text: string,
    dict: CmuDict,
): LineScansion {
    const words = text.split(/\s+/).filter(w => w);
    const syllables: SyllableUnit[] = [];

    for (let wIdx = 0; wIdx < words.length; wIdx++) {
        const word = words[wIdx];
        const syls = splitWordIntoSyllables(word, dict);
        const stress = getWordStress(word, dict);
        const isLastWord = wIdx === words.length - 1;

        for (let sIdx = 0; sIdx < syls.length; sIdx++) {
            const isLastSyl = sIdx === syls.length - 1;
            let sylText = syls[sIdx];
            if (isLastSyl && !isLastWord) sylText += ' ';

            // Use ACTUAL stress from CMU dict
            const s = sIdx < stress.length ? stress[sIdx] : 'u';
            syllables.push({ syllable: sylText, stress: s });
        }
    }

    const lastWord = words.length > 0 ? words[words.length - 1] : '';

    return {
        syllables,
        totalSyllables: syllables.length,
        actualStressPattern: syllables.map(s => s.stress).join(''),
        rhymeWord: cleanWord(lastWord),
    };
}

// ── 6. Meter adherence scoring ────────────────────────────────────────────

/**
 * Score how well actual stress matches the requested meter pattern.
 */
export function scoreMeterAdherence(actualStress: string, expectedPattern: string[], footMultiplier: number): MeterScore {
    const minLen = Math.min(actualStress.length, expectedPattern.length * footMultiplier);

    // Scale expected up to the full line count
    const fullExpected = Array.from({ length: expectedPattern.length * footMultiplier }, (_, i) => expectedPattern[i % expectedPattern.length]).join('');

    let score = 0;
    const mismatches: number[] = [];

    // We only penalize up to the shortest length. Truncation or overflow is inherently penalized by absolute syl count elsewhere
    for (let i = 0; i < minLen; i++) {
        const act = actualStress[i];
        const exp = fullExpected[i];

        if (act === exp) {
            score++;
        } else if (act === '\\' && exp === '/') {
            // Secondary stress mapped to a primary position is acceptable, slight deduction
            score += 0.8;
        } else if (act === '\\' && exp === 'u') {
            // Secondary stress mapped to unstressed position is barely acceptable
            score += 0.4;
        } else {
            mismatches.push(i);
        }
    }

    const pct = minLen > 0 ? (score / fullExpected.length) * 100 : 0;

    return {
        adherence: pct,
        expectedPattern: fullExpected,
        actualPattern: actualStress,
        mismatches,
    };
}

export interface MappedSyllable {
    syllable: string;
    actualStress: string;
    expectedStress: string;
    isDivergent: boolean;
}

export interface FabbHalleEvaluation {
    orthographicSyllables: number;
    poeticSyllables: number;
    divergences: string[];
    meterScore: number;
    alignedActualStress: string;
    expectedStress: string;
    mappedSyllables: MappedSyllable[];
}

export function evaluateFabbHalleScansion(lineText: string, expectedPattern: string[], footMultiplier: number, dict: CmuDict): FabbHalleEvaluation {
    const scansion = analyzeLineScansion(lineText, dict);
    const expected = Array.from({ length: expectedPattern.length * footMultiplier }, (_, i) => expectedPattern[i % expectedPattern.length]).join('');
    
    let actual = scansion.actualStressPattern;
    const orthographicSyllables = actual.length;
    let poeticSyllables = orthographicSyllables;
    const divergences: string[] = [];
    
    const rawSyllables = scansion.syllables.map(s => ({ ...s, isDivergent: false }));

    // 1. Feminine Ending (Extra unstressed syllable at the end)
    if (actual.length > expected.length && actual.endsWith('u') && expected.endsWith('/')) {
        poeticSyllables--;
        divergences.push("feminine_ending");
        rawSyllables[rawSyllables.length - 1].isDivergent = true;
    }
    
    // 2. Anacrusis / Acephalous (Extra or missing unstressed syllable at start)
    if (actual.length < expected.length && expected.startsWith('u') && actual.startsWith('/')) {
        // Missing initial unstressed (acephalous/headless)
        poeticSyllables++;
        divergences.push("acephalous");
        rawSyllables.unshift({ syllable: '', stress: 'u', isDivergent: true });
    } else if (actual.length > expected.length && expected.startsWith('u') && expected[1] === '/' && actual.startsWith('uu/')) {
        // Extra initial unstressed (anacrusis in Iambic)
        poeticSyllables--;
        divergences.push("anacrusis");
        rawSyllables[0].isDivergent = true;
    } else if (actual.length > expected.length && expected.startsWith('u') && expected[1] === 'u' && expected[2] === '/' && actual.startsWith('uuu/')) {
        // Anacrusis in Anapestic
        poeticSyllables--;
        divergences.push("anacrusis");
        rawSyllables[0].isDivergent = true;
    }
    
    // 3. Elision (If still too long, look for common elidable words)
    // We compute this on the original actual string length
    if (rawSyllables.filter(s => !s.isDivergent).length > expected.length) {
        const words = lineText.toLowerCase().split(/\s+/).filter(w => w);
        const elidable = new Set(["the", "a", "an", "and", "of", "to", "in"]);
        let elisionCount = 0;
        
        for (let i = 0; i < words.length - 1; i++) {
            const cleanW = words[i].replace(/[^a-z]/g, '');
            if (elidable.has(cleanW)) elisionCount++;
        }
        
        const currentActiveCount = rawSyllables.filter(s => !s.isDivergent).length;
        const neededReductions = currentActiveCount - expected.length;
        const appliedElisions = Math.min(elisionCount, neededReductions);
        
        if (appliedElisions > 0) {
            poeticSyllables -= appliedElisions;
            let applied = 0;
            
            // First pass: target elidable function words
            for (let i = 0; i < rawSyllables.length && applied < appliedElisions; i++) {
                const s = rawSyllables[i];
                if (!s.isDivergent && s.stress === 'u' && elidable.has(s.syllable.trim().toLowerCase().replace(/[^a-z]/g, ''))) {
                    s.isDivergent = true;
                    applied++;
                }
            }
            
            // Second pass: fallback if we didn't hit enough target words
            for (let i = 0; i < rawSyllables.length && applied < appliedElisions; i++) {
                const s = rawSyllables[i];
                if (!s.isDivergent && s.stress === 'u') {
                    s.isDivergent = true;
                    applied++;
                }
            }
            divergences.push("elision");
        }
    }
    
    // Reconstruct `actual` based solely on non-divergent syllables
    actual = rawSyllables.filter(s => !s.isDivergent).map(s => s.stress).join('');
    
    // 4. Score and Map using OT constraints
    let score = 100;
    const mappedSyllables: MappedSyllable[] = [];
    let expectedIdx = 0;

    for (const raw of rawSyllables) {
        if (raw.isDivergent) {
            mappedSyllables.push({
                syllable: raw.syllable,
                actualStress: raw.stress,
                expectedStress: '-',
                isDivergent: true
            });
            // Extrametricality penalty (DEP-2 violation)
            score -= 2; 
        } else {
            const expStr = expectedIdx < expected.length ? expected[expectedIdx] : '-';
            mappedSyllables.push({
                syllable: raw.syllable,
                actualStress: raw.stress,
                expectedStress: expStr,
                isDivergent: false
            });
            
            // Faithfulness Constraints (NOFLOP)
            if (raw.stress === expStr) {
                // Perfect faithful match
            } else if (raw.stress === '\\' && expStr === '/') {
                // Slight demotion to secondary stress
                score -= 2;
            } else if (raw.stress === '\\' && expStr === 'u') {
                // Secondary stress on weak slot — possible stress demotion
                score -= 4;
            } else if (raw.stress === '/' && expStr === 'u') {
                // Heavy stress on weak slot (NOFLOP violation)
                // Apply Attridge/Kiparsky demoted stress detection:
                // Monosyllabic content words get reduced penalty (demotion is natural)
                const isMonosyllabic = raw.syllable.trim().length > 0 && raw.syllable.trim().split(/\s+/).length === 1;
                // Check if flanked by stressed syllables (classic demotion context)
                const prevIdx = rawSyllables.indexOf(raw) - 1;
                const nextIdx = rawSyllables.indexOf(raw) + 1;
                const prevStressed = prevIdx >= 0 && (rawSyllables[prevIdx].stress === '/' || rawSyllables[prevIdx].stress === '\\');
                const nextStressed = nextIdx < rawSyllables.length && (rawSyllables[nextIdx].stress === '/' || rawSyllables[nextIdx].stress === '\\');
                const isDemotion = isMonosyllabic && (prevStressed || nextStressed);
                score -= isDemotion ? 4 : 10;  // Reduced penalty for demotion context
            } else if (raw.stress === 'u' && expStr === '/') {
                // Missing stress on strong slot (NOFLOP violation, pyrrhic foot)
                score -= 10;
            }

            expectedIdx++;
        }
    }
    
    // Penalize remaining un-aligned length mismatch (MAX / DEP alignment violations)
    if (actual.length !== expected.length) {
        score -= Math.abs(actual.length - expected.length) * 15;
    }
    
    return {
        orthographicSyllables,
        poeticSyllables,
        divergences,
        meterScore: Math.max(0, score),
        alignedActualStress: actual,
        expectedStress: expected,
        mappedSyllables
    };
}

// ── 7. End phonemes & rhyme detection ─────────────────────────────────────

function extractEndPhonemes(phonemeList: string[]): string[] | null {
    let lastStressedIdx: number | null = null;
    let lastVowelIdx: number | null = null;
    for (let i = 0; i < phonemeList.length; i++) {
        const p = phonemeList[i];
        if (isVowelPhoneme(p)) {
            lastVowelIdx = i;
            if (p[p.length - 1] === '1') lastStressedIdx = i;
            else if (p[p.length - 1] === '2' && lastStressedIdx === null) lastStressedIdx = i;
        }
    }
    const idx = lastStressedIdx !== null ? lastStressedIdx : lastVowelIdx;
    return idx !== null ? phonemeList.slice(idx) : null;
}

export function getEndPhonemes(word: string, dict: CmuDict): string[][] {
    const cleaned = cleanWord(word);
    if (!cleaned) return [];
    const lookups = [cleaned];
    if (cleaned.includes("'")) lookups.push(cleaned.replace(/'/g, ''));
    for (const lookup of lookups) {
        if (lookup in dict) {
            const results: string[][] = [];
            for (const pron of dict[lookup]) {
                const endPhon = extractEndPhonemes(pron);
                if (endPhon !== null) results.push(endPhon);
            }
            return results;
        }
    }
    return [];
}

function endingsMatch(endingsA: string[][], endingsB: string[][]): boolean {
    return classifyRhymeMatch(endingsA, endingsB) !== 'none';
}

/**
 * Classify the type of rhyme between two sets of end phonemes.
 * Returns the best match type found.
 */
export function classifyRhymeMatch(endingsA: string[][], endingsB: string[][]): string {
    for (const ea of endingsA) {
        for (const eb of endingsB) {
            // Exact match = perfect rhyme
            if (ea.length === eb.length && ea.every((p, i) => p === eb[i])) return 'perfect';
            
            // Strip stress digits match = perfect (ignoring stress level)
            const aStripped = ea.map(stripStress);
            const bStripped = eb.map(stripStress);
            if (aStripped.length === bStripped.length) {
                let diffs = 0;
                for (let i = 0; i < aStripped.length; i++) if (aStripped[i] !== bStripped[i]) diffs++;
                if (diffs === 0) return 'perfect';
                if (aStripped.length <= 2 ? diffs === 0 : diffs <= 1) return 'slant';
            }
            
            // Assonant rhyme: vowel nuclei match, consonants may differ
            const aVowels = aStripped.filter(p => 'AEIOU'.includes(p.charAt(0)));
            const bVowels = bStripped.filter(p => 'AEIOU'.includes(p.charAt(0)));
            if (aVowels.length > 0 && aVowels.length === bVowels.length && aVowels.every((v, i) => v === bVowels[i])) {
                return 'assonant';
            }
            
            // Consonant rhyme: consonant frames match, vowels may differ
            const aConsonants = aStripped.filter(p => !'AEIOU'.includes(p.charAt(0)));
            const bConsonants = bStripped.filter(p => !'AEIOU'.includes(p.charAt(0)));
            if (aConsonants.length > 0 && aConsonants.length === bConsonants.length && aConsonants.every((c, i) => c === bConsonants[i])) {
                return 'consonant';
            }
            
            // Slant fallback: if ending phonemes overlap by >= 50%
            const minLen = Math.min(aStripped.length, bStripped.length);
            if (minLen >= 2) {
                let matches = 0;
                for (let i = 0; i < minLen; i++) {
                    if (aStripped[aStripped.length - 1 - i] === bStripped[bStripped.length - 1 - i]) matches++;
                }
                if (matches / minLen >= 0.5) return 'slant';
            }
        }
    }
    return 'none';
}

function getLastWord(line: string): string {
    if (!line?.trim()) return '';
    const tokens = line.trim().split(/\s+/);
    for (let i = tokens.length - 1; i >= 0; i--) {
        const cleaned = cleanWord(tokens[i]);
        if (cleaned) return cleaned;
    }
    return '';
}

export function detectRhymeScheme(lines: string[], dict: CmuDict): string {
    if (lines.length === 0) return '';
    const lineEndings = lines.map(line => ({
        word: getLastWord(line),
        endings: getEndPhonemes(getLastWord(line), dict),
    }));

    const scheme: string[] = [];
    let nextLabel = 0;
    const groups: Array<{ endings: string[][]; label: string; word: string }> = [];

    for (const { endings, word } of lineEndings) {
        if (endings.length === 0) {
            scheme.push(nextLabel < 26 ? String.fromCharCode(65 + nextLabel) : '?');
            nextLabel++;
            continue;
        }
        let matched = false;
        for (const group of groups) {
            if (endingsMatch(endings, group.endings)) {
                scheme.push(group.label);
                for (const e of endings) group.endings.push(e);
                matched = true;
                break;
            }
        }
        if (!matched) {
            const label = nextLabel < 26 ? String.fromCharCode(65 + nextLabel) : '?';
            scheme.push(label);
            groups.push({ endings: [...endings], label, word });
            nextLabel++;
        }
    }
    return scheme.join('');
}

// ── 8. Find rhymes for a word ─────────────────────────────────────────────

export function findRhymesFor(word: string, dict: CmuDict, limit: number = 15): string[] {
    const cleaned = cleanWord(word);
    if (!cleaned) return [];
    const wordEndings = getEndPhonemes(cleaned, dict);
    if (wordEndings.length === 0) return [];
    const rhymes: string[] = [];
    for (const candidate of Object.keys(dict)) {
        if (candidate === cleaned) continue;
        if (rhymes.length >= limit) break;
        for (const pron of dict[candidate]) {
            const candEnd = extractEndPhonemes(pron);
            if (candEnd === null) continue;
            for (const wEnd of wordEndings) {
                const aStr = wEnd.map(stripStress);
                const bStr = candEnd.map(stripStress);
                if (aStr.length === bStr.length && aStr.every((p, i) => p === bStr[i])) {
                    rhymes.push(candidate);
                    break;
                }
            }
            if (rhymes.includes(candidate)) break;
        }
    }
    return rhymes;
}

// ── 9. Generate rhyme word sets for prompt pre-seeding ────────────────────

/**
 * Generate rhyme word sets that the LLM can use as end-words.
 * Returns groups of rhyming words from CMU dict.
 */
export function generateRhymeWordSets(
    dict: CmuDict,
    count: number = 6,
): Array<{ seed: string; rhymes: string[] }> {
    // Distinct poetry words as seeds, skipping immediate structural rhymes
    const seeds = [
        'light', 'day', 'love', 'heart',
        'dream', 'sky', 'fire', 'moon',
        'grace', 'gold', 'rain', 'wild',
        'sea', 'time', 'sound', 'deep',
        'wind', 'soul', 'earth', 'stone',
        'shade', 'flame', 'song', 'rose',
        'star', 'bird', 'tree', 'word',
        'truth', 'youth', 'hope', 'life'
    ];

    const sets: Array<{ seed: string; rhymes: string[] }> = [];
    const usedWords = new Set<string>();

    // Track the normalized phonetic endings of the sets to prevent A & B sounds from rhyming
    const usedEndings: string[][] = [];

    for (const seed of seeds) {
        if (sets.length >= count) break;
        if (usedWords.has(seed)) continue;

        const myEndings = getEndPhonemes(seed, dict);
        if (myEndings.length === 0) continue;

        let soundsLikeExisting = false;
        for (const e of myEndings) {
            for (const used of usedEndings) {
                const eStripped = e.map(stripStress).join(' ');
                const uStripped = used.map(stripStress).join(' ');
                if (eStripped === uStripped) soundsLikeExisting = true;
            }
        }

        if (soundsLikeExisting) continue;

        const rhymes = findRhymesFor(seed, dict, 20).filter(r => !usedWords.has(r) && r.length <= 8);
        if (rhymes.length >= 3) {
            sets.push({ seed, rhymes: rhymes.slice(0, 5) });
            usedWords.add(seed);
            for (const r of rhymes.slice(0, 5)) usedWords.add(r);
            usedEndings.push(myEndings[0]);
        }
    }

    return sets;
}

// ── 10. Poem validation ───────────────────────────────────────────────────

export function validatePoem(
    lineTexts: string[],
    expectedSylPerLine: number,
    expectedRhymeScheme: string,
    meterUnit: string[],
    footCount: number,
    dict: CmuDict,
): PoemValidation {
    const lines: PoemValidation['lines'] = [];
    const errors: string[] = [];

    for (let i = 0; i < lineTexts.length; i++) {
        const text = lineTexts[i];
        const words = text.split(/\s+/).filter(w => w);
        let totalSyl = 0;
        for (const word of words) totalSyl += getSyllableCount(word, dict);

        const syllableOk = totalSyl === expectedSylPerLine;

        // Get actual stress and score meter adherence
        const scansion = analyzeLineScansion(text, dict);
        const meterScore = scoreMeterAdherence(scansion.actualStressPattern, meterUnit, footCount);

        lines.push({ lineIndex: i, text, expectedSyllables: expectedSylPerLine, actualSyllables: totalSyl, syllableOk, meterScore });

        if (!syllableOk) {
            errors.push(`Line ${i + 1}: has ${totalSyl} syllables, needs exactly ${expectedSylPerLine}. "${text}"`);
        }
        if (meterScore.adherence < 60) {
            errors.push(`Line ${i + 1}: meter adherence only ${meterScore.adherence}%. Actual stress: ${meterScore.actualPattern}, expected: ${meterScore.expectedPattern}`);
        }
    }

    const cleanExpected = expectedRhymeScheme.replace(/\s+/g, '');
    const actualRhymeScheme = detectRhymeScheme(lineTexts, dict);
    const rhymeOk = actualRhymeScheme === cleanExpected;

    if (!rhymeOk) {
        errors.push(`Rhyme scheme: detected "${actualRhymeScheme}" but need "${cleanExpected}".`);
        for (let i = 0; i < cleanExpected.length && i < lineTexts.length; i++) {
            if (i < actualRhymeScheme.length && actualRhymeScheme[i] !== cleanExpected[i]) {
                const rhymePartners = [];
                for (let j = 0; j < cleanExpected.length; j++) {
                    if (j !== i && cleanExpected[j] === cleanExpected[i]) rhymePartners.push(j + 1);
                }
                const endWord = getLastWord(lineTexts[i]);
                if (rhymePartners.length > 0) {
                    errors.push(`  Line ${i + 1} ends with "${endWord}" but must rhyme with line(s) ${rhymePartners.join(', ')}.`);
                }
            }
        }
    }

    // Generate rhyme suggestions
    const rhymeSuggestions: Record<string, string[]> = {};
    const rhymeGroups: Record<string, number[]> = {};
    for (let i = 0; i < cleanExpected.length; i++) {
        const letter = cleanExpected[i];
        if (!(letter in rhymeGroups)) rhymeGroups[letter] = [];
        rhymeGroups[letter].push(i);
    }
    for (const [letter, indices] of Object.entries(rhymeGroups)) {
        if (indices.length < 2) continue;
        if (indices[0] < lineTexts.length) {
            const refWord = getLastWord(lineTexts[indices[0]]);
            if (refWord) {
                const rhymes = findRhymesFor(refWord, dict, 20);
                if (rhymes.length > 0) {
                    rhymeSuggestions[`${letter}(rhymes with "${refWord}")`] = rhymes.slice(0, 10);
                }
            }
        }
    }

    const allOk = lines.every(l => l.syllableOk) && rhymeOk;

    let errorReport = '';
    if (!allOk) {
        errorReport = 'VALIDATION ERRORS:\n' + errors.join('\n');
        if (Object.keys(rhymeSuggestions).length > 0) {
            errorReport += '\n\nRHYME SUGGESTIONS (verified from phonetic dictionary):';
            for (const [key, words] of Object.entries(rhymeSuggestions)) {
                errorReport += `\n  ${key}: ${words.join(', ')}`;
            }
        }
    }

    return { lines, expectedRhymeScheme: cleanExpected, actualRhymeScheme, rhymeOk, allOk, errorReport, rhymeSuggestions };
}

// ── 11. Count syllables for a full line ───────────────────────────────────

export function countLineSyllables(text: string, dict: CmuDict): number {
    return text.split(/\s+/).filter(w => w).reduce((sum, w) => sum + getSyllableCount(w, dict), 0);
}

// ── 12. Find words matching a specific stress pattern ─────────────────────

/**
 * Find common words from CMU dict whose stress pattern matches a given pattern.
 * E.g., pattern='/' → single stressed syllables: "cat", "light", "day"
 *       pattern='/u' → trochees: "beauty", "golden", "morning"
 *       pattern='u/' → iambs: "above", "believe", "delight"
 *       pattern='/uu' → dactyls: "beautiful", "silently", "merrily"
 *       pattern='uu/' → anapests: "understand", "incomplete"
 */
export function findWordsWithStress(
    pattern: string,
    dict: CmuDict,
    limit: number = 20,
): string[] {
    const targetLen = pattern.length;
    const matches: string[] = [];

    // Common words list — prioritize shorter, more common words
    const commonWords = new Set([
        'the', 'a', 'an', 'in', 'on', 'of', 'to', 'for', 'and', 'but', 'or',
        'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
        'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
        'shall', 'can', 'must', 'need', 'dare', 'ought',
    ]);

    for (const [word, pronunciations] of Object.entries(dict)) {
        if (matches.length >= limit) break;
        if (word.length > 10 || word.length < 2) continue;
        if (commonWords.has(word)) continue;
        if (word.includes("'") || word.includes('.')) continue;

        const phonemes = pronunciations[0];
        const vowels = phonemes.filter(isVowelPhoneme);
        if (vowels.length !== targetLen) continue;

        const wordStress = vowels.map(p => {
            const d = stressDigit(p);
            return d === '1' || d === '2' ? '/' : 'u';
        }).join('');

        if (wordStress === pattern) {
            matches.push(word);
        }
    }

    // Sort by word length (shorter = more common)
    matches.sort((a, b) => a.length - b.length);
    return matches.slice(0, limit);
}

// ── 13. Russian syllable counting ─────────────────────────────────────────

const RUSSIAN_VOWELS = new Set('АаЕеЁёИиОоУуЫыЭэЮюЯя'.split(''));

export function countRussianSyllables(word: string): number {
    let count = 0;
    for (const ch of word) if (RUSSIAN_VOWELS.has(ch)) count++;
    return Math.max(count, 1);
}

export function isRussianText(text: string): boolean {
    return /[а-яА-ЯёЁ]/.test(text);
}
