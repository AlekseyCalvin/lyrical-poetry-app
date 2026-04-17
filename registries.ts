export const METER_REGISTRY: Record<string, { pattern: string; name: string }> = {
  Pyrrhic: { pattern: "x x", name: "Pyrrhic" },
  Trochaic: { pattern: "/ x", name: "Trochaic" },
  Iambic: { pattern: "x /", name: "Iambic" },
  Spondee: { pattern: "/ /", name: "Spondee" },
  Dactylic: { pattern: "/ x x", name: "Dactylic" },
  Amphibrachic: { pattern: "x / x", name: "Amphibrachic" },
  Anapestic: { pattern: "x x /", name: "Anapestic" },
  Bacchius: { pattern: "x / /", name: "Bacchius" }
};

export const FOOT_REGISTRY: Record<string, { multiplier: number; name: string }> = {
  Monometer: { multiplier: 1, name: "Monometer" },
  Dimeter: { multiplier: 2, name: "Dimeter" },
  Trimeter: { multiplier: 3, name: "Trimeter" },
  Tetrameter: { multiplier: 4, name: "Tetrameter" },
  Pentameter: { multiplier: 5, name: "Pentameter" },
  Hexameter: { multiplier: 6, name: "Hexameter" },
  Heptameter: { multiplier: 7, name: "Heptameter" },
  Octameter: { multiplier: 8, name: "Octameter" }
};

