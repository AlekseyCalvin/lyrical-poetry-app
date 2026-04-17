import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";
import { analyzePoem, findRhymesFor, suggestWords } from "./poetry_engine";
import type { PoemAnalysis, RhymeResult, CmuDict } from "./poetry_engine";
import cmudict from "./cmudict.json";

const dict = cmudict as CmuDict;

// ---------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------

function formatWordBreakdown(words: PoemAnalysis["lines"][number]["words"]): string {
	return words
		.map((w) => {
			const syl = w.syllableCounts[0] ?? 1;
			return `${w.word}(${syl})`;
		})
		.join(" ");
}

function formatAnalysis(result: PoemAnalysis): string {
	const parts: string[] = [];

	parts.push("=== POETRY ANALYSIS ===");
	parts.push(`Meter: ${result.meter}`);
	parts.push("");

	for (const line of result.lines) {
		const sylRange =
			line.syllables[0] === line.syllables[1]
				? `${line.syllables[0]}`
				: `${line.syllables[0]}-${line.syllables[1]}`;
		const targetStr = line.target !== null ? ` (target: ${line.target})` : "";
		const sylCheck = line.syllableMatch ? " ✓" : " ✗";

		const stressStr = line.stressPattern || "(none)";
		const stressLabel =
			line.stressMatch === "full"
				? " ✓"
				: line.stressMatch === "partial"
					? " ~partial"
					: " ✗";

		parts.push(`LINE ${line.lineNum}: "${line.text}"`);
		parts.push(`  Syllables: ${sylRange}${sylCheck}${targetStr}`);
		parts.push(`  Stress: ${stressStr}${stressLabel}`);
		parts.push(`  Words: ${formatWordBreakdown(line.words)}`);

		if (line.problems.length > 0) {
			for (const p of line.problems) {
				if (p.startsWith("suggestion:")) {
					parts.push(`  → ${p.slice("suggestion:".length)}`);
				}
			}
		}
		parts.push("");
	}

	// Summary
	parts.push("=== SUMMARY ===");
	parts.push(`Lines: ${result.summary.totalLines}`);
	if (result.summary.targetLines !== null) {
		parts.push(`Target lines: ${result.summary.targetLines}`);
	}
	const schemeCheck = result.summary.rhymeMatch ? " ✓" : " ✗";
	parts.push(`Rhyme scheme: ${result.summary.rhymeScheme || "(none)"}${schemeCheck}`);
	if (result.summary.targetRhymeScheme) {
		parts.push(`Target rhyme scheme: ${result.summary.targetRhymeScheme}`);
	}
	parts.push(
		`Lines meeting syllable target: ${result.summary.syllableMatches}/${result.summary.totalLines}`
	);
	parts.push(
		`Lines meeting stress pattern: ${result.summary.stressMatches}/${result.summary.totalLines} (partial or better)`
	);

	if (result.summary.problems.length > 0) {
		parts.push(`Problems: ${result.summary.problems.join("; ")}`);
	} else {
		parts.push("Problem lines: none");
	}

	// Rhyme pairs
	if (result.rhymePairs.length > 0) {
		parts.push("");
		parts.push("=== RHYME PAIRS ===");
		for (const pair of result.rhymePairs) {
			const typeLabel = pair.type === "perfect" ? "perfect ✓" : `${pair.type}`;
			parts.push(`${pair.label}: ${pair.words[0]}/${pair.words[1]} (${typeLabel})`);
		}
	}

	// Suggestions
	if (result.suggestions.length > 0) {
		parts.push("");
		parts.push("=== SUGGESTIONS ===");
		for (const s of result.suggestions) {
			parts.push(`• ${s}`);
		}
	}

	return parts.join("\n");
}

function formatRhymes(result: RhymeResult): string {
	const parts: string[] = [];
	parts.push(`=== RHYMES FOR "${result.word}" ===`);

	const perfectStr = result.perfect
		.slice(0, 50)
		.map((r) => `${r.word}(${r.syllables})`)
		.join(", ");
	parts.push(`Perfect (${result.perfect.length}): ${perfectStr || "(none)"}`);

	const nearStr = result.near
		.slice(0, 50)
		.map((r) => `${r.word}(${r.syllables})`)
		.join(", ");
	const nearTotal = result.near.length;
	const nearShown = Math.min(nearTotal, 50);
	parts.push(`Near (${nearShown} of ${nearTotal}): ${nearStr || "(none)"}`);

	return parts.join("\n");
}

