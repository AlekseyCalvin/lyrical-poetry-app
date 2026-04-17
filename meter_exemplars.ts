/**
 * LYRICAL Meter Exemplar Bank
 * * Provides canonical verse lines with explicit scansion, common divergences,
 * and compositional guidance for each meter × foot combination.
 * Drawn from: Metrics_and_Scansion_Detailed.md, Comprehensive_Guide…md,
 * Partial_Taxonomy_of_Poetic_Forms.csv/2.csv, and the poetic canon.
 */

export interface MeterExemplar {
  text: string;
  scansion: string;      // e.g. "x / | x / || x / | x / | x /"
  rhythm?: string;       // optional cadence transcription for prompt grounding
  source: string;        // poet + work
  divergences?: string[];
}

export interface MeterProfile {
  exemplars: MeterExemplar[];
  commonDivergences: string[];
  sonicDescription: string;   // prose description of sonic character
  avoidance: string;          // anti-monotony guidance
  rhymeHints: string;         // guidance on preferred rhyme types
}

// ── Divergence Vocabulary ──────────────────────────────────────────────────
// Closed list for LLM schema + engine classification

export const DIVERGENCE_TYPES = [
'trochaic_inversion',		// the / x trochaic pattern in an x / iambic slot (most typically foot 1 or post-caesura)
'spondaic_substitution',	// the / / pattern foot in a line characterized by feet of a single stress meter (iambic line example: HEART-BREAK | came LATE, which scans as / / | x /)
'pyrrhic_substitution',		// a x x foot in a line characterized by a stressed meter (example in an iambic pentameter line: and NOT | beGOT|ten of | man's SPERM | unCLEAN |, which scans as x / | x / | x x | x / | x / ), often used for rhythmic variety or alignment with lexical stress
'anapestic_substitution',	// the x x / anapestic pattern replacing a binary (aka duple) foot (like / x or x / or / / or x x) or another triple (aka ternary) foot (like / x x or x / x)
'dactylic_substitution',	// the / x x dactylic pattern replacing a duple (aka binary) foot (like / x or / x or / / or x x) or another ternary (aka triple) foot (like x / x or x x /)
'amphibrachic_substitution', // the x / x amphibrachic pattern mapped into binary (aka duple) or other ternary (aka triple) grids
'tribrachic_substitution',	// the x x x (triple unstressed) pattern replacing a foot
'molossic_substitution',	// the / / / (triple stressed) pattern replacing a foot
'bacchic_substitution',	// the x / / bacchic pattern replacing a foot within other triple (aka ternary) or binary (aka duple) grids
'antibacchic_substitution',  // the / / x pattern replacing a foot
'ionic_substitution',		// the x x / / pattern, aka a minor ionic (or double iamb) in place of two standard duple (aka binary) feet
'choriambic_substitution',	// the / x x / pattern (aka iambic dipody or a trochee + a iamb) replacing two adjacent binary (aka duple) feet of same type
'antispastic_substitution',	// the x / / x pattern (aka trochaic dipody) replacing two adjacent binary (aka duple) feet of same type, naturally found in some words (e.g. impregnated)
'cretic_substitution',		// the / x / pattern (like an inverse amphibrach) replacing a standard foot (rare in English)
'acephalous',		// dropping the initial expected syllable of a line (headless)
'anacrusis',		// additional extrametrical unstressed syllable(s) at line start
'catalexis',		// dropping the terminal (last) unstressed syllable(s) of a line (usually unstressed in falling meter), like da-DUM, da-DUM, da-DUM, da-DUM, da- for iambic pentameter
'hypercatalexis',	// with an additional syllable beyond the standard final foot's boundary
'brachycatalexis',	// a line terminating one whole foot sooner than is suggested by rhythm or/and foot-count; an artful brachycatalexis can render more than just a one-off foot modulation – say, a tetrameter line amid pentameter verses – but, like a well-placed pipe bomb, effectuate a pattern-suspending sense of shock in readers
'feminine_ending',	// (most common variety of hypercatalexis) an extra unstressed syllable at line end, beyond standard metrical grid's acatalectic terminus (line's last stressed syllable, often a consonant-heavy sound); feminine endings help smooth or cushion inter-linear/stanzaic transitions or conclusion
'elision',		// suppressing/compressing syllables via synalepha or syncope (such as: o'er for over)
'aphaeresis',		// trimming/removing/muting the first phone, sub-grapheme, or lexical participle from the start of a word (such as: 'fore for before)
'apocope',		// severing/abridging/excising the concluding phonosemantic-unit, character-group, or suffix from the end of a word (such as: oft for often)
'syncope',		// suppressing/compressing/dropping sounds, letters, or syllables from the middle of a word (like Shakespear's: thou wand'rest in his shade)
'synaloepha',		// linguistic and phonopoetic effect/device/convention whereby two adjacent vowels from lexicographically separate syllables (or even words) are blended into a single phonetic or/and metrical unit during composition, recitation, and/or scansion (like in Th'oppressor's wrong)
'hovering_accent',	// metrical stress perceived as distributed equally over two adjacent syllables, if heavy or carrying long vowel sounds (examples: swell soul, real cool, cornfield, etc…)
'compensation',	// addition of an unstressed syllable to a foot to offset lack of an unstressed syllable in another foot (like in acephalous or truncated lines), common in long iambic lines
'masculine_caesura', // phonetic pause (implied or rendered as ||) after a stressed syllable, often bears a staccato effect (as in: Ah boys, how you hurt! || you were strong as you pressed; or in: We fought till noon || then fell; etc...)
'feminine_caesura',	// phonetic pause (implied or rendered as ||) after an unstressed syllable, carrying a smoother transition (as in: I have three daughters; || the eldest is eleven; or in: I told you already || we must go; etc...)
'caesura_shift',	// medial pause (aka caesura) falling outside the expected metrical boundary or position; (as in: We came into town in the night || then departed)
'syncopation',		// rhetorical or natural speech stress intentionally running counter to the underlying beat
'enjambment',	// syntactic continuation across a line break that overrides or softens the terminal metrical pause
'stress_demotion',	// lexical stress suppressed when mapped to a weak (W) metrical slot
'stress_promotion',	// unstressed syllable elevated (or promoted) to a beat when mapped to a strong (S) metrical slot
'wrenched_stress', 	// forcing of stress, distorting normative phonetic accentuation to conform to the metrical grid (akin to stress_promotion, but more pronounced) (As in: ReSIGNing I SAY || my LAST holiDAY – the wrenched stress is on the last syllable here, also a leonine rhyme (SAY/DAY) between end-syllables of the two hemistichs within one line).
'none',			// perfect faithful match
] as const;

export type DivergenceType = typeof DIVERGENCE_TYPES[number];

// ── Rhyme Type Vocabulary ──────────────────────────────────────────────────
// From RHYMES.md — closed enum for LLM self-declaration

