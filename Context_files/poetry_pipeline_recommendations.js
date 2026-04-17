const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        AlignmentType, HeadingLevel, BorderStyle, WidthType, 
        ShadingType, VerticalAlign, LevelFormat, PageBreak,
        Header, Footer, PageNumber, ExternalHyperlink } = require('docx');
const fs = require('fs');

// Color scheme - Midnight Code (technology/AI)
const colors = {
  primary: "020617",      // Midnight Black
  body: "1E293B",         // Deep Slate Blue
  secondary: "64748B",    // Cool Blue-Gray
  accent: "94A3B8",       // Steady Silver
  tableBg: "F8FAFC",      // Glacial Blue-White
  tableHeader: "1E293B"   // Deep Slate Blue
};

const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Times New Roman", size: 24 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 56, bold: true, color: colors.primary, font: "Times New Roman" },
        paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, color: colors.primary, font: "Times New Roman" },
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: colors.body, font: "Times New Roman" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, color: colors.secondary, font: "Times New Roman" },
        paragraph: { spacing: { before: 180, after: 90 }, outlineLevel: 2 } }
    ]
  },
  numbering: {
    config: [
      { reference: "bullet-list",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-1",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-2",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-3",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-4",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-5",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-6",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [{
    properties: {
      page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    headers: {
      default: new Header({ children: [new Paragraph({ 
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "LYRICAL Poetry Pipeline — Technical Recommendations", font: "Times New Roman", size: 20, color: colors.secondary })]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ 
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Page ", font: "Times New Roman", size: 20 }), new TextRun({ children: [PageNumber.CURRENT], font: "Times New Roman", size: 20 }), new TextRun({ text: " of ", font: "Times New Roman", size: 20 }), new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Times New Roman", size: 20 })]
      })] })
    },
    children: [
      // Title
      new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun("Enhancing Formal Poetry Generation")] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 480 },
        children: [new TextRun({ text: "Technical Analysis & Recommendations for the LYRICAL Poetry App Pipeline", size: 24, color: colors.secondary })] }),
      
      // Executive Summary
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Executive Summary")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "After comprehensive analysis of your LYRICAL poetry application architecture, development logs, and the provided research papers, I have identified several critical issues in the current pipeline and formulated concrete recommendations. The core challenges you face stem from fundamental limitations in how Large Language Models process phonetic and metrical constraints, compounded by the current architecture's reliance on post-hoc validation rather than structured pre-generation scaffolding.", size: 24 })
      ]}),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "The research papers you provided offer invaluable insights that directly address your pain points. Notably, the ", size: 24 }),
        new TextRun({ text: "LLM Learning to Write Poetry", italics: true, size: 24 }),
        new TextRun({ text: " paper demonstrates that combining GRPO (Generative Ranking Policy Optimization) with RAG achieves 91.23% rhyme accuracy on Tang poetry, while the ", size: 24 }),
        new TextRun({ text: "Refining Metrical Constraints", italics: true, size: 24 }),
        new TextRun({ text: " paper proves that iterative feedback mechanisms can dramatically improve metrical compliance. The ", size: 24 }),
        new TextRun({ text: "CoT-RAG", italics: true, size: 24 }),
        new TextRun({ text: " framework offers a sophisticated architecture for knowledge graph-driven reasoning that can be adapted for poetic constraint satisfaction.", size: 24 })
      ]}),
      
      // Section 1: Root Cause Analysis
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("1. Root Cause Analysis of Current Pipeline Issues")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.1 The Fundamental LLM Phonetics Problem")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "As the AGENTS.md correctly states, \"Standard autoregressive models do not 'hear' syllables. They predict sub-word tokens.\" This observation is supported by the research: the ", size: 24 }),
        new TextRun({ text: "Refining Metrical Constraints", italics: true, size: 24 }),
        new TextRun({ text: " paper found that even with explicit instructions, LLMs like Llama3.1-8B and Gemma2-9B produced correct syllable counts only about 50-60% of the time without feedback. Your Arcee Trinity model, despite being a 500B parameter reasoning model, faces the same tokenization-based limitations because the model processes text at the sub-word token level rather than the phonological level.", size: 24 })
      ]}),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "The \"rhyme-seeding\" approach you've implemented has merit conceptually, but the execution reveals that the LLM lacks the phonetic grounding to make nuanced distinctions between perfect rhymes, slant rhymes, and phonetic matches. When the model repeatedly generates identical words or phonetically identical templates across different rhyme families, it demonstrates that it cannot reliably compute the phonetic similarity space you're asking it to navigate.", size: 24 })
      ]}),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.2 Issues with the Current Scoring Mechanism")] }),
      new Paragraph({ spacing: { after: 120 }, children: [
        new TextRun({ text: "Your current scoring system in server.ts awards points based on:", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "40 points for exact syllable match", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "40 points for perfect rhyme", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "20 points for first rhyme establishment", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "20 points for acrostic compliance", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 200 }, children: [
        new TextRun({ text: "Up to 40 points for meter adherence", size: 24 })
      ]}),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "While this is a reasonable framework, the research papers suggest that scoring mechanisms should be more granular and include intermediate feedback signals. The ", size: 24 }),
        new TextRun({ text: "LLM Learning to Write Poetry", italics: true, size: 24 }),
        new TextRun({ text: " paper employed a weighted scoring system: Tones (0.4), Rhymes (0.3), Antithesis (0.2), Length (0.1)—with each dimension scored from 0-100 using rule-based algorithms applied to the CMU dictionary. This multi-dimensional scoring allows for more precise feedback loops.", size: 24 })
      ]}),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.3 Instructor-js/Zod Implementation Issues")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "Your logs indicate \"dire and sometimes disastrous\" results with Instructor-js and Zod. Based on my analysis, the core issues are likely:", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [
        new TextRun({ text: "Over-specification: ", bold: true, size: 24 }),
        new TextRun({ text: "The schemas are trying to enforce too many constraints simultaneously. The MetaGlyph paper shows that over-constrained symbolic prompts lead to 0% compliance when models cannot parse the instruction structure.", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, children: [
        new TextRun({ text: "Schema complexity: ", bold: true, size: 24 }),
        new TextRun({ text: "The buildDynamicDraftSchema function creates deeply nested objects with multiple nullable fields, making the JSON schema difficult for the LLM to reliably populate.", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "numbered-1", level: 0 }, spacing: { after: 200 }, children: [
        new TextRun({ text: "Model capability mismatch: ", bold: true, size: 24 }),
        new TextRun({ text: "The research shows that constraint-following ability varies dramatically by model. Kimi K2 achieves 98.1% implication fidelity, while mid-sized models (7B-12B) show near-zero operator fidelity for complex constraints.", size: 24 })
      ]}),
      
      // Section 2: Research-Derived Solutions
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("2. Research-Derived Solutions")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.1 The Xunzi-Yayun-R1 Approach (From the Poetry Paper)")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "The most directly applicable research comes from the Tang poetry generation paper, which achieved 91.23% rhyme accuracy. Their methodology, while designed for Chinese poetry, can be adapted to English verse. The key innovations are:", size: 24 })
      ]}),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("A. Rule Encoding as Reward Signals")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "Instead of asking the LLM to understand abstract prosody rules, the system converts discrete metrical constraints into differentiable reward signals. For your app, this would mean:", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Computing the \"metrical distance\" between the generated line and the target pattern using CMU dict", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Converting rhyme quality into a numerical score (perfect rhyme = 1.0, slant rhyme = 0.5-0.9 based on phoneme overlap)", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 200 }, children: [
        new TextRun({ text: "Using these scores as feedback rather than binary pass/fail criteria", size: 24 })
      ]}),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("B. Chain-of-Thought Data Distillation")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "The paper used DeepSeek-R1-671B to generate high-quality reasoning traces for poetry composition, then distilled these into smaller models. Your Arcee Trinity model can serve a similar role—instead of generating poems directly, have it generate the ", size: 24 }),
        new TextRun({ text: "reasoning chain", italics: true, size: 24 }),
        new TextRun({ text: " for poetic composition, which includes:", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Analysis of the theme and selection of appropriate vocabulary", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Pre-computation of rhyme candidates with phonetic similarity scores", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Draft line construction with explicit syllable counting", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 200 }, children: [
        new TextRun({ text: "Iterative refinement steps with constraint checking", size: 24 })
      ]}),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.2 The CoT-RAG Framework")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "The CoT-RAG paper presents a three-stage architecture that directly addresses your needs for a scaffolded poetry generation pipeline. The framework achieves 4-44% accuracy improvements over baseline methods by using knowledge graphs to modulate reasoning chain generation. For poetry, this translates to:", size: 24 })
      ]}),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Stage 1: Knowledge Graph-Driven CoT Generation")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "Build a poetic knowledge graph containing:", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Form definitions (your FORM_REGISTRY) as graph nodes", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Meter/foot patterns (METER_REGISTRY, FOOT_REGISTRY) as transformation rules", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Rhyme scheme templates as constraint propagation paths", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 200 }, children: [
        new TextRun({ text: "CMU dictionary phoneme relationships as the phonetic substrate", size: 24 })
      ]}),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Stage 2: Learnable Knowledge Case-Aware RAG")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "Implement a retrieval system that queries relevant poetic knowledge based on the current generation context. Unlike your current approach of passing rules as text, the RAG system retrieves:", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Example lines matching the target meter and foot pattern", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Words with the required stress patterns for the current metrical position", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Rhyme candidates pre-filtered for phonetic quality and thematic relevance", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 200 }, children: [
        new TextRun({ text: "Syntactic templates that naturally fit the meter", size: 24 })
      ]}),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Stage 3: Pseudo-Program Prompting Execution")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "The paper shows that representing reasoning as pseudo-programs (rather than natural language) improves execution fidelity. For poetry, this means encoding constraints as executable pseudo-code:", size: 24 })
      ]}),
      
      new Paragraph({ spacing: { after: 120 }, children: [
        new TextRun({ text: "Example Pseudo-Program for a Quatrain Line:", bold: true, size: 24 })
      ]}),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "LINE_1: {syllables: 10, pattern: \"u / u / u / u / u /\", rhyme: \"A\", constraint: START_WITH(THEME_KEYWORD)}\nCANDIDATES = FILTER(dictionary, syllable_count == 10 AND stress_pattern ~ \"u/u/u/u/u/\" AND end_rhyme ∈ RHYME_FAMILY_A)\nOUTPUT = SELECT_TOP(CANDIDATES, semantic_relevance, 5)", font: "Courier New", size: 20 })
      ]}),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.3 The Feedback Refinement Approach")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "The ", size: 24 }),
        new TextRun({ text: "Refining Metrical Constraints", italics: true, size: 24 }),
        new TextRun({ text: " paper provides empirical evidence that iterative feedback dramatically improves metrical compliance. Key findings:", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "numbered-2", level: 0 }, children: [
        new TextRun({ text: "Feedback effectiveness: ", bold: true, size: 24 }),
        new TextRun({ text: "The Erato-based feedback system achieved 76% accuracy for syllable constraints after iterations, compared to ~50% without feedback.", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "numbered-2", level: 0 }, children: [
        new TextRun({ text: "Rule-based superiority: ", bold: true, size: 24 }),
        new TextRun({ text: "Feedback from a rule-based tool (Erato) outperformed LLM-based feedback by significant margins. This validates your use of CMU dictionary for validation.", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "numbered-2", level: 0 }, children: [
        new TextRun({ text: "Trade-off awareness: ", bold: true, size: 24 }),
        new TextRun({ text: "The paper notes that meeting metrical constraints can reduce rhyme quality—Llama3.1's rhyme richness dropped from 0.70 to 0.18 after feedback-driven syllable correction. This suggests your pipeline needs explicit multi-objective optimization.", size: 24 })
      ]}),
      
      // Section 3: Concrete Implementation Recommendations
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("3. Concrete Implementation Recommendations")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.1 Replace Rhyme-Seeding with Pre-Computed Rhyme Clusters")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "Instead of asking the LLM to generate rhyme words dynamically, pre-compute rhyme clusters from CMU dict and store them in a structured format. This approach is validated by the Tang poetry paper's use of the \"Pingshui Yun\" database for rhyme retrieval.", size: 24 })
      ]}),
      
      new Paragraph({ spacing: { after: 120 }, children: [
        new TextRun({ text: "Implementation Steps:", bold: true, size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "numbered-3", level: 0 }, children: [
        new TextRun({ text: "Build a rhyme index: ", bold: true, size: 24 }),
        new TextRun({ text: "For each word in CMU dict, compute its \"rhyme key\" (the stressed vowel and following consonants). Group all words by rhyme key.", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "numbered-3", level: 0 }, children: [
        new TextRun({ text: "Add stress pattern metadata: ", bold: true, size: 24 }),
        new TextRun({ text: "Store the stress pattern of each word (e.g., \"MOUNTAIN\" -> \"/ u\"). This enables querying words by both rhyme and meter compatibility.", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "numbered-3", level: 0 }, children: [
        new TextRun({ text: "Implement slant rhyme scoring: ", bold: true, size: 24 }),
        new TextRun({ text: "Use phoneme similarity metrics (Levenshtein distance on phoneme sequences) to score slant rhymes. The Tang poetry paper rewarded both perfect and slant rhymes.", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "numbered-3", level: 0 }, spacing: { after: 200 }, children: [
        new TextRun({ text: "Create the query interface: ", bold: true, size: 24 }),
        new TextRun({ text: "When generating line N with rhyme designator \"A\", query: {rhyme_key: A_KEY, stress_pattern: REQUIRED_TAIL_PATTERN, syllable_count: REMAINING_SYLLABLES}. Return top-K candidates for LLM selection.", size: 24 })
      ]}),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.2 Implement a Two-Pass Generation Architecture")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "Based on the CoT-RAG and Tang poetry papers, implement a two-pass system that separates semantic planning from phonetic realization:", size: 24 })
      ]}),
      
      // Two-pass architecture table
      new Table({
        columnWidths: [4680, 4680],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({
                borders: cellBorders,
                shading: { fill: colors.tableHeader, type: ShadingType.CLEAR },
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Pass 1: Semantic Planning", bold: true, color: "FFFFFF", size: 22 })] })]
              }),
              new TableCell({
                borders: cellBorders,
                shading: { fill: colors.tableHeader, type: ShadingType.CLEAR },
                verticalAlign: VerticalAlign.CENTER,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Pass 2: Phonetic Realization", bold: true, color: "FFFFFF", size: 22 })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: cellBorders,
                children: [
                  new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "• Generate thematic vocabulary set", size: 20 })] }),
                  new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "• Draft line ideas (no constraints)", size: 20 })] }),
                  new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "• Identify rhyme cluster seeds", size: 20 })] }),
                  new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "• Plan imagery progression", size: 20 })] })
                ]
              }),
              new TableCell({
                borders: cellBorders,
                children: [
                  new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "• Query rhyme candidates from index", size: 20 })] }),
                  new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "• Build lines from phonetic templates", size: 20 })] }),
                  new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "• Validate meter via CMU dict", size: 20 })] }),
                  new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "• Score and rank candidates", size: 20 })] })
                ]
              })
            ]
          })
        ]
      }),
      new Paragraph({ spacing: { before: 200, after: 200 }, children: [
        new TextRun({ text: "This separation prevents the LLM from trying to \"count syllables\" (which it cannot do reliably) and instead focuses its strength on semantic coherence while the backend handles phonetics.", size: 24 })
      ]}),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.3 Build a Poetics RAG Knowledge Base")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "Your hypothesis about a \"custom poetics primer\" fed via RAG is validated by the research. The Tang poetry paper used RAG to retrieve relevant rhyme knowledge from the \"Pingshui Yun\" database, achieving 91.23% rhyme accuracy. The CoT-RAG paper showed 4-44% accuracy improvements from knowledge-grounded reasoning.", size: 24 })
      ]}),
      
      new Paragraph({ spacing: { after: 120 }, children: [
        new TextRun({ text: "Recommended Knowledge Base Contents:", bold: true, size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Meter-foot form compatibility rules: ", bold: true, size: 24 }),
        new TextRun({ text: "Which meters work naturally with which forms (e.g., iambic pentameter for sonnets, anapestic tetrameter for limericks)", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Syntactic templates: ", bold: true, size: 24 }),
        new TextRun({ text: "Pre-validated sentence structures that naturally fit common meters (e.g., \"The ADJECTIVE NOUN VERB ADVERB\" fits iambic tetrameter when words have correct stress)", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Thematic word clusters: ", bold: true, size: 24 }),
        new TextRun({ text: "Groups of thematically related words with their stress patterns and syllable counts pre-computed", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Exemplar poems: ", bold: true, size: 24 }),
        new TextRun({ text: "High-quality examples of each form with metrical analysis, for few-shot prompting", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 200 }, children: [
        new TextRun({ text: "Constraint propagation rules: ", bold: true, size: 24 }),
        new TextRun({ text: "For complex forms like Villanelle or Madrigal, explicit rules for how rhyme/refrain constraints propagate across stanzas", size: 24 })
      ]}),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.4 Integrate with the llmgen_poetry_feedback Framework")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "The GitHub project you referenced (manexagirrezabal/llmgen_poetry_feedback) implements precisely the feedback mechanism validated by the research papers. The framework:", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Uses Erato (rule-based poetry analyzer) for constraint validation", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Implements iterative refinement with structured feedback", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Supports multiple constraint types (syllables, lines, meter)", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 200 }, children: [
        new TextRun({ text: "Tracks diversity metrics to prevent repetitive outputs", size: 24 })
      ]}),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "Integrating this framework with your existing CMU dictionary backend would provide the validated feedback loop that the research shows is essential for metrical compliance. The key modification needed is extending Erato's validation to handle your form-specific constraints (exact line repetition, identicity requirements, refrains).", size: 24 })
      ]}),
      
      // Section 4: Outlines Integration
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("4. Outlines Integration Assessment")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "You mentioned considering Outlines for structured generation via their remote API. Based on the research and the MetaGlyph paper's findings on symbolic instruction languages, here is my assessment:", size: 24 })
      ]}),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.1 Potential Benefits")] }),
      new Paragraph({ numbering: { reference: "numbered-4", level: 0 }, children: [
        new TextRun({ text: "Guaranteed JSON structure: ", bold: true, size: 24 }),
        new TextRun({ text: "Outlines uses finite-state machines to constrain token generation, ensuring valid JSON output. This addresses your JSON extraction failures.", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "numbered-4", level: 0 }, children: [
        new TextRun({ text: "Regex-based constraints: ", bold: true, size: 24 }),
        new TextRun({ text: "You could theoretically constrain output to match specific stress patterns (e.g., \"(da )?(DUM )+\" for iambic meter).", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "numbered-4", level: 0 }, spacing: { after: 200 }, children: [
        new TextRun({ text: "Reduced hallucination: ", bold: true, size: 24 }),
        new TextRun({ text: "By constraining the output space, Outlines reduces the model's tendency to generate invalid content.", size: 24 })
      ]}),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.2 Critical Limitations")] }),
      new Paragraph({ numbering: { reference: "numbered-5", level: 0 }, children: [
        new TextRun({ text: "Token-level constraints ≠ phonetic constraints: ", bold: true, size: 24 }),
        new TextRun({ text: "Outlines operates at the token level, not the phoneme level. It cannot enforce syllable counts or stress patterns because these are not visible in the token sequence.", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "numbered-5", level: 0 }, children: [
        new TextRun({ text: "API dependency: ", bold: true, size: 24 }),
        new TextRun({ text: "The remote API adds latency and cost to each generation. The research papers show that iterative refinement (multiple calls) is often necessary for complex forms, making this expensive.", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "numbered-5", level: 0 }, spacing: { after: 200 }, children: [
        new TextRun({ text: "Creative constraint: ", bold: true, size: 24 }),
        new TextRun({ text: "Over-constraining generation can produce mechanical, formulaic outputs. The Tang poetry paper emphasizes balancing \"form\" and \"spirit\"—too much structural constraint risks losing artistic quality.", size: 24 })
      ]}),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.3 Recommended Approach")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "If you proceed with Outlines, use it for ", size: 24 }),
        new TextRun({ text: "output formatting only", bold: true, size: 24 }),
        new TextRun({ text: "—ensuring valid JSON structure for parsing—not for poetic constraint enforcement. Your CMU-dictionary-based validation should remain the source of truth for prosody. A hybrid architecture:", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "LLM generates line candidates (unconstrained)", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Outlines wraps output in guaranteed-valid JSON schema", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "CMU dict validates meter/rhyme", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 200 }, children: [
        new TextRun({ text: "Feedback loop refines candidates", size: 24 })
      ]}),
      
      // Section 5: Proposed Pipeline Architecture
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("5. Proposed Revised Pipeline Architecture")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "Based on all research findings, here is a revised architecture that addresses the identified issues while maintaining compatibility with your existing codebase:", size: 24 })
      ]}),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.1 Architecture Overview")] }),
      
      // Architecture table
      new Table({
        columnWidths: [3120, 3120, 3120],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Component", bold: true, color: "FFFFFF", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Function", bold: true, color: "FFFFFF", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, shading: { fill: colors.tableHeader, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Research Basis", bold: true, color: "FFFFFF", size: 20 })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Rhyme Index", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Pre-computed phoneme clusters from CMU dict", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Xunzi-Yayun RAG approach", size: 20 })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Semantic Planner", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "LLM generates thematic vocabulary and draft ideas", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Two-pass generation pattern", size: 20 })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Phonetic Engine", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Backend assembles lines from constraints + vocabulary", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Your existing CMU integration", size: 20 })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Constraint Validator", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Multi-dimensional scoring (meter, rhyme, form, semantics)", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Xunzi-Yayun weighted scoring", size: 20 })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Feedback Loop", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Iterative refinement with structured error messages", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Erato feedback approach", size: 20 })] })] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Poetics RAG", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Retrieves relevant poetic knowledge for context", size: 20 })] })] }),
              new TableCell({ borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "CoT-RAG framework", size: 20 })] })] })
            ]
          })
        ]
      }),
      new Paragraph({ spacing: { before: 200 }, children: [] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.2 Key Code Modifications")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("A. Replace Dynamic Rhyme Seeding with Pre-Computed Clusters")] }),
      new Paragraph({ spacing: { after: 120 }, children: [
        new TextRun({ text: "Current approach (problematic):", bold: true, size: 24 })
      ]}),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "The LLM is asked to generate a rhyme word thematically, then subsequent lines must rhyme with it. This fails because the LLM cannot reliably assess phonetic similarity.", font: "Courier New", size: 20 })
      ]}),
      new Paragraph({ spacing: { after: 120 }, children: [
        new TextRun({ text: "Recommended approach:", bold: true, size: 24 })
      ]}),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "Pre-compute rhyme clusters from CMU dict. When line N requires rhyme \"A\", query the cluster for candidates matching the required stress pattern and syllable count. Present the top 5 candidates to the LLM with their phonetic properties, asking it to SELECT (not generate) the most thematically appropriate.", font: "Courier New", size: 20 })
      ]}),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("B. Implement Constraint-Aware Line Assembly")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "Instead of generating entire lines, break the problem into smaller units the LLM can handle reliably:", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "numbered-6", level: 0 }, children: [
        new TextRun({ text: "Query LLM for thematic vocabulary (10-20 words/phrases related to the theme)", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "numbered-6", level: 0 }, children: [
        new TextRun({ text: "Backend filters vocabulary by stress pattern compatibility with target meter", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "numbered-6", level: 0 }, children: [
        new TextRun({ text: "Backend assembles candidate lines using template syntax (X Y Z [RHYME_WORD])", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "numbered-6", level: 0 }, children: [
        new TextRun({ text: "LLM evaluates candidates for semantic coherence and imagery", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "numbered-6", level: 0 }, spacing: { after: 200 }, children: [
        new TextRun({ text: "Backend validates final selection against all constraints", size: 24 })
      ]}),
      
      // Section 6: Addressing Semantic Triteness
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("6. Addressing Semantic Triteness and Thematic Banality")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "The research papers did not directly address poetic quality, but several findings are relevant:", size: 24 })
      ]}),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.1 The \"Cliche Problem\"")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "The Tang poetry paper noted that generated poems often lacked \"spirit\" despite formal compliance. They addressed this through:", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Thematic diversity requirements: ", bold: true, size: 24 }),
        new TextRun({ text: "The training data spanned 7 thematic categories (Nature, Seasons, Emotions, Life Events, Society, Objects, Philosophy). Ensure your theme prompts encourage diverse imagery.", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Style emulation: ", bold: true, size: 24 }),
        new TextRun({ text: "The paper used \"emulate Li Bai's style\" as a prompt component. You could add a \"style\" parameter referencing specific poets (Dickinson, Frost, Neruda) with distinctive voices.", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 200 }, children: [
        new TextRun({ text: "Explicit cliche avoidance: ", bold: true, size: 24 }),
        new TextRun({ text: "Your current prompts include \"AVOID cliches like 'dream', 'beam', 'gleam'...\" The research suggests this helps, but should be expanded with a more comprehensive forbidden-words list specific to each theme.", size: 24 })
      ]}),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.2 Literary Device Integration")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "The current pipeline focuses on formal constraints but neglects poetic devices that create depth. Consider adding explicit prompting for:", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Metaphor/simile requirements: ", bold: true, size: 24 }),
        new TextRun({ text: "Prompt for at least one comparison per stanza", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Alliteration targets: ", bold: true, size: 24 }),
        new TextRun({ text: "Query the phonetic database for words sharing initial consonants", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Enjambment patterns: ", bold: true, size: 24 }),
        new TextRun({ text: "For appropriate forms, prompt the LLM to create sentences that cross line boundaries", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 200 }, children: [
        new TextRun({ text: "Concrete imagery requirements: ", bold: true, size: 24 }),
        new TextRun({ text: "Require at least N concrete nouns per line (queryable from the RAG knowledge base)", size: 24 })
      ]}),
      
      // Section 7: Summary and Next Steps
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("7. Summary and Recommended Next Steps")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("7.1 Immediate Actions (High Impact, Lower Effort)")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Build the rhyme index: ", bold: true, size: 24 }),
        new TextRun({ text: "Pre-compute rhyme clusters from CMU dict. This directly addresses the rhyme-seeding issues and is fully within your control.", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Integrate llmgen_poetry_feedback: ", bold: true, size: 24 }),
        new TextRun({ text: "Clone the repository and adapt its Erato-based validation for your form constraints. The research validates that rule-based feedback outperforms LLM feedback.", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 200 }, children: [
        new TextRun({ text: "Expand cliche avoidance: ", bold: true, size: 24 }),
        new TextRun({ text: "Build a theme-specific forbidden-words list and integrate it into prompts.", size: 24 })
      ]}),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("7.2 Medium-Term Improvements (Higher Impact, Moderate Effort)")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Implement two-pass generation: ", bold: true, size: 24 }),
        new TextRun({ text: "Separate semantic planning from phonetic realization. This requires restructuring the compose endpoint but addresses the fundamental LLM limitation.", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Build the poetics RAG: ", bold: true, size: 24 }),
        new TextRun({ text: "Create a structured knowledge base of form rules, meter templates, and exemplar poems. The CoT-RAG research shows 4-44% accuracy gains from knowledge-grounded reasoning.", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 200 }, children: [
        new TextRun({ text: "Add literary device prompting: ", bold: true, size: 24 }),
        new TextRun({ text: "Extend the prompt templates to explicitly request metaphors, concrete imagery, and other poetic devices.", size: 24 })
      ]}),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("7.3 Longer-Term Considerations (Highest Impact, Higher Effort)")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Fine-tuning on quality poetry: ", bold: true, size: 24 }),
        new TextRun({ text: "While you indicated no intention to fine-tune, the Tang poetry paper demonstrates that even 1K high-quality examples can dramatically improve a model's poetic capabilities. If the above changes prove insufficient, consider distillation from your best Arcee outputs.", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [
        new TextRun({ text: "Multi-model ensemble: ", bold: true, size: 24 }),
        new TextRun({ text: "The research shows different models excel at different constraints (Kimi K2 for implication, GPT for membership, Gemini for overall equivalence). Consider using specialized models for different pipeline stages.", size: 24 })
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 200 }, children: [
        new TextRun({ text: "Constraint solving architecture: ", bold: true, size: 24 }),
        new TextRun({ text: "For complex forms like Villanelle or Madrigal, implement a constraint solver that pre-computes valid line templates before any LLM calls, reducing the problem to constrained selection.", size: 24 })
      ]}),
      
      // Closing
      new Paragraph({ spacing: { before: 400 }, children: [] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "The research papers you provided offer a clear path forward: the combination of pre-computed phonetic resources, iterative feedback loops, and knowledge-grounded generation has been empirically validated to achieve over 90% rhyme accuracy and dramatic improvements in metrical compliance. The key insight is that LLMs should not be asked to \"count syllables\" or \"find rhymes\"—these are algorithmic operations better handled by your CMU dictionary infrastructure. Instead, LLMs should focus on what they excel at: semantic coherence, thematic development, and stylistic variation within the constraints provided by the backend.", size: 24 })
      ]}),
      
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "I am available to elaborate on any specific recommendation or assist with implementation details.", size: 24 })
      ]})
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/z/my-project/download/LYRICAL_Poetry_Pipeline_Recommendations.docx", buffer);
  console.log("Document created: /home/z/my-project/download/LYRICAL_Poetry_Pipeline_Recommendations.docx");
});
