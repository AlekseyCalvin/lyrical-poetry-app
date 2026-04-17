export interface LineAnalysis {
  text: string;
  syllableCount: number;
  scansion: string;
  feet: string[];
  rhymeWord: string;
  rhymeSound: string;
  devices: string[];
}

export interface StanzaAnalysis {
  type: string;
  lines: LineAnalysis[];
}

export interface PoemAnalysis {
  theme: string;
  mood: string;
  suggestedColors: {
    background: string;
    text: string;
    accent: string;
  };
  form: string;
  rhymeScheme: string;
  meter: string;
  stanzas: StanzaAnalysis[];
  overallAnalysis: string;
}

export interface ComparisonAnalysis {
  sourceAnalysis: PoemAnalysis;
  translationAnalysis: PoemAnalysis;
  comparisonNotes: string;
  fidelityScore: number;
}

export interface SyllableData {
  syllable: string;
  stress: string;
  expectedSlot?: string;
  isDivergent?: boolean;
  divergenceType?: string;
}

export interface GeneratedLine {
  syllables: SyllableData[];
  rhymeSound: string;
  rhymeWord: string;
  meterAdherence?: number;
  rhymeType?: string;
  divergences?: string[];
  isBlank?: boolean;
}

export interface GeneratedPoem {
  lines: GeneratedLine[];
  explanation: string;
}