export const RHYME_TYPES = [
'perfect',	//  like: beat/street/incomplete/eat/elite/receipt; June/moon — exactly matched last-stressed syllable phoneme (not always or necessarily grapheme); the number of unstressed syllables preceding the last stressed syllable is immaterial for whether or not words rhyme 
'family',	// wet/deck; dame/grain; float/yoke; math/pass — when the stressed vowels match exactly, while the consonant sounds belong to the same phonetic family; Per CMU formulations, are both plosives ((voiced:) B, D, G, (unvoiced:) P, T, K), or both fricatives ((voiced:) V, TH, Z, ZH, I, (unvoiced:)  F, TH, S, SH, CH), or both nasals (M, N, NG)
'slant',		// like prayer/despair, air/cigar — close but imperfect, also called near-rhyme; typically, the match is between final consonants
'masculine',  // out/doubt — also known as single rhyme, wherein the rhyming stress falls on the final syllable of the end-word/foot
'feminine',    // like picky/tricky — also known as double rhyme, with the rhyming stress falling on the penultimate syllable of the end-word or sequence (can sometimes be simultaneously compound: composed of multiple matching syllables, even across word boundaries)
'dactylic', 	// mortality/finality, amorous/glamorous – rhyme with its stress on the antepenultimate (third from the last) syllable of the end-word or sequence (can sometimes be simultaneously compound: composed of multiple matching syllables, even across word boundaries)
'eye',		// prove/love — visual similarity without a sonic or phonetic match
'rich',		// belief/leaf — rhyme between homophones or near-homophones, with utterly distinct spelling; the opposite of an eye rhyme
'assonant',	// Eyes/Paradise — only the vowel sounds match, while surrounding consonant graphemes or/and phones may be completely different
'consonant',	// heal/hell — only the consonant frame matches, but the vowel sounds/phones or/and graphemes are different; also known as a para-rhyme
'augmented', // bray/brave, grow/sown — a sort of extension of slant rhyme. A rhyme in which the rhyming word (the latter word of a rhyming pair) carries an additional consonant.
'diminished', // brave/day, blown/sow, stained/rain — reversal of the augmented rhyme. A rhyme in which the rhymed-with word (the preceding word within a rhyming pair) carries an additional consonant
'syllabic',	// cleaver/silver, bottle/fiddle — a rhyme in which the last syllable of each word sounds the same but does not necessarily contain stressed vowels
'light',		// nets/carpéts, he/poverty — rhymes a primary or normatively stressed syllable with a secondarily stressed or unstressed syllable, disrupting conventional stress patterning
'wrenched',	// manifestation/attraction/convention — rhyme based grounded solely in matched suffixes, without any corresponding or preceding stressed vowel homophonies; yet, the parallelism of suffixed morphologies may often harness sufficient anchoring to offset dissonance 
'grammatical',	// pun/running/funny — rhyme between words with matching stressed vowel sound at their roots, but distinct inflectional suffixes or endings, often enforced by the rules and constraints of grammatical well-formedness in English
'broken',	// ... LIGHT/…NIGHT-|-gown …, Some asleep unawakened, ALL un- / -warned, eleven fathoms FALLen — splits or breaks up a word across line breaks, to rhyme one fragment with the end-word/syllables of another line, like enjambment that cuts words apart, and the first part rhymes some other line
'trailing',	// ring/finger, scout/doubter — where the rhyming part (the target of a rhyme) is the first syllable of a two-syllable word (or the first word in a pair of monosyllabic words
'apocopated', // finger/ring, doubter/scout — where the rhymed-with part (the source component of a rhyme pair) is the first syllable of a two-syllable word (or the first word in a monosyllabic word pair); reversal of the trailing rhyme
'unstressed',	 // forgiven/hidden, prison/heaven, very/sorry — rhymes which fall on the unstressed syllable
'mosaic',	// astronomical/solemn and comical —  complex compound rhymes aligning cumulative matching near-matching of several features: homophonies (matching vowel phones), consonant family-matches (like family rhymes), scansion (stress pattern), across syllabic sequences or entire sub-phrases, like: when you say/there you stay/blew away
'internal',	// I once drove to the sea/And I dove the QAQZŒQznnvvvhigh tide — rhyme between words or sounds located earlier within respective lines, not necessarily at terminus/end-line
'initial', 	// sailed all day/railed all night/lay uneasy/made a call — rhyme at the beginning of a line, including alliteration (unlike other rhyme types, an intralinear device, not interlinear; like in: entombed by whom), also known as head rhyme
'caesural',	// Sweet is the treading of wine, || and sweet the feet of the dove;/But a goodlier gift is thine || than foam of the grapes or love. — rhymes that occur at the caesura and (typically) also the line end across a pair of lines; also known as interlaced rhyme
'leonine',	// They sailed away, || for a year and a day — rhyme at the caesura and line end within a single line; in short, between hemistichs; once a staple of antique Latin verse, it had remained fairly common in English poetry, among the favored rhyme types of Shakespeare's, Edward Lear's, and many other keen poetic ears; also known as the medial rhyme
'identical',	// indeed, the doll had shaken/I froze, profoundly shaken — same word reused (within the context of this app, may be used for forms like Villanelle/Madrigal, some refrains)
] as const;

export type RhymeType = typeof RHYME_TYPES[number];

// ── Exemplar Bank ──────────────────────────────────────────────────────────

