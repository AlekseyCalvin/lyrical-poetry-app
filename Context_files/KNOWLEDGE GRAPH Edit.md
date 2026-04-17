> # Poetics Knowledge Graph: Foundation for an Agentic Verse System
> 
> ## I. ONTOLOGICAL ARCHITECTURE
> 
> ### A. Core Entity Taxonomy
> 
> ```
> POETIC_KNOWLEDGE_GRAPH
> ├── FORMAL_ENTITIES
> │   ├── Meter (stress patterns, periodicity)
> │   ├── Foot (metrical units, multipliers)
> │   ├── Form (stanzaic architecture, rhyme schemes)
> │   ├── Line (syllable constraints, caesura)
> │   └── Stanza (grouping logic, breaks)
> │
> ├── PHONETIC_ENTITIES
> │   ├── Syllable (weight, stressability, duration)
> │   ├── Phoneme (intrinsic duration, co-articulation)
> │   ├── Rhyme (perfect, slant, assonance, consonance)
> │   └── Sound_Pattern (alliteration, internal rhyme)
> │
> ├── SEMANTIC_ENTITIES
> │   ├── Theme (topic clusters, imagery families)
> │   ├── Genre (historical associations, conventions)
> │   ├── Tone (modal registers, voice qualities)
> │   └── Movement (period styles, aesthetic schools)
> │
> └── STRUCTURAL_ENTITIES
>     ├── Constraint (rules, exceptions, licenses)
>     ├── License (metrical permissions, deviations)
>     ├── Score (adherence metrics, quality indices)
>     └── Transformation (revision operations, refinements)
> ```
> 
> ---
> 
> ## II. METER & RHYTHM KNOWLEDGE
> 
> ### A. The Fundamental Principle: Counting Precedes Rhythm
> 
> From Fabb's Bracketed Grid Theory, we extract a foundational axiom: **metrical verse is characterized first by counting, then by rhythmic constraints.** This reverses traditional assumptions:
> 
> > *"If rhythm is fundamental to metricality, then prose should be able to be metrical; if counting is fundamental then the count must begin and end somewhere and hence the text must be divided into lines."* — Nigel Fabb
> 
> **Implications for English Verse Generation:**
> 1. Syllables must be counted before stress patterns are evaluated
> 2. Lines exist because counting requires boundaries
> 3. Rhythm is secondary—a constraint upon the counted elements
> 4. Variable length lines can have fixed counts (via non-projection rules)
> 
> ### B. Metrical Distance & Similarity Space
> 
> From Mirapolsky's harmonic analysis, we derive a metrical topology:
> 
> **Distance Formula:**
> ```
> σ = √Σ(A(i,j) - B(i,j))² / n
> ```
> Where A(i,j) and B(i,j) represent stress values (0 or 1) at coordinate positions.
> 
> **Key Findings for English:**
> - Maximum distance between any two meters = **1.0**
> - Maximum distance between binary meters (Iamb/Choree) = 1.0
> - Maximum distance between ternary meters (Dactyl/Anapest/Amphibrach) ≈ 0.816
> - Three-syllable meters cluster more tightly (full stress positions align more often)
> - Two-syllable meters show more variation (stress skipping is common)
> 
> **Metrical Similarity Clusters:**
> | Cluster | Members | Semantic Implications |
> |---------|---------|----------------------|
> | Rising | Iamb, Anapest | Questioning, building, forward motion |
> | Falling | Trochee, Dactyl | Certainty, completeness, descent |
> | Iambic Family | Iamb-3, Iamb-4, Iamb-5 | Elevated, discursive, narrative |
> | Trochaic Family | Trochee-3, Trochee-4 | Song-like, incantatory, folk |
> 
> ### C. Stress Pattern Grammar (English-Specific)
> 
> **From the Registries + Hopkins Analysis:**
> 
> ```
> METER_PATTERNS = {
>   "Pyrrhic":     { pattern: "x x",    stress: [0, 0],    feet: "no stress" },
>   "Trochaic":    { pattern: "/ x",    stress: [1, 0],    feet: "falling" },
>   "Iambic":      { pattern: "x /",    stress: [0, 1],    feet: "rising" },
>   "Spondee":     { pattern: "/ /",    stress: [1, 1],    feet: "equal" },
>   "Dactylic":    { pattern: "/ x x",  stress: [1, 0, 0], feet: "falling ternary" },
>   "Amphibrachic":{ pattern: "x / x",  stress: [0, 1, 0], feet: "rising-falling" },
>   "Anapestic":   { pattern: "x x /",  stress: [0, 0, 1], feet: "rising ternary" },
>   "Bacchius":    { pattern: "x / /",  stress: [0, 1, 1], feet: "rising double" }
> }
> ```
> 
> **Stress Realization Rules (English):**
> 1. **Lexical Stress Constraint:** Stressed syllables in polysyllabic words MUST occur in S-positions (strong)
> 2. **Monosyllable Tendency:** Monosyllables tend toward meter-consistent positions but are not required
> 3. **Resolution:** A stressed light syllable + stressless non-heavy syllable in the same word may fill one position
> 4. **Pyrrhic Positions:** Allowed when no lexical stress is present; often filled by weak function words
> 
> ---
> 
> ## III. SYLLABLE WEIGHT & PHONETICS
> 
> ### A. Syllable Classification Schema
> 
> From Hopkins analysis (applicable to English):
> 
> ```
> WEIGHT_CATEGORIES:
>   HEAVY (∑) = { closed_syllable | long_vowel | diphthong | stressed_monosyllable }
>   LIGHT (∂) = { open_short_vowel | reduced_vowel | unstressed_short }
>   AMBIGUOUS (∏) = { syllable_with_optional_interpretation }
> ```
> 
> **English Weight Assignment Rules:**
> ```
> isHeavy(syllable) = 
>   hasCodaConsonant(syllable) ∨ 
>   hasLongVowel(syllable) ∨
>   hasDiphthong(syllable) ∨
>   isStressedMonosyllable(syllable)
> 
> isLight(syllable) =
>   isOpenSyllable(syllable) ∧
>   hasShortVowel(syllable) ∧
>   ¬isStressed(syllable)
> ```
> 
> **Special Provisions:**
> 1. Final silent 'e' does not make syllable heavy
> 2. Final stressless syllables: single consonant may be ignored
> 3. Vowel-sonorant merger can create light syllables (e.g., "can" unstressed → /kən/ → /kŋ̩/)
> 
> ### B. Correption (Vowel Shortening)
> 
> From classical metrics, applicable when English permits:
> 
> ```
> CORREPTION_RULE:
>   vowel + immediate_following_vowel → shortened_vowel
>   Example: "how early" → /haʊ ɜːrli/ → "how" can be treated as light
> ```
> 
> This enables resolution in English verse where vowels meet across word boundaries.
> 
> ### C. Duration Modeling
> 
> From PhLADiPreLiO's computational approach:
> 
> **Sound Duration as Rhythmic Foundation:**
> - Each phoneme has characteristic duration range
> - Syllable duration = Σ(phoneme_durations) + coarticulation_adjustment
> - Rhythm emerges from duration patterns, not just stress patterns
> 
> **For English, we derive:**
> ```
> SYLLABLE_DURATION_FACTORS:
>   1. Intrinsic phoneme duration (vowels > consonants)
>   2. Stress level (stressed ≈ 1.3× longer than unstressed)
>   3. Position (phrase-final lengthening ≈ 1.2×)
>   4. Weight (heavy syllables take longer to articulate)
> ```
> 
> ---
> 
> ## IV. FORM ARCHITECTURE & CONSTRAINTS
> 
> ### A. Form Knowledge Graph Schema
> 
> ```
> FORM_NODE {
>   name: String,
>   lines: Integer,
>   rhyme_scheme: String,
>   stanza_breaks: Integer[],
>   rules: String,
>   
>   DERIVED_CONSTRAINTS: {
>     rhyme_groups: Map<Char, Integer[]>,  // line indices per rhyme family
>     repetition_requirements: RepetitionRule[],
>     special_features: String[],
>     difficulty_score: Float
>   }
> }
> 
> REPETITION_RULE {
>   type: "refrain" | "identical_line" | "variation",
>   source_lines: Integer[],
>   target_lines: Integer[],
>   constraint: "verbatim" | "semantic" | "inversion" | "play",
>   strictness: "required" | "preferred"
> }
> ```
> 
> ### B. Form-Specific Constraints Extracted
> 
> **1. Villanelle (19 lines)**
> ```
> {
>   rhyme_scheme: "A1-B1-A2 a-B1-A1 a-B1-A2 a-B1-A1 a-B1-A2 a-B1-A1-A2",
>   repetition_rules: [
>     { type: "identical_line", source: 0, target: [6, 12], constraint: "verbatim" },
>     { type: "identical_line", source: 2, target: [9, 15], constraint: "verbatim" },
>     { type: "identical_closing", source: [0, 2], target: [18], constraint: "both" }
>   ],
>   constraint_graph: {
>     A1_line: "MUST end with word that repeats exactly",
>     A2_line: "MUST end with word that repeats exactly",
>     B1_line: "MUST end with word that repeats exactly",
>     a_lines: "MUST rhyme with A-family, distinct words"
>   }
> }
> ```
> 
> **2. Rondine (12 lines)**
> ```
> {
>   rhyme_scheme: "ABBAABC ABBAC",
>   refrain_rule: {
>     marker: "C",
>     requirement: "repetition or ironic inversion of opening words",
>     flexibility: "high"
>   },
>   stanza_breaks: [7],
>   semantic_challenge: "C-lines must resonantly echo first line's beginning"
> }
> ```
> 
> **3. Madrigal (13 lines)**
> ```
> {
>   rhyme_scheme: "A1-B1-B2 a-b-A1-B1 a-b-b-A-B1-B2",
>   repetition_hierarchy: {
>     capital_numbered: "exact word/phrase repetition required",
>     lowercase: "rhyme only, distinct words required"
>   },
>   constraint_lattice: {
>     A1: { rhyme_family: "A", repetition: "identical" },
>     B1: { rhyme_family: "B", repetition: "identical" },
>     B2: { rhyme_family: "B", repetition: "identical", distinct_from: "B1" },
>     a: { rhyme_family: "A", repetition: "none", distinct: true },
>     b: { rhyme_family: "B", repetition: "none", distinct: true }
>   }
> }
> ```
> 
> **4. Common Octave (8 lines)**
> ```
> {
>   rhyme_scheme: "ABCA BCAC",
>   special_rule: "MUST use slanted rhymes exclusively",
>   stanza_breaks: [4],
>   constraint: "no perfect rhymes allowed"
> }
> ```
> 
> ### C. Rhyme Type Hierarchy
> 
> ```
> RHYME_TYPES (ordered by strictness):
>   1. IDENTICAL      - exact word repetition (Villanelle A1, Madrigal capitals)
>   2. PERFECT        - matching vowel + coda (cat/hat)
>   3. RICH           - perfect + matching onset (light/sight)
>   4. SLANT          - imperfect vowel match (soul/all, love/move)
>   5. ASSONANCE      - vowel match only (light/time)
>   6. CONSONANCE     - coda match only (park/fork)
>   7. EYE_RHYME      - visual match, phonetic mismatch (love/prove)
>   8. NEAR_RHYME     - phonetic proximity (soul/oil)
> ```
> 
> **Slant Rhyme Distance Metric:**
> ```
> slant_distance(word1, word2) = 
>   edit_distance(end_phoneme_sequence(word1), end_phoneme_sequence(word2))
>   
> close_slant: distance ≤ 1
> acceptable_slant: distance ≤ 2
> ```
> 
> ---
> 
> ## V. SYNTACTIC-PROSODIC INTEGRATION
> 
> ### A. Prosodic Marking System
> 
> From the French prosody model (adapted for English):
> 
> ```
> PROSODIC_MARKS = {
>   SI: { name: "strong_independence", strength: 7, cue: "major_juncture" },
>   ID: { name: "independence", strength: 6, cue: "phrase_boundary" },
>   SL: { name: "strong_left_dependence", strength: 5, cue: "subject-verb_link" },
>   IT: { name: "interdependence", strength: 4, cue: "coordinate_link" },
>   LD: { name: "left_dependence", strength: 3, cue: "modifier-head" },
>   RD: { name: "right_dependence", strength: 2, cue: "head-modifier" },
>   SR: { name: "strong_right_dependence", strength: 1, cue: "lexicalized_expression" }
> }
> ```
> 
> **Application to English Verse:**
> - Higher-strength marks = more likely to align with line breaks
> - Lower-strength marks = may be compressed within lines
> - Syntactic parsing guides natural caesura placement
> 
> ### B. Threshold-Based Grouping
> 
> ```
> PROSODIC_THRESHOLDS (English, normal speech rate):
>   prosodic_word:    4 syllables (max comfortable articulation)
>   phonation_group:  8 syllables (before micro-breath)
>   breath_group:     12 syllables (before reset)
>   respiratory_group: 16 syllables (before major pause)
> ```
> 
> **Implication for Line Length:**
> - Lines exceeding 12 syllables typically require caesura
> - Lines under 4 syllables feel abrupt (unless intentional)
> - Optimal line length: 8-12 syllables for English iambic
> 
> ---
> 
> ## VI. SEMANTIC HALO OF METER
> 
> ### A. Meter-Meaning Associations
> 
> From the Russian corpus study, generalized to English:
> 
> **Principle:** Meters accumulate semantic associations through historical usage, not intrinsic properties.
> 
> ```
> SEMANTIC_HALO_HYPOTHESIS:
>   meter → semantic_cluster
>   
>   where semantic_cluster emerges from:
>     1. Historical genre associations
>     2. Canonical poems in that meter
>     3. Period/style preferences
>     4. Rhythmic affordances (rising vs falling)
> ```
> 
> **English Meter Semantic Tendencies:**
> 
> | Meter | Historical Associations | Semantic Inclinations |
> |-------|------------------------|----------------------|
> | Iambic Pentameter | Sonnet, blank verse, epic | Serious, contemplative, elevated |
> | Iambic Tetrameter | Hymn, ballad | Narrative, song-like, folk |
> | Trochaic Tetrameter | Nursery rhyme, incantation | Playful, rhythmic, urgent |
> | Anapestic Tetrameter | Comic verse, light poetry | Energetic, bouncy, satirical |
> | Dactylic Hexameter | Classical epic translation | Grand, rolling, mythic |
> | Free Verse | Modern poetry | Contemporary, unconstrained |
> 
> ### B. Semantic Accumulation Over Time
> 
> **From the clustering analysis:**
> - Early period: Strong meter-genre binding (genres "fall" into meters)
> - Later period: Semantic diffusion (meters become semantically broader)
> - Rare meters: Maintain concentrated semantic halo
> - Common meters: Develop diffuse, general-use semantics
> 
> **For the Agent:**
> ```
> SEMANTIC_RETRIEVAL_STRATEGY:
>   if meter.is_rare():
>     semantic_focus = "historical associations"
>     vocabulary_bias = "canonically_constrained"
>   else:
>     semantic_focus = "broad thematic"
>     vocabulary_bias = "flexible"
> ```
> 
> ### C. Gini Coefficient for Semantic Concentration
> 
> ```
> semantic_inequality(meter) = Gini(topic_distribution)
> 
> High Gini (0.2+): Concentrated semantic halo (rare forms)
> Low Gini (0.1-): Diffuse semantic halo (common forms like Iamb-4)
> 
> IMPLICATION:
>   Rare forms should be generated with stronger adherence to
>   their semantic traditions; common forms allow broader interpretation.
> ```
> 
> ---
> 
> ## VII. SPRUNG RHYTHM & COMPLEX METERS
> 
> ### A. Hopkins' Innovation
> 
> **Sprung Rhythm Rules:**
> ```
> SPRUNG_RHYTHM_CONSTRAINTS:
>   1. S_positions: may contain {stressed_syllable OR resolved_sequence OR stressless_non-light}
>   2. W_positions: may contain {stressless_syllable OR stressless_light_sequence OR resolved_sequence OR null}
>   3. Overreaving: Final W of line = Initial W of next line (ambistichic)
>   4. Outrides: Extrametrical syllables following S positions, weaker than preceding stress
> ```
> 
> **Weighted Constraint Grammar:**
> ```
> CONSTRAINT_HIERARCHY:
>   *Lexical_Stress_in_W: VIOLATION (unless resolved)
>   *Heavy_in_Multiply_Filled_W: VIOLATION
>   *Null_in_S: VIOLATION (with 2 documented exceptions)
>   *Stressless_Light_in_S: VIOLATION
>   *Multiply_Filled_S: VIOLATION (except resolved)
>   
>   Outrides_Must_Fall: outride stress < preceding stress
>   Outrides_Must_Follow_S: outrides after strong positions
>   Outrides_Must_Cohere: attach to preceding material
>   Outrides_Must_Precede_Break: occur before boundaries
> ```
> 
> ### B. Resolution
> 
> **Definition:** A stressed light syllable + stressless non-heavy syllable in the same word.
> 
> **English Examples:**
> - "very" /'vɛr.i/ → ['vɛri] → can fill one position
> - "many" /'mɛn.i/ → ['mɛni] → resolution candidate
> - "body" /'bɒd.i/ → ['bɒdi] → resolution candidate
> 
> **Application:**
> ```python
> def can_resolve(word):
>     syllables = syllabify(word)
>     if len(syllables) != 2:
>         return False
>     first = syllables[0]
>     return (is_stressed(first) and 
>             is_light(first) and 
>             not is_heavy(syllables[1]))
> ```
> 
> ---
> 
> ## VIII. CONSTITUTIVE VS. IMPLIED FORM
> 
> ### A. Fabb's Distinction
> 
> **Constitutive Form:** Generated by rules, non-negotiable
> - Syllable count
> - Position of lexical stresses in polysyllables
> - Line boundaries
> 
> **Implied Form:** Derived through inference, negotiable
> - Genre classification
> - Rhythmic approximation
> - Stanza grouping (in some cases)
> 
> **For the Agent:**
> ```
> FORM_GENERATION_STRATEGY:
>   1. Build constitutive form via generative rules
>   2. Infer implied form via pragmatic interpretation
>   3. Use interpretive resemblance for tendencies
>   4. Never violate constitutive constraints
> ```
> 
> ### B. Tendencies as Pragmatic Inference
> 
> **From Relevance Theory:**
> 
> Tendencies in meter (like monosyllable placement) are not generated by rules but inferred through **interpretive use**:
> 
> ```
> INFERENCE_CHAIN:
>   A: "This line has rhythm x/x/xxx/x/"
>   B: "This line resembles x/x/x/x/x/" (interpretive use)
>   C: "If line has rhythm x/x/x/x/x/, it is in iambic pentameter"
>   ∴ D: "This line is in iambic pentameter" (with reduced strength)
> ```
> 
> **Implication:** The agent should aim for resemblance, not perfection, in tendencies.
> 
> ---
> 
> ## IX. RHYTHM ANALYSIS TOOLS
> 
> ### A. Polyrhythmic Coherence
> 
> From PhLADiPreLiO's polyrhythm model:
> 
> **Definition:** Multiple rhythmic patterns coexisting in a single line.
> 
> **Coherence Condition:**
> ```
> coherent(rhythm_1, rhythm_2, ..., rhythm_n) =
>   all(rhythm_i and rhythm_j have synchronized strong positions for some i,j)
> ```
> 
> **For English Verse:**
> - Primary rhythm: meter (stress pattern)
> - Secondary rhythm: syllable weight distribution
> - Tertiary rhythm: syntactic phrasing
> - Quaternary rhythm: semantic emphasis
> 
> **Optimal Lines:** When all rhythms cohere (strong positions align across layers)
> 
> ### B. Duration-Based Analysis
> 
> ```
> rhythmic_score(line) = 
>   coherence(primary_rhythm, secondary_rhythm) +
>   balance(duration_distribution) +
>   alignment(syntactic_breaks, metric_positions)
> ```
> 
> **Balance Measure:**
> ```python
> def balance(durations):
>     mean_duration = sum(durations) / len(durations)
>     variance = sum((d - mean_duration)**2 for d in durations) / len(durations)
>     return 1 / (1 + variance)  # Higher = more balanced
> ```
> 
> ---
> 
> ## X. GRAPH-RAG ARCHITECTURE
> 
> ### A. Knowledge Graph Schema for Verse Generation
> 
> ```yaml
> VerseKnowledgeGraph:
>   nodes:
>     - Form:
>         properties: [name, lines, rhyme_scheme, stanza_breaks, rules, difficulty]
>         edges: [has_meter, requires_rhyme_type, has_repetition_rule]
>     
>     - Meter:
>         properties: [name, pattern, foot_type, typical_forms]
>         edges: [semantic_associations, historical_usage]
>     
>     - RhymeWord:
>         properties: [word, phonetic_ending, syllable_count, stress_pattern]
>         edges: [rhymes_with, slant_rhymes, belongs_to_family]
>     
>     - Constraint:
>         properties: [type, strictness, application_point]
>         edges: [applies_to_form, has_exception]
>     
>     - Theme:
>         properties: [name, keywords, imagery_cluster]
>         edges: [associated_with_form, associated_with_meter]
>     
>     - Example:
>         properties: [text, author, form, meter, quality_score]
>         edges: [illustrates_form, demonstrates_meter]
> 
>   relationships:
>     - REQUIRES: Form → Constraint
>     - PERMITS: Form → License
>     - ASSOCIATES: Meter → Theme
>     - RHYMES_WITH: RhymeWord → RhymeWord
>     - ILLUSTRATES: Example → Form
> ```
> 
> ### B. Retrieval Strategy
> 
> ```python
> def retrieve_context(theme, meter, foot, form):
>     # Step 1: Resolve form constraints
>     constraints = graph.query(
>         "MATCH (f:Form {name: $form})-[:REQUIRES]->(c:Constraint) RETURN c"
>     )
>     
>     # Step 2: Get semantic associations
>     themes = graph.query(
>         "MATCH (m:Meter {name: $meter})-[:ASSOCIATES]->(t:Theme) RETURN t"
>     )
>     
>     # Step 3: Build rhyme candidates
>     rhyme_structure = parse_rhyme_scheme(form.rhyme_scheme)
>     rhyme_candidates = {}
>     for family in rhyme_structure.families:
>         rhyme_candidates[family] = graph.query(
>             "MATCH (r1:RhymeWord)-[:RHYMES_WITH]->(r2:RhymeWord) "
>             "WHERE r1.stress_pattern ~ $pattern "
>             "RETURN r2 LIMIT 20",
>             pattern=meter.pattern
>         )
>     
>     # Step 4: Get examples
>     examples = graph.query(
>         "MATCH (e:Example)-[:ILLUSTRATES]->(f:Form {name: $form}) "
>         "RETURN e ORDER BY e.quality_score DESC LIMIT 3"
>     )
>     
>     return {
>         "constraints": constraints,
>         "themes": themes,
>         "rhyme_candidates": rhyme_candidates,
>         "examples": examples
>     }
> ```
> 
> ### C. Line-by-Line Generation Flow
> 
> ```
> GENERATION_PIPELINE:
>   
>   1. FORM_RESOLUTION
>      Input: form_name, meter_name, foot_name
>      Output: LineTemplate[lines]
>      Process:
>        - Query graph for form structure
>        - Resolve rhyme families
>        - Identify repetition requirements
>        - Build template with constraint annotations
>   
>   2. ANCHOR_GENERATION
>      Input: LineTemplate, theme, rhyme_candidates
>      Output: AnchorLines[]
>      Process:
>        - Generate lines with repetition requirements first (A1, A2, B1)
>        - Validate against constraints
>        - Store for reuse
>   
>   3. DEPENDENT_GENERATION
>      Input: AnchorLines, LineTemplate, rhyme_candidates
>      Output: FullDraft
>      Process:
>        - For each line in order:
>          a. Retrieve rhyme word candidates from graph
>          b. Match stress pattern against meter
>          c. Generate with theme + retrieved context
>          d. Validate syllable count and stress
>          e. If fail, re-generate with feedback
>   
>   4. VALIDATION
>      Input: FullDraft
>      Output: ValidationReport
>      Process:
>        - Count syllables per line
>        - Verify rhyme scheme
>        - Check repetition fidelity
>        - Score meter adherence
>        - Return report with scores
>   
>   5. REFINEMENT
>      Input: FullDraft, ValidationReport
>      Output: RefinedDraft
>      Process:
>        - Identify violations
>        - For each violation:
>          a. Retrieve alternative rhyme candidates
>          b. Generate replacement
>          c. Re-validate
>        - Iterate until score threshold met
> ```
> 
> ---
> 
> ## XI. VALIDATION & SCORING METRICS
> 
> ### A. Multi-Dimensional Quality Assessment
> 
> ```python
> class VerseQuality:
>     def __init__(self, poem, form, meter, foot):
>         self.syllable_score = self.score_syllables()
>         self.meter_score = self.score_meter()
>         self.rhyme_score = self.score_rhyme()
>         self.repetition_score = self.score_repetition()
>         self.semantic_score = self.score_semantics()
>         self.overall = self.compute_overall()
>     
>     def score_syllables(self):
>         """Check if line syllable counts match form requirements"""
>         expected = self.form.expected_syllables(self.meter, self.foot)
>         actual = [count_syllables(line) for line in self.poem.lines]
>         deviations = [abs(e - a) for e, a in zip(expected, actual)]
>         return 1 - (sum(deviations) / len(deviations))
>     
>     def score_meter(self):
>         """Use Mirapolsky distance metric"""
>         expected_pattern = self.meter.pattern * self.foot.multiplier
>         scores = []
>         for line in self.poem.lines:
>             actual = extract_stress_pattern(line)
>             distance = metrical_distance(expected_pattern, actual)
>             scores.append(1 - distance)
>         return mean(scores)
>     
>     def score_rhyme(self):
>         """Verify rhyme scheme compliance"""
>         scheme = parse_rhyme_scheme(self.form.rhyme_scheme)
>         actual_endings = [get_phonetic_ending(line) for line in self.poem.lines]
>         
>         family_scores = []
>         for family, indices in scheme.families.items():
>             endings = [actual_endings[i] for i in indices]
>             if family.is_uppercase():  # Repetition required
>                 family_scores.append(score_identical(endings))
>             else:
>                 family_scores.append(score_rhyme_family(endings))
>         
>         return mean(family_scores)
>     
>     def score_repetition(self):
>         """Check verbatim or near-verbatim repetition"""
>         repetition_rules = self.form.repetition_rules
>         scores = []
>         for rule in repetition_rules:
>             source = self.poem.lines[rule.source]
>             targets = [self.poem.lines[t] for t in rule.targets]
>             for target in targets:
>                 if rule.constraint == "verbatim":
>                     scores.append(1.0 if source == target else 0.0)
>                 elif rule.constraint == "semantic":
>                     scores.append(semantic_similarity(source, target))
>         return mean(scores) if scores else 1.0
>     
>     def score_semantics(self):
>         """Evaluate thematic coherence"""
>         # Use topic model or embedding similarity
>         theme_embedding = get_theme_embedding(self.poem.theme)
>         line_embeddings = [get_embedding(line) for line in self.poem.lines]
>         similarities = [cosine_similarity(theme_embedding, e) for e in line_embeddings]
>         return mean(similarities)
>     
>     def compute_overall(self):
>         weights = {
>             'syllable': 0.2,
>             'meter': 0.25,
>             'rhyme': 0.25,
>             'repetition': 0.15,
>             'semantic': 0.15
>         }
>         return sum(
>             getattr(self, f"{k}_score") * v 
>             for k, v in weights.items()
>         )
> ```
> 
> ### B. Feedback Generation for Refinement
> 
> ```python
> def generate_feedback(validation_report):
>     feedback = []
>     
>     if validation_report.syllable_score < 0.9:
>         violations = find_syllable_violations(validation_report)
>         for line_idx, expected, actual in violations:
>             feedback.append({
>                 "line": line_idx,
>                 "issue": "syllable_count",
>                 "expected": expected,
>                 "actual": actual,
>                 "action": f"Adjust line {line_idx+1} to have {expected} syllables"
>             })
>     
>     if validation_report.meter_score < 0.85:
>         violations = find_stress_violations(validation_report)
>         for line_idx, expected_pattern, actual_pattern in violations:
>             feedback.append({
>                 "line": line_idx,
>                 "issue": "meter_violation",
>                 "expected_pattern": expected_pattern,
>                 "actual_pattern": actual_pattern,
>                 "action": f"Revise line {line_idx+1} to match {expected_pattern}"
>             })
>     
>     if validation_report.rhyme_score < 0.9:
>         violations = find_rhyme_violations(validation_report)
>         for line_idx, family, expected_rhyme in violations:
>             alternatives = graph.query_rhyme_alternatives(
>                 family, expected_rhyme, limit=5
>             )
>             feedback.append({
>                 "line": line_idx,
>                 "issue": "rhyme_mismatch",
>                 "family": family,
>                 "alternatives": alternatives,
>                 "action": f"Consider ending line {line_idx+1} with: {alternatives}"
>             })
>     
>     return feedback
> ```
> 
> ---
> 
> ## XII. PRAGMATIC GUIDELINES FOR THE AGENT
> 
> ### A. Before Generation
> 
> 1. **Query the form's constraint graph** — never assume; retrieve explicit requirements
> 2. **Retrieve semantic associations** for the selected meter — align theme accordingly
> 3. **Pre-compute rhyme families** — build candidate pools before line-by-line generation
> 4. **Identify anchor lines** — generate constrained lines (repetitions) first
> 
> ### B. During Generation
> 
> 1. **One line at a time** — do not batch-generate and hope for coherence
> 2. **Retrieve context per slot** — rhyme candidates, stress-matched vocabulary, thematic phrases
> 3. **Use the rhyme index** — never invent rhymes without phonetic verification
> 4. **Check syllable count** immediately after generation
> 5. **Validate stress pattern** before accepting
> 
> ### C. After Generation
> 
> 1. **Score multi-dimensionally** — never accept on "feels right"
> 2. **Generate targeted feedback** — specific violations lead to specific fixes
> 3. **Iterate on failures** — replace only failing lines, not wholesale
> 4. **Preserve successes** — do not re-generate lines that pass validation
> 
> ### D. Quality Thresholds
> 
> ```
> ACCEPTANCE_CRITERIA:
>   syllable_score: ≥ 0.95
>   meter_score: ≥ 0.85
>   rhyme_score: ≥ 0.90
>   repetition_score: ≥ 0.95 (for verbatim) or ≥ 0.80 (for variation)
>   semantic_score: ≥ 0.70 (flexible for creative work)
>   overall: ≥ 0.85
> ```
> 
> ---
> 
> ## XIII. KNOWLEDGE CODA: WHAT THE AGENT MUST KNOW
> 
> ### The Eight Pillars of Versification Wisdom
> 
> **I. COUNTING IS PRIMARY**
> Meter begins with counting. Rhythm follows. Never conflate the two.
> 
> **II. CONSTRAINTS ARE HIERARCHICAL**
> Some are constitutive (inviolable). Some are implied (negotiable). Know which is which.
> 
> **III. SYLLABLES HAVE WEIGHT**
> Heavy syllables resist compression. Light syllables permit flexibility. Use this.
> 
> **IV. FORMS ENCODE HISTORY**
> Every form carries its semantic halo. Rare forms retain concentrated associations. Common forms diffuse.
> 
> **V. RHYME IS PHONETIC, NOT ORTHOGRAPHIC**
> Perfect rhyme matches phonemes. Slant rhyme matches proximity. Eye rhyme is visual only.
> 
> **VI. REPETITION HAS STRUCTURE**
> Identical repetition is strict. Variation permits play. Know the form's requirements.
> 
> **VII. TENDENCIES ARE PRAGMATIC**
> Monosyllable placement, rhythmic approximation — these are inferred, not generated.
> 
> **VIII. VALIDATION IS EXTERNAL**
> The LLM cannot judge its own output perfectly. External scoring is required.
> 
> ---
> 
> ## XIV. SAMPLE PROMPT SCAFFOLD
> 
> When generating verse, the agent should receive structured context:
> 
> ```markdown
> ## VERSE GENERATION CONTEXT
> 
> ### Form: {form_name}
> - Lines: {line_count}
> - Rhyme Scheme: {rhyme_scheme}
> - Special Rules: {rules}
> - Difficulty: {difficulty_score}
> 
> ### Meter: {meter_name}
> - Pattern: {stress_pattern}
> - Foot Multiplier: {multiplier}
> - Expected Syllables per Line: {expected_syllables}
> 
> ### Constraints for This Line (Line {N}):
> - Rhyme Family: {family}
> - Rhyme Candidates: {candidate_words}
> - Stress Pattern: {meter_pattern_for_this_line}
> - Repetition: {repetition_requirement_if_any}
> 
> ### Semantic Context:
> - Theme: {theme}
> - Meter Associations: {semantic_tendencies}
> - Imagery Suggestions: {imagery_clusters}
> 
> ### Quality Requirements:
> - Syllable Count: Must be {expected_count}
> - Stress Pattern: Must approximate {pattern}
> - Rhyme: Must rhyme with {rhyme_family_members}
> - Repetition: {verbatim/variation/none}
> 
> ### Generate:
> A single line that satisfies all constraints while remaining poetically inventive.
> ```
> 
> ---
> 
> ## XV. FINAL SYNTHESIS
> 
> The knowledge graph presented here serves as the **grounding layer** for the agentic poet. It encodes:
> 
> 1. **Formal knowledge** — the rules, constraints, and architectures of verse
> 2. **Phonetic knowledge** — syllable weights, durations, rhyme relationships
> 3. **Semantic knowledge** — meter-meaning associations, thematic clusters
> 4. **Procedural knowledge** — generation pipelines, validation strategies
> 
> The agent that draws from this graph will not merely *guess* at verse—it will **compose** with awareness of tradition, constraint, and craft. It will know that a villanelle demands exact repetition, that anapests convey energy, that heavy syllables cannot be rushed, that semantic halos accumulate over centuries.
> 
> And it will know, most importantly, that verse is **both art and architecture**—feeling and form intertwined, each informing the other, each demanding the other's presence.
> 
> *This is the knowledge the agent requires. This is the foundation upon which it shall build its verses.*
> 
> ---
> 
> *End of Knowledge Graph Foundation Document*
