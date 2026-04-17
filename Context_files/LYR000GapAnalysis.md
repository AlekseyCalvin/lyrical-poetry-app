Verse Metrics & Schema Gap Analysis — LYRICAL
Objective
Analyze every layer of the poetry generation pipeline against the user's compiled verse-metrics primers, then propose concrete improvements that will:

Tighten rhythm–meter alignment between W/S grid and ˘ ´ diacritics.
Surface advanced prosodic features (anacrusis, demoted stress, caesura, catalexis, feminine endings) in both the generative schema and the rendered output.
Enrich the rhyme-type inventory the generator considers.
Remain dynamic — no hard-coded rules that sabotage triple meters or complex forms.
A. Screenshot Diagnosis
Observation	Root Cause
Screenshot 1 (Amphibrachic Dimeter Madrigal): W/S grid often reads W W S W W W S W — too many W's for a 6-syllable Amphibrachic Dimeter line. Several lines show WSW W clusters with no clear amphibrachic 
(x / x)
 pattern. Diacritic ˘ ´ marks sometimes align to strong syllables but frequently disagree with the W/S row above them.	The W/S grid is generated post-hoc by the engine from CMU dict lookup, which correctly reports lexical stress. But the abstract metrical template mapped over those syllables (the "expected" W/S) is produced by a simple formula: meterPattern × footMultiplier. For Amphibrachic Dimeter that gives x / x · x / x = W S W W S W. The poem the LLM generated, however, wasn't composed to hit that grid, because the LLM's schema only asks for conventional_metrical_grid as a freeform string array — the LLM fills it with whatever it wants. Nothing in the organic_schema forces the LLM to actually syllable-map its draft against the supplied W/S template.
Screenshot 2 (Dactylic Trimeter Septet): Grid reads S W W S W W S W W (correct for Dactylic Trimeter). Diacritics mark stressed/unstressed via CMU lookup. But the poem text itself reads largely iambic (rising), not dactylic (falling). E.g. "Time appears calling from the vesper's bell" scans as / u u / u u / u u /  — this is actually dactylic! Yet the W/S row shows an alternating S W W … pattern that doesn't match the displayed number of positions.	The issue is more subtle: the engine is scoring faithfulness, but the prompt to the LLM doesn't supply few-shot exemplars or audible sonic illustrations of what Dactylic Trimeter actually sounds like in practice. The LLM has a weak prior for triple meters without concrete examples. Also, the sonicRhythm provided (DUM da da DUM da da DUM da da) is a single flat string — no word-level examples for the LLM to ground itself.
IMPORTANT

Core finding: The gap is not primarily in the display engine (which correctly looks up CMU stress per syllable). The gap is in the generative prompting + schema: the LLM is not given enough concrete, grounded guidance to compose lines within the meter, nor is it required to output a per-syllable grid mapping that can be validated before rendering.

B. Layer-by-Layer Gap Analysis
B1. Prompt Templates (
prompt_templates.ts
)
Present	Missing / Underspecified
W/S grid string, e.g. W S W S W S	No few-shot examples per meter. The LLM has no audible/textual exemplar of what Amphibrachic Dimeter or Anapestic Trimeter sounds like.
sonicRhythm = da DUM da DUM	This is good but too schematic. Missing real verse quotations with explicit scansion marks from the canon — exactly the kind of "demonstrative referents from the poetic canon" the AGENTS.md envisions.
Theme vocabulary hints	No guidance on legitimate divergences by meter type. The system prompt mentions "trochee in iambic slot" generically but doesn't say: "In Dactylic verse, a common divergence is spondaic substitution in the final foot (catalexis); in Anapestic verse, anacrusis is normal and expected."
Cliché filter	No coverage of rhyme-type variety: the prompt says "must rhyme" but never mentions slant rhyme, feminine rhyme, light rhyme, broken rhyme, wrenched rhyme, etc., despite these being extensively catalogued in 
RHYMES.md
.
Recommendation: For each meter × foot combination, the prompt builder should inject:

2–3 canonical example lines with explicit scansion marks and source attribution.
Meter-specific divergence vocabulary (e.g., anacrusis, catalexis, feminine ending, spondaic substitution).
Rhyme guidance drawn from 
RHYMES.md
 — at minimum, tell the model it can use slant/half rhyme, feminine rhyme, etc., and provide examples.