const exemplarBank: Record<string, MeterProfile> = {
  // ═══ DUPLE METERS ═══

  "Iambic_Dimeter": {
    exemplars: [
      { text: "The sun is set",
        scansion: "x / | x /",
        source: "(Traditional nursery rhyme)",
        divergences: ["none"] },
  { text: "The rose / in bloom",
    scansion: "x / | x /",
    source: "(Constructed illustration)",
    divergences: ["none"] },
      { text: "And Russia's czar",
        scansion: "x / | x /",
        source: "Pushkin, Eugene Onegin (trans.)",
        divergences: ["none"] },
  { text: "I loved you once",
    scansion: "x / | x /",
    source: "(Constructed illustration)",
    divergences: ["none"] },
      { text: "And rest at last",
        scansion: "x / | x /",
        source: "(Constructed)",
        divergences: ["none"] },
    ],
    commonDivergences: ["trochaic_inversion", "spondaic_substitution", "feminine_ending"],
    sonicDescription: "The shortest viable iambic line. Two beats create a stark, truncated, or epigrammatic feel. Often used in hymns or simple ballads.",
    avoidance: "Can feel too brief or abrupt. Ensure the thought is complete or intentionally fragmentary.",
    rhymeHints: "Masculine rhymes are standard. The shortness makes the rhyme impact immediate."
  },

  "Iambic_Trimeter": {
    exemplars: [
      { text: "The only news I know",
        scansion: "x / | x / | x /",
        source: "Dickinson, The Only News I Know",
        divergences: ["none"] },
      { text: "A silent expert's calm",
        scansion: "x / | x / | x /",
        source: "Pushkin, Eugene Onegin (trans.)",
        divergences: ["none"] },
      { text: "My eyes across the sky",
        scansion: "x / | x / | x /",
        source: "Tsvetaeva, I do not want (trans.)",
        divergences: ["none"] },
      { text: "The whiskey on your breath",
        scansion: "x / | x / | x /",
	rhythm: "| the WHIS | key ON | your BREATH |",
        source: "Roethke, My Papa's Waltz",
        divergences: ["stress_promotion"] },
    ],
    commonDivergences: ["trochaic_inversion", "feminine_ending", "stress_demotion", "pyrrhic_substitution"],
    sonicDescription: "Compact and hymn-like. Three iambic feet create a measured, deliberate cadence.",
    avoidance: "Don't pad with filler words. Every syllable must earn its place.",
    rhymeHints: "Common in ballad meter (alternating with tetrameter). Slant rhyme acceptable and historically favored. Alternating masculine and feminine rhymes in some traditional contexts."
  },

  "Iambic_Tetrameter": {
    exemplars: [
      { text: "In days of passions and elations",
        scansion: "x / | x / | x / | x / x",
	rhythm: "| in DAYS | of PASS-|-ions AND | e-LAT-ions |",
        source: "Pushkin, Eugene Onegin (trans.)",
        divergences: ["feminine_ending"] },
      { text: "In this and that, and as a rule",
        scansion: "x / | x / || x / | x /",
	rhythm: "| in THIS | and THAT, || and AS | a RULE |",
        source: "Pushkin, Eugene Onegin (trans.)",
        divergences: ["masculine_caesura"] },
      { text: "She walks in beauty, like the night",
	scansion: "x / | x / || x x | x /",
	rhythm: "| she WALKS | in BEAU-ty, || like the | NIGHT |",
	source: "Byron, She Walks in Beauty",
	divergences: ["feminine_caesura", "pyrrhic_substitution"] },
      { text: "But fate not easily escaped",
        scansion: "x / | x / | x x | x /",
	rhythm: "| but FATE | not EA-|-si-ly | e-SCAPED |",
        source: "Panov, Reagan Provocateur (trans.)",
        divergences: ["pyrrhic_substitution"] },
      { text: "The woods are lovely, dark and deep,",
        scansion: "x / | x / | x || / | x /",
	rhythm: "| the WOODS | are LOVE|-ly, || DARK | and DEEP |",
        source: "Robert Frost, Stopping by Woods on a Snowy Evening",
        divergences: ["feminine_caesura", "caesura_shift"] },
    ],
    commonDivergences: ["trochaic_inversion", "pyrrhic_substitution", "dactylic_substitution", "anapestic_substitution", "spondaic_substitution", "feminine_caesura", "masculine_caesura"],
    sonicDescription: "A tighter, brighter cousin of pentameter. Four rising feet create a more song-like, forward-driving pulse.",
    avoidance: "Vary the 2nd and 3rd feet to avoid a sing-song quality.",
    rhymeHints: "Perfect and slant rhymes both strong. The shorter line rewards crisp, monosyllabic end-words."
  },

  "Iambic_Pentameter": {
    exemplars: [
      { text: "When I do count the clock that tells the time",
        scansion: "x / | x / | x / || x / | x /",
        source: "Shakespeare, Sonnet 12",
        divergences: ["masculine_caesura", "caesura_shift"] },
      { text: "The Neva, and the silence over stone",
	scansion: "x / || x x | x / | x x | x /",
	rhythm: "| the NE-va, || and the | SI-lence | o-ver | STONE |",
        source: "Anna Akhmatova, Untitled (after Blok) (trans.)",
        divergences: ["feminine_caesura", "pyrrhic_substitution", "caesura_shift"] },
      { text: "And not begotten of man's sperm unclean",
        scansion: "x / | x / | x x | / / | x /",
        rhythm: "| and NOT | be-GOT|-ten of | MAN's SPERM | unCLEAN |",
        source: "Geoffrey Chaucer, Monk's Tale, Canterbury Tales",
        divergences: ["pyrrhic_substitution", "spondaic_substitution"] },
      { text: "And welte all Paradys, savynge o tree",
        scansion: "x / | x / | x / || x / | x /",
        rhythm: "| and WELTE | all PAR-|a-DYS, || sa-VYGNE | o TREE |",
        source: "Geoffrey Chaucer, Monk's Tale, Canterbury Tales",
        divergences: ["masculine_caesura", "caesura_shift"] },
      { text: "The readers of the Boston Evening Transcript",
        scansion: "x / | x / | x / | x / | x / x ",
        source: "Eliot, Boston Evening Transcript",
rhythm: "| the REA-|-ders OF| the BOS-|-ton EVE-|-ning TRAN-script |",
        divergences: ["feminine_ending", "hypercatalexis", "stress_promotion"] },
      { text: "Behind my shoulder yet another informer",
        scansion: "x / | x / | x x | x / x | x / (x)",
        rhythm: "| Be-HIND | my SHOUL-|-der yet | a-NO-ther in- | FOR-mer) |",
        source: "Letov, Somebody More (trans.)",
        divergences: ["feminine_ending", "pyrrhic_substitution"] },
      { text: "Nor Royal Village parks, nor Moscow spires",
        scansion: "x / | x / | x / || x / | x /",
        source: "Georgiy Ivanov, There will not be a Europe (trans.)",
        divergences: ["masculine_caesura", "caesura_shift"] },
    ],
    commonDivergences: ["trochaic_inversion", "spondaic_substitution", "pyrrhic_substitution", "dactylic_substitution", "anapestic_substitution", "feminine_ending", "masculine_caesura", "feminine_caesura", "caesura_shift"],
    sonicDescription: "The natural heartbeat of English verse. Rising duple rhythm — da DUM da DUM — yet the best practitioners constantly disrupt this with initial inversions, spondaic weight, and pyrrhic acceleration.",
    avoidance: "Do NOT produce monotonous da-DUM-da-DUM across every line, unless warranted by theme/concept. Most common variations (paeons, substitutions) in feet 1 and 3. Use enjambment to prevent mechanical end-stopping.",
    rhymeHints: "Perfect and slant rhymes equally valued. Feminine rhymes add sophistication. Avoid cliché pairs like night/light, love/above, unless highly motivated. Rich feminine rhymes can be effective (though don't overuse, or homogenize: same applies to all rhyme type/form combinations). Try multisyllabic or even compound (mult-word) rhymes, if approporiate words present themselves and uniquely suit the theme/content."
  },

  "Iambic_Hexameter": {
    exemplars: [
{ text: "In a solitude of the sea deep from human vanity",
        scansion: "x x / | x / | x x / || x x / || x / | x /",
        source: "Hardy, The Convergence of the Twain",
        divergences: ["anapestic_substitution", "feminine_caesura", "feminine_ending"] },
  { text: "The light of day is dyed in gold and red and rose",
    scansion: "x / | x / | x / || x / | x / | x /",
    source: "(Constructed illustration)",
    divergences: ["masculine_caesura"] },
    ],
    commonDivergences: ["caesura_shift", "masculine_caesura", "feminine_caesura", "feminine_ending", "trochaic_inversion", "spondaic_substitution", "pyrrhic_substitution", "dactylic_substitution", "anapestic_substitution"],
    sonicDescription: "The Alexandrine. A long, stately line of twelve syllables. In English, often used to slow the tempo or conclude a stanza. Typically features a central caesura.",
    avoidance: "Do not let the line drag. Ensure the caesura provides a necessary breath. Avoid ending on a feminine rhyme unless intentional for specific forms.",
    rhymeHints: "Masculine rhymes provide a strong terminus to the long line. Often rhymes with shorter lines in complex stanza forms."
  },

  "Iambic_Heptameter": {
    exemplars: [
      { text: "But, O sad miracle! the dull gray grass did not turn to gold.",
        scansion: "x / | / / | x x || x / | / / | x x / | x /",
	rhythm: "| but, O | SAD MIR-|-a-cle! || the DULL | GRAY GRASS | did not TURN | to GOLD |",
        source: "Adapted traditional ballad meter",
        divergences: ["masculine_caesura", "spondaic_substitution", "pyrrhic_substitution", "anapestic_substitution"] },
  { text: "The moon above the hill is full and bright and still and fair",
    scansion: "x / | x / | x / | x / | x / | x / | x /",
    source: "(Constructed illustration)",
    divergences: ["none"] },
      { text: "The shepherd swains shall dance and sing for thy delight each May morning",
        scansion: "x / | x / | x / | x / || x / | x / | / / x",
	rhythm: "| the SHEP-herd | SWAINS shall | DANCE and | SING || for THY | de-LIGHT | EACH MAY | mor-NING |",
        source: "Milton, Lycidas (adapted)",
        divergences: ["spondaic_substitution", "feminine_ending", "masculine_caesura"] },
    ],
    commonDivergences: ["caesura_shift", "feminine_ending", "trochaic_inversion"],
    sonicDescription: "The 'Fourteener.' A very long line, often felt as two distinct phrases (4+3). Common in early English drama and ballads. It risks prose-like sprawl if not carefully cadenced.",
    avoidance: "Avoid running the line without a pause. The caesura is structurally vital to prevent breathless sprawl.",
    rhymeHints: "Typically rhymes in couplets or alternate lines. Masculine endings are most common for stability."
  },

"Iambic_Octameter": {
    exemplars: [
      { text: "Th' immortal queen will never sleep, but walks upon a silent stone",
        scansion: "x / | x / | x / | x / || x / | x / | x / | x /",
        source: "Aleksey Calvin (Constructed exemplar)",
        divergences: ["synaloepha", "masculine_caesura"] },
      { text: "To watch our age-old waste respawn, to guide each new moon in the skies.",
        scansion: "x / | x / | / / | x / || x / | x / | / x | x /",
        source: "Aleksey Calvin (Constructed exemplar)",
        divergences: ["spondaic_substitution", "antispastic_substitution", "hovering_accent", "masculine_caesura"] },
      { text: "I knew the queen before her time, for I had dwelled on borderlines",
        scansion: "x / | x / | x / | x / || x / | x / | x / | x /",
        source: "Aleksey Calvin (Constructed exemplar)",
        divergences: ["masculine_caesura"] },
      { text: "Among those glimpsing paradise across a nightmare of the known…",
        scansion: "x / | x / | x / | x / || x / | x / | x x | x /",
        source: "Aleksey Calvin (Constructed exemplar)",
        divergences: ["pyrrhic_substitution", "stress_demotion"] },
  { text: "The sun descends beyond the hills and paints the sky with gold and red",
    scansion: "x / | x / | x / | x / | x / | x / | x / | x /",
    source: "(Constructed illustration)",
    divergences: ["none"] },
    ],
    commonDivergences: ["caesura_shift", "feminine_ending", "spondaic_substitution", "synaloepha"],
    sonicDescription: "An extremely extended line, rare in serious verse but powerful when handled. Often creates a hypnotic, tumbling effect. Practically requires a strong medial caesura.",
    avoidance: "Treat as two tetrameter lines linked by rhyme or thought. Without strong internal breaks, it becomes unwieldy.",
    rhymeHints: "Internal rhyme is highly effective to bind the long line together."
  },

  "Trochaic_Dimeter": {
    exemplars: [
      { text: "Rich the treasure",
        scansion: "/ x | / x",
        source: "Dryden, Alexander's Feast",
        divergences: ["none"] },
      { text: "Shady I.",
        scansion: "/ x | /",
        source: "Tsoy, Like a Shade (trans.)",
        divergences: ["catalexis"] },
      { text: "Hurry, maidens",
        scansion: "/ x | / x",
        source: "Pushkin, Eugene Oregon, Young Women's Song (trans.)",
        divergences: ["none"] },
      { text: "Ashes to ashes...",
        scansion: "/ / | / x",
        source: "David Bowie, Ashes to Ashes",
        divergences: ["spondaic_substitution"] },
      { text: "Funk to funky...",
        scansion: "/ x | / x",
        source: "David Bowie, Ashes to Ashes",
        divergences: ["none"] },
      { text: "Dust to dust,",
        scansion: "/ x | /",
        source: "Longfellow, A Psalm of Life",
        divergences: ["catalexis"] },
    ],
    commonDivergences: ["catalexis", "spondaic_substitution"],
    sonicDescription: "Extremely brief and punchy. Two trochaic feet create a stark, declamatory fragment.",
    avoidance: "Often indistinguishable from a truncated longer line. Use for incantatory or fragmented quick-fire effect. May be effective for chants.",
    rhymeHints: "Masculine (catalectic) endings tend may sound more natural (due to end-consonant punchiness). Rhyme is optional but amplifies the chant."
  },

  "Trochaic_Trimeter": {
    exemplars: [
      { text: "Higher still and higher",
        scansion: "/ x | / x | / x",
        source: "Shelley, To a Skylark",
        divergences: ["none"] },
  { text: "Double, double, toil and trouble",
    scansion: "/ x | / x | / x | / x",
    source: "Shakespeare, Macbeth",
    divergences: ["feminine_caesura"] },
      { text: "Here they come again",
        scansion: "/ x | / x | /",
        source: "(Constructed)",
        divergences: ["catalexis"] },
    ],
    commonDivergences: ["catalexis", "stress_promotion"],
    sonicDescription: "Compressed incantatory pulse. Three falling feet — ideal for spells, chants, or percussive emphasis.",
    avoidance: "Allow some feet to lighten rather than hammering every downbeat.",
    rhymeHints: "Perfect rhymes strengthened by the short line's finality."
  },

  "Trochaic_Tetrameter": {
    exemplars: [
      { text: "How our local kids went off",
        scansion: "/ x | / x | / x | /",
        source: "Blok, Twelve (trans.)",
        divergences: ["catalexis"] },
      { text: "With the officers philandered",
        scansion: "/ x | / x | / x | / x",
        source: "Blok, Twelve (trans.)",
        divergences: ["none"] },
  { text: "In her heart – a sudden pain",
    scansion: "/ x | / || x / x | / ",
rhythm: "| IN her | HEART – || a SUD-den | PAIN |",
    source: "Blok, Twelve (trans.)",
    divergences: ["masculine_caesura", "catalexis", "amphibrachic_substitution"] },
  { text: "Stroll-away-hey, stroll-away!",
    scansion: "/ x | / x || / x | /",
    source: "Blok, Twelve (trans.)",
    divergences: ["feminine_caesura", "catalexis"] },
  { text: "Should you ask me, whence these stories?",
    scansion: "/ x | / x || / x | / x",
    source: "Longfellow, Hiawatha",
    divergences: ["feminine_caesura"] },
  { text: "Tyger Tyger, burning bright",
    scansion: "/ x | / x | / x | /",
    source: "Blake, The Tyger",
    divergences: ["catalexis"] },
      { text: "Tell me not in mournful numbers",
        scansion: "/ x | / x | / x | / x",
        source: "Longfellow, A Psalm of Life",
        divergences: ["none"] },
    ],
    commonDivergences: ["catalexis", "spondaic_substitution", "stress_demotion"],
    sonicDescription: "Incantatory, chant-like falling meter. Heavy downbeat on each foot creates a rhythmic hammer-strike. Often catalectic (last unstressed syllable dropped, ending on a stress).",
    avoidance: "Catalexis at line-end is normal and expected — do NOT force an unstressed final syllable. Vary internal feet.",
    rhymeHints: "Masculine (catalectic) endings dominant. When full lines are used, feminine rhymes are natural."
  },

  "Trochaic_Pentameter": {
    exemplars: [
      { text: "Rafael made a century of sonnets",
        scansion: "/ x x | / x | / x | / x | / x",
        source: "Browning, One Word More",
        divergences: ["dactylic_substitution"] },
      { text: "With a black-and-white fan who's swiping,",
        scansion: "/ x | / x | / x | / x | / ",
        source: "Akhmatova, Poem With No Hero (trans.)",
        divergences: ["catalexis"] },
  { text: "Tell me, tell me, tell me of the ancient days",
    scansion: "/ x | / x | / x | / x | / x | /",
    source: "(Constructed illustration)",
    divergences: ["catalexis"] },
      { text: "There they are, my fifty men and women",
        scansion: "/ x | / x | / x | / x | / x",
        source: "Browning, One Word More",
        divergences: ["none"] },
    ],
    commonDivergences: ["catalexis", "spondaic_substitution", "caesura_shift"],
    sonicDescription: "A long falling line, rare in English compared to the tetrameter. It combines the chant-like quality of the trochee with the extended thought-space of the pentameter line.",
    avoidance: "Avoid over-using heavy monosyllables which can make the line sound like a list. Use anacrusis sparingly to vary the start. Use caesura and occasionally vary stress patterns.",
    rhymeHints: "Masculine endings (catalectic) are standard. Feminine endings (full line) create a softer, rolling close."
  },

  "Trochaic_Hexameter": {
    exemplars: [
      { text: "Shadows softly falling over distant mountains",
        scansion: "/ x | / x | / x || / x | / x | / x",
        source: "(Constructed)",
        divergences: ["none"] },
      { text: "Never have I seen a morning bright and early",
        scansion: "/ x | / x | / x || / x | / x | / x",
        source: "(Constructed)",
        divergences: ["none"] },
    ],
    commonDivergences: ["catalexis", "caesura_shift", "anacrusis"],
    sonicDescription: "A very long chant-like line. Can feel like two short lines combined. The relentless downbeat rhythm is well-suited for narrative ballads or driving processional verses.",
    avoidance: "Break the line with a caesura to allow the reader to breathe. Without variation, the hammering rhythm becomes fatiguing.",
    rhymeHints: "Masculine rhymes stabilize the long falling cadence."
  },

  "Trochaic_Heptameter": {
    exemplars: [
      { text: "Never will you find a river flowing to the sea",
        scansion: "/ x | / x | / x | / x || / x | / x | /",
        source: "(Constructed)",
        divergences: ["catalexis", "caesura_shift"] },
    ],
    commonDivergences: ["catalexis", "caesura_shift", "stress_demotion"],
    sonicDescription: "An exceptionally long falling line. The weight of seven consecutive downbeats creates an intense, almost overwhelming drive.",
    avoidance: "This length is difficult to sustain in trochaic meter. Enjambment is essential to prevent a thudding halt.",
    rhymeHints: "Couplets are standard. Internal rhyme can help structure the long line."
  },

  "Trochaic_Octameter": {
    exemplars: [
      { text: "Once upon a midnight dreary, while I pondered, weak and weary",
        scansion: "/ x | / x | / x | / x || / x | / x | / x | / x",
        source: "Poe, The Raven",
        divergences: ["none"] },
      { text: "And the silken, sad, uncertain rustling of each purple curtain",
        scansion: "/ x | / x | / x | / x || / x | / x | / x | / x",
        source: "Poe, The Raven (variation)",
        divergences: ["feminine_ending"] },
    ],
    commonDivergences: ["catalexis", "caesura_shift", "stress_demotion"],
    sonicDescription: "The meter of Poe's 'The Raven.' A hypnotic, driving, extended falling rhythm. The length allows for complex musicality and internal rhyme structures.",
    avoidance: "Do not drop the final syllable (catalexis) if the rhyme scheme relies on feminine endings (as in The Raven). Maintain the driving pulse.",
    rhymeHints: "Feminine rhymes (weary/dreary) are iconic for this meter in this length."
  },

  // ═══ TRIPLE METERS ═══

  "Dactylic_Dimeter": {
    exemplars: [
      { text: "Touch her not scornfully",
        scansion: "/ x x | / x x",
        source: "Hood, The Bridge of Sighs",
        divergences: ["none"] },
    ],
    commonDivergences: ["catalexis"],
    sonicDescription: "Very short falling triple line: only two dactylic feet. Creates a fragmentary, breathless quality.",
    avoidance: "Every word must count. Avoid padding.",
    rhymeHints: "Feminine rhymes natural; masculine with catalexis."
  },

  "Dactylic_Trimeter": {
    exemplars: [
      { text: "Cannon to right of them,",
        scansion: "/ x x | / x x",
        source: "Tennyson, Charge of the Light Brigade",
        divergences: ["none"] },
      { text: "Russia is luminous. Russia is bliss.",
        scansion: "/ x x | / x x | / x x | / ",
        source: "Georgiy Ivanov, Russia (trans.)",
        divergences: ["hypercatalexis"] },
      { text: "Half a league onward",
        scansion: "/ x x | / x",
        source: "Tennyson, Charge of the Light Brigade",
        divergences: ["catalexis"] },
    ],
    commonDivergences: ["catalexis", "spondaic_substitution"],
    sonicDescription: "Compact dactylic pulse. Three heavy downbeats separated by paired light syllables — DUM da da DUM da da DUM da da. Produces a percussive, martial effect.",
    avoidance: "Allow the final foot to truncate naturally. Catalexis is historically the norm, not the exception.",
    rhymeHints: "Catalectic lines produce masculine endings. Full lines produce dactylic (triple) feminine rhymes."
  },

  "Dactylic_Tetrameter": {
    exemplars: [
      { text: "Just for a handful of silver he left us",
        scansion: "/ x x | / x x | / x x | / x",
        source: "Robert Browning, The Lost Leader",
        divergences: ["none"] },
      { text: "Lived in the light of that star known as the sun there",
        scansion: "/ x x | / x x | / x x | / x",
        source: "Viktor Tsoy, Star Known as the Sun (trans.)",
        divergences: ["catalexis"] },
      { text: "Suddenly hearing the cackling of crows",
        scansion: "/ x x | / x x | / x x | /",
        source: "Nikolay Gumilev, Wayward Streetcar (trans.)",
        divergences: ["none"] },
    ],
    commonDivergences: ["catalexis", "spondaic_substitution", "trochaic_inversion"],
    sonicDescription: "Sweeping falling triple meter — DUM da da DUM da da. Creates a rolling, majestic, or mournful cadence. The heavy downbeat followed by two light syllables mimics galloping or wave-motion.",
    avoidance: "Catalexis in the final foot is extremely common (ending / x instead of / x x). Do NOT force three full syllables in every foot.",
    rhymeHints: "Feminine (dactylic) and masculine (catalectic) endings both legitimate."
  },

  "Dactylic_Pentameter": {
    exemplars: [
      { text: "Wandering aimlessly over the desolate wilderness",
        scansion: "/ x x | / x x | / x x | / x x | / x x",
        source: "(Constructed exemplar)",
        divergences: ["none"] },
    ],
    commonDivergences: ["catalexis", "spondaic_substitution"],
    sonicDescription: "A long, rolling line. Less common than the hexameter, but provides a distinct falling rhythm suited to elegiac or majestic subjects.",
    avoidance: "Avoid padding with adjectives. The dactylic rhythm is energetic; too many syllables can tire the ear.",
    rhymeHints: "Feminine rhymes (triple) are structurally intrinsic to the full line."
  },

  "Dactylic_Hexameter": {
    exemplars: [
      { text: "This is the forest primeval. The murmuring pines and the hemlocks",
        scansion: "/ x x | / x x | / x || / x x | / x x | / x",
        source: "Longfellow, Evangeline",
        divergences: ["caesura_shift", "catalexis"] },
    ],
    commonDivergences: ["spondaic_substitution", "catalexis", "caesura_shift", "trochaic_inversion"],
    sonicDescription: "The epic meter of classical antiquity (Dactylic Hexameter). Six feet, typically dactyls or spondees. In English, the dactylic foot dominates. The fifth foot is almost always a dactyl. The line ends with a catalectic foot (/ x).",
    avoidance: "English lacks the quantitative rhythm of Greek/Latin. Use stress accent carefully. Do not force a spondee if natural speech resists it.",
    rhymeHints: "Traditionally unrhymed in epic. When rhymed, masculine (catalectic) is standard."
  },

  "Dactylic_Heptameter": {
    exemplars: [
      { text: "Wandering aimlessly over the desolate wilderness, looking for company",
        scansion: "/ x x | / x x | / x x || / x x | / x x | / x x | / x x",
        source: "(Constructed exemplar)",
        divergences: ["none"] },
    ],
    commonDivergences: ["catalexis", "spondaic_substitution"],
    sonicDescription: "An extended dactylic line, very rare. Creates a relentless forward motion.",
    avoidance: "Extremely difficult to sustain natural English syntax without sounding forced. Caesuras are vital.",
    rhymeHints: "Masculine rhyme standard to cap the rolling rhythm."
  },

  "Dactylic_Octameter": {
    exemplars: [
      { text: "Wandering aimlessly over the desolate wilderness, looking for company everywhere",
        scansion: "/ x x | / x x | / x x | / x x || / x x | / x x | / x x | / x x",
        source: "(Constructed exemplar)",
        divergences: ["none"] },
    ],
    commonDivergences: ["catalexis", "spondaic_substitution"],
    sonicDescription: "A marathon of falling rhythm. Eight feet of dactyls create an overwhelming wave-like motion.",
    avoidance: "Use for specific musical or liturgical effects. Risks becoming monotonous quickly.",
    rhymeHints: "Feminine rhymes preserve the full triple cadence."
  },

  "Amphibrachic_Dimeter": {
    exemplars: [
      { text: "The morning is breaking",
        scansion: "x / x | x / x",
        source: "(Constructed)",
        divergences: ["none"] },
    ],
    commonDivergences: ["catalexis", "stress_demotion"],
    sonicDescription: "Very short rocking line. Two amphibrachic feet — da DUM da da DUM da.",
    avoidance: "Do NOT pad with function words. Catalexis on final foot gives a masculine punch.",
    rhymeHints: "Both masculine (catalectic) and feminine (full) viable."
  },

  "Amphibrachic_Trimeter": {
    exemplars: [
      { text: "A dancer in yellow who sways",
        scansion: "x / x | x / x | x /",
        source: "(Constructed illustration)",
        divergences: ["catalexis"] },
    ],
    commonDivergences: ["catalexis", "anacrusis"],
    sonicDescription: "A compact rocking triple. Three amphibrachic feet create a lilting, nursery-rhyme-like sway.",
    avoidance: "Embrace natural catalexis at line-end.",
    rhymeHints: "Masculine with catalexis, feminine without."
  },

  "Amphibrachic_Tetrameter": {
    exemplars: [
      { text: "I speak not, I trace not, I breathe not thy name",
        scansion: "x / x | x / x | x / x | x /",
        source: "Byron, Stanzas for Music",
        divergences: ["catalexis"] },
      { text: "The bullet zeroes in on the one at fault!",
        scansion: "x / x | / x / | x x / | x /",
        source: "Letov, Bullet Zeroes In... (trans.)",
        divergences: ["catalexis", "cretic_substitution"] },
      { text: "I go on traversing spaces like giants",
        scansion: "x / x | x / x | / x | x / x",
        source: "Kocherga, Kangaroo (trans.)",
        divergences: ["trochaic_substitution"] },
    ],
    commonDivergences: ["catalexis", "anacrusis", "stress_demotion"],
    sonicDescription: "A swaying, waltz-like rocking rhythm — da DUM da da DUM da. The stress falls in the middle of each foot, creating a gentle pendulum motion.",
    avoidance: "Catalexis at line-end is standard. Embrace the rocking quality.",
    rhymeHints: "Masculine endings (catalectic) predominate."
  },

  "Amphibrachic_Pentameter": {
    exemplars: [
      { text: "The willows are weeping, the river is flowing in silence",
        scansion: "x / x | x / x | x / x | x / x | x / x",
        source: "(Constructed exemplar)",
        divergences: ["none"] },
    ],
    commonDivergences: ["catalexis", "anacrusis"],
    sonicDescription: "A long, rocking line. Five amphibrachs create a sustained waltz rhythm.",
    avoidance: "The repetitive 'da-DUM-da' can feel mechanical. Enjambment is key.",
    rhymeHints: "Feminine rhymes maintain the waltz cadence."
  },

  "Amphibrachic_Hexameter": {
    exemplars: [
      { text: "The waves of the ocean came rolling in quickly to cover the sand",
        scansion: "x / x | x / x | x / x || x / x | x / x | x /",
        source: "(Constructed exemplar)",
        divergences: ["catalexis"] },
    ],
    commonDivergences: ["catalexis", "caesura_shift"],
    sonicDescription: "A very long, swaying line. The length allows for descriptive depth while maintaining a distinct triple lilt.",
    avoidance: "Use caesuras to break the monotony of the central stresses.",
    rhymeHints: "Feminine rhymes fit the meter perfectly."
  },

  "Amphibrachic_Heptameter": {
    exemplars: [
      { text: "The lady of sorrow is weeping alone in the shadows of darkest despair",
        scansion: "x / x | x / x | x / x | x / x || x / x | x / x | x /",
        source: "(Constructed exemplar)",
        divergences: ["catalexis"] },
    ],
    commonDivergences: ["catalexis"],
    sonicDescription: "An extremely extended rocking rhythm. Rare in practice.",
    avoidance: "Difficult to sustain without sounding like a nursery rhyme. Requires sophisticated syntax.",
    rhymeHints: "Feminine rhymes are intrinsic to the flow."
  },

  "Amphibrachic_Octameter": {
    exemplars: [
      { text: "The lady of sorrow is weeping alone in the shadows of darkest despair and regret",
        scansion: "x / x | x / x | x / x | x / x || x / x | x / x | x / x | x /",
        source: "(Constructed exemplar)",
        divergences: ["catalexis"] },
    ],
    commonDivergences: ["catalexis"],
    sonicDescription: "A marathon of the amphibrachic sway. Highly musical and hypnotic.",
    avoidance: "Very rare. Best reserved for stylized or comic verse.",
    rhymeHints: "Feminine rhymes preserve the endless rocking motion."
  },

  "Anapestic_Dimeter": {
    exemplars: [
      { text: "With the sheep in the fold",
        scansion: "x x / | x x /",
        source: "(Constructed)",
        divergences: ["none"] },
      { text: "Arethusa arose",
        scansion: "x x / | x x /",
        source: "Shelley, Arethusa",
        divergences: ["none"] },
    ],
    commonDivergences: ["catalexis", "anacrusis", "spondaic_substitution"],
    sonicDescription: "A very short, skipping line. Two anapestic feet create a rapid, fleeting motion.",
    avoidance: "Avoid filler words just to fill the meter; prefer catalexis over weak syllables.",
    rhymeHints: "Masculine endings (catalectic) are punchy. Feminine endings (full) maintain the gallop."
  },

  "Anapestic_Trimeter": {
    exemplars: [
      { text: "One day long ago, by the Nile",
        scansion: "x / | x x / | x x /",
        source: "Lozina-Lozinsky, By the Nile (trans.)",
        divergences: ["acephalous"] },
      { text: "I am monarch of all I survey",
        scansion: "x x / | x x / | x x /",
        source: "Cowper, The Solitude of Alexander Selkirk",
        divergences: ["none"] },
    ],
    commonDivergences: ["anacrusis", "spondaic_substitution"],
    sonicDescription: "A lighter gallop than tetrameter. Three anapestic feet create a nimble, dance-like triple rhythm.",
    avoidance: "Beware of monotonous da-da-DUM repetition — vary the weight of unstressed syllables.",
    rhymeHints: "Both masculine and feminine rhymes work. Slant rhyme adds sophistication."
  },

  "Anapestic_Tetrameter": {
    exemplars: [
      { text: "We all live, underneath us no country we sense",
        scansion: "x x / | x x / | x x / | x x /",
        source: "Mandelshtam, Stalin Epigram (trans.)",
        divergences: ["none"] },
      { text: "A loud-cackling swarm, in whose feathers warm dressed,",
        scansion: "x / | x x / | x x / | x x /",
	rhythm: "| a LOUD-cack-ling SWARM, || in whose FEA-thers warm DRESSED |",
        source: "James Russell Lowell, A Fable for Critics",
        divergences: ["none"] },
      { text: "On the road, baby sparrows chirp past him",
        scansion: "x x / | x x / | x x / | x ",
        source: "Vaginov, Come One Evening (trans.)",
        divergences: ["catalexis"] },
      { text: "The Assyrian came down like the wolf on the fold",
        scansion: "x x / | x x / | x x / | x x /",
        source: "Byron, The Destruction of Sennacherib",
        divergences: ["none"] },
    ],
    commonDivergences: ["anacrusis", "catalexis", "spondaic_substitution", "elision"],
    sonicDescription: "Galloping, propulsive triple meter. Two unstressed syllables rush into each stressed beat — da da DUM da da DUM. Perfect for narrative momentum and dramatic energy.",
    avoidance: "Allow elision (synalepha) and anacrusis naturally. Do NOT treat every line starting with exactly two unstressed syllables as mandatory — a single-syllable anacrusis is legitimate.",
    rhymeHints: "Masculine rhymes dominate. The galloping rhythm rewards decisive, punchy end-words."
  },

  "Anapestic_Pentameter": {
    exemplars: [
      { text: "At the edge of the forest the shadows were gathered around",
        scansion: "x x / | x x / | x x / | x x / | x x /",
        source: "(Constructed exemplar)",
        divergences: ["none"] },
    ],
    commonDivergences: ["anacrusis", "spondaic_substitution", "catalexis"],
    sonicDescription: "A very long, sweeping line. Five anapests create a sustained, breathless momentum.",
    avoidance: "Very easy to become doggerel. Avoid clichéd 'twas the night before' constructions. Ensure the syntax is robust enough to carry the length.",
    rhymeHints: "Masculine rhymes help ground the extensive run-up of unstressed syllables."
  },

  "Anapestic_Hexameter": {
    exemplars: [
      { text: "At the edge of the forest the shadows were gathered in circles of gold",
        scansion: "x x / | x x / | x x / || x x / | x x / | x x /",
        source: "(Constructed exemplar)",
        divergences: ["none"] },
    ],
    commonDivergences: ["anacrusis", "caesura_shift", "spondaic_substitution"],
    sonicDescription: "An extended gallop. The length allows for a very long narrative breath, almost prose-like in its span, but strictly rhythmic.",
    avoidance: "Must be broken by caesuras to avoid losing the listener in a wash of syllables.",
    rhymeHints: "Strong masculine rhymes are essential to punctuate the long line."
  },

  "Anapestic_Heptameter": {
    exemplars: [
      { text: "At the edge of the forest the shadows were gathered in circles of shimmering gold",
        scansion: "x x / | x x / | x x / | x x / || x x / | x x / | x x /",
        source: "(Constructed exemplar)",
        divergences: ["none"] },
    ],
    commonDivergences: ["anacrusis", "spondaic_substitution"],
    sonicDescription: "An extremely long, driving line. Rare, used for specific comedic or rollicking narrative effects.",
    avoidance: "The sheer number of unstressed syllables risks monotony. Use spondaic substitution to break the flow.",
    rhymeHints: "Masculine rhyme provides a necessary anchor."
  },

  "Anapestic_Octameter": {
    exemplars: [
      { text: "On the morning of Sunday the captain departed and sailed to the edge of the glittering world",
        scansion: "x x / | x x / | x x / | x x / || x x / | x x / | x x / | x x /",
        source: "(Constructed exemplar)",
        divergences: ["none"] },
    ],
    commonDivergences: ["anacrusis", "caesura_shift"],
    sonicDescription: "A marathon of a line. Eight feet of triple rhythm create an intense, almost frantic momentum.",
    avoidance: "Highly prone to doggerel. Use for light verse or specific high-energy narrative.",
    rhymeHints: "Feminine endings (full anapest) extend the gallop; masculine endings stop it."
  },

  // ═══ SUBSTITUTIONAL & RARE METERS ═══

  "Spondee_Dimeter": {
    exemplars: [
      { text: "Rocks, caves, lakes, fens",
        scansion: "/ / | / /",
        source: "Milton, Paradise Lost (fragment)",
        divergences: ["none"] },
      { text: "Out, out brief candle",
        scansion: "/ / | / /",
        source: "Milton, Paradise Lost (fragment)",
        divergences: ["none"] },
    ],
    commonDivergences: ["stress_demotion", "hypercatalectic"],
    sonicDescription: "Pure weight. Every syllable demands equal stress — a logjam of heavy monosyllables.",
    avoidance: "Spondaic meter is nearly impossible to sustain. Use compound nouns and adjacent content words.",
    rhymeHints: "Masculine rhymes only. Heavy, decisive end-words."
  },

  "Spondee_Trimeter": {
    exemplars: [
      { text: "Heart break, soul shake, doom take",
        scansion: "/ / | / / | / /",
        source: "(Constructed exemplar)",
        divergences: ["none"] },
    ],
    commonDivergences: ["stress_demotion", "pyrrhic_substitution"],
    sonicDescription: "Six consecutive heavy syllables. Incredibly dense and intense.",
    avoidance: "Avoid adjacent words that naturally reduce stress (e.g., 'the' or 'and'). Requires purely content-heavy diction.",
    rhymeHints: "Masculine rhymes only."
  },

  "Spondee_Tetrameter": {
    exemplars: [
      { text: "Hill top, stone cliff, dark pit, cold rain",
        scansion: "/ / | / / | / / | / /",
        source: "(Constructed exemplar)",
        divergences: ["none"] },
    ],
    commonDivergences: ["stress_demotion"],
    sonicDescription: "A relentless hammering of stress. Eight beats without relief. Extremely rare.",
    avoidance: "Almost impossible to maintain natural speech. Often reads as a list of compound words.",
    rhymeHints: "Masculine rhyme."
  },

  "Spondee_Pentameter": {
    exemplars: [
      { text: "Great gods, bold men, dark deeds, red blood, white bone",
        scansion: "/ / | / / | / / | / / | / /",
        source: "(Constructed exemplar)",
        divergences: ["none"] },
    ],
    commonDivergences: ["stress_demotion"],
    sonicDescription: "A line of pure weight. Ten stressed syllables.",
    avoidance: "Sustain only for one or two lines for special effect.",
    rhymeHints: "Masculine rhyme."
  },

  "Spondee_Hexameter": {
    exemplars: [
      { text: "Dark night, cold wind, rough sea, hard ship, brave men, lost hope",
        scansion: "/ / | / / | / / | / / | / / | / /",
        source: "(Constructed exemplar)",
        divergences: ["none"] },
    ],
    commonDivergences: ["stress_demotion"],
    sonicDescription: "Extended weight. Twelve beats.",
    avoidance: "Theoretically possible but practically unsustainable in natural English.",
    rhymeHints: "Masculine rhyme."
  },

  "Spondee_Heptameter": {
    exemplars: [
      { text: "Red fire, black smoke, steel sword, gold shield, stone wall, strong arm, true heart",
        scansion: "/ / | / / | / / | / / | / / | / / | / /",
        source: "(Constructed exemplar)",
        divergences: ["none"] },
    ],
    commonDivergences: ["stress_demotion"],
    sonicDescription: "Extreme weight.",
    avoidance: "Avoid as a base meter.",
    rhymeHints: "Masculine rhyme."
  },

  "Spondee_Octameter": {
    exemplars: [
      { text: "Stone steps, iron gate, dark hall, cold room, dead hearth, gray ash, black dust, deep gloom",
        scansion: "/ / | / / | / / | / / | / / | / / | / / | / /",
        source: "(Constructed exemplar)",
        divergences: ["none"] },
    ],
    commonDivergences: ["stress_demotion"],
    sonicDescription: "Maximum weight.",
    avoidance: "Avoid as a base meter.",
    rhymeHints: "Masculine rhyme."
  },

  "Bacchius_Dimeter": {
    exemplars: [
      { text: "The tall trees, the dark night",
        scansion: "x / / | x / /",
        source: "(Constructed illustration from Metrics primer)",
        divergences: ["none"] },
    ],
    commonDivergences: ["stress_demotion", "spondaic_substitution"],
    sonicDescription: "Dragging, heavy meter. One unstressed syllable followed by two stressed ones per foot — da DUM DUM. Creates sustained weight and solemnity.",
    avoidance: "Find natural collocations where articles/prepositions precede compound-stress phrases.",
    rhymeHints: "Masculine rhymes. Monosyllabic end-words."
  },

  "Bacchius_Trimeter": {
    exemplars: [
      { text: "A great storm, a black night, a cold wind",
        scansion: "x / / | x / / | x / /",
        source: "(Constructed exemplar)",
        divergences: ["none"] },
    ],
    commonDivergences: ["spondaic_substitution"],
    sonicDescription: "A rising heavy meter (light-HEAVY-HEAVY). Three feet create a gathering momentum of weight.",
    avoidance: "Rare in English. Requires phrases with secondary stress patterns.",
    rhymeHints: "Masculine rhyme."
  },

  "Bacchius_Tetrameter": {
    exemplars: [
      { text: "In deep woods, on high hills, by cold streams, the wind sighs",
        scansion: "x / / | x / / | x / / | x / /",
        source: "(Constructed exemplar)",
        divergences: ["none"] },
    ],
    commonDivergences: ["spondaic_substitution"],
    sonicDescription: "Extended heavy rising rhythm.",
    avoidance: "Ensure the first syllable remains unstressed to differentiate from the Spondee.",
    rhymeHints: "Masculine rhyme."
  },

  "Bacchius_Pentameter": {
    exemplars: [
      { text: "A good life, a long road, a fair friend, a true word, a sad song",
        scansion: "x / / | x / / | x / / | x / / | x / /",
        source: "(Constructed exemplar)",
        divergences: ["none"] },
    ],
    commonDivergences: ["spondaic_substitution"],
    sonicDescription: "Very long heavy rising line.",
    avoidance: "Avoid monotony by varying the vocabulary.",
    rhymeHints: "Masculine rhyme."
  },

  "Bacchius_Hexameter": {
    exemplars: [
      { text: "The red sun, the gray mist, the cold rain, the dark sea, the lost ship, the drowned men",
        scansion: "x / / | x / / | x / / | x / / | x / / | x / /",
        source: "(Constructed exemplar)",
        divergences: ["none"] },
    ],
    commonDivergences: ["spondaic_substitution"],
    sonicDescription: "Marathon of rising weight.",
    avoidance: "Extremely rare. Use for stylized effect.",
    rhymeHints: "Masculine rhyme."
  },

  "Bacchius_Heptameter": {
    exemplars: [
      { text: "A bold knight, a brave deed, a wrong right, a just law, a strong arm, a fast horse, a long day",
        scansion: "x / / | x / / | x / / | x / / | x / / | x / / | x / /",
        source: "(Constructed exemplar)",
        divergences: ["none"] },
    ],
    commonDivergences: ["spondaic_substitution"],
    sonicDescription: "Extended rising heavy.",
    avoidance: "Avoid as base meter.",
    rhymeHints: "Masculine rhyme."
  },

  "Bacchius_Octameter": {
    exemplars: [
      { text: "The new day, the old year, the young king, the wise man, the strong sword, the sharp blade, the deep cut, the quick end",
        scansion: "x / / | x / / | x / / | x / / | x / / | x / / | x / / | x / /",
        source: "(Constructed exemplar)",
        divergences: ["none"] },
    ],
    commonDivergences: ["spondaic_substitution"],
    sonicDescription: "Maximum heavy rising.",
    avoidance: "Avoid as base meter.",
    rhymeHints: "Masculine rhyme."
  },
};

