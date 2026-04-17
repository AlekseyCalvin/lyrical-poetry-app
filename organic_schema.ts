import { z } from "zod";
import { DIVERGENCE_TYPES, RHYME_TYPES } from './meter_exemplars.js';

export interface MetricalAssemblyWord {
  word: string;
  phonetic_syllables: string[];
  lexical_stress: string[];
  grid_alignment: string[];
  divergence_type: string;
}

export interface OrganicPoemResult {
  semantic_arc: string;
  lines: Array<{
    line_id: string;
    rhyme_concept: string;
    syllable_count: number;
    end_word: string;
    rhyme_type: string;
    conventional_metrical_grid: string[];
    divergences_used: string[];
    text: string;
  }>;
}

/**
 * Builds a dynamic OpenRouter response_format schema for a specific stanza blueprint.
 * We force the LLM to output an exact number of lines matching the stanza.
 */
export function buildOrganicPoemSchema(numberOfLines: number, strictMode: boolean = true) {
  return {
    type: "json_schema",
    ...(strictMode ? { strict: true } : {}),
    json_schema: {
      name: "organic_poem",
      description: "Chronological organic composition of a poem with Fabb-Halle and Optimality Theory constraints using Multi-Grid Scansion",
      schema: {
        type: "object",
        properties: {
          semantic_arc: {
            type: "string",
            description: "A brief summary of the thematic progression of this stanza or poem."
          },
          lines: {
            type: "array",
            description: "The poetry lines, generated chronologically. Must be exactly the required length.",
            items: {
              type: "object",
              properties: {
                line_id: { type: "string", description: "Line identifier, e.g., L1, L2" },
                rhyme_concept: { type: "string", description: "The intended rhyme group, e.g., 'A'" },
                syllable_count: { type: "integer", description: "EXPLICIT syllable count of this line. Must equal the target." },
                end_word: { type: "string", description: "The last word of this line (for rhyme validation)." },
                rhyme_type: {
                  type: "string",
                  enum: [...RHYME_TYPES],
                  description: "What kind of rhyme this end-word makes with its rhyme family: perfect, slant, feminine, masculine, assonant, consonant, eye, light, wrenched, broken, mosaic, rich, internal, or identical."
                },
                conventional_metrical_grid: {
                  type: "array",
                  items: { type: "string" },
                  description: "The pure target blueprint grid for this line, e.g., ['W', 'S', 'W', 'S']"
                },
                divergences_used: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: [...DIVERGENCE_TYPES]
                  },
                  description: "Prosodic divergences organically embedded: trochaic_inversion, spondaic_substitution, pyrrhic_substitution, anacrusis, catalexis, feminine_ending, acephalous, elision, caesura_shift, stress_demotion, stress_promotion, ionic_substitution, choriambic_substitution, wrenched_stress, or none."
                },
                text: { type: "string", description: "The finalized line text formed by organic composition." }
              },
              required: [
                "line_id", "rhyme_concept", "syllable_count", "end_word", "rhyme_type",
                "conventional_metrical_grid", "divergences_used", "text"
              ],
              additionalProperties: false
            }
          }
        },
        required: ["semantic_arc", "lines"],
        additionalProperties: false
      }
    }
  };
}
