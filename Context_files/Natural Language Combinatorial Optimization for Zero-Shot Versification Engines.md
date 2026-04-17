**LYRICAL FRAMEWORK ADVICE GUIDE III**

To architect a zero-shot, single-call versification engine that bypasses the need for piecemeal multi-agent orchestration, we must fundamentally hack the autoregressive nature of Large Language Models. By framing poetry generation not as a free-text completion task, but as a **Natural Language Combinatorial Optimization (NLCO)** problem 1, we can force the LLM to mathematically "solve" the poem's prosody within the latent space of a single, massive JSON schema.  
Drawing exclusively from the academic corpus provided and the core architecture of your LYRICAL app (specifically the constraints in registries.ts), this approach transforms metrical rules from passive, post-hoc constraints into active, token-by-token generative guidance 2\.  
Here is the hyper-methodology for a unified, combinatorial Zod/JSON schema, grounded in rigorous verse theory.

### 1\. Theoretical Axioms for the Combinatorial Schema

To make a single-shot schema fool-proof, it must force the LLM to structurally abide by the philological and computational realities of verse before a single word is outputted. We encode three academic axioms directly into the schema's ordering:  
**Axiom A: Counting Precedes Rhythm (The Fabb Principle)**Nigel Fabb’s Bracketed Grid Theory argues that the fundamental basis of all metrical verse is *counting*, not rhythm 3\. If rhythm were fundamental, prose could be metrical; but because counting is fundamental, text must be divided into exact boundaries 3\.*Schema Hack:* The schema will absolutely forbid the LLM from generating a poetic line as a continuous string. Instead, it must instantiate an array of syllable objects whose exact length is locked mathematically to your FOOT\_REGISTRY and METER\_REGISTRY prior to generation 4\.  
**Axiom B: Statistical Stress Profiling (The Taranovsky Distribution)**As Kiril Taranovsky and Marina Tarlinskaja have demonstrated, modern binary meters do not feature flat "da-DUM da-DUM" stresses; they possess distinct statistical "stress profiles" 5, 6\. In the Russian (and largely English) iambic tetrameter, the penultimate ictus (the 3rd strong beat) is statistically the weakest, while the final ictus is a constant 100% stress 5, 7\.*Schema Hack:* We inject a target\_stress\_profile parameter for each line. This acts as a "soft constraint," guiding the LLM to drop secondary/primary stresses on specific metrical feet (e.g., forcing a pyrrhic substitution) to prevent the output from sounding like a mechanical metronome, thereby recovering the natural "semantic halo" of the meter 8\.  
**Axiom C: The "FIT" Principle (Hanson & Kiparsky)**Parametric theories of meter dictate that a language selects meters that allow its vocabulary to fit efficiently into binary or ternary structures 9, 10\.*Schema Hack:* We force the LLM to emulate the internal logic of Pronouncingjs by declaring the anticipated CMU dictionary stress token (0, 1, 2\) *before* it generates the syllable text 11\. By forcing the token prediction sequence to be \[Metrical Position\] \-\> \[CMU Stress\] \-\> \[Syllable Text\], the LLM’s attention mechanism is mathematically cornered into satisfying the FIT principle.

### 2\. The "NLCO Master Harness" (Zod Schema)

This schema is designed to be passed to an OpenRouter frontier model (like Arcee Trinity or Claude 3.5 Sonnet) using strict: true JSON structured outputs. It executes a complete Lexicalized Tree Adjoining Grammar (LTAG) state-space search 12 within a single inference call.  
import { z } from "zod";

