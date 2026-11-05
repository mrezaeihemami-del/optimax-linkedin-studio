import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  Globe2, 
  Cpu, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { SourceRegisterItem, AppSettings, Story, AIProvider, PostFormat, TemplateStyle } from '../types';

interface RunResearchModalProps {
  sources: SourceRegisterItem[];
  settings: AppSettings;
  onSuccess: (newStory: Story) => void;
  onClose: () => void;
}

export const RunResearchModal: React.FC<RunResearchModalProps> = ({
  sources,
  settings,
  onSuccess,
  onClose,
}) => {
  const [selectedSourceId, setSelectedSourceId] = useState<string>(sources[0]?.id || '');
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(settings.ai_provider || 'gemini-lite');
  const [selectedFormat, setSelectedFormat] = useState<PostFormat>('image');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateStyle>('executive_navy');
  const [customTopic, setCustomTopic] = useState('');
  const [sourcePassage, setSourcePassage] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedSource = sources.find((s) => s.id === selectedSourceId) || sources[0];

  const steps = [
    'Connecting to verified source register',
    `Running multi-agent pipeline with ${selectedProvider.toUpperCase()} engine`,
    'Validating 150–220 word limit, evidence quotes & duplicate logs',
    `Formatting native ${selectedFormat.toUpperCase()} asset (${selectedTemplate.replace('_', ' ')})`,
    'Posting draft to Pending Approval Queue for user review'
  ];

  const handleStartRun = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunning(true);
    setErrorMsg(null);
    setCurrentStep(1);

    // Simulate animated step progression for clarity
    const timer1 = setTimeout(() => setCurrentStep(2), 800);
    const timer2 = setTimeout(() => setCurrentStep(3), 2000);

    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization: selectedSource?.organization,
          source_url: selectedSource?.website,
          topic_hint: customTopic,
          supporting_passage: sourcePassage,
          preferred_provider: selectedProvider,
          format: selectedFormat,
          template_style: selectedTemplate,
        }),
      });

      const resData = await response.json();
      clearTimeout(timer1);
      clearTimeout(timer2);

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to generate post candidate');
      }

      setCurrentStep(4);
      setTimeout(() => {
        onSuccess(resData.data);
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during post generation.');
      setIsRunning(false);
      setCurrentStep(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 text-white rounded-lg shadow-xs shadow-blue-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Autonomous Research & Draft Run
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Polls HTA registers and synthesizes 1 LinkedIn post draft
              </p>
            </div>
          </div>
          {!isRunning && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!isRunning ? (
            <form onSubmit={handleStartRun} className="space-y-4">
              {/* Source Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-blue-600" />
                  Target Authority / Register
                </label>
                <select
                  value={selectedSourceId}
                  onChange={(e) => setSelectedSourceId(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                >
                  {sources.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.organization} ({s.country})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  Topics: {selectedSource?.topics}
                </p>
              </div>

              {/* Topic Hint (Optional) */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Focus Topic or Specific Announcement (Optional)
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g., JCA oncology methodology, RWE external controls, orphan drug threshold"
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Supporting context / text */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Source Excerpt or URL Context (Optional)
                </label>
                <textarea
                  rows={3}
                  value={sourcePassage}
                  onChange={(e) => setSourcePassage(e.target.value)}
                  placeholder="Paste excerpt from press release or consultation document..."
                  className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Format & Template Style Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    Target LinkedIn Format
                  </label>
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value as PostFormat)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  >
                    <option value="image">Single Image (1080×1350)</option>
                    <option value="carousel">Multi-Slide Document (PDF)</option>
                    <option value="poll">Interactive Poll</option>
                    <option value="article_link">Article Link Preview</option>
                    <option value="text_only">Executive Text Only</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    Visual Template Style
                  </label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value as TemplateStyle)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  >
                    <option value="executive_navy">Executive Navy</option>
                    <option value="breaking_alert">Breaking Alert</option>
                    <option value="comparative_grid">Comparative Grid</option>
                    <option value="stat_spotlight">Stat Spotlight</option>
                    <option value="editorial_light">Editorial Light</option>
                  </select>
                </div>
              </div>

              {/* Active AI Provider Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-blue-600" />
                    AI Workflow Engine
                  </span>
                  <span className="text-[11px] text-slate-400">Uses your 4 customized agent prompts</span>
                </label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value as any)}
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="gemini-lite">Google Gemini 3.1 Flash-Lite (Recommended - Fast & No 503 Spikes)</option>
                  <option value="gemini">Google Gemini 3.8 Flash (Advanced Reasoning)</option>
                  <option value="openai">OpenAI GPT-4o</option>
                  <option value="claude">Anthropic Claude 3.5 Sonnet</option>
                  <option value="deepseek">DeepSeek V3 / R1</option>
                  <option value="mistral">Mistral AI Large</option>
                  <option value="custom">Custom Provider Endpoint</option>
                </select>
              </div>

              {/* Action */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start Autonomous Synthesis</span>
                </button>
              </div>
            </form>
          ) : (
            /* Running Step-by-Step Animation */
            <div className="py-6 space-y-5">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-2">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Executing Optimax Editorial Research Run
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Analyzing {selectedSource?.organization}...
                </p>
              </div>

              <div className="space-y-3">
                {steps.map((st, idx) => {
                  const isDone = currentStep > idx;
                  const isCurrent = currentStep === idx;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-2.5 rounded-lg text-xs transition-colors ${
                        isDone
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300'
                          : isCurrent
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 font-medium'
                          : 'text-slate-400 dark:text-slate-600'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" />
                      )}
                      <span>{st}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
