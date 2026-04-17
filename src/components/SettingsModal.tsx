import React, { useState, useEffect } from 'react';
import { X, Save, Server, Key, Cpu, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface LLMSettings {
    baseUrl: string;
    apiKey: string;
    model: string;
    strictMode?: boolean;
}

const DEFAULT_SETTINGS: LLMSettings = {
    baseUrl: 'https://openrouter.ai/api/v1',
    apiKey: '',
    model: 'arcee-ai/trinity-large-preview:free',
    strictMode: true,
};

const STORAGE_KEY = 'lyrical-llm-settings';

export function loadSettings(): LLMSettings {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
        }
    } catch { }
    return DEFAULT_SETTINGS;
}

export function saveSettings(settings: LLMSettings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const [settings, setSettings] = useState<LLMSettings>(loadSettings);
    const [saved, setSaved] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);

    useEffect(() => {
        if (isOpen) {
            setSettings(loadSettings());
            setSaved(false);
            setTestResult(null);
        }
    }, [isOpen]);

    const handleSave = () => {
        saveSettings(settings);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleTest = async () => {
        setTesting(true);
        setTestResult(null);
        try {
            const res = await fetch('http://localhost:3001/api/health', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    llmBaseUrl: settings.baseUrl,
                    llmApiKey: settings.apiKey,
                    llmModel: settings.model,
                }),
            });
            const data = await res.json() as Record<string, string>;
            if (res.ok) {
                setTestResult({ ok: true, msg: `✓ Connected — Model: ${data.model}` });
            } else {
                setTestResult({ ok: false, msg: data.error || 'Connection failed' });
            }
        } catch (err: any) {
            setTestResult({ ok: false, msg: err.message || 'Connection failed' });
        } finally {
            setTesting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    onClick={(e) => e.target === e.currentTarget && onClose()}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25 }}
                        className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                            <h2 className="text-lg font-bold text-zinc-100 font-marcellus tracking-wider">Backend Settings</h2>
                            <button onClick={onClose} className="p-1 hover:bg-zinc-800 rounded-lg transition-colors">
                                <X className="w-5 h-5 text-zinc-400" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-5 space-y-5">
                            <p className="text-xs text-zinc-500 leading-relaxed">
                                Configure any OpenAI-compatible API endpoint. Works with OpenRouter, Ollama, vLLM, LM Studio, and more.
                            </p>

                            {/* API Base URL */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                                    <Server className="w-3.5 h-3.5" /> API Base URL
                                </label>
                                <input
                                    type="text"
                                    value={settings.baseUrl}
                                    onChange={(e) => setSettings({ ...settings, baseUrl: e.target.value })}
                                    placeholder="https://openrouter.ai/api/v1"
                                    className="w-full p-2.5 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none placeholder-zinc-600"
                                />
                            </div>

                            {/* API Key */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                                    <Key className="w-3.5 h-3.5" /> API Key
                                </label>
                                <input
                                    type="password"
                                    value={settings.apiKey}
                                    onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                                    placeholder="sk-or-v1-..."
                                    className="w-full p-2.5 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none placeholder-zinc-600"
                                />
                            </div>

                            {/* Model */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                                    <Cpu className="w-3.5 h-3.5" /> Model Name
                                </label>
                                <input
                                    type="text"
                                    value={settings.model}
                                    onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                                    placeholder="arcee-ai/trinity-large-preview:free"
                                    className="w-full p-2.5 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none placeholder-zinc-600"
                                />
                            </div>

                            {/* Strict Mode Toggle */}
                            <div className="flex items-center justify-between bg-zinc-950/50 p-3 rounded-lg border border-zinc-800">
                                <div>
                                    <label className="text-sm font-medium text-zinc-200">Enforce Strict Schema</label>
                                    <p className="text-[10px] text-zinc-500 mt-0.5">Off for models that crash OpenRouter validation (Nemotron).</p>
                                </div>
                                <button
                                    role="switch"
                                    aria-checked={settings.strictMode !== false}
                                    onClick={() => setSettings({ ...settings, strictMode: settings.strictMode === false ? true : false })}
                                    className={`relative inline-flex h-5 w-9 focus:outline-none items-center rounded-full transition-colors ${settings.strictMode !== false ? 'bg-indigo-500' : 'bg-zinc-700'}`}
                                >
                                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${settings.strictMode !== false ? 'translate-x-5' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            {/* Presets */}
                            <div className="flex flex-wrap gap-2">
                                <span className="text-xs text-zinc-500">Quick presets:</span>
                                <button
                                    onClick={() => setSettings({ ...settings, baseUrl: 'https://openrouter.ai/api/v1' })}
                                    className="text-xs px-2 py-0.5 bg-zinc-800 rounded text-zinc-400 hover:text-indigo-300 transition-colors"
                                >
                                    OpenRouter
                                </button>
                                <button
                                    onClick={() => setSettings({ ...settings, baseUrl: 'http://localhost:11434/v1', model: 'llama3' })}
                                    className="text-xs px-2 py-0.5 bg-zinc-800 rounded text-zinc-400 hover:text-indigo-300 transition-colors"
                                >
                                    Ollama (local)
                                </button>
                                <button
                                    onClick={() => setSettings({ ...settings, baseUrl: 'http://localhost:1234/v1', model: 'local-model' })}
                                    className="text-xs px-2 py-0.5 bg-zinc-800 rounded text-zinc-400 hover:text-indigo-300 transition-colors"
                                >
                                    LM Studio
                                </button>
                            </div>

                            {/* Test result */}
                            {testResult && (
                                <div className={`text-xs px-3 py-2 rounded-lg ${testResult.ok ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/50' : 'bg-red-950/50 text-red-400 border border-red-800/50'}`}>
                                    {testResult.msg}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-950/50">
                            <button
                                onClick={handleTest}
                                disabled={testing || !settings.baseUrl}
                                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm transition-colors disabled:opacity-50"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                {testing ? 'Testing...' : 'Test Connection'}
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-900/20"
                            >
                                <Save className="w-3.5 h-3.5" />
                                {saved ? 'Saved ✓' : 'Save Settings'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
