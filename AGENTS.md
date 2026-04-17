# LYRICAL: The Poetry App - Agent Guide & Architecture Synopsis

## 1. Project Characteristics & Aims
- **Name**: LYRICAL — The Poetry App
- **Primary Objective**: Provide a robust, beautifully designed multilingual poetry composition, scansion, and translation-comparison tool.
- **Key Proposition**: Empower users—whether novices or seasoned poets—to explore, compose, and visualize highly structured verse forms (e.g., Odes, Madrigals, Sestinas, Acrostics) strictly adhering to metrical (iambic, trochaic, etc.), foot (pentameter, trimeter, etc.), and rhyme constraints.
- **Aesthetic**: A rich, dark, immersive, "magical" UI/UX featuring high-quality background imagery, dynamic "misty trails" that materialize into poem lines, intuitive dropdowns, and elegant typography (Fraunces, Libre Baskerville, Marcellus, etc.).

## 2. Application Architecture
### Frontend (UI/UX)
- **Tech Stack**: React, TypeScript, Vite, Tailwind CSS.
- **Core Components**:
  - `App.tsx`: Main layout, context provider, reset and settings menu functionality.
  - `PoemGenerator.tsx`: The heart of the Compose tab. Handles user selections (Meter, Foot, Form, Theme/Acrostic), triggers API requests, maps dynamic misty trails to specific verse sizes, and orchestrates the syllable-by-syllable rendering with scansion diacritics.
  - `Visualizer.tsx`, `PoemAnalyzer.tsx`, `TranslationComparator.tsx`: Pre-existing modules for analysis and comparing structural fidelities between original poems and translations.
  - `SettingsModal.tsx`: Interface for plugging in custom LLM API keys, Base URLs (e.g., OpenRouter), and custom model names.

### Backend & Desktop Wrapper
- **Tech Stack**: Node.js/Express (`server.ts`), Tauri (Rust-based macOS wrapper).
- **Core Services**: 
  - `server.ts`: Listens on port 3001 (or dynamically), handles `/api/compose` requests. Interprets frontend form selections, constructs prompts, interacts with the LLM via API parameters, and mathematically/phonetically validates rhyme and meter using local data.
  - Tauri (`src-tauri` directory): Embeds the frontend UI as a Mac executable `.app` / `.dmg` and spawns the Node.js backend as a sidecar/subprocess or concurrent process upon launch.

## 3. Core Mechanics & Dictionaries
- **Dictionaries & Data**: 
  - `cmudict.json` / `poetry_engine.ts`: Uses the Carnegie Mellon University Pronouncing Dictionary to resolve phonemes, stress patterns, and syllable boundaries natively.
  - `registries.ts`: Hardcoded, meticulously mapped constants defining rules for formal generation. Includes `METER_REGISTRY` (Trochaic, Anapestic, etc.), `FOOT_REGISTRY` (Pentameter, Trimeter, etc.), and `FORM_REGISTRY` (Odes, Rondeaus, Sonnets, Madrigals, etc.).
  - `schemas.ts`: Expected JSON output interfaces/Zod validation rules linking raw LLM data to typed objects like `{ text, syllables, rhyme }`.

### The Core Challenge & Evolution of Generation Mechanisms
- **Goal**: Generate poems that are completely compliant with classic prosody rules regarding exact syllable counts, stress patterns (scansion marks like ´ and ˘), and exact end-line/internal rhyme schemes.
- **Past Attempt 1 (Instructor/Zod 1-Shot)**: Over-relied on a faulty, insufficiently thought-out and dynamic JSON enforcement schema using Instructor/Zod. One of the trajectories henceforth is to compose a more sophisticated schema to accomodate for the full range of app-supported poetic constraints, styles, forms, and devices, whilst preserving or empowering the baseline creativity and adaptability of the Poet generative agent. Prior implementation attempts may have failed because the prior schemas lacked sufficient context-grounded information, directions, clarity, or built-in conditioning formulations optimal for fostering an adaptive approach to composition: on one hand, to elaborate specific and comprehensive guidance map, with ranges, recipes, and biases/suggestions for every formal poem configuration combination; on the other, encouraging the model to be creative, sophisticated, original, experimental, and inventive in all ways and contexts not bounded by schematized or explicitly prompted constraints. We must also account for the reality that LLMs may falter under JSON boundaries without deep internal scratchpads or granular native validation loops.
- **Past Attempt 2 (While-Loop / Self-Refine)**: Instructed the model natively via `<draft>` and `<think>` tags, then validated the prosody locally on the backend via CMU dict, feeding errors back into a self-refine conversational loop (up to 3 tries). 
  - *Result*: Unreliable. The model failed to genuinely align complex parameters (like Anapestic Trimeter Madrigals) or handle basic syllabification appropriately within standard textual tokens (e.g., treating multi-syllable words as single syllables). It led to misaligned UI rendering and frequent fallback error crashes.

## 4. Current Directive & Future Strategy (Symbolic Grammars)
The user explicitly rejects naive "while loops" or basic prompt-based self-refinement for this problem domain.