export const FORM_REGISTRY: Record<string, { lines: number; rhyme_scheme: string; stanza_breaks: number[]; rules: string }> = {
  "Couplet": {
    lines: 2,
    rhyme_scheme: "AA",
    stanza_breaks: [],
    rules: "A 2-line poem or stanza with an AA rhyme scheme."
  },
  "Triplet": {
    lines: 3,
    rhyme_scheme: "ABA",
    stanza_breaks: [],
    rules: "A 3-line poem, also known as a Tercet, with an ABA rhyme scheme."
  },
  "Quatrain": {
    lines: 4,
    rhyme_scheme: "ABAB",
    stanza_breaks: [],
    rules: "A 4-line poem or stanza with an ABAB rhyme scheme."
  },
  "Limerick": {
    lines: 5,
    rhyme_scheme: "AABBA",
    stanza_breaks: [],
    rules: "A 5-line poem following a strict AABBA rhyme scheme."
  },
  "Sextilla": {
    lines: 6,
    rhyme_scheme: "ABABCC",
    stanza_breaks: [],
    rules: "A 6-line poem functioning as a single stanza with an ABABCC rhyme scheme."
  },
  "Septet": {
    lines: 7,
    rhyme_scheme: "ABABBCC",
    stanza_breaks: [],
    rules: "A 7-line poem functioning as a single stanza with an ABABBCC rhyme scheme."
  },
  "Common Octave": {
    lines: 8,
    rhyme_scheme: "ABCA BCAC",
    stanza_breaks: [4],
    rules: "An 8-line poem divided into two quatrains. You MUST use slanted rhymes exclusively for this form."
  },
  "Triad": {
    lines: 9,
    rhyme_scheme: "AAA BBB CCC",
    stanza_breaks: [3, 6],
    rules: "A 9-line poem consisting of three mono-rhymed triplets."
  },
  "English Ode": {
    lines: 10,
    rhyme_scheme: "ABAB CDECDE",
    stanza_breaks: [4],
    rules: "A 10-line poem divided into an opening quatrain and a closing sestet."
  },
  "Rondine": {
    lines: 12,
    rhyme_scheme: "ABBAABC ABBAC",
    stanza_breaks: [7],
    rules: "A 12-line poem structured into two stanzas: a septet (7 lines) followed by a quintet (5 lines). The 'C'-lines here designate a Refrain, which MUST end with words that are (depending on the context, content, and theme of the poem as a whole) are either a verbatim repetition of or an ironic inversion of or a play-on the opening (first) words of the poem's first line."
  },
  "Madrigal": {
    lines: 13,
    rhyme_scheme: "A1-B1-B2 a-b-A1-B1 a-b-b-A-B1-B2",
    stanza_breaks: [3, 7],
    rules: "A 13-line poem divided into stanzas of 3, 4, and 6 lines. Words or phrases at the end of capital letter designated lines (such as A1 or B2) are subject to both rhyme and repetition/identicity, requiring strict identicity matching to lines designated with the same capital letter & number. So, each B1 must end in the exact same word or phrasal unit as other B1s; likewise, each B2=B2 and A1=A1. But B2 ≠ B1. Line-ends in lowercase letter designated lines (like a or b) MUST rhyme with all lines designated by the same letter, irrespectively of capitalization. Each lowercase line-end, however, is not repeated and MUST be distinct to itself. So: every b rhymes with every other b and with B1 and with B2. And every b is not identical to any other b, nor to B1, nor to B2. Same pattern applies to the A family."
  },
  "Petrarchan Sonnet": {
    lines: 14,
    rhyme_scheme: "ABBAABBA CDCDCD",
    stanza_breaks: [8],
    rules: "A 14-line poem consisting of an opening octave (8 lines) and a closing sestet (6 lines)."
  },
  "Shakespearean Sonnet": {
    lines: 14,
    rhyme_scheme: "ABAB CDCD EFEF GG",
    stanza_breaks: [4, 8, 12],
    rules: "A 14-line poem consisting of three quatrains followed by a closing rhyming couplet."
  },
  "Rondeau": {
    lines: 15,
    rhyme_scheme: "AABBA AABC AABBAC",
    stanza_breaks: [5, 9],
    rules: "A 15-line poem divided into stanzas of 5, 4, and 6 lines. Similarly to the repetition/variation rules for the Rondine form, the 'C' designator here marks a Refrain — signaling the repetition, inversion, or play-on the first few words of the poem's first line (the A-line of stanza 1). Thus, the opening words must be repeated identically or variated at the line-end of the last line of the second and third stanzas."
  },
  "Pantoum": {
    lines: 16,
    rhyme_scheme: "ABAB ABAB ABAB ABAB",
    stanza_breaks: [4, 8, 12],
    rules: "A 16-line poem of four quatrains. The 2nd and 4th lines of each stanza MUST be repeated identically as the 1st and 3rd lines of the next stanza. The final stanza concludes by using the unrepeated 1st and 3rd lines of the very first stanza to close the loop."
  },
"Lucubration": {
    lines: 17,
    rhyme_scheme: "ABABABAB CDCDCDCD D",
    stanza_breaks: [8, 16],
    rules: "A 17-line poem consisting of two octaves and a concluding single-line coda."
  },
  "Villanelle": {
    lines: 19,
    rhyme_scheme: "A1-B1-A2 a-B1-A1 a-B1-A2 a-B1-A1 a-B1-A2 a-B1-A1-A2",
    stanza_breaks: [3, 6, 9, 12, 15],
    rules: "A 19-line poem consisting of 5 tercets and 1 closing quatrain. The 1st line (A1) and 3rd line (A2) of the first stanza are repeated alternately as the final lines of the following tercets, and together as the final two lines of the poem. Every 'a' line is distinct to itself, but rhymes with both A1 and A2. A1 and A2 end-rhymes rhyme with each other and with the end-rhyme every 'a'. So, every A1=A1. Every a≠A1, a≠A2, nor any other a. But every a rhymes with every other a and with every A. The B1 line is repeated across the whole poem as the second line of every stanza."
  },
  "Ballad": {
    lines: 20,
    rhyme_scheme: "ABAB ABAB ABAB ABAB ABAB",
    stanza_breaks: [4, 8, 12, 16],
    rules: "Exactly 20 lines of poetry divided evenly into 5 quatrains with an alternating rhyme scheme."
  }
};