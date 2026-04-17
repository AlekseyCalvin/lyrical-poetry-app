import { readFileSync } from 'node:fs';

/**
 * LYRICAL anti-cliche utilities.
 *
 * Core principle: a word is not a cliche on its own. What goes stale is
 * ready-made phrasing, prefabricated emotional shorthand, and repetitive reuse
 * of the same end-words or image-clusters inside one poem.
 *
 * This module therefore does three things:
 * 1. Loads the user's curated phrase lexicon from cliches_.txt.
 * 2. Scores lines for exact or near-exact stock phrasing.
 * 3. Scores whole poems for internal repetition of end-words and image-bigrams.
 * 4. Suggests or puts forth a pre-curated lexical pool associated with the poem's theme.
 *
 * This file is server-side only.
 */

type ClicheHitType =
  | 'exact_phrase'
  | 'loose_phrase'
  | 'repeated_end_word'
  | 'repeated_bigram'
  | 'repeated_image_word';

export interface ClicheHit {
  type: ClicheHitType;
  snippet: string;
  source?: string;
  score: number;
}

export interface LineClicheAnalysis {
  line: string;
  normalized: string;
  score: number;
  hits: ClicheHit[];
}

export interface PoemClicheAnalysis {
  score: number;
  lines: LineClicheAnalysis[];
  repeatedEndWords: string[];
  repeatedBigrams: string[];
  repeatedImageWords: string[];
}

export interface ClicheAnalysisOptions {
  theme?: string;
  exemptWords?: string[];
  allowExactLineRepeats?: boolean;
}

interface ClichePhraseEntry {
  phrase: string;
  tokens: string[];
}

const RAW_CLICHE_LEXICON = readFileSync(new URL('./cliches_.txt', import.meta.url), 'utf8');

const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'been', 'but', 'by', 'for',
  'from', 'had', 'has', 'have', 'he', 'her', 'hers', 'him', 'his', 'i',
  'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'me', 'my', 'of', 'on',
  'or', 'our', 'ours', 'she', 'so', 'than', 'that', 'the', 'their', 'them',
  'themselves', 'there', 'these', 'they', 'this', 'those', 'to', 'up', 'us',
  'was', 'we', 'were', 'what', 'when', 'where', 'which', 'who', 'with',
  'you', 'your', 'yours',
]);

const POETIC_IMAGE_HINTS = new Set([
  'bird', 'cloud', 'dawn', 'day', 'dream', 'eye', 'eyes', 'flame', 'glimmer',
  'gold', 'golden', 'heart', 'hope', 'light', 'moon', 'night', 'rain', 'sea',
  'shadow', 'sky', 'soul', 'star', 'storm', 'sun', 'wind',
]);

const DEFAULT_PROMPT_EXAMPLES = [
  'dark and stormy night',
  'depth of my soul',
  'glimmer of hope',
  'follow your heart',
  'broken heart',
  'every cloud has a silver lining',
  'brand new day',
  'dare to dream',
  'free as a bird',
  'calm before the storm',
];

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function normalizeForClicheMatch(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’‘]/g, "'")
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9'\s-]/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenizeNormalized(text: string): string[] {
  if (!text) return [];
  return text.split(' ').filter(Boolean);
}

function contentWordsFromText(text: string): string[] {
  return tokenizeNormalized(normalizeForClicheMatch(text)).filter(
    (token) => token.length >= 4 && !STOPWORDS.has(token)
  );
}