B2. Organic Schema (
organic_schema.ts
)
Present	Missing
conventional_metrical_grid: string[] — LLM can list W/S per syllable	No per_word_scansion array requiring the LLM to syllable-break each word and assign stress before writing the line. This was present in 
dag_schemas.ts
 (Schema 3: text_to_grid_mapping) but never adopted by the active organic flow.
identified_divergences: string[] — freeform	The values accepted are not enumerated. The LLM can write anything ("iambic_inversion" or "banana"). A closed enum or guided list would ground the model.
No syllable_count per line	The model has no slot to self-verify that its line hits the syllable target. 
dag_schemas.ts
 has syllable_count_verification, but the organic schema omits it.
No end_word field	The model doesn't declare its end-word separately, making rhyme cross-checking harder.
No rhyme_type field	No mechanism for the LLM to declare what kind of rhyme it used (perfect, slant, feminine, etc.) — missing an important layer of self-awareness.
Recommendation: Extend the organic schema's lines item to include:

syllable_count: integer — explicit self-count.
end_word: string — declared separately for rhyme validation.
rhyme_type: enum["perfect","slant","feminine","masculine","eye","assonant","consonant"] — from 
RHYMES.md
.
divergences_used: enum list with a closed vocabulary drawn from 
Metrics_and_Scansion_Detailed.md
 §3 (anacrusis, catalexis, feminine_ending, spondaic_substitution, pyrrhic_substitution, trochaic_inversion, elision, synalepha, caesura_shift).
B3. Poetry Engine / Fabb-Halle Evaluator (
poetry_engine.ts
)
Present	Missing
evaluateFabbHalleScansion()
 handles feminine_ending, anacrusis, acephalous, elision	These divergences are detected and tolerated but they are not surfaced to the user in the rendered output. The isDivergent flag exists on each syllable but is not used in the frontend.
scoreMeterAdherence()
 does simple position-by-position comparison	No notion of stress demotion (Attridge's concept): a lexically stressed monosyllable occupying a W slot should be penalized less than a polysyllabic primary stress in W (Kiparsky's constraint). Currently both get the same −10 penalty.
FUNCTION_WORDS set for stress suppression	Missing clitic phrase handling: "of the" should be treated as a single unstressed anacrusis unit, not two separate syllables each with independent stress decisions (align with §4 of Comprehensive Guide).
findRhymesFor()
 does phoneme-ending match	Only perfect rhyme. No slant/half rhyme, assonant rhyme, or consonant rhyme detection — the engine can't tell the LLM "your slant rhyme is valid."
Recommendation:

Add classifyDivergence() function that labels each syllable–grid mismatch with a named divergence type, passed through to the frontend for display.
Implement demoted stress detection: if a monosyllabic content word has stress 1 but appears in a W slot, classify this as demotion (Attridge) rather than a flat violation; penalize less.
Implement slant rhyme tolerance in 
endingsMatch()
: strip to vowel nucleus only and compare, accepting consonant/assonant matches as "near rhyme."
Pass divergences array per line in the API payload so the frontend can render them.
B4. Server Compose Route (
server.ts
)
Present	Missing
evaluateFabbHalleScansion()
 is called per line	The divergences detected are logged to console but not included in the API response payload. The frontend never sees them.
validatePoem()
 checks syllable count + rhyme scheme	No meter-level validation feedback sent to the user. The "Architectural Notes" footer shows form/meter/syllable info, but nothing about actual meter adherence score or which specific lines diverged.
No repair loop	The organic flow runs exactly once — no self-refine. The DAG Schemas (Schema 4: ReflectiveCorrection) exist in 
dag_schemas.ts
 but are entirely unused.
Recommendation:

Include divergences, meterScore, and rhymeType per line in the API response.
Add a lightweight repair pass: if meterScore < 40 for any line, re-prompt that specific line using Schema 4 (ReflectiveCorrection) before returning.
B5. Frontend Display (
PoemGenerator.tsx
, 
types.ts
)
Present	Missing
W/S grid displayed as green text above each syllable	No divergence annotation: anacrusis syllables, feminine endings, elisions are not visually distinguished. All syllables look the same.
˘ ´ diacritics show actual stress	No secondary stress (ˋ) distinction in practice — the server collapses \\ to / at line 310 of server.ts ("Secondary stress renders as primary for UI clarity"). This erases a real phonological distinction that matters for demoted-stress analysis.
expectedSlot is passed as W/S	No rendering of divergence type (e.g., a small tooltip saying "trochaic inversion" or "anacrusis").
No per-line meter score visible	Users have no idea which lines are metrically strong vs. weak.
SyllableData type has stress, expectedSlot	Missing isDivergent, divergenceType, rhymeType fields.
Recommendation:

