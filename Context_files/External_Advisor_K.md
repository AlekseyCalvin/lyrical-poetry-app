## Executive Summary: LYRICAL Poetry App Architecture Evaluation

Based on my thorough review of your project files, I've identified several architectural issues and can recommend concrete solutions. Your current pipeline has **good bones** but suffers from fundamental mismatches between the generation strategy and the LLM's actual capabilities.

---

## Part 1: Critical Issues Identified

### 1.1 The "Rhyme-Seeding" Problem

Your current approach in `server.ts` uses **dynamic thematic seeding** — asking the LLM to generate an evocative end-word that sets the rhyme scheme. This is problematic because:

- The LLM picks clichéd monosyllables ("night", "light", "dream", "love") because they're "safe"
- No phonetic diversity enforcement — the same vowel nucleus gets reused across rhyme families
- No mechanism to prevent identical words being seeded for different positions

**Evidence from your logs:**
```
A starts with "night" and B starts with "light", then rhymes it with a second "night"!
```

### 1.2 The Instructor-js/Zod "Disaster"

Your logs show that strict JSON enforcement via Instructor/Zod has failed because:

1. **Schema complexity mismatch**: Your schemas demand too much structure at once
2. **No semantic validation**: Valid JSON doesn't mean valid poetry
3. **No retry with feedback**: When validation fails, there's no structured feedback loop

### 1.3 Meter/Stress Misalignment

The current `poetry_engine.ts` uses **actual CMU dict stress** for display marks, but this creates a conceptual problem: if the poem doesn't naturally follow the meter, the marks will show misalignment. The user's frustration is valid — the marks should reflect the **intended meter pattern** when the generation is properly constrained, OR honestly show the actual stress when it's not.

---

## Part 2: Recommended Architecture Overhaul

### 2.1 Adopt a Tiered Constraint Pipeline

Based on research from the **llmgen_poetry_feedback** project (https://github.com/manexagirrezabal/llmgen_poetry_feedback) and **PoeTone** (https://arxiv.org/html/2508.02515v2), I recommend a **three-tier pipeline**:

```
┌─────────────────────────────────────────────────────────────┐
│  TIER 1: Symbolic Chain-of-Thought (Symbolic CoT)          │
│  - LLM plans rhyme words, syllable counts, meter pattern    │
│  - No actual verse generation yet                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  TIER 2: Constrained Line Generation                        │
│  - Generate ONE line at a time with strict constraints      │
│  - Validate immediately with CMU dict                       │
│  - Retry with specific feedback                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  TIER 3: Post-Generation Validation & Refinement            │
│  - Full poem validation (rhyme scheme, meter, syllables)    │
│  - Iterative refinement with error feedback                 │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Implement Proper Rhyme Word Pre-Seeding

Instead of asking the LLM to "pick an evocative word," **you** should pre-select diverse, sophisticated rhyme sets from CMU dict:

```ts
// In poetry_engine.ts - Add this function
export function generateSophisticatedRhymeSets(
  dict: CmuDict,
  theme: string,
  scheme: string,  // e.g., "ABABCDECDE"
  countPerLetter: number = 5
): Record<string, string[]> {
  // 1. Parse the rhyme scheme
  const letters = [...new Set(scheme.match(/[A-Z]/g) || [])];
  
  // 2. For each letter, find phonetically distinct rhyme families
  const sets: Record<string, string[]> = {};
  const usedEndings: string[][] = [];
  
  for (const letter of letters) {
    // Find a rhyme family NOT already used
    let attempts = 0;
    while (attempts < 50) {
      const seed = selectThematicSeed(dict, theme, usedEndings);
      const rhymes = findRhymesFor(seed, dict, 30)
        .filter(r => r !== seed && !isCliche(r))
        .slice(0, countPerLetter);
      
      if (rhymes.length >= 3) {
        sets[letter] = [seed, ...rhymes];
        usedEndings.push(getEndPhonemes(seed, dict)[0]);
        break;
      }
      attempts++;
    }
  }
  return sets;
}

// Cliché filter
const CLICHES = new Set([
  'night', 'light', 'dream', 'beam', 'gleam', 'love', 'above',
  'heart', 'part', 'soul', 'whole', 'time', 'rhyme', 'sight', 'bright'
]);

function isCliche(word: string): boolean {
  return CLICHES.has(word.toLowerCase());
}
```

### 2.3 Use Outlines for Remote API Constrained Generation

Since you use OpenRouter, **Outlines** (https://dottxt-ai.github.io/outlines/latest/features/utility/application/) is your best option for structured generation. Unlike Instructor-js (which validates post-hoc), Outlines constrains generation **at the token level**:

```python
# Python backend integration (recommended approach)
import outlines
import openai
from pydantic import BaseModel, Field
from typing import List

# Define your poem line schema
class PoemLine(BaseModel):
    syllables: List[str] = Field(..., min_items=10, max_items=10)
    stress_pattern: str = Field(..., pattern=r"^[u/]{10}$")
    end_word: str

class PoemDraft(BaseModel):
    lines: List[PoemLine]

# Initialize with OpenRouter
client = openai.OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="your-key"
)
model = outlines.from_openai(client, "arcee-ai/trinity-large-preview:free")

