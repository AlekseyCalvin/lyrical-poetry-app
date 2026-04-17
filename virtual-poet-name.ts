export type RNG = () => number;

export interface VirtualPoetNameResult {
  name: string;
  selected: string[];
  first: string;
  last: string;
  seed: number;
  corpusSize: number;
  uniqueCorpusSize: number;
}

export interface VirtualPoetNameOptions {
  count?: number;              // default 13, used only for inspiration sampling
  order?: number;              // preferred Markov order for segment generation
  seed?: number;               // seeded randomness for reproducibility
  minLen?: number;             // backward-compatible minimum letters per segment
  maxLen?: number;             // backward-compatible maximum letters per segment
  minFirstLen?: number;
  maxFirstLen?: number;
  minLastLen?: number;
  maxLastLen?: number;
  tries?: number;              // attempts per segment / full name combination
  avoidCloseMatches?: boolean;
}

export interface PoetSamplesEntry {
  author?: string;
  [key: string]: unknown;
}

export interface PoetSamplesLoadOptions {
  dedupe?: boolean;
}

const START = "^";
const END = "$";
const STATE_SEP = "\u0001";
export const DEFAULT_POET_SAMPLES_URL = new URL("./Poets_Lyricists_Samples.json", import.meta.url);

const SURNAME_PARTICLES = new Set([
  "da",
  "de",
  "del",
  "della",
  "der",
  "di",
  "du",
  "la",
  "le",
  "st",
  "saint",
  "van",
  "von"
]);

type Chain = Map<string, Map<string, number>>;