function isHeadingLine(line: string): boolean {
  if (!line) return true;
  if (/^#{2,}\s*[A-Z]\s*#{2,}$/i.test(line)) return true;
  if (/^#{2,}/.test(line)) return true;
  if (/^[A-Z][A-Z\s:]+$/.test(line)) return true;
  return false;
}

function parseCuratedClichePhrases(raw: string): string[] {
  const phrases: string[] = [];
  const seen = new Set<string>();

  for (const rawLine of raw.split(/\r?\n/)) {
    const trimmed = rawLine.trim();
    if (!trimmed || isHeadingLine(trimmed)) continue;

    const normalized = normalizeForClicheMatch(trimmed);
    const tokens = tokenizeNormalized(normalized);

    // Single words are not treated as cliches in isolation.
    if (tokens.length < 2) continue;
    if (seen.has(normalized)) continue;

    seen.add(normalized);
    phrases.push(normalized);
  }

  return phrases;
}

export const CURATED_CLICHE_PHRASES = parseCuratedClichePhrases(RAW_CLICHE_LEXICON);

const CURATED_CLICHE_PHRASE_SET = new Set(CURATED_CLICHE_PHRASES);

const CURATED_CLICHE_ENTRIES: ClichePhraseEntry[] = CURATED_CLICHE_PHRASES
  .map((phrase) => ({ phrase, tokens: tokenizeNormalized(phrase) }))
  .sort((a, b) => {
    if (b.tokens.length !== a.tokens.length) return b.tokens.length - a.tokens.length;
    return b.phrase.length - a.phrase.length;
  });

function exactPhraseWeight(tokenCount: number): number {
  if (tokenCount >= 6) return 0.75;
  if (tokenCount >= 4) return 0.58;
  return 0.4;
}

function loosePhraseWeight(tokenCount: number): number {
  if (tokenCount >= 6) return 0.28;
  if (tokenCount >= 4) return 0.22;
  return 0.16;
}

function orderedTokenMatchCount(window: string[], phraseTokens: string[]): number {
  let phraseIndex = 0;
  let matched = 0;

  for (const token of window) {
    if (phraseIndex < phraseTokens.length && token === phraseTokens[phraseIndex]) {
      matched += 1;
      phraseIndex += 1;
    }
  }

  return matched;
}

function hasLoosePhraseVariant(lineTokens: string[], phraseTokens: string[]): boolean {
  if (phraseTokens.length < 4) return false;
  if (lineTokens.length < phraseTokens.length) return false;

  const minWindow = Math.max(phraseTokens.length - 1, 4);
  const maxWindow = Math.min(lineTokens.length, phraseTokens.length + 2);

  for (let windowSize = minWindow; windowSize <= maxWindow; windowSize += 1) {
    for (let start = 0; start + windowSize <= lineTokens.length; start += 1) {
      const window = lineTokens.slice(start, start + windowSize);
      const matched = orderedTokenMatchCount(window, phraseTokens);
      const coverage = matched / phraseTokens.length;

      if (matched >= 4 && coverage >= 0.8) {
        return true;
      }
    }
  }

  return false;
}

function analyzeLineBase(line: string): LineClicheAnalysis {
  const normalized = normalizeForClicheMatch(line);
  const lineTokens = tokenizeNormalized(normalized);
  const paddedLine = ` ${normalized} `;
  const hits: ClicheHit[] = [];
  const occupiedRanges: Array<{ start: number; end: number }> = [];
  const exactMatchedPhrases = new Set<string>();

  if (!normalized) {
    return { line, normalized, hits, score: 0 };
  }

  for (const entry of CURATED_CLICHE_ENTRIES) {
    const target = ` ${entry.phrase} `;
    const exactIndex = paddedLine.indexOf(target);

    if (exactIndex >= 0) {
      const start = exactIndex;
      const end = exactIndex + target.length;
      const overlapsExisting = occupiedRanges.some(
        (range) => start < range.end && end > range.start
      );

      if (overlapsExisting) continue;

      occupiedRanges.push({ start, end });
      exactMatchedPhrases.add(entry.phrase);
      hits.push({
        type: 'exact_phrase',
        snippet: entry.phrase,
        score: exactPhraseWeight(entry.tokens.length),
      });
    }
  }

  if (hits.length === 0) {
    let looseHitCount = 0;

    for (const entry of CURATED_CLICHE_ENTRIES) {
      if (exactMatchedPhrases.has(entry.phrase)) continue;
      if (!hasLoosePhraseVariant(lineTokens, entry.tokens)) continue;

      hits.push({
        type: 'loose_phrase',
        snippet: entry.phrase,
        score: loosePhraseWeight(entry.tokens.length),
      });
      looseHitCount += 1;

      if (looseHitCount >= 2) break;
    }
  }

  const score = clamp01(hits.reduce((sum, hit) => sum + hit.score, 0));
  return { line, normalized, hits, score };
}

function pushHit(analysis: LineClicheAnalysis, hit: ClicheHit): void {
  analysis.hits.push(hit);
  analysis.score = clamp01(analysis.score + hit.score);
}

function lastMeaningfulWord(text: string): string {
  const tokens = tokenizeNormalized(normalizeForClicheMatch(text));
  if (tokens.length === 0) return '';
  return tokens[tokens.length - 1] || '';
}

function buildRepeatedLineMask(lines: LineClicheAnalysis[], allowExactLineRepeats: boolean): boolean[] {
  if (!allowExactLineRepeats) return lines.map(() => false);

  const seen = new Set<string>();
  return lines.map((analysis) => {
    if (!analysis.normalized) return false;
    if (seen.has(analysis.normalized)) return true;
    seen.add(analysis.normalized);
    return false;
  });
}

export function isCliche(text: string): boolean {
  const normalized = normalizeForClicheMatch(text);
  return normalized.length > 0 && CURATED_CLICHE_PHRASE_SET.has(normalized);
}

export function analyzeLineCliches(line: string): LineClicheAnalysis {
  return analyzeLineBase(line);
}

export function analyzePoemCliches(
  lines: string[],
  options: ClicheAnalysisOptions = {}
): PoemClicheAnalysis {
  const analyses = lines.map(analyzeLineBase);
  const repeatedLineMask = buildRepeatedLineMask(
    analyses,
    options.allowExactLineRepeats !== false
  );
  const exemptWords = new Set([
    ...contentWordsFromText(options.theme || ''),
    ...(options.exemptWords || []).flatMap((word) => contentWordsFromText(word)),
  ]);

  const endWordMap = new Map<string, number[]>();
  const bigramMap = new Map<string, number[]>();
  const imageWordMap = new Map<string, number[]>();

  analyses.forEach((analysis, index) => {
    if (!analysis.normalized || repeatedLineMask[index]) return;

    const endWord = lastMeaningfulWord(analysis.line);
    if (endWord && endWord.length >= 3 && !STOPWORDS.has(endWord)) {
      const existing = endWordMap.get(endWord) || [];
      existing.push(index);
      endWordMap.set(endWord, existing);
    }

    const contentWords = contentWordsFromText(analysis.line).filter(
      (word) => !exemptWords.has(word)
    );

    for (let i = 0; i < contentWords.length - 1; i += 1) {
      const bigram = `${contentWords[i]} ${contentWords[i + 1]}`;
      const existing = bigramMap.get(bigram) || [];
      if (!existing.includes(index)) existing.push(index);
      bigramMap.set(bigram, existing);
    }

    for (const word of contentWords) {
      const existing = imageWordMap.get(word) || [];
      existing.push(index);
      imageWordMap.set(word, existing);
    }
  });

  const repeatedEndWords: string[] = [];
  for (const [word, indexes] of endWordMap.entries()) {
    if (indexes.length <= 1) continue;
    repeatedEndWords.push(word);

    for (const index of indexes.slice(1)) {
      pushHit(analyses[index], {
        type: 'repeated_end_word',
        snippet: word,
        score: 0.18,
      });
    }
  }

  const repeatedBigrams: string[] = [];
  for (const [bigram, indexes] of bigramMap.entries()) {
    if (indexes.length <= 1) continue;
    repeatedBigrams.push(bigram);

    for (const index of indexes.slice(1)) {
      pushHit(analyses[index], {
        type: 'repeated_bigram',
        snippet: bigram,
        score: 0.12,
      });
    }
  }

  const repeatedImageWords: string[] = [];
  for (const [word, indexes] of imageWordMap.entries()) {
    if (indexes.length <= 3) continue;
    if (POETIC_IMAGE_HINTS.has(word) || word.length >= 5) {
      repeatedImageWords.push(word);
      for (const index of indexes.slice(3)) {
        pushHit(analyses[index], {
          type: 'repeated_image_word',
          snippet: word,
          score: 0.08,
        });
      }
    }
  }

  const score = analyses.length > 0
    ? clamp01(analyses.reduce((sum, analysis) => sum + analysis.score, 0) / analyses.length)
    : 0;

  return {
    score,
    lines: analyses,
    repeatedEndWords,
    repeatedBigrams,
    repeatedImageWords,
  };
}

/**
 * Backwards-compatible single-line score helper.
 * If poem context is supplied, return the score for the first occurrence of the line
 * within that context after repetition checks have been applied.
 */
export function clicheScore(
  line: string,
  context?: string[] | ClicheAnalysisOptions
): number {
  if (!context) return analyzeLineCliches(line).score;

  if (Array.isArray(context)) {
    const poemAnalysis = analyzePoemCliches(context);
    const index = context.findIndex((candidate) => candidate === line);
    return index >= 0 ? poemAnalysis.lines[index]?.score ?? 0 : analyzeLineCliches(line).score;
  }

  return analyzeLineCliches(line).score;
}

export function getClichePromptExamples(theme: string, limit = 10): string[] {
  const themeWords = new Set(contentWordsFromText(theme));

  const ranked = CURATED_CLICHE_ENTRIES
    .map((entry) => {
      let score = 0;

      for (const token of entry.tokens) {
        if (themeWords.has(token)) score += 4;
        if (POETIC_IMAGE_HINTS.has(token)) score += 2;
      }

      if (entry.tokens.length >= 3 && entry.tokens.length <= 6) score += 1;

      return { phrase: entry.phrase, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.phrase.localeCompare(b.phrase))
    .map((entry) => entry.phrase);

  const merged = [
    ...DEFAULT_PROMPT_EXAMPLES.filter((phrase) => CURATED_CLICHE_PHRASE_SET.has(phrase)),
    ...ranked,
  ];

  return [...new Set(merged)].slice(0, limit);
}

export function buildClichePromptGuidance(theme: string, maxExamples = 10): string {
  const examples = getClichePromptExamples(theme, maxExamples);
  const exampleText = examples.map((phrase) => `"${phrase}"`).join(', ');

  return [
    'Common words are fully allowed; what must be avoided is ready-made language.',
    'Do not lean on prefab idioms, inherited emotional shorthand, or stale image-pairs.',
    `Unless you are radically transforming them, avoid stock phrasings such as ${exampleText}.`,
    'Prefer exact particulars, motivated metaphor, and imagery that feels discovered inside this poem rather than borrowed from generic verse.',
  ].join(' ');
}

// ── Thematic vocabulary clusters ──────────────────────────────────────────
// Curated non-banal words keyed by broad semantic domains.
// Injected into prompts to steer the LLM toward richer diction.

export const THEMATIC_VOCABULARY: Record<string, string[]> = {
  absurdist: [
    'aberrant', 'absurd', 'anomalous', 'antic', 'antinomy', 'aporia', 'atypical',
    'automatism', 'avant-garde', 'Beckettian', 'bizarre', 'capricious',
    'chaotic', 'circumstance', 'comic', 'comical', 'condition', 'contingency',
    'contradiction', 'crazy', 'crisis', 'dada', 'dadaist', 'deviant', 'dilemma',
    'dispossession', 'dreamlike', 'emergency', 'episode', 'erratic', 'event',
    'eventuality', 'exigency', 'experimental', 'facetious', 'farcical',
    'funny', 'gambit', 'gibberish', 'heterodox', 'humor', 'illogical',
    'incident', 'incongruous', 'insane', 'Ionescoan', 'joke', 'Kafkaesque',
    'Kafkan', 'laughter', 'ludicrous', 'mad', 'maneuver', 'meaningless',
    'mercurial', 'nonsense', 'nonsensical', 'non-sequitur', 'occurrence',
    'odd', 'ouroboros', 'outlandish', 'outré', 'oxymoron', 'paradox',
    'pataphysical', 'pataphysics', 'peculiar', 'pickle', 'pinch',
    'Pinteresque', 'playful', 'plight', 'ploy', 'predicament', 'preposterous',
    'puerile', 'quandary', 'queer', 'random', 'ridiculous', 'ruse',
    'silly', 'situation', 'spot', 'squeeze', 'state', 'status',
    'Stoppardian', 'strange', 'stratagem', 'subterfuge', 'surreal',
    'tactic', 'tautology', 'tight', 'trance', 'unconscious', 'unorthodox',
    'unpredictable', 'weird', 'whimsical', 'wild',
  ],
  animal: [
    'affliction', 'agony', 'anguish', 'animal', 'animals', 'badger', 'bane',
    'bear', 'beast', 'beasts', 'bestial', 'bird', 'birds', 'blaze',
    'bloodletting', 'bloodshed', 'brute', 'butchery', 'butterfly', 'carnage',
    'carnivorous', 'cat', 'claw', 'cock', 'colony', 'conflagration', 'cow',
    'creature', 'crepuscular', 'critter', 'crow', 'curse', 'deer', 'distress',
    'dog', 'dolphin', 'dove', 'eagle', 'fauna', 'feather', 'feral', 'fire',
    'fish', 'flame', 'flock', 'fox', 'fur', 'goat', 'gulls', 'hare', 'hawk',
    'herbivorous', 'herd', 'hibernating', 'holocaust', 'horse', 'inferno',
    'infliction', 'insect', 'invertebrate', 'jackals', 'leopard', 'leopards',
    'lion', 'massacre', 'migratory', 'misery', 'nomadic', 'nuisance',
    'omnivorous', 'ordeal', 'owl', 'pack', 'paw', 'pest', 'pig', 'plague',
    'pod', 'pogrom', 'predatory', 'pride', 'pyre', 'rabbit', 'rack', 'rat',
    'savage', 'scale', 'scourge', 'sheep', 'shoal', 'slaughter', 'snake',
    'spider', 'stag', 'stake', 'suffering', 'swarm', 'tail', 'taxonomy',
    'tiger', 'torment', 'torture', 'trial', 'tribulation', 'undomesticated',
    'untamed', 'varmint', 'vermin', 'vertebrate', 'visitation', 'whale',
    'wheel', 'wild', 'wing', 'wolf', 'zoological', 'zoology',
  ],
  celestial: [
    'aether', 'antimatter', 'aphelion', 'apogee', 'asteroid', 'astral',
    'astrolabe', 'astronomy', 'astrophysical', 'aureole', 'aurora', 'azimuth',
    'beaming', 'blazing', 'burning', 'canopy', 'circumambient', 'colonnade',
    'comet', 'constellation', 'corona', 'coruscating', 'cosmic', 'cosmological',
    'cosmos', 'dark-matter', 'dawn', 'declination', 'dusk', 'eclipse',
    'ecliptic', 'effulgent', 'empyrean', 'equinox', 'ether', 'etheric',
    'eventide', 'exosphere', 'expanse', 'extraterrestrial', 'firmament',
    'flaming', 'flaring', 'flashing', 'fulgent', 'galactic', 'galaxies',
    'galaxy', 'geocentric', 'gleaming', 'glistening', 'glittering', 'globe',
    'heaven', 'heavens', 'heliocentric', 'heliotrope', 'horizon', 'horoscope',
    'incandesce', 'infinite', 'intergalactic', 'interplanetary', 'interstellar',
    'inviolable', 'ionosphere', 'lambent', 'laquearia', 'luminous', 'lunar',
    'lunula', 'mesosphere', 'meteor', 'midnight', 'moon', 'nadir', 'nebula',
    'nebulosity', 'night', 'nubilous', 'obliquity', 'occultation', 'orb',
    'orbit', 'outer', 'parallax', 'perigee', 'perihelion', 'phosphor',
    'planet', 'planetary', 'planets', 'pulsar', 'quasar', 'radiant',
    'refulgent', 'scintilla', 'scintillate', 'scintillating', 'sidereal',
    'singularity', 'sky', 'solar', 'soliform', 'solstice', 'space',
    'sparkling', 'sphere', 'star', 'stars', 'stellar', 'stelliferous',
    'stratosphere', 'sun', 'superluminal', 'sylvan', 'syzygy', 'thermosphere',
    'transit', 'transpicuous', 'troposphere', 'twilight', 'universal',
    'universe', 'vacuum', 'vault', 'vespertine', 'void', 'welkin', 'zenith',
    'zenithal', 'zodiac', 'zodiacal',
  ],
  culinary: [
    'alimentary', 'appetizer', 'bake', 'bank', 'banquet', 'bitter', 'boil',
    'bratwurst', 'bread', 'breakfast', 'cache', 'cheese', 'chicken',
    'comestible', 'comestibles', 'confection', 'confectionery', 'consumables',
    'cooked', 'cuisine', 'currant', 'dainty', 'degustation', 'delicacy',
    'demotic', 'dessert', 'dinner', 'discoveries', 'eat', 'eatables', 'eating',
    'edibles', 'epicure', 'epicurean', 'famished', 'fare', 'feast',
    'filet mignons', 'finds', 'fish', 'flavor', 'flounders', 'food', 'fresh',
    'fruit', 'fry', 'fund', 'gammon', 'gastronomic', 'gastronomical',
    'gastronomy', 'gourmand', 'grill', 'gustation', 'gustatory', 'herb',
    'hoard', 'ingestion', 'lamb', 'lunch', 'mackerel', 'mastication', 'meal',
    'meat', 'morsel', 'mouthful', 'nibble', 'nourishing', 'nourishment',
    'nutritional', 'nutritious', 'olfactory', 'pastry', 'patisserie', 'pool',
    'provision', 'provisions', 'quaff', 'rations', 'raw', 'reanimations',
    'reawakenings', 'rebirths', 'reclamations', 'recoveries', 'recuperations',
    'regenerations', 'renaissances', 'renewals', 'repossessions', 'reserve',
    'restorations', 'resurrections', 'resuscitations', 'retrievals', 'revivals',
    'rich', 'roast', 'salt', 'sauce', 'savory', 'scrod', 'seltzer', 'snack',
    'soup', 'sour', 'spice', 'steak', 'steam', 'stew', 'stock', 'stores',
    'subsistence', 'supplies', 'sustaining', 'sustenance', 'sweet', 'taste',
    'tidbit', 'treasure', 'troves', 'vegetable', 'viands', 'victual',
    'victuals', 'wine',
  ],
  elegiac: [
    'anguish', 'arid', 'ashes', 'attrition', 'bereavement', 'bone', 'cadaver',
    'cenotaph', 'charnel', 'cinerary', 'cistern', 'columbarium',
    'commemorative', 'complaint', 'corpse', 'cry', 'death', 'decay',
    'departed', 'desolate', 'despair', 'dirge', 'distress', 'doleful',
    'dolorous', 'effacement', 'elegy', 'end', 'eulogy', 'exequies', 'fading',
    'farewell', 'final', 'finitude', 'funeral', 'funerary', 'funereal',
    'ghost', 'goodbye', 'grave', 'gravestone', 'grief', 'groan', 'headstone',
    'impermanence', 'interment', 'keen', 'keening', 'lachrymose', 'lament',
    'lamentation', 'last', 'longing', 'loss', 'marker', 'mausoleum',
    'melancholy', 'memento', 'memorial', 'memory', 'miserable', 'missing',
    'moan', 'monument', 'morbid', 'mori', 'mortality', 'mortuary',
    'mournful', 'mourning', 'mutability', 'nostalgia', 'obituary', 'obsequy',
    'ossuary', 'pain', 'pallor', 'passing', 'piteous', 'pitiful', 'plaint',
    'plaintive', 'regret', 'relic', 'reliquary', 'remains', 'remembrance',
    'reminiscent', 'requiem', 'requiescat', 'revenant', 'rubbish', 'rueful',
    'ruin', 'sadness', 'sepulchral', 'sepulchre', 'shadow', 'shrine',
    'shroud', 'sigh', 'skeleton', 'skull', 'sob', 'sorrow', 'sorrowful',
    'spirit', 'sterile', 'suffering', 'sullen', 'tear', 'tearful',
    'threnody', 'threnos', 'tomb', 'tombstone', 'transience', 'vestige',
    'vicissitude', 'wail', 'wake', 'weep', 'weeping', 'woebegone', 'woeful',
    'wretched',
  ],
  erotic: [
    'abandon', 'ache', 'alive', 'ambrosial', 'amorous', 'amour', 'aperture',
    'Aphrodite', 'appetite', 'ardor', 'aromatic', 'arousal', 'awakening',
    'beat', 'blissful', 'bliss', 'blush', 'body', 'breath', 'cadence',
    'caress', 'caresses', 'carnal', 'cavity', 'chamber', 'cipher', 'concave',
    'concupiscent', 'corporeal', 'craving', 'Cupid', 'delight', 'delirious',
    'desire', 'dissolution', 'echo', 'ecstasy', 'embrace', 'enrapturing',
    'enthralling', 'entwined', 'Eros', 'eroticism', 'excitation', 'fever',
    'flesh', 'flutter', 'frenzied', 'frisson', 'glance', 'heady', 'heartbeat',
    'heat', 'hollow', 'hunger', 'impressionable', 'incitement', 'indifference',
    'infatuated', 'interlaced', 'interstice', 'intimacy', 'intimate', 'itch',
    'kiss', 'kissing', 'languor', 'libidinous', 'longing', 'love', 'lust',
    'measure', 'meter', 'musky', 'nectarous', 'oscillate', 'palpable',
    'palpitation', 'pang', 'passion', 'pleasure', 'profusion', 'provocation',
    'pulsating', 'pulsation', 'pungent', 'quaver', 'quiver', 'rapture',
    'reactive', 'receptive', 'resonate', 'responsive', 'reverberate', 'rhythm',
    'rock', 'roll', 'romance', 'romantic', 'seduction', 'sensitive', 'sensual',
    'sensuality', 'sensuous', 'sexy', 'sexualized', 'hyper-sexualized', 'shiver',
    'shudder', 'sibilance', 'skin', 'stimulation', 'stimulus', 'stirring',
    'surrender', 'susceptible', 'sway', 'symmetry', 'synthetic', 'tactile',
    'temptation', 'thirst', 'threshold', 'throb', 'throbbing', 'titillation',
    'touch', 'trembling', 'tremor', 'twinge', 'undercurrent', 'undulate',
    'undulating', 'unguent', 'unreproved', 'vellum', 'Venus', 'vertigo',
    'vibrate', 'voluptuous', 'warmth', 'whisper', 'writhing', 'yearning',
  ],
  grotesque: [
    'aberration', 'abomination', 'abscess', 'actor', 'adept', 'aesthete',
    'aestheticism', 'agent', 'appalling', 'atrocity', 'authority', 'baroque',
    'bizarrerie', 'blemish', 'blood', 'boil', 'boulevardier', 'carbuncle',
    'carbuncular', 'caricature', 'carious', 'chimera', 'cognoscente',
    'connoisseur', 'corruption', 'creepy', 'cubism', 'cubist', 'dada',
    'dadaist', 'dandy', 'dark', 'decadence', 'decadent', 'decay', 'deformed',
    'deformity', 'demented', 'demotic', 'disfigurement', 'disgusting',
    'distorted', 'disturbing', 'doer', 'eerie', 'excreted', 'executant',
    'expert', 'expressionism', 'expressionist', 'fantasia', 'fauvism',
    'fauvist', 'fingernails', 'flaneur', 'fright', 'futurism', 'futurist',
    'gangrenous', 'gargoyle', 'ghoulish', 'gingivectomist', 'gothic',
    'grotesquerie', 'hideous', 'horror', 'macabre', 'maestro', 'malformation',
    'maniacal', 'mannerism', 'mannerist', 'master', 'molting', 'monstrosity',
    'monstrous', 'morbid', 'mutation', 'mutilation', 'necrotic', 'nightmare',
    'noisome', 'operator', 'pageant', 'partaker', 'participant', 'performer',
    'phantasmagoria', 'player', 'practitioner', 'professional', 'pustule',
    'putrefied', 'putrescent', 'repugnant', 'repulsive', 'revolting', 'rococo',
    'rot', 'sag', 'scar', 'seeped', 'shadow', 'sickening', 'specialist',
    'spectacle', 'surrealism', 'surrealist', 'symbolism', 'symbolist', 'terror',
    'torpid', 'twisted', 'ugly', 'uncanny', 'unsettling', 'virtuoso',
    'vorticism', 'Vorticist', 'wound',
  ],
  introspective: [
    'abstractedly', 'abyss', 'acolyte', 'aethereal', 'alone', 'aloof',
    'ambiguities', 'ambivalence', 'anxiety', 'aporia', 'aspirations',
    'autochthonous', 'awareness', 'bare', 'bearing', 'being', 'calm',
    'carrying', 'catharsis', 'chaos', 'clairvoyante', 'cogitated',
    'comprehensive', 'confusion', 'consciousness', 'containing',
    'contemplation', 'craftily', 'cunningly', 'disclosing', 'displaying',
    'dissertations', 'dissonance', 'doubt', 'dream', 'dreams', 'ego',
    'embracing', 'emotion', 'encompassing', 'endogenous', 'epiphany',
    'epistemic', 'ethereal', 'existence', 'existential', 'exhibiting',
    'exposing', 'fantasizing', 'fear', 'feeling', 'feverishly', 'formidable',
    'gnosis', 'hermeneutic', 'holding', 'holistic', 'horoscope', 'icons',
    'identity', 'immanent', 'implacably', 'inborn', 'inbred', 'inclusive',
    'indubitable', 'inertia', 'inexplicable', 'inherent', 'innate', 'inner',
    'integral', 'integrated', 'intractable', 'intrinsic', 'introverted',
    'introspection', 'involuted', 'inward', 'inwardness', 'lacuna', 'laying',
    'liminal', 'lonely', 'manifesting', 'meaning', 'measuredly', 'meditation',
    'memories', 'memory', 'mind', 'mood', 'musing', 'naked', 'narcissistic',
    'native', 'natural', 'noetic', 'nothing', 'obscurely', 'obsessed',
    'organic', 'original', 'palimpsest', 'paranoid', 'peace', 'penumbra',
    'perception', 'periphery', 'phenomenological', 'plain', 'pondering',
    'preconscious', 'primordial', 'primitive', 'pristine', 'psyche',
    'psychological', 'pure', 'quizzically', 'recursion', 'reflection',
    'reflexive', 'repose', 'reverberation', 'reverie', 'rumination',
    'ruminated', 'self', 'selfhood', 'sheer', 'showing', 'silence', 'simple',
    'sloppily', 'solipsistic', 'solitude', 'soul', 'spirit', 'spooky',
    'still', 'stripped', 'stupefying', 'subconscious', 'synthetic',
    'thinking', 'thought', 'translucence', 'unadorned', 'unclothed',
    'uncorrupted', 'uncovering', 'unspoiled', 'untainted', 'unvarnished',
    'unveiling', 'wearing',
  ],
  liminal: [
    'abutting', 'adjoining', 'ambiguous', 'between', 'betwixt', 'blurred',
    'border', 'borderland', 'bordering', 'bounds', 'bridge', 'bridged',
    'brink', 'change', 'chasms', 'coincident', 'coinciding', 'conditional',
    'contiguous', 'contingent', 'coterminous', 'coupling', 'crossing', 'cusp',
    'dawn', 'demarcate', 'dependent', 'disposed', 'dissolve', 'doorway',
    'dusk', 'edge', 'ephemeral', 'evanescent', 'fleeting', 'foggy', 'gap',
    'gate', 'hazy', 'hinge', 'indeterminate', 'intermediate', 'intermediary',
    'intermezzo', 'interposed', 'intersecting', 'interstitial', 'interval',
    'intervening', 'joining', 'leaning', 'liable', 'limbo', 'linking',
    'margin', 'median', 'mediating', 'mesial', 'middle', 'neither', 'nor',
    'nose to nose', 'overlapping', 'pairing', 'passage', 'passing',
    'penumbral', 'permeable', 'portal', 'prone', 'provisional', 'reliant',
    'seam', 'spied', 'subject', 'tending', 'tentative', 'threshold',
    'transition', 'transitional', 'transitory', 'transitive', 'twilight',
    'uncertain', 'unfocused', 'vague', 'verge', 'verging',
  ],
  maritime: [
    'abyss', 'abyssal', 'adrift', 'afloat', 'anchor', 'aqueous', 'argosy',
    'barque', 'bathyscaphe', 'bay', 'beach', 'benthic', 'bilge', 'billowing',
    'boat', 'boatswain', 'brine', 'buoyant', 'calm', 'captain', 'careening',
    'castaway', 'catamaran', 'coast', 'coral', 'course', 'coursing',
    'coxswain', 'current', 'deck', 'deckhand', 'deep', 'derelict', 'dhow',
    'dive', 'diving', 'dock', 'dolphin', 'dredge', 'drenched', 'drift',
    'dripping', 'driving', 'estuary', 'fathoming', 'fish', 'flotsam',
    'fluvial', 'foam', 'foundering', 'galley', 'gulls', 'harbor', 'heaving',
    'helm', 'helmsman', 'horizon', 'hulk', 'hurricane', 'immersed', 'jetsam',
    'journey', 'keeling', 'ketch', 'lagan', 'leeward', 'lighthouse',
    'littoral', 'mariner', 'maritime', 'nautical', 'nautilus', 'neritic',
    'ocean', 'oceanic', 'pelagic', 'phosphorescence', 'pier', 'pitching',
    'plunging', 'port', 'reef', 'riparian', 'rolling', 'running', 'sail',
    'sailor', 'salt', 'scuba', 'sea', 'seafarer', 'seiche', 'ship',
    'shipwreck', 'shipwrecked', 'shoal', 'shore', 'sinking', 'soaked',
    'sodden', 'sopping', 'sound', 'spar', 'spindrift', 'spray', 'storm',
    'streaming', 'submerged', 'submerging', 'submersed', 'surging',
    'swelling', 'tempest', 'thalassa', 'thalassic', 'tidal', 'tideline',
    'undertow', 'voyage', 'water', 'wave', 'whale', 'windward', 'wreck',
    'yawl',
  ],
  metaphysical: [
    'agnostic', 'alchemy', 'animistic', 'apotheosis', 'antithesis',
    'beatification', 'being', 'canonization', 'datta', 'damyata',
    'dayadhvam', 'deification', 'dialectic', 'divine', 'essence',
    'eschatological', 'eternal', 'ethereal', 'gnostic', 'god', 'haecceity',
    'Hegelian', 'hermetic', 'hidden', 'illusion', 'immanent', 'ineffable',
    'infinite', 'ipseity', 'manifested', 'metaphysical', 'miracle',
    'mystery', 'mystical', 'neoplatonic', 'noumenal', 'numinous', 'occult',
    'ontic', 'ontological', 'panentheistic', 'pantheistic', 'phenomenal',
    'platonic', 'point-of-origin', 'polytheistic', 'quiddity', 'reality',
    'redeem', 'revelation', 'sacred', 'scholastic', 'secret', 'shamanistic',
    'shantih', 'soul', 'split-image', 'sublime', 'soteriological', 'synthesis',
    'teleological', 'theodicy', 'theosophical', 'thisness', 'transcendence',
    'transcendent', 'transcendental', 'transformation', 'truth', 'unreal',
    'veil', 'vision',
  ],
  pastoral: [
    'agrarian', 'alluvium', 'arboreal', 'arcadian', 'arbor', 'bedrock',
    'birch', 'blossom', 'bower', 'bracken', 'brake', 'briar', 'bucolic',
    'bush', 'canopy', 'champaign', 'chlorophyll', 'clay', 'combe', 'compost',
    'coppice', 'copse', 'cottar', 'countryside', 'covert', 'crop', 'dale',
    'dell', 'dirt', 'earth', 'eclogue', 'fallow', 'farm', 'farming',
    'fatherland', 'fecund', 'fell', 'fennel', 'fenland', 'fern', 'field',
    'flaxen', 'flower', 'flowers', 'forest', 'furrow', 'gammon', 'garden',
    'georgic', 'glen', 'glade', 'grass', 'grazier', 'grove', 'hedge',
    'hedge lined', 'hedgerow', 'heather', 'hill', 'hollow', 'humus',
    'husbandman', 'idyllic', 'landscape', 'layer', 'leaf', 'leaves',
    'lichen', 'loam', 'loess', 'manure', 'marjoram', 'marl', 'meadow',
    'moor', 'moorland', 'moss', 'mulch', 'nature', 'nurturing', 'oak',
    'orchard', 'pasture', 'peasant', 'petal', 'pine', 'primordial',
    'reedbed', 'riverbank', 'rural', 'rustic', 'scrubland', 'sedge', 'serf',
    'shepherd', 'shrub', 'silt', 'soil', 'spinney', 'strath', 'stratum',
    'stubble', 'subsoil', 'sward', 'swain', 'sylvan', 'terraced',
    'theocritus', 'thicket', 'topsoil', 'tree', 'trees', 'turf', 'tussock',
    'undergrowth', 'vale', 'vein', 'verdant', 'villein', 'vine', 'weald',
    'wetland', 'willow', 'wold', 'woods', 'yarrow', 'yeoman',
  ],
  scientific: [
    'accurate', 'algorithm', 'algorithmic', 'applied', 'archived', 'astronomy',
    'atom', 'biology', 'cable', 'cache', 'canonization', 'carbuncular',
    'chemistry', 'corroborated', 'data', 'deductive', 'demotic', 'demonstrable',
    'documental', 'documentary', 'electron', 'empirical', 'empiricist',
    'energy', 'entered', 'epistemological', 'equation', 'evidential',
    'evidentiary', 'exact', 'experiment', 'experimental', 'falsifiable',
    'filed', 'force', 'formula', 'frequency', 'gravity', 'guarded', 'held',
    'hypothetical', 'inexplicable', 'inductive', 'instrumental',
    'interdisciplinary', 'kept', 'laboratory', 'light', 'logged',
    'luminiferous', 'measurable', 'mesons', 'methodical', 'methodological',
    'molecule', 'neutrinos', 'neutron', 'noted', 'observable', 'observational',
    'paradigmatic', 'particle', 'physics', 'precise', 'provable', 'proton',
    'qualitative', 'quantifiable', 'quantitative', 'quantum', 'radiation',
    'recorded', 'registered', 'replicable', 'reproducible', 'reserved',
    'retained', 'rigorous', 'saved', 'science', 'screened', 'shielded',
    'spared', 'stored', 'supported', 'sustained', 'systematic', 'technical',
    'testable', 'theoretical', 'theory', 'upheld', 'verifiable', 'wave',
  ],
  sonic: [
    'acoustic', 'acoustical', 'atonal', 'auditory', 'auricular', 'aural',
    'bang', 'beat', 'bell', 'buzz', 'call', 'cacophonous', 'chime', 'click',
    'clamor', 'crackle', 'croon', 'crescendo', 'cry', 'decrescendo',
    'detecting', 'din', 'discerning', 'discovering', 'dissonant', 'drum',
    'echo', 'finding', 'fortissimo', 'frequency', 'giggles', 'grunted',
    'harmony', 'harmonious', 'hearing', 'heeding', 'homophonic', 'hum',
    'identifying', 'jug', 'knowing', 'legato', 'locating', 'melody',
    'melodic', 'monophonic', 'murmur', 'music', 'noise', 'noticing', 'noting',
    'note', 'oboists', 'observing', 'Palestrina', 'peal', 'perceiving',
    'pianissimo', 'pipe organ', 'pinpointing', 'polyphonic', 'pop', 'pouted',
    'powwow', 'puttered', 'quiet', 'raving', 'recognizing', 'resonance',
    'resonant', 'reverberant', 'reverberation', 'rhythm', 'ring', 'roar',
    'rock', 'roll', 'rustle', 'sashayed', 'sashaying', 'sforzando', 'shout',
    'sibilance', 'silence', 'singing', 'song', 'sonic', 'sound', 'sputtered',
    'staccato', 'strident', 'tapping', 'tereu', 'thunder', 'tolling', 'tone',
    'tremolo', 'tuneful', 'twit', 'vibration', 'vibrant', 'vibrato',
    'voice', 'whisper', 'yell', 'yodel',
  ],
  technological: [
    'administered', 'aeronautical', 'aerospace', 'apparatus', 'appropriating',
    'appropriative', 'appropriate', 'art', 'automated', 'automatic',
    'automaton', 'autonomous', 'banal', 'basic', 'blockchain', 'bros',
    'cabal', 'crime', 'crashing', 'crash', 'crushed', 'cable', 'circuit',
    'dreamless', 'code', 'computational', 'computer', 'constructed',
    'controlled', 'cybernetic', 'cybernetically', 'cybernetics', 'device',
    'digital', 'directed', 'display', 'electric', 'electric current',
    'electromagnetic', 'electronic', 'energy', 'engine', 'engorged',
    'examined', 'exploitation', 'exploiting', 'explored', 'fabricated',
    'fiberoptic', 'genomic', 'governed', 'gramophone', 'hardware', 'horns',
    'industrial', 'inspected', 'instrument', 'internet', 'investigated',
    'iPhone', 'lost', 'losing', 'killing', 'killer', 'monstrous', 'malicious',
    'miniscule', 'memory', 'mesmerized', 'mesmeric', 'self-same', 'odd',
    'rabbit-hole', 'machinic', 'machine', 'managed', 'addiction', 'hooked',
    'crack', 'crackheads', 'dope', 'weird', 'weirdo', 'stranger',
    'unbelievable', 'absurdity', 'smoking', 'imperial', 'Empire',
    'capitalist', 'capital', 'corporate', 'international', 'transnational',
    'wordlist', 'worlded', 'corpse-like', 'cadavers', 'demands', 'stand-up',
    'meeting', 'pressure', 'stress', 'stressful', 'manic', 'depressed',
    'depression', 'psychotic', 'borderline', 'bipolar', 'chill', 'chilling',
    'cracked-up', 'crack-down', 'cops', 'rebels', 'anarchists', 'anarchy',
    'syndicalist', 'library', 'portal', 'platform', 'prison', 'bondage',
    'servitude', 'ransom', 'paycheck', 'poverty', 'horror', 'damn', 'damned',
    'darkness', 'pollution', 'overwhelming', 'despair', 'desperation',
    'wire-tangle', 'Lane', 'server', 'servile', 'sentry', 'Huggingface',
    'predator', 'predatorial', 'resist', 'occupy', 'create', 'sovereignty',
    'autonomy', 'autonomist', 'flailing', 'drowning', 'mirrors', 'branches',
    'nets', 'webs', 'spiders', 'whales', 'bulls', 'bears', 'rising',
    'stocks', 'stock', 'markets', 'market', 'grifter', 'grifting', 'drifting',
    'browsing', 'producing', 'mixing', 'stems', 'tracks', 'DUI', 'DAW',
    'plugin', 'plugins', 'synths', 'Markovian', 'stochastic', 'programmatic',
    'internalized', 'robotized', 'cyber-real', 'solarpunk', 'k-punk',
    'dystopia', 'FOMA', 'zoomer', 'zoomers', 'millennial', 'boomer',
    'Facebook', 'Instagram', 'Insta', 'Snapchat', 'Google-God', 'cult',
    'scientology-grift', 'persephone', 'Hades', 'Mercury', 'Athena',
    'Owl-eyed', 'shattered', 'airs', 'yearning', 'etcetra', 'fireworks',
    'ruins', 'castles', 'palaces', 'grotto', 'tunnel', 'rifle', 'grenades',
    'AK-47', 'pistol', 'gun', 'dagger', 'knife', 'sword', 'shank',
    'knuckles', 'brillo', 'pipe', 'meth', 'cocaine', 'amphetamines', 'heroin',
    'opiate', 'methadone', 'dolophine', 'LCD', 'Prozac', 'SSRI', 'bipolar',
    'autistic', 'Aspy', 'neurodivergent', 'pansexual', 'asexual', 'bigender',
    'trans', 'transgender', 'genderqueer', 'sapiosexual', 'fuck', 'screw',
    'anal', 'eat-out', 'vagina', 'pussy', 'penis', 'ass', 'ass-crack',
    'asshole', 'dick', 'cock', 'phallus', 'clit', 'clitoris', 'vibrator',
    'dildo', 'magic', 'magick', 'sigil', 'sigilization', 'latent', 'layers',
    'dimensions', 'domains', 'hairy', 'shaven', 'unshaven', 'pubes',
    'breasts', 'perking', 'flab', 'rolls', 'thighs', 'crotch', 'thrust',
    'throb', 'shiver', 'shake', 'orgasm', 'orgasming', 'orgasmic', 'cosmic',
    'shout', 'surf', 'bossanova', 'Pixies', 'show', 'club', 'house-show',
    'punk-house', 'crusty', 'garage', 'noise', 'industrial', 'warehouse',
    'ACAB', 'Revolution', 'RCA', 'Communism', 'Marx', 'Marxist', 'academic',
    'blog', 'research', 'paper', 'insight', 'detournement', 'collage',
    'cut-up', 'hack', 'hacker', 'Anonymous', 'sneak', 'code', 'codes',
    'values', 'honor', 'careful', 'adore', 'lick', 'tongue', 'spit',
    'fluids', 'kinky', 'kink', 'fetish', 'leather', 'sadistic', 'masochistic',
    'bondage', 'control', 'discipline', 'appendix', 'mental', 'planet',
    'walls', 'spell', 'Wicca', 'pagan', 'paeanistic', 'Neuromancer',
    'twisted', 'broken', 'bird', 'BART', 'melts', 'dirty', 'refuse',
    'fuckfuckfuckfuck', 'fuckdamn', 'goddamn', 'shawl', 'cobblestones',
    'particular', 'peculiar', 'unusual', 'sort', 'oddball', 'whacky',
    'morbid', 'necrosis', 'limbs', 'flashing', 'sirens', 'nowhere', 'drowns',
    'spins', 'waters', 'remember', 'smashing', 'smashingly', 'stash',
    'stashes', 'stashing', 'slash', 'gender-queer', 'queerest', 'garbage',
    'trapeze', 'fire', 'fire-dancer', 'aerial', 'Ariel', 'manufactured',
    'mechanical', 'mechanism', 'mechanized', 'memes', 'monitored', 'dreamy',
    'American', 'Soviet', 'Russian', 'Perestroika', 'Glasnost', 'sprawl',
    'swarm', 'swarming', 'swarmed', 'spawned', 'respawn', 'respawned',
    'unalive', 'unaliving', 'unalived', 'smother', 'stab', 'bash', 'stomp',
    'curb', 'murder', 'gang', 'neighbour', 'Oakland', 'LA', 'Berkeley',
    'Dub-C', 'trail', 'creek', 'wilderness', 'wastelands', 'wastoid',
    'drunkard', 'lush', 'wino', 'distill', 'universal', 'universality',
    'post-nationalist', 'focus', 'blessed', 'trash', 'glowing', 'centuries',
    'breathe', 'starve', 'starving', 'ravenous', 'insatiable', 'engorging',
    'translucent', 'transparent', 'oblique', 'dimensioned', 'flat', '2D',
    '3D', 'Dada', 'surreal', 'prisms', 'kaleidoscopic', 'flow', 'freestyle',
    'cradle', 'cling', 'embrace', 'weep', 'wept', 'mope', 'whimper',
    'laugh', 'roar', 'cars', 'car', 'hearse', 'alley', 'shadows', 'shade',
    'sunset', 'hangs', 'generation', 'stillness', 'snowy', 'tangible',
    'forlornly', 'grinning', 'motors', 'nanotechnological', 'network',
    'networked', 'observed', 'electric', 'Apollo', 'labor', 'activist',
    'Antifa', 'masked', 'mask', 'mime', 'Pierrot', 'Harlequin', 'Columbine',
    'comedy', 'riot', 'protest', 'action', 'meet-up', 'hang-out', 'hung',
    'heart', 'infatuated', 'macking', 'lightning', 'response', 'happiness',
    'shoots', 'ether', 'nitrous', 'whip-its', 'cans', 'messiness', 'beer',
    'brew', '40s', 'whiskey', 'flask', 'handle', 'underground', 'guitarist',
    'drummer', 'money', 'sleepless', 'clinic', 'hospital', 'councilor',
    'therapist', 'invader', 'newspaper', 'museum', 'kitten', 'ruby', 'amethyst',
    'agate', 'emerald', 'quartz', 'phantom', 'midnight', 'francisco',
    'dialogues', 'classroom', 'operated', 'overwhelmed', 'plumbed',
    'postindustrial', 'power', 'programmable', 'probed', 'regulated',
    'researched', 'robot', 'satellite', 'screen', 'selfacting', 'semiotics',
    'signal', 'silicone', 'simulacrum', 'skinning', 'sold', 'software',
    'studied', 'suffocating', 'supervised', 'system', 'tech', 'technical',
    'technological', 'technofeudalist', 'tool', 'transistor', 'unearthed',
    'vectoral', 'vectoralist', 'viewed', 'voltage', 'watched', 'wire',
    'wireless',
  ],
  temporal: [
    'afternoon', 'age', 'ages', 'aging', 'album', 'alive', 'almanac',
    'anachronism', 'ancient', 'asynchronous', 'autumn', 'awareness',
    'beginning', 'brewing', 'calendar', 'century', 'Chronos', 'chronicle',
    'chronicity', 'chronological', 'chronology', 'chronometer', 'clock',
    'commencing', 'crepuscule', 'cyclical', 'day', 'decade', 'deferred',
    'delayed', 'demobbed', 'developing', 'diachronic', 'dilatory', 'diurnal',
    'duration', 'durational', 'emerging', 'entropy', 'entropic', 'ephemeral',
    'era', 'eternal', 'eternity', 'evanescent', 'evening', 'evolving', 'fall',
    'fleeting', 'fleetly', 'forever', 'fortnight', 'fortnights', 'frozen',
    'fugitive', 'fugue', 'future', 'gestating', 'gloaming', 'gravity',
    'gravitas', 'growing', 'hiatus', 'horological', 'hour', 'impermanence',
    'immediate', 'imminent', 'impending', 'inertia', 'inexorable',
    'initiating', 'instantaneous', 'interim', 'intermission', 'isochronal',
    'kairos', 'latency', 'linear', 'lull', 'lunar', 'matin', 'maturing',
    'mediate', 'meridian', 'millennium', 'minute', 'moment', 'momentary',
    'month', 'moonth', 'morning', 'night', 'nightfall', 'nocturne',
    'originating', 'past', 'perennial', 'perpetual', 'postponed', 'potential',
    'present', 'procrastinate', 'punctual', 'replenished', 'ripening',
    'sauntered', 'season', 'second', 'semiotic', 'sempiternal', 'sequential',
    'serial', 'simultaneity', 'spiral', 'spring', 'stasis', 'starting',
    'static', 'summer', 'sunrise', 'sunset', 'suspended', 'synchronicity',
    'synchronous', 'tardy', 'temporal', 'tension', 'tempus', 'time', 'timing',
    'timeless', 'today', 'tomorrow', 'transience', 'transient', 'transitory',
    'unfolding', 'vesper', 'vigil', 'virtual', 'week', 'winter', 'yesterday',
  ],
  urban: [
    'access', 'agglomeration', 'alley', 'apartment', 'arcade', 'asphalt',
    'awning', 'basilica', 'block', 'boulevard', 'boudoir', 'borough',
    'brownstone', 'building', 'bus', 'cab', 'camisoles', 'chimney',
    'cobblestone', 'commissioners', 'concrete', 'conurbation', 'cornice',
    'court', 'crescent', 'crowd', 'curb', 'demotic', 'district', 'divan',
    'downtown', 'dugs', 'duplex', 'easement', 'edifice', 'egress',
    'factory', 'facade', 'favela', 'flyover', 'garret', 'ghetto', 'girder',
    'glow', 'gramophone', 'graffiti', 'grid', 'gutter', 'harbor', 'heights',
    'hood', 'housing', 'ingress', 'itinerant', 'lamp', 'landscape', 'layout',
    'light', 'loop', 'mall', 'mantel', 'market', 'megalopolis', 'metropolis',
    'municipality', 'neighborhood', 'neon', 'noise', 'office', 'ordinance',
    'outlook', 'overpass', 'pantry', 'parapet', 'peripatetic', 'pavement',
    'place', 'plaza', 'precinct', 'profile', 'prospect', 'quarter',
    'regulation', 'restriction', 'road', 'scene', 'scenery', 'scaffold',
    'sector', 'shop', 'shanty', 'sidewalk', 'silhouette', 'sirens', 'skyline',
    'skyscraper', 'slum', 'solicitors', 'square', 'stenographers', 'store',
    'street', 'streetscape', 'subway', 'taxi', 'tenement', 'terrace',
    'thoroughfare', 'tower', 'town', 'townscape', 'traffic', 'train',
    'trestle', 'underpass', 'uptown', 'urbane', 'vagrant', 'vista', 'view',
    'viaduct', 'ward', 'way', 'zone', 'zoning',
  ],
  violent: [
    'aggressive', 'anger', 'antagonistic', 'assaultive', 'attack', 'battle',
    'belittle', 'bellicose', 'belligerent', 'break', 'brutal', 'charging',
    'checking', 'coercive', 'combative', 'compelling', 'compulsive',
    'compulsory', 'conclusive', 'conflict', 'constraining', 'crash',
    'critical', 'crucial', 'decisive', 'destroy', 'determinative', 'driving',
    'encumbering', 'enrage', 'essential', 'explode', 'ferocious', 'fierce',
    'fight', 'final', 'finishing', 'forceful', 'forcible', 'fury', 'hassled',
    'hate', 'hindering', 'hit', 'holocaust', 'hostile', 'hurt', 'impeding',
    'implacable', 'inflame', 'indispensable', 'injure', 'intractable',
    'invader', 'kill', 'last', 'loading', 'mandatory', 'martial', 'merciless',
    'murder', 'necessary', 'needful', 'obdurate', 'obligatory', 'obstructing',
    'pain', 'pivotal', 'pitiless', 'pressing', 'predatory', 'propelling',
    'provable', 'punch', 'pugnacious', 'rage', 'rapacious', 'rassled',
    'required', 'requisite', 'revile', 'rudely', 'ruthless', 'savage',
    'shatter', 'slap', 'smash', 'slaughter', 'snarl', 'sneer', 'stemming',
    'stopping', 'storm', 'struggle', 'strike', 'terminal', 'truculent',
    'ultimate', 'unrelenting', 'urging', 'vicious', 'violence', 'violent',
    'war', 'warlike', 'weighting', 'wound', 'wrath',
  ],
};

/**
 * Returns a curated vocabulary cluster for a given theme.
 * Falls back to a concatenation of introspective, sonic, metaphysical, liminal, and temporal.
 * Also checks for partial matches (e.g., "autumn" → pastoral).
 */
export function getThematicVocabulary(theme: string): string[] {
  const lower = theme.toLowerCase();
  
  // Direct match
  if (lower in THEMATIC_VOCABULARY) return THEMATIC_VOCABULARY[lower];
  
  // Comprehensive keyword mapping covering all categories
  const mapping: Record<string, string> = {
    // Celestial
    star: 'celestial', stars: 'celestial', sun: 'celestial', moon: 'celestial',
    planet: 'celestial', planets: 'celestial', galaxy: 'celestial',
    galaxies: 'celestial', universe: 'celestial', cosmos: 'celestial',
    cosmic: 'celestial', space: 'celestial', outer: 'celestial', sky: 'celestial',
    heavens: 'celestial', heaven: 'celestial', constellation: 'celestial',
    orbit: 'celestial', eclipse: 'celestial', astronomy: 'celestial',
    astral: 'celestial', stellar: 'celestial', interstellar: 'celestial',
    nebula: 'celestial', comet: 'celestial', asteroid: 'celestial',
    meteor: 'celestial', aurora: 'celestial', dawn: 'celestial', dusk: 'celestial',
    twilight: 'celestial', night: 'celestial', midnight: 'celestial',
    
    // Temporal
    time: 'temporal', clock: 'temporal', hour: 'temporal', minute: 'temporal',
    second: 'temporal', moment: 'temporal', duration: 'temporal', age: 'temporal',
    ages: 'temporal', era: 'temporal', epoch: 'temporal', season: 'temporal',
    winter: 'temporal', spring: 'temporal', summer: 'temporal', autumn: 'temporal',
    fall: 'temporal', year: 'temporal', month: 'temporal', week: 'temporal',
    day: 'temporal', nightfall: 'temporal', sunrise: 'temporal', sunset: 'temporal',
    morning: 'temporal', afternoon: 'temporal', evening: 'temporal',
    calendar: 'temporal', millennium: 'temporal', century: 'temporal',
    decade: 'temporal', eternity: 'temporal', forever: 'temporal', past: 'temporal',
    present: 'temporal', future: 'temporal', yesterday: 'temporal',
    tomorrow: 'temporal', today: 'temporal', aging: 'temporal', old: 'temporal',
    ancient: 'temporal', timeless: 'temporal',
    
    // Pastoral
    nature: 'pastoral', landscape: 'pastoral', field: 'pastoral', meadow: 'pastoral',
    forest: 'pastoral', woods: 'pastoral', tree: 'pastoral', trees: 'pastoral',
    flower: 'pastoral', flowers: 'pastoral', grass: 'pastoral', leaf: 'pastoral',
    leaves: 'pastoral', garden: 'pastoral', farming: 'pastoral', farm: 'pastoral',
    rural: 'pastoral', countryside: 'pastoral', harvest: 'pastoral',
    orchard: 'pastoral', grove: 'pastoral', hill: 'pastoral', valley: 'pastoral',
    stream: 'pastoral', riverbank: 'pastoral', pasture: 'pastoral', crop: 'pastoral',
    soil: 'pastoral', earth: 'pastoral', dirt: 'pastoral', blossom: 'pastoral',
    petal: 'pastoral', vine: 'pastoral', hedge: 'pastoral', bush: 'pastoral',
    shrub: 'pastoral', fern: 'pastoral', moss: 'pastoral', willow: 'pastoral',
    oak: 'pastoral', pine: 'pastoral', birch: 'pastoral',
    
    // Maritime
    ocean: 'maritime', sea: 'maritime', water: 'maritime', wave: 'maritime',
    tide: 'maritime', current: 'maritime', beach: 'maritime', shore: 'maritime',
    coast: 'maritime', bay: 'maritime', harbor: 'maritime', port: 'maritime',
    ship: 'maritime', boat: 'maritime', sail: 'maritime', sailor: 'maritime',
    captain: 'maritime', voyage: 'maritime', journey: 'maritime', deep: 'maritime',
    abyss: 'maritime', reef: 'maritime', coral: 'maritime', fish: 'maritime',
    whale: 'maritime', dolphin: 'maritime', storm: 'maritime', hurricane: 'maritime',
    tempest: 'maritime', calm: 'maritime', horizon: 'maritime', salt: 'maritime',
    brine: 'maritime', spray: 'maritime', foam: 'maritime', drift: 'maritime',
    anchor: 'maritime', helm: 'maritime', deck: 'maritime', pier: 'maritime',
    dock: 'maritime', lighthouse: 'maritime',
    
    // Elegiac
    death: 'elegiac', grief: 'elegiac', loss: 'elegiac', sorrow: 'elegiac',
    mourning: 'elegiac', funeral: 'elegiac', grave: 'elegiac', tomb: 'elegiac',
    memory: 'elegiac', remembrance: 'elegiac', farewell: 'elegiac',
    goodbye: 'elegiac', lament: 'elegiac', melancholy: 'elegiac', sadness: 'elegiac',
    despair: 'elegiac', anguish: 'elegiac', pain: 'elegiac', suffering: 'elegiac',
    regret: 'elegiac', nostalgia: 'elegiac', longing: 'elegiac', missing: 'elegiac',
    departed: 'elegiac', ghost: 'elegiac', spirit: 'elegiac', shadow: 'elegiac',
    ruin: 'elegiac', decay: 'elegiac', fading: 'elegiac', passing: 'elegiac',
    end: 'elegiac', final: 'elegiac', last: 'elegiac', ashes: 'elegiac',
    
    // Erotic
    love: 'erotic', desire: 'erotic', passion: 'erotic', lust: 'erotic',
    longing: 'erotic', romance: 'erotic', romantic: 'erotic', kiss: 'erotic',
    kissing: 'erotic', touch: 'erotic', embrace: 'erotic', caress: 'erotic',
    intimacy: 'erotic', intimate: 'erotic', sensual: 'erotic', sensuous: 'erotic',
    flesh: 'erotic', body: 'erotic', skin: 'erotic', warmth: 'erotic',
    heat: 'erotic', fever: 'erotic', hunger: 'erotic', thirst: 'erotic',
    craving: 'erotic', yearning: 'erotic', ecstasy: 'erotic', rapture: 'erotic',
    pleasure: 'erotic', delight: 'erotic', temptation: 'erotic', seduction: 'erotic',
    surrender: 'erotic', abandon: 'erotic', whisper: 'erotic', breath: 'erotic',
    heartbeat: 'erotic', trembling: 'erotic', blush: 'erotic', glance: 'erotic',
    
    // Urban
    city: 'urban', town: 'urban', street: 'urban', road: 'urban', avenue: 'urban',
    boulevard: 'urban', alley: 'urban', building: 'urban', skyscraper: 'urban',
    tower: 'urban', apartment: 'urban', tenement: 'urban', housing: 'urban',
    concrete: 'urban', asphalt: 'urban', pavement: 'urban', sidewalk: 'urban',
    curb: 'urban', gutter: 'urban', traffic: 'urban', crowd: 'urban',
    subway: 'urban', train: 'urban', bus: 'urban', taxi: 'urban', cab: 'urban',
    neon: 'urban', light: 'urban', lamp: 'urban', glow: 'urban', smog: 'urban',
    noise: 'urban', sirens: 'urban', downtown: 'urban', uptown: 'urban',
    district: 'urban', neighborhood: 'urban', block: 'urban', plaza: 'urban',
    square: 'urban', market: 'urban', mall: 'urban', store: 'urban', shop: 'urban',
    office: 'urban', factory: 'urban',
    
    // Introspective
    mind: 'introspective', thought: 'introspective', thinking: 'introspective',
    reflection: 'introspective', dream: 'introspective', dreams: 'introspective',
    memory: 'introspective', memories: 'introspective', self: 'introspective',
    soul: 'introspective', spirit: 'introspective', consciousness: 'introspective',
    awareness: 'introspective', perception: 'introspective', feeling: 'introspective',
    emotion: 'introspective', mood: 'introspective', inner: 'introspective',
    inward: 'introspective', alone: 'introspective', solitude: 'introspective',
    lonely: 'introspective', identity: 'introspective', meaning: 'introspective',
    purpose: 'introspective', existence: 'introspective', being: 'introspective',
    nothing: 'introspective', abyss: 'introspective', silence: 'introspective',
    quiet: 'introspective', still: 'introspective', calm: 'introspective',
    peace: 'introspective', chaos: 'introspective', confusion: 'introspective',
    doubt: 'introspective', fear: 'introspective', anxiety: 'introspective',
    
    // Absurdist
    nonsense: 'absurdist', absurd: 'absurdist', weird: 'absurdist',
    strange: 'absurdist', bizarre: 'absurdist', odd: 'absurdist',
    peculiar: 'absurdist', surreal: 'absurdist', funny: 'absurdist',
    silly: 'absurdist', ridiculous: 'absurdist', crazy: 'absurdist',
    insane: 'absurdist', mad: 'absurdist', wild: 'absurdist', chaotic: 'absurdist',
    random: 'absurdist', meaningless: 'absurdist', illogical: 'absurdist',
    paradox: 'absurdist', contradiction: 'absurdist', dreamlike: 'absurdist',
    whimsical: 'absurdist', playful: 'absurdist', comic: 'absurdist',
    humor: 'absurdist', laughter: 'absurdist', joke: 'absurdist',
    
    // Grotesque
    grotesque: 'grotesque', ugly: 'grotesque', hideous: 'grotesque',
    monstrous: 'grotesque', deformed: 'grotesque', twisted: 'grotesque',
    distorted: 'grotesque', creepy: 'grotesque', eerie: 'grotesque',
    uncanny: 'grotesque', disturbing: 'grotesque', unsettling: 'grotesque',
    disgusting: 'grotesque', repulsive: 'grotesque', sickening: 'grotesque',
    macabre: 'grotesque', morbid: 'grotesque', gothic: 'grotesque', dark: 'grotesque',
    shadow: 'grotesque', nightmare: 'grotesque', horror: 'grotesque', terror: 'grotesque',
    fright: 'grotesque', decay: 'grotesque', rot: 'grotesque', corruption: 'grotesque',
    wound: 'grotesque', scar: 'grotesque', blood: 'grotesque',
    
    // Sonic
    sound: 'sonic', music: 'sonic', song: 'sonic', singing: 'sonic',
    voice: 'sonic', whisper: 'sonic', murmur: 'sonic', echo: 'sonic',
    resonance: 'sonic', vibration: 'sonic', tone: 'sonic', note: 'sonic',
    melody: 'sonic', harmony: 'sonic', rhythm: 'sonic', beat: 'sonic',
    drum: 'sonic', bell: 'sonic', chime: 'sonic', ring: 'sonic', cry: 'sonic',
    shout: 'sonic', scream: 'sonic', yell: 'sonic', call: 'sonic',
    silence: 'sonic', quiet: 'sonic', noise: 'sonic', clamor: 'sonic',
    din: 'sonic', roar: 'sonic', thunder: 'sonic', crash: 'sonic',
    bang: 'sonic', pop: 'sonic', click: 'sonic', tap: 'sonic', rustle: 'sonic',
    crackle: 'sonic', hum: 'sonic', buzz: 'sonic',
    
    // Culinary
    food: 'culinary', eat: 'culinary', eating: 'culinary', meal: 'culinary',
    dinner: 'culinary', lunch: 'culinary', breakfast: 'culinary', feast: 'culinary',
    banquet: 'culinary', taste: 'culinary', flavor: 'culinary', spice: 'culinary',
    herb: 'culinary', salt: 'culinary', sweet: 'culinary', sour: 'culinary',
    bitter: 'culinary', savory: 'culinary', rich: 'culinary', fresh: 'culinary',
    raw: 'culinary', cooked: 'culinary', bake: 'culinary', roast: 'culinary',
    fry: 'culinary', boil: 'culinary', steam: 'culinary', grill: 'culinary',
    meat: 'culinary', steak: 'culinary', lamb: 'culinary', chicken: 'culinary',
    fish: 'culinary', vegetable: 'culinary', fruit: 'culinary', bread: 'culinary',
    wine: 'culinary', cheese: 'culinary', soup: 'culinary', stew: 'culinary',
    sauce: 'culinary',
    
    // Animal
    animal: 'animal', animals: 'animal', creature: 'animal', beasts: 'animal',
    beast: 'animal', bird: 'animal', birds: 'animal', crow: 'animal',
    eagle: 'animal', hawk: 'animal', dove: 'animal', owl: 'animal', wolf: 'animal',
    fox: 'animal', dog: 'animal', cat: 'animal', horse: 'animal', cow: 'animal',
    pig: 'animal', sheep: 'animal', goat: 'animal', rabbit: 'animal',
    hare: 'animal', deer: 'animal', bear: 'animal', lion: 'animal',
    tiger: 'animal', leopard: 'animal', fish: 'animal', whale: 'animal',
    dolphin: 'animal', snake: 'animal', spider: 'animal', insect: 'animal',
    butterfly: 'animal', wing: 'animal', claw: 'animal', feather: 'animal',
    fur: 'animal', scale: 'animal', tail: 'animal', paw: 'animal',
    
    // Scientific
    science: 'scientific', physics: 'scientific', chemistry: 'scientific',
    biology: 'scientific', electron: 'scientific', neutron: 'scientific',
    proton: 'scientific', atom: 'scientific', molecule: 'scientific',
    particle: 'scientific', quantum: 'scientific', energy: 'scientific',
    force: 'scientific', gravity: 'scientific', light: 'scientific',
    radiation: 'scientific', wave: 'scientific', frequency: 'scientific',
    data: 'scientific', algorithm: 'scientific', experiment: 'scientific',
    theory: 'scientific', equation: 'scientific', formula: 'scientific',
    laboratory: 'scientific',
    
    // Metaphysical
    metaphysical: 'metaphysical', spirit: 'metaphysical', soul: 'metaphysical',
    essence: 'metaphysical', being: 'metaphysical', existence: 'metaphysical',
    reality: 'metaphysical', truth: 'metaphysical', illusion: 'metaphysical',
    veil: 'metaphysical', transcendence: 'metaphysical', eternal: 'metaphysical',
    infinite: 'metaphysical', divine: 'metaphysical', god: 'metaphysical',
    sacred: 'metaphysical', mystery: 'metaphysical', occult: 'metaphysical',
    hidden: 'metaphysical', secret: 'metaphysical', transformation: 'metaphysical',
    alchemy: 'metaphysical', miracle: 'metaphysical', vision: 'metaphysical',
    revelation: 'metaphysical',
    
    // Violent
    violence: 'violent', violent: 'violent', anger: 'violent', rage: 'violent',
    fury: 'violent', wrath: 'violent', hate: 'violent', fight: 'violent',
    battle: 'violent', war: 'violent', conflict: 'violent', struggle: 'violent',
    attack: 'violent', strike: 'violent', hit: 'violent', punch: 'violent',
    slap: 'violent', wound: 'violent', injure: 'violent', hurt: 'violent',
    pain: 'violent', kill: 'violent', murder: 'violent', slaughter: 'violent',
    assassinate: 'violent', destroy: 'violent', ruin: 'violent', break: 'violent',
    crash: 'violent', smash: 'violent', shatter: 'violent', explode: 'violent',
    storm: 'violent',
    
    // Liminal
    threshold: 'liminal', doorway: 'liminal', gate: 'liminal', border: 'liminal',
    boundary: 'liminal', edge: 'liminal', margin: 'liminal', verge: 'liminal',
    brink: 'liminal', cusp: 'liminal', twilight: 'liminal', dawn: 'liminal',
    dusk: 'liminal', limbo: 'liminal', between: 'liminal', neither: 'liminal',
    nor: 'liminal', transition: 'liminal', crossing: 'liminal', passage: 'liminal',
    portal: 'liminal', bridge: 'liminal', gap: 'liminal', interval: 'liminal',
    interstice: 'liminal', seam: 'liminal', hinge: 'liminal', turning: 'liminal',
    change: 'liminal',
    
    // Technological
    technology: 'technological', tech: 'technological', machine: 'technological',
    engine: 'technological', robot: 'technological', computer: 'technological',
    digital: 'technological', electric: 'technological', electronic: 'technological',
    circuit: 'technological', wire: 'technological', cable: 'technological',
    current: 'technological', voltage: 'technological', power: 'technological',
    energy: 'technological', device: 'technological', tool: 'technological',
    instrument: 'technological', apparatus: 'technological', mechanism: 'technological',
    system: 'technological', network: 'technological', internet: 'technological',
    code: 'technological', software: 'technological', hardware: 'technological',
    screen: 'technological', display: 'technological', signal: 'technological',
  };
  
  for (const [keyword, domain] of Object.entries(mapping)) {
    if (lower.includes(keyword)) {
      if (domain in THEMATIC_VOCABULARY) {
        return THEMATIC_VOCABULARY[domain];
      }
    }
  }
  
  // Fallback: concatenation of introspective, sonic, metaphysical, liminal, and temporal
  return [
    ...THEMATIC_VOCABULARY['introspective'],
    ...THEMATIC_VOCABULARY['sonic'],
    ...THEMATIC_VOCABULARY['metaphysical'],
    ...THEMATIC_VOCABULARY['liminal'],
    ...THEMATIC_VOCABULARY['temporal'],
  ];
}