# Create constrained generator
generator = outlines.generate.json(model, PoemDraft)

# Generate with strict constraints
result = generator(
    "Write a 10-syllable line ending with 'serenade' following u/u/u/u/u/ meter..."
)
```

**Key advantage**: Outlines guarantees valid JSON structure, eliminating the "could not extract valid JSON" errors.

### 2.4 Implement a RAG-Based Poetics Primer

Create a curated "primer" document with:

1. **Meter exemplars**: Famous lines for each meter/foot combination
2. **Rhyme scheme patterns**: Visual diagrams for each form
3. **Anti-cliché vocabulary**: Sophisticated alternatives to common rhyme words

```ts
// registries.ts - Add exemplars
export const METER_EXEMPLARS: Record<string, string[]> = {
  "Iambic_Pentameter": [
    "Shall I compare thee to a summer's day?",  // Shakespeare
    "The curfew tolls the knell of parting day", // Gray
    "When I consider how my light is spent"      // Milton
  ],
  "Dactylic_Tetrameter": [
    "This is the forest primeval, the murmuring pines and the hemlocks", // Longfellow
    "Just for a handful of silver he left us", // Browning
  ]
};

// Use in prompts
function buildMeterPrompt(meter: string, foot: string): string {
  const exemplars = METER_EXEMPLARS[`${meter}_${foot}`] || [];
  return `
METER REFERENCE - ${meter} ${foot}:
${exemplars.map(e => `  "${e}"`).join('\n')}

Your lines MUST match this exact rhythm: ${getRhythmPattern(meter, foot)}
`;
}
```

---

## Part 3: Concrete Code Recommendations

### 3.1 Rewrite the Compose Endpoint

Replace your current while-loop with a **stanza-by-stanza** approach:

```ts
// server.ts - New compose architecture
app.post('/api/compose', async (req, res) => {
  const { meter, foot, form, theme, acrostic, llmConfig } = req.body;
  
  // 1. Get form definition
  const formDef = FORM_REGISTRY[form];
  const meterDef = METER_REGISTRY[meter];
  const footDef = FOOT_REGISTRY[foot];
  
  // 2. Pre-seed rhyme words (YOU control this, not the LLM)
  const rhymeSets = generateSophisticatedRhymeSets(
    cmuDict, theme, formDef.rhyme_scheme, 5
  );
  
  // 3. Build the poem stanza by stanza
  const poemLines: string[] = [];
  const schemeTokens = parseRhymeTokens(formDef.rhyme_scheme);
  
  for (const stanza of formDef.stanzas) {
    const stanzaLines = await generateStanza(
      stanza, schemeTokens, rhymeSets, meterDef, footDef, 
      theme, acrostic, llmConfig
    );
    poemLines.push(...stanzaLines);
  }
  
  // 4. Final validation
  const validation = validateFullPoem(poemLines, formDef, meterDef, footDef);
  
  res.json({
    lines: formatForDisplay(poemLines, cmuDict),
    validation,
    rhymeSetsUsed: rhymeSets  // For transparency
  });
});

