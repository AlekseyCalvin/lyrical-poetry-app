import React from 'react';
import { motion } from 'motion/react';
import { PoemAnalysis, LineAnalysis } from '../types';

interface VisualizerProps {
  analysis: PoemAnalysis;
}

const RHYME_COLORS = [
  '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
];

function getRhymeColor(rhymeSound: string) {
  if (!rhymeSound || rhymeSound === 'X' || rhymeSound === '-') return 'transparent';
  const charCode = rhymeSound.toUpperCase().charCodeAt(0);
  if (charCode >= 65 && charCode <= 90) {
    return RHYME_COLORS[(charCode - 65) % RHYME_COLORS.length];
  }
  return 'transparent';
}

export default function Visualizer({ analysis }: VisualizerProps) {
  const { suggestedColors, stanzas } = analysis;

  return (
    <div 
      className="p-8 rounded-2xl shadow-2xl transition-colors duration-1000 font-serif border border-zinc-800"
      style={{ 
        backgroundColor: '#18181b', // zinc-900
        color: '#f4f4f5' // zinc-100
      }}
    >
      <div className="mb-8 border-b pb-4 border-zinc-800">
        <h2 className="text-3xl font-bold mb-2 text-indigo-400">Analysis Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4">
          <div><span className="opacity-70">Form:</span> <strong className="block text-lg text-zinc-200">{analysis.form}</strong></div>
          <div><span className="opacity-70">Meter:</span> <strong className="block text-lg text-zinc-200">{analysis.meter}</strong></div>
          <div><span className="opacity-70">Rhyme Scheme:</span> <strong className="block text-lg text-zinc-200">{analysis.rhymeScheme}</strong></div>
          <div><span className="opacity-70">Mood:</span> <strong className="block text-lg text-zinc-200">{analysis.mood}</strong></div>
        </div>
        <p className="mt-6 text-lg leading-relaxed text-zinc-300">{analysis.overallAnalysis}</p>
      </div>

      <div className="space-y-8">
        {stanzas.map((stanza, sIdx) => (
          <div key={sIdx} className="relative">
            <div className="absolute -left-6 top-0 bottom-0 w-1 rounded bg-indigo-500/20"></div>
            <div className="text-xs uppercase tracking-widest mb-2 text-zinc-500">{stanza.type}</div>
            <div className="space-y-4">
              {stanza.lines.map((line, lIdx) => (
                <LineVisualizer key={lIdx} line={line} accentColor="#818cf8" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LineVisualizer({ line, accentColor }: { line: LineAnalysis, accentColor: string, key?: React.Key }) {
  const rhymeColor = getRhymeColor(line.rhymeSound);
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="group relative flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors"
    >
      {/* Scansion & Text */}
      <div className="flex-1">
        <div className="flex gap-1 mb-1 text-xs font-mono opacity-60 tracking-[0.2em] text-zinc-400">
          {line.scansion.split('').map((char, i) => (
            <span key={i} className={char === '/' ? 'text-red-400 font-bold' : ''}>
              {char === 'u' ? '˘' : char === '/' ? '´' : char}
            </span>
          ))}
        </div>
        <div className="text-xl leading-relaxed text-zinc-100">
          {line.text}
        </div>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-3 text-xs font-sans opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-300" title="Syllables">
          {line.syllableCount} syl
        </span>
        <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-300" title="Feet">
          {line.feet.join(', ')}
        </span>
        {line.devices.length > 0 && (
          <span className="px-2 py-1 rounded border border-indigo-500/30 text-indigo-300" title="Devices">
            {line.devices.join(', ')}
          </span>
        )}
        <span 
          className="w-6 h-6 flex items-center justify-center rounded-full text-white font-bold shadow-sm"
          style={{ backgroundColor: rhymeColor !== 'transparent' ? rhymeColor : '#3f3f46' }}
          title={`Rhyme: ${line.rhymeWord}`}
        >
          {line.rhymeSound}
        </span>
      </div>
    </motion.div>
  );
}
