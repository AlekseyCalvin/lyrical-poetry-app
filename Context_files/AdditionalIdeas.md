This would solve half the current confusion.

⸻

Quality control: anti-cliché system

You also need a cheap but effective anti-banality layer.

Add local blacklist/penalty for:
• light, night, day, heart, soul, dream, gleam, above, love, fire, desire
• “eternal [noun]”
• “whispers in the dark”
• “fate’s cruel hand”
• “burning heart”
• “morning sun”
• similar stale stock phrases

Do not fully forbid all of them in all contexts, but strongly penalize them.

Ask model for:
• image field
• lexical field
• emotional register
• syntactic texture

This helps style.

⸻

What to do with Poetry MCP server

Yes, you should learn from it more.
But not necessarily depend on the remote server in production.

Learn from Poetry MCP:
• dictionary-first grounding
• phonetic validation
• rhyme detection from phoneme endings
• meter analysis from stress sequence
• tool-oriented architecture

Prefer local over remote where possible:
Because:
• less latency
• more deterministic
• fewer integration failures
• better for Tauri desktop app

Use remote Poetry MCP only if:
• you want an additional optional validation oracle
• or a fallback analysis service

Not as your main line-by-line production dependency.

⸻

Best practical route from here

If I were guiding the next implementation cycle, I would recommend this order:

Phase A — stabilize architecture
1. Make registries​.ts authoritative.
2. Add explicit repetition metadata.
3. Add stanza-break metadata everywhere.
4. Add rhyme family distinctness rules.

Phase B — rebuild compose pipeline
1. symbolic blueprint compiler
2. Instructor-backed plan generation
3. line-slot executor
4. local CMU validation
5. score-based best-of selection

Phase C — improve lexical quality
1. thematic end-word discovery
2. cliché blacklist
3. semantic diversity scoring
4. style-guided rewrite pass

Phase D — improve UI honesty
1. show compliance score
2. show where meter deviates
3. show stanza breaks correctly
4. distinguish primary vs secondary stress

Phase E — only then evaluate extra frameworks
• Outlines
• llguidance
• CoTRAG
• remote MCP use
• RAG primer

Because if the architecture is wrong, those tools won’t save it.

⸻

My recommendation on frameworks

Strongly recommend keeping
• CMU local grounding
• Instructor-js
• Zod
• your React/Tauri/OpenRouter setup

Recommend adding
• explicit symbolic line-slot IR
• score-based candidate selection
• phrase/foot chunk generation for tri-syllabic meters
• anti-cliché lexical filter
• rhyme-family distance validator

Maybe add later
• Outlines / llguidance for blueprint-level grammar
• RAG primer for stylistic sophistication and poetics rules
• IPA fallback integration
• optional remote Poetry MCP cross-check

Do not do first
• giant CFG over final poem text
• all-at-once whole-poem constrained generation
• hard error-only failure modes
• simplistic rhyme seeding

⸻

Most important strategic insight

Your problem is not “how do I constrain the LLM harder?”

It is:

how do I move formal truth out of the LLM and into a symbolic, dictionary-backed intermediate system, while leaving the LLM responsible for semantic richness, imagery, local phrasing, and stylistic invention?

That is the real design question.

And that is the route most likely to work.

If you want, next I can do one of two things:

1. give you a concrete revised backend architecture in prose with file-by-file responsibilities, or
2. draft a replacement server.ts pipeline design plus revised registries​.ts / schemas​.ts structures tailored to your current app.