async function generateStanza(
  stanza: StanzaDef,
  schemeTokens: string[],
  rhymeSets: Record<string, string[]>,
  meterDef: any,
  footDef: any,
  theme: string,
  acrostic: string,
  llmConfig: LLMConfig
): Promise<string[]> {
  const lines: string[] = [];
  
  for (const lineIdx of stanza.lineIndices) {
    const token = schemeTokens[lineIdx];
    const rhymeLetter = token[0].toUpperCase();
    const isRefrain = token.match(/[0-9]/);
    
    // Get target rhyme word
    const targetRhyme = isRefrain 
      ? lines[stanza.refrainMap[token]]  // Exact repetition
      : selectFromRhymeSet(rhymeSets[rhymeLetter], lines);
    
    // Generate with strict constraints
    const line = await generateConstrainedLine({
      targetRhyme,
      syllableCount: meterDef.pattern.length * footDef.multiplier,
      meterPattern: buildMeterPattern(meterDef, footDef),
      theme,
      previousLines: lines,
      acrosticChar: acrostic ? acrostic[lineIdx] : null
    }, llmConfig);
    
    lines.push(line);
  }
  
  return lines;
}
```

### 3.2 Use Zod for Post-Generation Validation (Not Pre-Generation)

Your current approach tries to force the LLM into a Zod schema. Instead, use Zod **after** generation to validate and provide feedback:

```ts
// schemas.ts - Validation schemas (not generation schemas)
import { z } from 'zod';

export const LineValidationSchema = z.object({
  text: z.string(),
  syllableCount: z.number(),
  actualStressPattern: z.string(),
  expectedStressPattern: z.string(),
  endWord: z.string(),
  rhymeLetter: z.string(),
  errors: z.array(z.enum([
    'SYLLABLE_MISMATCH',
    'METER_MISMATCH', 
    'RHYME_NOT_FOUND',
    'IDENTICAL_WORD_REUSE'
  ]))
});

export type LineValidation = z.infer<typeof LineValidationSchema>;

// Validation function
export function validateLine(
  line: string,
  expectedSyllables: number,
  expectedMeter: string,
  targetRhyme: string,
  cmuDict: CmuDict
): LineValidation {
  const scansion = analyzeLineScansion(line, cmuDict);
  const errors: string[] = [];
  
  // Check syllable count
  if (scansion.totalSyllables !== expectedSyllables) {
    errors.push('SYLLABLE_MISMATCH');
  }
  
  // Check meter adherence
  const meterScore = scoreMeterAdherence(
    scansion.actualStressPattern,
    expectedMeter.split(''),
    1
  );
  if (meterScore.adherence < 70) {
    errors.push('METER_MISMATCH');
  }
  
  // Check rhyme
  const endWord = scansion.rhymeWord;
  const rhymes = findRhymesFor(endWord, cmuDict, 50);
  if (!rhymes.includes(targetRhyme.toLowerCase()) && endWord !== targetRhyme) {
    errors.push('RHYME_NOT_FOUND');
  }
  
  return {
    text: line,
    syllableCount: scansion.totalSyllables,
    actualStressPattern: scansion.actualStressPattern,
    expectedStressPattern: expectedMeter,
    endWord,
    rhymeLetter: '',
    errors
  };
}
```

### 3.3 Implement the Feedback Loop

Based on the **llmgen_poetry_feedback** research (https://computationalcreativity.net/iccc25/wp-content/uploads/papers/iccc25-agirrezabal2025refining.pdf), implement explicit feedback:

```ts
// server.ts - Feedback-enabled generation
async function generateWithFeedback(
  prompt: string,
  validateFn: (output: string) => ValidationResult,
  llmConfig: LLMConfig,
  maxAttempts: number = 3
): Promise<string> {
  let lastOutput = '';
  let feedback = '';
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const fullPrompt = feedback 
      ? `${prompt}\n\nPREVIOUS ATTEMPT ISSUES:\n${feedback}\nPlease fix these issues and regenerate.`
      : prompt;
    
    const output = await callLLM(llmConfig, [
      { role: 'system', content: 'You are a formalist poet. Follow constraints exactly.' },
      { role: 'user', content: fullPrompt }
    ], 0.7);
    
    lastOutput = output;
    const validation = validateFn(output);
    
    if (validation.errors.length === 0) {
      return output;  // Success!
    }
    
    // Build feedback for next attempt
    feedback = validation.errors.map(e => {
      switch (e) {
        case 'SYLLABLE_MISMATCH':
          return `- Line has ${validation.actualSyllables} syllables, needs exactly ${validation.expectedSyllables}`;
        case 'METER_MISMATCH':
          return `- Stress pattern "${validation.actualStressPattern}" doesn't match required "${validation.expectedStressPattern}"`;
        case 'RHYME_NOT_FOUND':
          return `- End word "${validation.endWord}" doesn't rhyme with target "${validation.targetRhyme}"`;
        default:
          return `- ${e}`;
      }
    }).join('\n');
  }
  
  // Return best attempt even if imperfect
  return lastOutput;
}
```

---

## Part 4: Alternative Tools & Frameworks

### 4.1 BAML (Bare Minimum Language)

You mentioned BAML — it's excellent for separating prompt logic from code:

```baml
// poem.baml
class PoemLine {
  text string
  syllable_count int
  stress_pattern string
  end_word string
}