// ── Lookup Helper ──────────────────────────────────────────────────────────

/**
 * Look up meter exemplars for a given meter + foot combination.
 * Falls back to the meter at a common foot count (Tetrameter/Pentameter),
 * then to a generic profile.
 */
export function getMeterExemplars(meterKey: string, footKey: string): MeterProfile {
  // Try exact match first
  const exact = exemplarBank[`${meterKey}_${footKey}`];
  if (exact) return exact;

  // Try meter with common foot counts as fallback
  const fallbacks = ['Pentameter', 'Tetrameter', 'Trimeter', 'Dimeter'];
  for (const fb of fallbacks) {
    const fallback = exemplarBank[`${meterKey}_${fb}`];
    if (fallback) return fallback;
  }

  // Generic fallback
  return {
    exemplars: [],
    commonDivergences: ['trochaic_inversion', 'spondaic_substitution', 'pyrrhic_substitution', 'catalexis', 'feminine_ending'],
    sonicDescription: `${meterKey} ${footKey} — compose with attention to the natural stress pattern of the meter.`,
    avoidance: "Avoid mechanical repetition. Allow natural variations.",
    rhymeHints: "Perfect, slant, and feminine rhymes are all valid.",
  };
}

/**
 * Format exemplars as a prompt-ready string for LLM injection.
 */
export function formatExemplarsForPrompt(profile: MeterProfile): string {
  const parts: string[] = [];

  parts.push(`SONIC CHARACTER: ${profile.sonicDescription}`);
  parts.push(`WARNING: ${profile.avoidance}`);
  parts.push(`RHYME GUIDANCE: ${profile.rhymeHints}`);

  if (profile.exemplars.length > 0) {
    parts.push('\nCANONICAL EXAMPLES (study the scansion carefully):');
    for (const ex of profile.exemplars) {
      parts.push(`  "${ex.text}"`);
      parts.push(`  Scansion: ${ex.scansion}  [${ex.source}]`);
      if (ex.rhythm) {
        parts.push(`  Rhythm: ${ex.rhythm}`);
      }
      if (ex.divergences && ex.divergences.length > 0 && ex.divergences[0] !== 'none') {
        parts.push(`  Divergences: ${ex.divergences.join(', ')}`);
      }
    }
  }

  if (profile.commonDivergences.length > 0) {
    parts.push(`\nLEGITIMATE DIVERGENCES for this meter: ${profile.commonDivergences.join(', ')}`);
    parts.push('These are real prosodic techniques — use them organically, not mechanically.');
  }

  return parts.join('\n');
} 