function mulberry32(seed: number): RNG {
  let state = seed >>> 0;

  return function () {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function deriveSeed(seed: number, salt: number): number {
  return (seed ^ salt) >>> 0;
}

async function readLocalTextFile(pathOrUrl: string | URL): Promise<string> {
  const dynamicImport = Function("specifier", "return import(specifier)") as (
    specifier: string
  ) => Promise<{ readFile: (path: string | URL, encoding: BufferEncoding) => Promise<string> }>;

  const fs = await dynamicImport("node:fs/promises");
  return fs.readFile(pathOrUrl, "utf8");
}

function normalizeQuotes(input: string): string {
  return input
    .replace(/[‘’‛`]/g, "'")
    .replace(/[“”]/g, '"');
}

function normalizeDisplay(input: string): string {
  return normalizeQuotes(input.normalize("NFC"))
    .replace(/\s+/g, " ")
    .trim();
}

function stripDiacritics(input: string): string {
  return input.normalize("NFKD").replace(/\p{M}/gu, "");
}

function splitParentheticalCandidates(name: string): string[] {
  const clean = normalizeDisplay(name);
  const outside = clean.replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
  const inside = [...clean.matchAll(/\(([^)]+)\)/g)].map(match => match[1].trim());
  return [outside, ...inside].filter(Boolean);
}

function tokenizeHumanName(name: string): string[] {
  const clean = normalizeDisplay(name)
    .replace(/[^\p{L}\p{M}\s.'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  return clean
    .split(/\s+/)
    .map(token => token.replace(/^[^.\p{L}\p{M}']+|[^.\p{L}\p{M}'-]+$/gu, ""))
    .filter(Boolean);
}

function isInitialToken(token: string): boolean {
  const bare = token.replace(/[.'-]/g, "");
  return bare.length <= 1;
}

function scoreCandidateName(name: string): number {
  const tokens = tokenizeHumanName(name);
  const expanded = tokens.filter(token => !isInitialToken(token));
  const letterCount = expanded.join("").length;
  const tokenPenalty = Math.abs(tokens.length - 2) * 3;
  const initialPenalty = (tokens.length - expanded.length) * 4;
  return letterCount + expanded.length * 10 - tokenPenalty - initialPenalty;
}

function chooseCanonicalBaseName(name: string): string {
  const candidates = splitParentheticalCandidates(name);
  if (!candidates.length) return normalizeDisplay(name);

  const outside = candidates[0];
  const outsideTokens = tokenizeHumanName(outside);
  const outsideExpanded = outsideTokens.filter(token => !isInitialToken(token));

  if (outsideExpanded.length >= 2) return outside;

  return candidates
    .slice()
    .sort((a, b) => scoreCandidateName(b) - scoreCandidateName(a))[0];
}

function canonicalizeName(name: string): string {
  const base = chooseCanonicalBaseName(name);
  return tokenizeHumanName(base)
    .map(token => stripDiacritics(token).replace(/[.'-]/g, "").toLowerCase())
    .filter(Boolean)
    .join(" ");
}

export function dedupePoetNames(corpus: string[]): string[] {
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const rawName of corpus) {
    const display = normalizeDisplay(rawName);
    if (!display) continue;

    const key = canonicalizeName(display) || stripDiacritics(display).toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    unique.push(display);
  }

  return unique;
}

export function extractPoetNamesFromSamplesData(
  data: PoetSamplesEntry[],
  options: PoetSamplesLoadOptions = {}
): string[] {
  const { dedupe = true } = options;

  const names = data
    .map(entry => entry.author)
    .filter((author): author is string => typeof author === "string")
    .map(author => normalizeDisplay(author))
    .filter(Boolean);

  return dedupe ? dedupePoetNames(names) : names;
}

export async function loadPoetNamesFromSamplesFile(
  pathOrUrl: string | URL = DEFAULT_POET_SAMPLES_URL,
  options: PoetSamplesLoadOptions = {}
): Promise<string[]> {
  const raw = await readLocalTextFile(pathOrUrl);
  const parsed = JSON.parse(raw) as unknown;

  if (!Array.isArray(parsed)) {
    throw new Error("Poet samples file must contain a JSON array.");
  }

  return extractPoetNamesFromSamplesData(parsed as PoetSamplesEntry[], options);
}

function shuffle<T>(arr: T[], rng: RNG): T[] {
  const out = arr.slice();

  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }

  return out;
}

export function selectVirtualPoetInspirations(
  corpus: string[],
  count = 13,
  seed = Date.now()
): string[] {
  const unique = dedupePoetNames(corpus);
  const rng = mulberry32(deriveSeed(seed, 0x9e3779b9));

  if (count >= unique.length) return shuffle(unique, rng);
  return shuffle(unique, rng).slice(0, count);
}

export async function selectVirtualPoetInspirationsFromSamplesFile(
  count = 13,
  seed = Date.now(),
  pathOrUrl: string | URL = DEFAULT_POET_SAMPLES_URL
): Promise<string[]> {
  const corpus = await loadPoetNamesFromSamplesFile(pathOrUrl, { dedupe: true });
  return selectVirtualPoetInspirations(corpus, count, seed);
}

function selectFirstCandidate(tokens: string[]): string | null {
  for (let i = 0; i < tokens.length - 1; i++) {
    if (!isInitialToken(tokens[i])) return tokens[i];
  }

  return null;
}

function selectLastCandidate(tokens: string[]): string | null {
  if (tokens.length < 2) return null;

  const last = tokens[tokens.length - 1];
  const prev = tokens[tokens.length - 2];
  const prevKey = prev.replace(/\./g, "").toLowerCase();

  if (SURNAME_PARTICLES.has(prevKey)) {
    return `${prev} ${last}`;
  }

  return last;
}

function buildGenerationPools(corpus: string[]): { firsts: string[]; lasts: string[] } {
  const firstSeen = new Set<string>();
  const lastSeen = new Set<string>();
  const firsts: string[] = [];
  const lasts: string[] = [];

  for (const rawName of corpus) {
    const base = chooseCanonicalBaseName(rawName);
    const tokens = tokenizeHumanName(base);
    if (tokens.length < 2) continue;

    const first = selectFirstCandidate(tokens);
    const last = selectLastCandidate(tokens);

    if (first) {
      const key = stripDiacritics(first).replace(/[.'-]/g, "").toLowerCase();
      if (key && !firstSeen.has(key)) {
        firstSeen.add(key);
        firsts.push(first);
      }
    }

    if (last) {
      const key = stripDiacritics(last).replace(/[.'-\s]/g, "").toLowerCase();
      if (key && !lastSeen.has(key)) {
        lastSeen.add(key);
        lasts.push(last);
      }
    }
  }

  return { firsts, lasts };
}

function sanitizeSegmentForGeneration(segment: string): string {
  return normalizeDisplay(segment)
    .replace(/[^\p{L}\p{M}\s'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function tokenizeForCharMarkov(segment: string, order: number): string[] {
  const clean = sanitizeSegmentForGeneration(segment);
  if (!clean) return [];
  return [...Array(order).fill(START), ...Array.from(clean), END];
}

function buildChain(segments: string[], order: number): Chain {
  const chain: Chain = new Map();

  for (const segment of segments) {
    const tokens = tokenizeForCharMarkov(segment, order);
    if (!tokens.length) continue;

    for (let i = 0; i < tokens.length - order; i++) {
      const state = tokens.slice(i, i + order).join(STATE_SEP);
      const next = tokens[i + order];
      if (!chain.has(state)) chain.set(state, new Map());

      const bucket = chain.get(state)!;
      bucket.set(next, (bucket.get(next) ?? 0) + 1);
    }
  }

  return chain;
}

function weightedChoice<T>(bucket: Map<T, number>, rng: RNG): T {
  let total = 0;
  for (const weight of bucket.values()) total += weight;

  let cursor = rng() * total;
  for (const [item, weight] of bucket) {
    cursor -= weight;
    if (cursor <= 0) return item;
  }

  return [...bucket.keys()][0];
}

function countLetters(input: string): number {
  return Array.from(input.replace(/[^\p{L}\p{M}]/gu, "")).length;
}

function tidyGeneratedSegment(segment: string): string {
  return segment
    .replace(/\s+/g, " ")
    .replace(/(^[-'\s]+)|([-\s']+$)/g, "")
    .trim();
}

function formatGeneratedSegment(segment: string): string {
  let result = "";
  let uppercaseNext = true;

  for (const char of segment.toLowerCase()) {
    if (/\p{L}/u.test(char)) {
      result += uppercaseNext ? char.toLocaleUpperCase() : char;
      uppercaseNext = false;
      continue;
    }

    result += char;
    uppercaseNext = char === " " || char === "-" || char === "'";
  }

  return result;
}

function generateSegmentFromChain(
  chain: Chain,
  order: number,
  rng: RNG,
  minLetters: number,
  maxLetters: number
): string {
  let state = Array(order).fill(START).join(STATE_SEP);
  let out = "";

  for (let i = 0; i < maxLetters + 6; i++) {
    const transitions = chain.get(state);
    if (!transitions) break;

    const next = weightedChoice(transitions, rng);
    if (next === END) {
      if (countLetters(out) >= minLetters) break;
      continue;
    }

    out += next;
    state = (state + STATE_SEP + next).split(STATE_SEP).slice(-order).join(STATE_SEP);
  }

  const tidy = tidyGeneratedSegment(out);
  const letters = countLetters(tidy);
  if (!tidy || letters < minLetters || letters > maxLetters) return "";

  return formatGeneratedSegment(tidy);
}

function charSetSimilarity(a: string, b: string): number {
  const A = new Set(a.toLowerCase());
  const B = new Set(b.toLowerCase());
  let shared = 0;

  for (const char of A) {
    if (B.has(char)) shared++;
  }

  return shared / Math.max(A.size, B.size, 1);
}

function tooSimilar(candidate: string, corpus: string[]): boolean {
  const cleanCandidate = canonicalizeName(candidate).replace(/\s+/g, "");

  return corpus.some(original => {
    const cleanOriginal = canonicalizeName(original).replace(/\s+/g, "");
    if (!cleanCandidate || !cleanOriginal) return false;
    if (cleanCandidate === cleanOriginal) return true;
    if (cleanCandidate.includes(cleanOriginal) || cleanOriginal.includes(cleanCandidate)) return true;
    return charSetSimilarity(cleanCandidate, cleanOriginal) > 0.86;
  });
}

function buildOrderFallbacks(preferredOrder: number): number[] {
  const safeOrder = Math.max(2, Math.floor(preferredOrder));
  const orders: number[] = [];

  for (let order = safeOrder; order >= 2; order--) {
    orders.push(order);
  }

  return orders;
}

function generateSegment(
  pool: string[],
  preferredOrder: number,
  rng: RNG,
  minLetters: number,
  maxLetters: number,
  tries: number,
  avoidCloseMatches: boolean
): string {
  for (const order of buildOrderFallbacks(preferredOrder)) {
    const chain = buildChain(pool, order);

    for (let i = 0; i < tries; i++) {
      const candidate = generateSegmentFromChain(chain, order, rng, minLetters, maxLetters);
      if (!candidate) continue;
      if (avoidCloseMatches && tooSimilar(candidate, pool)) continue;
      return candidate;
    }
  }

  return "";
}

export function generateVirtualPoetName(
  corpus: string[],
  options: VirtualPoetNameOptions = {}
): VirtualPoetNameResult {
  const {
    count = 13,
    order = 3,
    seed = Date.now(),
    minLen,
    maxLen,
    minFirstLen = Math.max(3, minLen ?? 3),
    maxFirstLen = Math.max(5, Math.min(10, maxLen ?? 10)),
    minLastLen = Math.max(4, minLen ?? 4),
    maxLastLen = Math.max(6, maxLen ?? 14),
    tries = 256,
    avoidCloseMatches = true
  } = options;

  const uniqueCorpus = dedupePoetNames(corpus);
  const selected = selectVirtualPoetInspirations(uniqueCorpus, count, seed);
  const pools = buildGenerationPools(uniqueCorpus);

  const nameRng = mulberry32(deriveSeed(seed, 0x85ebca6b));

  let first = "";
  let last = "";

  for (let i = 0; i < tries; i++) {
    first = generateSegment(
      pools.firsts,
      order,
      nameRng,
      minFirstLen,
      maxFirstLen,
      Math.max(16, Math.floor(tries / 4)),
      avoidCloseMatches
    );

    last = generateSegment(
      pools.lasts,
      order,
      nameRng,
      minLastLen,
      maxLastLen,
      Math.max(16, Math.floor(tries / 4)),
      avoidCloseMatches
    );

    if (!first || !last) continue;

    const fullName = `${first} ${last}`;
    if (avoidCloseMatches && tooSimilar(fullName, uniqueCorpus)) continue;

    return {
      name: fullName,
      selected,
      first,
      last,
      seed,
      corpusSize: corpus.length,
      uniqueCorpusSize: uniqueCorpus.length
    };
  }

  const fallbackFirst = pools.firsts[0] ?? "Lyrical";
  const fallbackLast = pools.lasts[0] ?? "Poet";

  return {
    name: `${fallbackFirst} ${fallbackLast}`,
    selected,
    first: fallbackFirst,
    last: fallbackLast,
    seed,
    corpusSize: corpus.length,
    uniqueCorpusSize: uniqueCorpus.length
  };
}

export async function generateVirtualPoetNameFromSamplesFile(
  options: VirtualPoetNameOptions = {},
  pathOrUrl: string | URL = DEFAULT_POET_SAMPLES_URL
): Promise<VirtualPoetNameResult> {
  const corpus = await loadPoetNamesFromSamplesFile(pathOrUrl, { dedupe: true });
  return generateVirtualPoetName(corpus, options);
}
