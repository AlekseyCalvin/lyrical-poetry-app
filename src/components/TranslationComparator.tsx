import React, { useState } from 'react';
import { compareTranslation } from '../services/llmService';
import { ComparisonAnalysis } from '../types';
import Visualizer from './Visualizer';
import { Loader2, ArrowRightLeft } from 'lucide-react';

export default function TranslationComparator() {
  const [source, setSource] = useState('');
  const [translation, setTranslation] = useState('');
  const [analysis, setAnalysis] = useState<ComparisonAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompare = async () => {
    if (!source.trim() || !translation.trim()) return;
    setLoading(true);
    setError('');
    try {
      const result = await compareTranslation(source, translation);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'Failed to compare translations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-zinc-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-zinc-800">
          <label className="block text-sm font-medium mb-2 text-zinc-300">Source Poem</label>
          <textarea
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full h-64 p-4 bg-zinc-950 border border-zinc-800 rounded-xl font-serif text-lg resize-y focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-zinc-100"
            placeholder="Original text..."
          />
        </div>
        <div className="bg-zinc-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-zinc-800">
          <label className="block text-sm font-medium mb-2 text-zinc-300">Translation</label>
          <textarea
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            className="w-full h-64 p-4 bg-zinc-950 border border-zinc-800 rounded-xl font-serif text-lg resize-y focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-zinc-100"
            placeholder="Translated text..."
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleCompare}
          disabled={loading || !source.trim() || !translation.trim()}
          className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-indigo-900/50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRightLeft className="w-5 h-5" />}
          Compare Formal Fidelity
        </button>
      </div>
      {error && <p className="text-center text-red-400 text-sm">{error}</p>}

      {analysis && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-indigo-950/50 p-8 rounded-2xl border border-indigo-900/50 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-indigo-100">Comparison Notes</h3>
              <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full shadow-sm border border-zinc-800">
                <span className="text-sm font-medium text-zinc-300">Fidelity Score:</span>
                <span className="text-xl font-bold text-indigo-400">{analysis.fidelityScore}/10</span>
              </div>
            </div>
            <p className="text-lg leading-relaxed text-indigo-200">{analysis.comparisonNotes}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4 px-2 text-zinc-200">Source Analysis</h4>
              <Visualizer analysis={analysis.sourceAnalysis} />
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4 px-2 text-zinc-200">Translation Analysis</h4>
              <Visualizer analysis={analysis.translationAnalysis} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
