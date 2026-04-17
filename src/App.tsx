import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Feather, BookOpen, ArrowRightLeft, PenTool, Settings, RotateCcw } from 'lucide-react';
import PoemAnalyzer from './components/PoemAnalyzer';
import TranslationComparator from './components/TranslationComparator';
import PoemGenerator from './components/PoemGenerator';
import SettingsModal from './components/SettingsModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'compose' | 'analyze' | 'compare'>('compose');
  const [showSettings, setShowSettings] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey(prev => prev + 1);
    setActiveTab('compose');
    setShowResetConfirm(false);
  };

  return (
    <div className="h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-900 flex flex-col overflow-hidden">
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md z-50 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Feather className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-bold tracking-widest font-marcellus uppercase">Lyrical</span>
          </div>

          <nav className="flex items-center gap-1 p-1 bg-zinc-900 rounded-lg">
            <TabButton
              active={activeTab === 'compose'}
              onClick={() => setActiveTab('compose')}
              icon={<PenTool className="w-3.5 h-3.5" />}
              label="Compose"
            />
            <TabButton
              active={activeTab === 'analyze'}
              onClick={() => setActiveTab('analyze')}
              icon={<BookOpen className="w-3.5 h-3.5" />}
              label="Analyze"
            />
            <TabButton
              active={activeTab === 'compare'}
              onClick={() => setActiveTab('compare')}
              icon={<ArrowRightLeft className="w-3.5 h-3.5" />}
              label="Compare"
            />
          </nav>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-zinc-100"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-zinc-100"
              title="Backend Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${resetKey}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full overflow-y-auto"
          >
            {activeTab === 'compose' && <PoemGenerator />}
            {activeTab === 'analyze' && <div className="max-w-7xl mx-auto px-4 py-12"><PoemAnalyzer /></div>}
            {activeTab === 'compare' && <div className="max-w-7xl mx-auto px-4 py-12"><TranslationComparator /></div>}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-6 max-w-sm mx-4 text-center"
            >
              <RotateCcw className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-zinc-100 mb-2 font-marcellus">Return to the Beginning?</h3>
              <p className="text-sm text-zinc-400 mb-5">This will clear your current composition and return to the opening screen.</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors"
                >
                  Stay
                </button>
                <button
                  onClick={handleReset}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-900/20"
                >
                  Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${active
          ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
        }`}
    >
      {icon}
      {label}
    </button>
  );
}