export const ZeroShotCombinatorialPoetSchema \= z.object({  
    
  // PHASE 1: MACRO-PLANNING & ONTOLOGY  
  // The LLM must explicitly acknowledge the mathematical boundaries of the request.  
  architectural\_blueprint: z.object({  
    theme\_domain: z.string(),  
    form\_identification: z.string().describe("e.g., 'Lucubration', 'Pantoum'"),  
    global\_syllables\_per\_line: z.number().describe("Fabb's Law: Counting precedes rhythm. Exact integer required."),  
    stanza\_and\_rhyme\_matrix: z.array(z.string()).describe("Array of line designators, e.g., \['A1', 'B', 'A2', 'B'\] for Villanelle.")  
  }),

  // PHASE 2: THE LATENT 'PRONOUNCING.JS' RHYME DICTIONARY  
  // Solves the "cliché/monotony" problem by forcing the LLM to establish a rich phonetic search space first.  
  phonetic\_lexicon\_anchors: z.array(z.object({  
    rhyme\_family: z.string().describe("e.g., 'A', 'B', 'C'"),  
    cmu\_vowel\_target: z.string().describe("The exact CMU phoneme targeted (e.g., 'EH1 R', 'IY0')."),  
    slant\_rhyme\_tolerance: z.boolean().describe("If true, allows phonologically adjacent endings to prevent clichés."),  
    candidate\_lexicon: z.array(z.string())  
      .length(8)  
      .describe("8 highly evocative, non-cliché words sharing this phonetic ending. DO NOT use 'light/night/bright'.")  
  })),

  // PHASE 3: COMBINATORIAL LINE SYNTHESIS (The LTAG Matrix)  
  // This is the core hack. The LLM cannot write a line freely; it must build it syllable-by-syllable.  
  poem\_grid: z.array(z.object({  
    line\_index: z.number(),  
    stanza\_index: z.number(),  
    rhyme\_designator: z.string(),  
      
    // REPETITION SOLVER: For forms like Madrigal or Lucubration  
    exact\_repetition\_pointer: z.number().nullable()  
      .describe("If this line is a structural refrain (e.g., A1, B2), output the line\_index of the source line to copy. Else, null."),

    // TARANOVSKY RHYTHMIC IMPULSE  
    statistical\_stress\_profile: z.array(z.number())  
      .describe("Target strength of each ictus. e.g., \[13-16\] forces a naturalistic drop on the penultimate beat."),

    // BRACKETED GRID EXECUTION  
    // The array length must perfectly equal the requested foot \* meter multiplier.  
    syllabic\_scaffold: z.array(z.object({  
      position\_index: z.number(),  
      metrical\_role: z.enum(\["W", "S"\]).describe("Weak or Strong position in the abstract grid."),  
        
      // Emulating local CMU dict checking in the latent space  
      predicted\_cmu\_stress: z.enum(\["0", "1", "2"\])  
        .describe("0=unstressed, 1=primary, 2=secondary. Must align with metrical\_role per the FIT principle."),  
        
      syllable\_text: z.string()  
        .describe("A single orthographic syllable. NO HYPHENS. E.g., 'Star' (not 'Sta-r').")  
    })), // In production, use Zod's .length() constrained dynamically by your registries.ts

    // INTEGRATION & EVALUATION  
    prosodic\_check: z.object({  
      violates\_CLASH: z.boolean().describe("Are there two '1' stresses adjacent?"),  
      violates\_LAPSE: z.boolean().describe("Are there three '0' stresses adjacent?")  
    }),  
      
    assembled\_line: z.string().describe("The syllables joined into a final, punctuated string.")  
  }))  
});

### 3\. How This Hacks the Generation Process

By utilizing this single, massive JSON schema via OpenRouter's structured outputs, you completely bypass the "generate \-\> fail \-\> retry" loop and the multi-agent latency overhead. Here is why this specific structural ordering works based on the literature:

1. **Forced Phonological Preparation:** By placing phonetic\_lexicon\_anchors *before* the poem\_grid, you force the LLM to pre-compute its rhyming vocabulary across the entire poem before it is allowed to write a single line. It is instructed to generate an array of 8 words tied to a specific cmu\_vowel\_target (mimicking Pronouncing.js). Because it has to generate 8 words per rhyme family, it quickly exhausts the clichés ("light/night") and is forced to explore deeper into the semantic space 8, generating highly original vocabulary that it is then "locked" into using during the grid phase.  
2. **The "Pointer" Solution for Refrains:** For arcane forms with exact repetitions (Madrigals, Villanelles, Pantoums), you previously faced the issue of the LLM hallucinating variations. By using exact\_repetition\_pointer, you cast the generation as a graph 17\. The LLM explicitly declares "this line points to line\_index 1." You can then use a tiny post-processing script in your Node backend to mathematically overwrite the text of the current line with the exact text of the pointed line, guaranteeing 100% adherence to complex stanzaic looping.  
3. **Sub-Word Attention Masking:** In previous iterations, the LLM failed at scansion because it generated whole words and then failed to retroactively fit them to the meter. By forcing the sequence metrical\_role (W/S) \-\> predicted\_cmu\_stress (0/1/2) \-\> syllable\_text, the LLM must first commit to a linguistic constraint 9\. Once it outputs "predicted\_cmu\_stress": "1", its attention mechanism is mathematically biased toward outputting a heavy/stressed syllable for the syllable\_text. This perfectly bridges the gap between your poetry\_engine.ts logic and the LLM's latent space, effectively making the LLM act as its own Pronouncing.js server 11\.

This zero-shot framework leverages **compositional reasoning**. By breaking the poetic artifact down into its absolute smallest phonological and mathematical atoms *within the JSON keys themselves*, the frontier model is prevented from taking "shortcuts" that lead to metrical failure, resulting in highly creative, computationally perfect verse in a single pass.  