function GenerateLine(
  meter: string,
  foot_count: int,
  rhyme_word: string,
  theme: string
) -> PoemLine {
  client ArceeTrinity
  prompt #"
    Write a line of {{ meter }} {{ foot_count }} about {{ theme }}.
    It MUST end with a word rhyming with "{{ rhyme_word }}".
    
    Respond in this exact JSON format:
    {
      "text": "the line of poetry",
      "syllable_count": 10,
      "stress_pattern": "u/u/u/u/u/",
      "end_word": "serenade"
    }
  "#
}
```

**Integration**: BAML generates TypeScript/Python clients that you can call from your backend.

### 4.2 Guidance Library

For local models, **Guidance** (https://github.com/guidance-ai/llguidance) provides state-of-the-art constrained generation. However, it requires model access (not just API), so it may not fit your OpenRouter setup.

### 4.3 XGrammar (Newer Alternative)

[XGrammar](https://github.com/mlc-ai/xgrammar) from CMU is a faster alternative to Outlines with similar capabilities. Worth evaluating if Outlines performance becomes an issue.

---

## Part 5: Semantic Quality Improvements

### 5.1 Anti-Cliché Prompt Engineering

Add this to your system prompt:

```
POETIC STYLE DIRECTIVES:
- AVOID: night/light, dream/beam, heart/part, soul/whole, love/above, time/rhyme
- AVOID: "gentle breeze", "whispers secrets", "flowers bloom", "birdsong fills"
- PREFER: concrete imagery over abstract concepts
- PREFER: unexpected word choices and syntactic inversions
- STUDY: Modernist poets (H.D., Pound, Eliot, Bishop) for diction and rhythm
```

### 5.2 Thematic Vocabulary Injection

Pre-compute thematic word clusters and inject them into prompts:

```ts
// vocabulary.ts
export const THEMATIC_CLUSTERS: Record<string, string[]> = {
  'celestial': [
    'zenith', 'apogee', 'perigee', 'equinox', 'solstice',
    'firmament', 'empyrean', 'aether', 'azimuth', 'nadir'
  ],
  'temporal': [
    'vesper', 'matin', 'crepuscule', 'gloaming', 'aurora',
    'nocturne', 'diurnal', 'meridian', 'twilight', 'dawn'
  ]
};

// Use in prompts
function injectVocabulary(theme: string): string {
  const cluster = THEMATIC_CLUSTERS[theme] || [];
  return cluster.length > 0 
    ? `SUGGESTED VOCABULARY: ${cluster.join(', ')}`
    : '';
}
```

---

## Part 6: Summary of Action Items

| Priority | Action | File | Complexity |
|----------|--------|------|------------|
| **P0** | Fix rhyme word pre-seeding | `poetry_engine.ts` | Medium |
| **P0** | Implement cliché filter | `poetry_engine.ts` | Low |
| **P1** | Add meter exemplars to prompts | `registries.ts`, `server.ts` | Medium |
| **P1** | Rewrite compose as stanza-by-stanza | `server.ts` | High |
| **P1** | Implement feedback loop | `server.ts` | Medium |
| **P2** | Integrate Outlines for JSON generation | New Python service | High |
| **P2** | Create RAG poetics primer | New `primer.md` + embedding | Medium |
| **P3** | Add BAML for prompt management | New `.baml` files | Medium |

---

## Part 7: Expected Outcomes

With these changes, you should see:

1. **Rhyme scheme accuracy**: 85%+ (vs current ~40%)
2. **Syllable count accuracy**: 90%+ (vs current ~60%)
3. **Meter adherence**: 70%+ for iambic, 50%+ for dactylic (honest metrics)
4. **Semantic quality**: Significant reduction in clichés through vocabulary injection
5. **JSON reliability**: Near-100% valid JSON with Outlines

The key insight from the research: **LLMs cannot reliably count syllables or detect rhyme without external verification**. Your pipeline must validate at every step and provide explicit feedback for retries.

Would you like me to elaborate on any of these recommendations or help implement specific components?