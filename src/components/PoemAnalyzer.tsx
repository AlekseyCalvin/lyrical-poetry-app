import React, { useState } from 'react';
import { analyzePoem } from '../services/llmService';
import { PoemAnalysis } from '../types';
import Visualizer from './Visualizer';
import { Loader2, Sparkles } from 'lucide-react';

export default function PoemAnalyzer() {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<PoemAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    try {
      const result = await analyzePoem(input);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze poem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-zinc-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-zinc-800">
        <label className="block text-sm font-medium mb-2 text-zinc-300">Enter Poem (English, Russian, etc.)</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-64 p-4 bg-zinc-950 border border-zinc-800 rounded-xl font-serif text-lg resize-y focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-zinc-100"
          placeholder="Paste your poem here..."
        />
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={loading || !input.trim()}
            className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 shadow-lg shadow-indigo-900/50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            Analyze Scansion & Form
          </button>
        </div>
        {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
      </div>

      {analysis && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Visualizer analysis={analysis} />
        </div>
      )}
    </div>
  );
}
