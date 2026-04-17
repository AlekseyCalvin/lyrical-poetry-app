import React, { useState, useEffect } from 'react';
import { composePoem } from '../services/llmService';
import { GeneratedPoem } from '../types';
import { Loader2, PenTool, Sparkles, ChevronDown, Copy, Check, FileText, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const METERS = [
  { name: 'Pyrrhic', size: 2, pattern: 'u u' },
  { name: 'Trochaic', size: 2, pattern: '/ u' },
  { name: 'Iambic', size: 2, pattern: 'u /' },
  { name: 'Spondee', size: 2, pattern: '/ /' },
  { name: 'Dactylic', size: 3, pattern: '/ u u' },
  { name: 'Amphibrachic', size: 3, pattern: 'u / u' },
  { name: 'Anapestic', size: 3, pattern: 'u u /' },
  { name: 'Bacchius', size: 3, pattern: 'u / /' },
];

const FOOT_COUNTS = [
  { name: 'Monometer', count: 1 },
  { name: 'Dimeter', count: 2 },
  { name: 'Trimeter', count: 3 },
  { name: 'Tetrameter', count: 4 },
  { name: 'Pentameter', count: 5 },
  { name: 'Hexameter', count: 6 },
  { name: 'Heptameter', count: 7 },
  { name: 'Octameter', count: 8 },
];

const FORMS = [
  { name: 'Couplet', lines: 2, rhyme: 'AA', bg: '/visuals/LyricalImg2.webp' },
  { name: 'Triplet', lines: 3, rhyme: 'ABA', bg: '/visuals/LyricalImg3.webp' },
  { name: 'Quatrain', lines: 4, rhyme: 'ABAB', bg: '/visuals/LyricalImg4.webp' },
  { name: 'Limerick', lines: 5, rhyme: 'AABBA', bg: '/visuals/LyricalImg6.webp' },
  { name: 'Sextilla', lines: 6, rhyme: 'ABABCC', bg: '/visuals/LyricalImg7.webp' },
  { name: 'Septet', lines: 7, rhyme: 'ABABBCC', bg: '/visuals/LyricalImg8.webp' },
  { name: 'Common Octave', lines: 8, rhyme: 'ABCA BCAC', bg: '/visuals/LyricalImg10.webp' },
  { name: 'Triad', lines: 9, rhyme: 'AAA BBB CCC', bg: '/visuals/LyricalImg11.webp' },
  { name: 'English Ode', lines: 10, rhyme: 'ABAB CDECDE', bg: '/visuals/LyricalImg13.webp' },
  { name: 'Rondine', lines: 12, rhyme: 'ABBAABC ABBAC', bg: '/visuals/LyricalImg14.webp' },
  { name: 'Madrigal', lines: 13, rhyme: 'A1-B1-B2 a-b-A1-B1 a-b-b-A-B1-B2', bg: '/visuals/LyricalImg15.webp' },
  { name: 'Petrarchan Sonnet', lines: 14, rhyme: 'ABBAABBA CDCDCD', bg: '/visuals/LyricalImg16.webp' },
  { name: 'Shakespearean Sonnet', lines: 14, rhyme: 'ABAB CDCD EFEF GG', bg: '/visuals/LyricalImg17.webp' },
  { name: 'Rondeau', lines: 15, rhyme: 'AABBA AABC AABBAC', bg: '/visuals/LyricalImg18.webp' },
  { name: 'Pantoum', lines: 16, rhyme: 'ABAB ABAB (repeating)', bg: '/visuals/LyricalImg19.webp' },
  { name: 'Lucubration', lines: 17, rhyme: 'ABABABAB CDCDCDCD D', bg: '/visuals/LyricalImg20.webp' },
  { name: 'Villanelle', lines: 19, rhyme: 'A1-B1-A2 a-B1-A1...', bg: '/visuals/LyricalImg21.webp' },
  { name: 'Ballad', lines: 20, rhyme: 'ABAB (5 quatrains)', bg: '/visuals/LyricalImg22.webp' },
];

const FONTS = [
  'font-fraunces',
  'font-ibm',
  'font-baskerville',
  'font-marcellus',
  'font-medieval',
  'font-oldstandard'
];

// Title/landing background
const TITLE_BG = '/visuals/LyricalImg5.webp';

export default function PoemGenerator() {
  const [meter, setMeter] = useState('');
  const [foot, setFoot] = useState('');
  const [form, setForm] = useState('');
  const [theme, setTheme] = useState('');
  const [acrostic, setAcrostic] = useState('');
  const [showAcrostic, setShowAcrostic] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [result, setResult] = useState<GeneratedPoem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);

  const selectedMeter = METERS.find(m => m.name === meter);
  const selectedFoot = FOOT_COUNTS.find(f => f.name === foot);
  const selectedForm = FORMS.find(f => f.name === form);

  const isReady = selectedMeter && selectedFoot && selectedForm;

  // Auto-collapse menu when all 3 are selected
  useEffect(() => {
    if (isReady && !result) {
      setIsMenuOpen(false);
    }
  }, [meter, foot, form]);

  // Calculate template dimensions
  const lineCount = selectedForm?.lines || 0;
  const syllablesPerLine = (selectedMeter?.size || 0) * (selectedFoot?.count || 0);

  // Pick a deterministic font based on form
  const formIndex = selectedForm ? FORMS.findIndex(f => f.name === selectedForm.name) : 0;
  const fontClass = selectedForm ? FONTS[formIndex % FONTS.length] : 'font-serif';
  const bgImage = selectedForm ? selectedForm.bg : TITLE_BG;

  const handleGenerate = async () => {
    if (!isReady) return;
    setLoading(true);
    setError('');
    try {
      const generated = await composePoem(meter, foot, form, theme, acrostic);
      setResult(generated);
    } catch (err: any) {
      setError(err.message || 'Failed to generate poem.');
    } finally {
      setLoading(false);
    }
  };

  const getPoemText = (): string => {
    if (!result) return '';
    return result.lines.map((line, idx) => {
      const text = line.syllables.map(s => s.syllable).join('');
      return text + (line.isBlank && idx !== result.lines.length - 1 ? '\n' : '');
    }).join('\n');
  };

  const getPoemWithScansion = (): string => {
    if (!result) return '';
    return result.lines.map((line, idx) => {
      const text = line.syllables.map(s => s.syllable).join('');
      const scansion = line.syllables.map(s => s.stress === '/' ? '´' : s.stress === '\\' ? 'ˋ' : '˘').join(' ');
      return `${scansion}\n${text}` + (line.isBlank && idx !== result.lines.length - 1 ? '\n' : '');
    }).join('\n\n');
  };

  const getPoemMetadata = (): string => {
    if (!result) return '';
    const text = getPoemText();
    return `${form} | ${meter} ${foot}\nRhyme Scheme: ${selectedForm?.rhyme || ''}\n\n${getPoemWithScansion()}\n\n${result.explanation || ''}`;
  };

  const handleCopy = async (type: 'text' | 'scansion' | 'full') => {
    let content = '';
    if (type === 'text') content = getPoemText();
    else if (type === 'scansion') content = getPoemWithScansion();
    else content = getPoemMetadata();

    await navigator.clipboard.writeText(content);
    setCopied(type);
    setShowExport(false);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="relative min-h-full flex flex-col">
      {/* Dynamic Background based on form */}
      <div
        className="absolute inset-0 z-0 transition-all duration-1000 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          opacity: isReady ? 0.35 : 0.55,
        }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/40 to-zinc-950/80" />

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col flex-1 p-4">

        {/* Title - shrinks when menu is closed */}
        <div className={`text-center transition-all duration-500 ${isMenuOpen ? 'mb-6 mt-6' : 'mb-2 mt-1'}`}>
          <h1 className={`${isMenuOpen ? 'text-6xl md:text-8xl' : 'text-2xl md:text-3xl'} font-bold tracking-widest lyrical-title transition-all`}>LYRICAL</h1>
          {isMenuOpen && <p className="text-lg md:text-xl font-marcellus text-indigo-300 tracking-widest uppercase opacity-80 mt-2">The Poetry App</p>}
        </div>

        {/* Controls Container */}
        <div className="bg-zinc-950/70 p-4 rounded-2xl shadow-2xl border border-zinc-800/50 mb-3 flex flex-col gap-3 shrink-0 backdrop-blur-sm">

          {/* Menu Section */}
          {isMenuOpen ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1 text-zinc-400 uppercase tracking-wider">Meter</label>
                <select
                  value={meter}
                  onChange={e => setMeter(e.target.value)}
                  className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-zinc-100 text-sm"
                >
                  <option value="">Select Meter...</option>
                  {METERS.map(m => <option key={m.name} value={m.name}>{m.name} ({m.pattern})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-zinc-400 uppercase tracking-wider">Foot Count</label>
                <select
                  value={foot}
                  onChange={e => setFoot(e.target.value)}
                  className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-zinc-100 text-sm"
                >
                  <option value="">Select Foot...</option>
                  {FOOT_COUNTS.map(f => <option key={f.name} value={f.name}>{f.name} ({f.count})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-zinc-400 uppercase tracking-wider">Form</label>
                <select
                  value={form}
                  onChange={e => setForm(e.target.value)}
                  className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-zinc-100 text-sm"
                >
                  <option value="">Select Form...</option>
                  {FORMS.map(f => <option key={f.name} value={f.name}>{f.name} ({f.lines} lines) — {f.rhyme}</option>)}
                </select>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsMenuOpen(true)}
              className="w-full py-2 px-4 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 font-marcellus tracking-wider text-sm transition-colors flex justify-between items-center"
            >
              <span className="font-bold text-indigo-400">MENU</span>
              <span className="text-zinc-100">{meter} | {foot} | {form}</span>
              <span className="text-xs opacity-50 flex items-center gap-1"><ChevronDown className="w-3 h-3" /> Expand</span>
            </button>
          )}

          {/* Theme & Compose Section */}
          {isReady && !isMenuOpen && (
            <div className="flex flex-col gap-2 animate-in fade-in duration-500">
              {/* Compact Theme/Acrostic Row */}
              <div className="flex flex-col md:flex-row items-center gap-3 bg-zinc-900/40 p-2 rounded-lg border border-zinc-800/50">
                <div className="flex items-center gap-2 flex-1 w-full">
                  <label className="text-xs font-medium text-zinc-400 whitespace-nowrap uppercase tracking-wider">Theme / Word:</label>
                  <input
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="flex-1 bg-transparent border-b border-zinc-700 focus:border-indigo-500 outline-none text-zinc-100 px-2 py-1 text-sm"
                    placeholder="e.g. The sea at midnight"
                  />
                </div>

                <div className="flex items-center gap-2 flex-1 w-full">
                  <label className="text-xs font-medium text-zinc-400 whitespace-nowrap uppercase tracking-wider flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showAcrostic}
                      onChange={(e) => setShowAcrostic(e.target.checked)}
                      className="rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500"
                    />
                    Acrostic:
                  </label>
                  {showAcrostic && (
                    <input
                      type="text"
                      value={acrostic}
                      onChange={(e) => setAcrostic(e.target.value)}
                      maxLength={lineCount}
                      className="flex-1 bg-transparent border-b border-zinc-700 focus:border-indigo-500 outline-none text-zinc-100 px-2 py-1 text-sm"
                      placeholder={`${lineCount}-letter word`}
                    />
                  )}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || (showAcrostic && acrostic.length !== lineCount && acrostic.length > 0)}
                className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-indigo-600/80 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 text-sm border border-indigo-500/30 shadow-lg shadow-indigo-900/20"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    Conjuring Muses...
                  </>
                ) : (
                  <>
                    <PenTool className="w-4 h-4" />
                    Compose Verse
                  </>
                )}
              </button>
              {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            </div>
          )}
        </div>

        {/* The Canvas / Template Area */}
        {isReady && (
          <div className={`flex-1 bg-zinc-950/50 p-6 rounded-2xl shadow-2xl border border-zinc-800/50 flex flex-col items-center justify-center overflow-y-auto backdrop-blur-sm ${fontClass}`}>
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div
                  key="trails"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
                  transition={{ duration: 0.8 }}
                  className={`w-full max-w-3xl misty-trail-container ${loading ? 'animate-pulse' : ''}`}
                >
                  {/* Rhyme scheme annotation */}
                  <div className="text-center text-xs text-zinc-500 font-sans mb-2 tracking-widest uppercase">
                    {selectedForm?.rhyme}
                  </div>
                  {Array.from({ length: lineCount }).map((_, i) => (
                    <div
                      key={i}
                      className="misty-trail"
                      style={{
                        width: `${Math.min(95, Math.max(30, syllablesPerLine * 5.5))}%`,
                        animationDelay: `${i * 0.15}s`
                      }}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="poem"
                  initial={{ opacity: 0, filter: "blur(8px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 1.0, ease: "easeOut" }}
                  className="w-full max-w-4xl space-y-1"
                >
                  <div className="space-y-1">
                    {result.lines.map((line, lIdx) => (
                      <div key={lIdx} className={`relative group py-2 ${line.isBlank ? 'mb-8' : ''}`}>
                        {/* Each line rendered as vertical columns: mark ABOVE syllable */}
                        <div className="flex flex-wrap justify-center items-end">
                          {line.syllables.map((syl, sIdx) => {
                            const isMidWord = !syl.syllable.endsWith(' ') && sIdx < line.syllables.length - 1
                              && !line.syllables[sIdx + 1]?.syllable?.match(/^[.,;:!?'")\]]/);

                            // Remove hyphens for intra-words, use padding/layout
                            return (
                              <React.Fragment key={sIdx}>
                                <div className="flex flex-col items-center">
                                  {/* Expected grid slot (W/S) displayed tiny above the stress mark */}
                                  <span className="text-[10px] font-sans text-emerald-500/60 font-medium mb-0.5 tracking-wider" title="Metrical Grid Position">
                                    {syl.expectedSlot}
                                  </span>
                                  {/* Scansion mark ALWAYS displayed above text */}
                                  <span
                                    className={`text-sm font-mono leading-tight mb-0.5 select-none ${syl.stress === '/'
                                      ? 'text-red-400 font-black drop-shadow-[0_0_4px_rgba(248,113,113,0.7)]'
                                      : syl.stress === '\\'
                                        ? 'text-purple-400 font-bold drop-shadow-[0_0_3px_rgba(192,132,252,0.6)]'
                                        : syl.isDivergent
                                          ? 'text-amber-400 font-bold drop-shadow-[0_0_3px_rgba(251,191,36,0.5)]'
                                          : 'text-sky-300 font-bold drop-shadow-[0_0_3px_rgba(125,211,252,0.5)]'
                                      }`}
                                    title={syl.isDivergent ? `Divergence: ${syl.divergenceType || 'extrametrical'}` : syl.divergenceType && syl.divergenceType !== 'none' ? `Divergence: ${syl.divergenceType}` : undefined}
                                  >
                                    {syl.stress === 'u' ? '˘' : syl.stress === '/' ? '´' : syl.stress === '\\' ? 'ˋ' : syl.stress}
                                  </span>
                                  {/* Syllable text — typographic bolding applied to stressed syllables */}
                                  <span className={`whitespace-pre text-xl md:text-2xl transition-all duration-300 ${syl.stress === '/'
                                    ? 'font-bold text-zinc-50 drop-shadow-[0_1px_3px_rgba(255,255,255,0.4)]'
                                    : syl.stress === '\\'
                                      ? 'font-medium text-zinc-100 drop-shadow-[0_1px_2px_rgba(255,255,255,0.2)]'
                                      : 'font-normal text-zinc-300'}`}>
                                    {syl.syllable}
                                  </span>
                                </div>
                              </React.Fragment>
                            );
                          })}
                        </div>

                        {/* Rhyme + Meter Info on hover */}
                        <div className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity font-sans">
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="px-1.5 py-0.5 rounded bg-zinc-800/90 text-[10px] text-zinc-300 uppercase tracking-wider border border-zinc-700/50">
                              {line.rhymeSound}{line.rhymeType && line.rhymeType !== 'perfect' ? ` (${line.rhymeType})` : ''}
                            </span>
                            {line.meterAdherence !== undefined && (
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${
                                line.meterAdherence >= 80 ? 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50' :
                                line.meterAdherence >= 50 ? 'bg-amber-900/60 text-amber-300 border-amber-700/50' :
                                'bg-red-900/60 text-red-300 border-red-700/50'
                              }`}>
                                {Math.round(line.meterAdherence)}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Copy / Export toolbar */}
                  <div className="mt-4 flex items-center justify-center gap-2 font-sans relative">
                    <button
                      onClick={() => handleCopy('text')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium transition-colors border border-zinc-700/50"
                    >
                      {copied === 'text' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied === 'text' ? 'Copied!' : 'Copy Poem'}
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setShowExport(!showExport)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium transition-colors border border-zinc-700/50"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Export
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      {showExport && (
                        <div className="absolute bottom-full mb-1 left-0 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden z-10 min-w-[160px]">
                          <button onClick={() => handleCopy('scansion')} className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-700 flex items-center gap-2">
                            <Music className="w-3 h-3" /> With Scansion
                          </button>
                          <button onClick={() => handleCopy('full')} className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-700 flex items-center gap-2">
                            <FileText className="w-3 h-3" /> Full Metadata
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 font-sans text-xs text-zinc-400 leading-relaxed text-center">
                    <strong className="text-zinc-200 block mb-1 uppercase tracking-wider text-[10px]">Architectural Notes:</strong>
                    {result.explanation}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