Restore secondary stress ˋ in the UI — remove the collapsing at server.ts line 310.
Add a divergence badge system: syllables marked isDivergent get a slightly different color (e.g., amber) and a tooltip explaining the divergence type (anacrusis, elision, etc.).
Show per-line meterScore on hover or as a sidebar heat-bar.
Add rhymeType label next to the rhyme-letter badge on hover.
B6. Meter-Specific Exemplars & Few-Shot Grounding
The primers contain extensive real verse quotations with complex scansion. None of these are currently injected into the LLM prompt. This is the single biggest leverage point.

Recommendation: Build a meter_exemplars.ts lookup keyed by (meterKey, footKey) that returns 2–3 canonical lines with scansion marks:

typescript
// Example entry:
"Iambic_Pentameter": {
  exemplars: [
    { text: "That time of year thou mayst in me behold", 
      scansion: "\\ / | x / || x / | x / | x /",
      source: "Shakespeare, Sonnet 73",
      divergences: ["spondaic_substitution(foot_1)"] },
    // ...
  ],
  commonDivergences: ["trochaic_inversion(foot_1)", "spondaic_substitution", "pyrrhic_substitution", "feminine_ending"],
  avoidance: "Do NOT produce monotonous da-DUM-da-DUM. Vary foot 1 and 3."
},
"Dactylic_Trimeter": {
  exemplars: [
    { text: "Cannon to right of them,", scansion: "/ x x | / x x", source: "Tennyson" },
    // ...
  ]
}
B7. Rhyme Type Enrichment
RHYMES.md catalogues 25+ rhyme types across 4 categories: by similarity nature, by stress relation, by line position, and by word boundary. Currently, the system recognizes only:

Perfect end-rhyme (phoneme ending match).
Slant tolerance mentioned in CandidateWordZod.slant_rhyme_tolerance (DAG schema) but never used in the active organic flow.
Recommendation:

Surface at minimum 8 rhyme types in the generative prompt: perfect, slant, feminine, masculine, eye, assonant, consonant, broken/mosaic.
Let the LLM tag each line-end with its intended rhyme type.
Teach the engine to validate slant and assonant rhymes: compare vowel nuclei only for assonant; compare consonant frames only for consonant rhyme.
Add internal rhyme detection: scan for phoneme matches at caesura positions within lines.
C. Summary of Proposed Changes
File	Change	Rationale
[NEW] meter_exemplars.ts	Keyed exemplar bank with canonical lines, scansion, and divergence vocabulary per meter×foot combination	Few-shot grounding for the LLM
prompt_templates.ts	Inject exemplars, rhyme-type guidance, divergence vocabulary into the organic composition prompt	Close the prompt gap
organic_schema.ts	Add syllable_count, end_word, rhyme_type, divergences_used (closed enum) per line	Schema-level self-verification
poetry_engine.ts	Add slant/assonant/consonant rhyme matching; demoted-stress classification; classifyDivergence()	Richer validation layer
server.ts	Pass divergences, meterScore, rhymeType per line in API payload; restore secondary stress; optional lightweight repair loop	Surface all prosodic data
types.ts	Add isDivergent, divergenceType, meterScore, rhymeType to SyllableData / GeneratedLine	Type support for new fields
PoemGenerator.tsx	Divergence badge coloring, tooltip system, per-line meter heat, secondary stress rendering	Visual prosodic literacy
Verification Plan
Automated
Run 6 test compositions covering: Iambic Pentameter Sonnet, Dactylic Trimeter Septet, Amphibrachic Dimeter Madrigal, Anapestic Tetrameter Quatrain, Trochaic Tetrameter Ballad, Bacchius Dimeter Couplet.
For each: verify W/S grid length matches syllable count; verify diacritics reflect CMU stress; verify divergences array is non-empty where expected; verify rhymeType is present.
Manual / Visual
Inspect that secondary stress (ˋ) appears distinctly and that anacrusis/feminine-ending syllables are visually differentiated.
Verify the few-shot exemplars appear in the console-logged prompt.
Confirm Tauri build succeeds with new fields.
NOTE

This plan deliberately avoids hard-coding meter-specific "rules" that would freeze triple meters or break under complex forms. All new constraints are self-declared by the LLM within a guided schema and then validated/labeled by the engine post-hoc.