// ---------------------------------------------------------------------------
// MCP Agent
// ---------------------------------------------------------------------------

export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "Poetry Analysis Tools",
		version: "1.0.0",
	});

	async init() {
		// Tool 1: analyze_poem
		this.server.tool(
			"analyze_poem",
			"ALWAYS use after drafting poetry, songs, lyrics, or verse. Write freely first, then use this to check meter, syllables, rhyme scheme, and stress patterns. Fix any problems found, then re-analyze until clean. Supports meters: free, iambic-pentameter, haiku, limerick, sonnet, or custom:N,N,N for custom syllable targets per line.",
			{
				poem: z
					.string()
					.describe(
						"The full text of the poem, with lines separated by newlines"
					),
				meter: z
					.string()
					.optional()
					.describe(
						"Meter preset: 'free', 'iambic-pentameter', 'haiku', 'limerick', 'sonnet', or 'custom:N,N,N' for custom syllable targets per line. Defaults to 'free'."
					),
			},
			async ({ poem, meter }) => {
				const result = analyzePoem(poem, meter || "free", dict);
				return {
					content: [
						{
							type: "text" as const,
							text: formatAnalysis(result),
						},
					],
				};
			}
		);

		// Tool 2: lookup_rhymes
		this.server.tool(
			"lookup_rhymes",
			"Use after writing a draft to verify intended rhymes actually rhyme, or to find better alternatives when analyze_poem identifies rhyme problems. Also useful when revising and stuck on a specific rhyme.",
			{
				word: z.string().describe("The word to find rhymes for"),
			},
			async ({ word }) => {
				const result = findRhymesFor(word, dict);
				return {
					content: [
						{
							type: "text" as const,
							text: formatRhymes(result),
						},
					],
				};
			}
		);

		// Tool 3: suggest_words
		this.server.tool(
			"suggest_words",
			"Use when revising poetry to find replacement words that fix rhythm problems identified by analyze_poem. For example, find 2-syllable iambic words to fix a line of iambic pentameter, or find words with specific stress patterns to match your meter.",
			{
				stress: z
					.string()
					.describe(
						"Stress pattern using 0=unstressed, 1=primary, 2=secondary. E.g., '01' for iambic, '10' for trochaic, '010' for 3-syllable with stress on middle"
					),
				syllables: z
					.number()
					.describe("Number of syllables the word should have"),
				limit: z
					.number()
					.optional()
					.describe("Max results to return (default 50)"),
			},
			async ({ stress, syllables, limit }) => {
				const results = suggestWords(stress, syllables, dict);
				const trimmed = results.slice(0, limit || 50);
				return {
					content: [
						{
							type: "text" as const,
							text: `=== WORDS: ${syllables} syllables, stress "${stress}" ===\n${trimmed.join(", ")}\n\n(${trimmed.length} of ${results.length} total matches)`,
						},
					],
				};
			}
		);

		// Prompt 1: write-poem
		this.server.prompt(
			"write-poem",
			"Write a poem with proper meter and rhythm",
			{
				topic: z.string().describe("What the poem should be about"),
				form: z
					.string()
					.optional()
					.describe(
						"Poetry form: sonnet, haiku, limerick, free verse, etc."
					),
			},
			async ({ topic, form }) => ({
				messages: [
					{
						role: "user" as const,
						content: {
							type: "text" as const,
							text: `Write a ${form || "poem"} about ${topic}. Use the analyze_poem tool to check your draft's meter and rhythm, then revise any lines that don't match the target. Use lookup_rhymes and suggest_words to find the perfect words. Present the final poem with the analysis showing all lines pass.`,
						},
					},
				],
			})
		);

		// Prompt 2: analyze-my-poem
		this.server.prompt(
			"analyze-my-poem",
			"Get detailed rhythm and rhyme analysis of a poem",
			{
				poem: z.string().describe("The poem text to analyze"),
				meter: z
					.string()
					.optional()
					.describe(
						"Expected meter: iambic-pentameter, haiku, limerick, sonnet, free"
					),
			},
			async ({ poem, meter }) => ({
				messages: [
					{
						role: "user" as const,
						content: {
							type: "text" as const,
							text: `Analyze this poem using the analyze_poem tool with meter "${meter || "free"}":\n\n${poem}\n\nShow me the syllable counts, stress patterns, and rhyme scheme. Point out any rhythm issues and suggest fixes.`,
						},
					},
				],
			})
		);
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/mcp") {
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return (env as any).ASSETS.fetch(request);
	},
};