**The Solution Trajectory (Line-by-Line Assembly Engine):**
The project is shifting away from blindly trusting the LLM to understand rigid phonetics. Instead, it is emphasizing trying to comprehensively, strategically, optimally, and effectively implement **Symbolic Grammars & Constraints** via an Assembly Engine in `server.ts`, or/and by other means.
- **Constraint-Based Micro-Tasking**: Instead of letting the LLM generate arbitrary text and validating post-hoc, the backend must define and refine robust, specialized, and adaptive scaffolding. Presetly, `buildPoemSkeleton` pre-calculates the requisite semantic constraints, syllables, exact binary metrical rhythms (such as Iambic `da DUM da DUM` and Trochaic `DA dum DA dum`, Pyrrhic `da-da da-da`, and Spondaic `DUM DUM DUM DUM`), as well as structural end-rhymes (arrangements of `A`, `B`, `C`, `...` or/and `a`, `b`, `c`, `...` line ends).
- The project must more thoroughly and reliably accomodate triple metrical rhythms (such as Dactylic `DUM da da DUM da da`, Amphibrachic `da DUM da da DUM da`, Anapestic `da da DUM da da DUM`, and Bacchic `DUM DUM da DUM DUM da`) and complex forms, such as the Madrigal, Rondeau, and Villanelle, which are already implemented in the code base, but must be integrated into the generative schemas and broader workflow with more descriptively nuanced, methodically comprehensive, and creatively fruitful consideration for their respective mechanics and specificities (which may involve not only refining formal constraints, but also integrating more historical, cultural, and literary context, such as  demonstrative referents from the poetic canon).
- **Dynamic Thematic Targeting**: To avoid deterministic repetition and mechanistic output, the engine must *not* excessively rely on static, pre-calculated CMU rhyme banks. Instead, we ought to model more sophisticated mechanics. One *potential* idea: when establishing a fresh rhyme scheme (e.g. `A`), the LLM is prompted to output a single evocative end-word thematically linked to the user's prompt. That distinct word is stored in state. This plan may be: either taken as a starting point in developing a more dynamic framework, or/and evaluated against other strategies/methodologies, or/and retained as a fallback if opting for some other approach.
- **Slant Rhyme Tolerance**: For subsequent dependent tokens, such as rhyme or/and repetition end-lines (e.g. `A1`, `a`), the LLM is forced to target words that rhyme or fuzzily/half-rhyme natively with the established semantic seed. The engine may reward strict perfect internal rhymes, but should also reward/tolerate LLM-chosen slant/imperfect rhymes, multi-syllable rhymes, multi-word rhymes, syntactically flexible rhymes (e.g. the last word of one line rhyming with the second-to-last word of another line), etc, so as to guarantee linguistic sophistication over rigid, banal matching.
- **Fallback Distancing**: When lines fail 3 parsing attempts entirely, the fallback word injected by the server to prevent UI crashes uses `findRhymesFor` to fetch a rhyme. Crucially: we must first extract the rhyme-portion of the word's phones, and run the search on the rhyming part, rather than than the entire word, so as to broaden the window of candidates. It may be better, however, to exclude the origin rhyme word from becoming selected out of the list of candidate words for the target rhyme slot, so that complex forms like Madrigal's `A1`, `a` do not erroneously duplicate strings natively.

## 5. Workflows & Guidelines for Agents
1. **Never Assume Strict Compliance from Vanilla LLMs**: Standard autoregressive models do not "hear" syllables. They predict sub-word tokens. Attempting to force exact syllable stresses via plain-text prompts would likely fail without algorithmic intervention.
2. **Consult Registers**: Always reference `registries.ts` for form constraints and `cmudict.json` for phonetic ground truth.
3. **Protect the UI/UX**: Ensure the "misty trails" dynamic CSS, dark-theme styling, single-page scroll layout, and font configurations remain untouched and immaculate unless directly augmenting them.
4. **Log Diligently**: When changing core architecture, document trajectories extensively. Make backups of core scripts whenever possible. 
5. **No Auto-Responses on API Failures**: Do not fallback to "cowardly" error messages if constraints partially fail — always endeavor to present a *closest* semantic match, or explicitly reconstruct the pipeline so algorithmic failure isn't catastrophic to the user experience.
6. **Tool Prudence**: Do not swap models (e.g., to Gemini Flash) randomly. Comply with User's preferred models (e.g., Arcee Trinity Large via OpenRouter).

## 6. Directory / Important Files Checklist
- `/src/components/PoemGenerator.tsx` (Core visual & integration UI component).
- `server.ts` (Backend orchestrator; currently holds the flawed "while-loop" generation).
- `poetry_engine.ts` (Core logic for mapping CMU dict sounds to vowels/stresses).
- `schemas.ts` & `registries.ts` (Rulesets).
- `Prompts_log.md`, `Fixing Poetry Mechanics.md` (Crucial historical context and user design dictations).
- `LYRICAL-Framework-for-Structured-Agentic-Poetry-Generation.md`, `Ontology-to-Tools-Enforcement-for-LYRICAL-Generative-Poetics.md` (Promising methodological insights/advice for to the project, with proposals for new specialized JSON schemas, as well as a range of development plausible trajectories).
- `ZOD_and_InstructorJS_guide.md` (a concise guide and reference to ZOD primitives, schema structuring, instruction formulations, etc)
- `Open_Router_Tool_Calling.md`, `OpenRouterStructuredOutputs.md` `Open_Router_Response_Healing.md`, `OpenRouterMCPServerUse.md` (topical documentation for formulating Open Router API inference queries, including guides for: 1. defining, formatting, implementing, or adopting tools and function calls; 2. formatting JSON schemas/objects and keying in input structures aimed at programmatically or dynamically structured outputs; 3. Open Router's automated response healing feature, which repairs malformatted JSON schemas; 4. integrating custom MCP server functions, tools, and operations into the Open Router call itself)

```npm install aparrish/pronouncingjs```) : 

```

const pronouncing = require('pronouncing'); 
> let rhymePart = pronouncing.rhymingPart(phonesForWord("word"))[0];
> pronouncing.search(rhymePart + "$")

```)

```