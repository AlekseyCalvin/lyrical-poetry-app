import { z } from "zod";
import { METER_REGISTRY, FOOT_REGISTRY, FORM_REGISTRY } from "./registries.js";

// 1. Dynamic Drafting Schema (SCoT Enforced)
export function buildDynamicDraftSchema(formKey: string, meterKey: string, footKey: string) {
  const formDef = FORM_REGISTRY[formKey];
  const meterDef = METER_REGISTRY[meterKey];
  const footDef = FOOT_REGISTRY[footKey];

  const targetBlueprint = Array(footDef.multiplier).fill(meterDef.pattern).join(" ");
  const targetSyllables = meterDef.pattern.replace(/ /g, "").length * footDef.multiplier;

  return z.object({
    theme: z.string(),
    lines: z.array(z.object({
      line_number: z.number(),
      target_rhyme_designator: z.string().describe(`The exact letter/number from the scheme: ${formDef.rhyme_scheme}`),
      target_rhyme_sound: z.string().describe("Phonetic ending sound required. If exact repetition, put the sound of the repeated word."),
      exact_word_repetition: z.string().nullable().describe("If the scheme requires identicity (e.g., B1, A2, or Refrain), explicitly write the EXACT word to repeat here. Otherwise, null."),
      exact_line_repetition: z.number().nullable().describe("If the form (e.g., Pantoum, Villanelle) requires repeating an entire previous line, write the integer of that line number here. Otherwise, null."),
      phonetic_blueprint: z.string().describe(`MUST strictly be exactly: '${targetBlueprint}'`),
      syllable_count: z.number().describe(`MUST strictly be exactly: ${targetSyllables}`),
      text: z.string().describe("The generated line. If exact_line_repetition is not null, this MUST perfectly match the referenced line.")
    }))
      .describe(`The ${formDef.lines} lines of the ${formKey}, following rules: ${formDef.rules}`)
  });
}

// 2. Analysis Schema
export const PoemAnalysisSchema = z.object({
  overall_compliance_score: z.number().min(0).max(100),
  misalignments: z.array(z.object({
    line_number: z.number(),
    error_type: z.enum(["METER_MISMATCH", "SYLLABLE_COUNT_ERROR", "RHYME_FAILURE", "IDENTICITY_FAILURE"]),
    description: z.string().describe("Detailed explanation of why the line fails formal constraints."),
    suggested_fix_strategy: z.string()
  })),
  needs_revision: z.boolean()
});

// 3. Revision Schema
export const PoemRevisionSchema = z.object({
  applied_corrections: z.array(z.string()).describe("Log of changes made utilizing the mandatory MCP vocabulary fixes."),
  final_poem_lines: z.array(z.string()).describe("The final, flawless lines of the poem.")
});