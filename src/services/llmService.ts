import { PoemAnalysis, ComparisonAnalysis, GeneratedPoem } from '../types';

// Always use the absolute server URL — relative paths resolve to tauri://localhost/
// in the Tauri desktop app, which fails. CORS headers on the server allow cross-origin.
const API_BASE = 'http://localhost:3001/api';
const STORAGE_KEY = 'lyrical-llm-settings';

function getLLMFields(): Record<string, any> {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const s = JSON.parse(stored);
            return {
                llmBaseUrl: s.baseUrl || '',
                llmApiKey: s.apiKey || '',
                llmModel: s.model || '',
                llmStrictMode: s.strictMode !== false,
            };
        }
    } catch { }
    return {};
}

export async function analyzePoem(text: string): Promise<PoemAnalysis> {
    const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, ...getLLMFields() }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error((err as any).error || `Analysis failed (${response.status})`);
    }

    return response.json();
}

export async function compareTranslation(
    source: string,
    translation: string
): Promise<ComparisonAnalysis> {
    const response = await fetch(`${API_BASE}/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, translation, ...getLLMFields() }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error((err as any).error || `Comparison failed (${response.status})`);
    }

    return response.json();
}

export async function composePoem(
    meter: string,
    foot: string,
    form: string,
    theme: string,
    acrostic: string
): Promise<GeneratedPoem> {
    const response = await fetch(`${API_BASE}/compose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meter, foot, form, theme, acrostic, ...getLLMFields() }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error((err as any).error || `Composition failed (${response.status})`);
    }

    return response.json();
}
