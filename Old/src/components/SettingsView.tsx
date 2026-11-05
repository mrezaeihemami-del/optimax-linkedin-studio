import React, { useState } from 'react';
import { 
  Key, 
  Linkedin, 
  Cpu, 
  Image as ImageIcon, 
  Clock, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  ExternalLink,
  Sparkles,
  Palette,
  Eye,
  EyeOff,
  Lock,
  Bot,
  RotateCcw,
  Sliders,
  Server
} from 'lucide-react';
import { AppSettings, AIProvider, WorkflowAgentPrompts } from '../types';
import { DEFAULT_AGENT_PROMPTS } from '../data/initialData';

interface SettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => Promise<void>;
  onLogout?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onLogout,
}) => {
  const [formData, setFormData] = useState<AppSettings>({
    ...settings,
    agent_prompts: settings.agent_prompts || DEFAULT_AGENT_PROMPTS,
  });

  const [activeSubTab, setActiveSubTab] = useState<'providers' | 'prompts' | 'linkedin' | 'cadence' | 'security'>('providers');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Visibility toggles
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordStatus, setPasswordStatus] = useState<{
    loading: boolean;
    success: boolean | null;
    message: string;
  }>({ loading: false, success: null, message: '' });

  // Connection testing states
  const [testState, setTestState] = useState<{
    type: string | null;
    loading: boolean;
    success: boolean | null;
    message: string;
  }>({
    type: null,
    loading: false,
    success: null,
    message: '',
  });

  const [isDetectingIdentity, setIsDetectingIdentity] = useState(false);
  const [detectedIdentity, setDetectedIdentity] = useState<{
    name: string;
    personUrn: string;
    organizations: Array<{ id: string; urn: string }>;
  } | null>(null);

  const handleAutoDetectLinkedIn = async () => {
    if (!formData.linkedin_access_token) {
      alert('ابتدا Access Token را در کادر زیر وارد کنید.');
      return;
    }
    setIsDetectingIdentity(true);
    try {
      const res = await fetch(`/api/linkedin/detect-identity?token=${encodeURIComponent(formData.linkedin_access_token)}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to detect identity');
      }
      const d = data.data;
      setDetectedIdentity(d);

      // Auto-set author URN if currently empty or default
      const isDefault = !formData.linkedin_org_urn || formData.linkedin_org_urn === 'urn:li:organization:98471203';
      if (isDefault) {
        const urnToUse = d.organizations && d.organizations.length > 0 ? d.organizations[0].urn : d.personUrn;
        setFormData((prev) => ({
          ...prev,
          linkedin_org_urn: urnToUse,
          linkedin_org_name: prev.linkedin_org_name || d.name,
        }));
      }
    } catch (err: any) {
      alert(`خطا در شناسایی هویت لینکدین: ${err.message}`);
    } finally {
      setIsDetectingIdentity(false);
    }
  };

  const toggleKeyVisibility = (field: string) => {
    setShowKeys((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleTestConnection = async (type: string) => {
    setTestState({ type, loading: true, success: null, message: 'Verifying credentials...' });
    try {
      await onSaveSettings(formData);
      const resp = await fetch('/api/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) {
        throw new Error(data.error || 'Connection check failed');
      }
      setTestState({
        type,
        loading: false,
        success: true,
        message: data.message || 'Connection verified successfully!',
      });
    } catch (err: any) {
      setTestState({
        type,
        loading: false,
        success: false,
        message: err.message || 'Failed to connect. Check credentials.',
      });
    }
  };

  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await onSaveSettings(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({
        loading: false,
        success: false,
        message: 'New password and confirmation do not match.',
      });
      return;
    }

    if (passwordForm.newPassword.length < 4) {
      setPasswordStatus({
        loading: false,
        success: false,
        message: 'New password must be at least 4 characters.',
      });
      return;
    }

    setPasswordStatus({ loading: true, success: null, message: 'Updating password...' });

    try {
      const resp = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: passwordForm.currentPassword,
          new_password: passwordForm.newPassword,
        }),
      });
      const data = await resp.json();

      if (!resp.ok || !data.success) {
        throw new Error(data.error || 'Failed to update password');
      }

      setPasswordStatus({
        loading: false,
        success: true,
        message: 'Password successfully updated! Use your new password on future logins.',
      });

      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setPasswordStatus({
        loading: false,
        success: false,
        message: err.message || 'Error updating password',
      });
    }
  };

  const handleResetPrompts = () => {
    if (window.confirm('Reset all 4 agent prompts to Optimax default benchmarks?')) {
      setFormData({
        ...formData,
        agent_prompts: { ...DEFAULT_AGENT_PROMPTS },
      });
    }
  };

  const toggleDay = (day: string) => {
    const current = formData.schedule_days || [];
    if (current.includes(day)) {
      setFormData({ ...formData, schedule_days: current.filter((d) => d !== day) });
    } else {
      setFormData({ ...formData, schedule_days: [...current, day] });
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Studio Settings & Agent Configuration
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure multi-provider AI keys, workflow agent system prompts, LinkedIn publishing credentials, and account password
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onLogout && (
            <button
              onClick={onLogout}
              className="px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
            >
              Log Out
            </button>
          )}

          <button
            onClick={() => handleSaveAll()}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>All settings and agent configurations saved successfully.</span>
        </div>
      )}

      {/* Sub-Tabs Navigation */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
        {[
          { id: 'providers' as const, label: 'AI Providers & Keys', icon: Cpu },
          { id: 'prompts' as const, label: 'Agent Prompts Studio', icon: Bot },
          { id: 'linkedin' as const, label: 'LinkedIn & Templates', icon: Linkedin },
          { id: 'cadence' as const, label: 'Cadence & Schedule', icon: Clock },
          { id: 'security' as const, label: 'Password & Security', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: AI Providers & API Keys */}
      {activeSubTab === 'providers' && (
        <div className="space-y-6">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Active AI Model Provider
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select which engine powers the research and writing agents
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleTestConnection(formData.ai_provider)}
                disabled={testState.loading}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Test {formData.ai_provider.toUpperCase()} Connection
              </button>
            </div>

            {/* Provider Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'gemini-lite' as AIProvider, name: 'Google Gemini 3.1 Flash-Lite', desc: 'Fast, high capacity, resilient against 503 traffic spikes (Recommended)', recommended: true },
                { id: 'gemini' as AIProvider, name: 'Google Gemini 3.8 Flash', desc: 'Deep reasoning & advanced synthesis (auto-falls back if busy)' },
                { id: 'openai' as AIProvider, name: 'OpenAI GPT-4o', desc: 'Requires custom OpenAI API key' },
                { id: 'claude' as AIProvider, name: 'Claude 3.5 Sonnet', desc: 'Requires Anthropic API key' },
                { id: 'deepseek' as AIProvider, name: 'DeepSeek V3 / R1', desc: 'Requires DeepSeek API key' },
                { id: 'mistral' as AIProvider, name: 'Mistral Large', desc: 'Requires Mistral API key' },
                { id: 'custom' as AIProvider, name: 'Custom OpenAI-Compatible', desc: 'Groq, Together, Ollama, Perplexity, OpenRouter' },
              ].map((p) => (
                <div
                  key={p.id}
                  onClick={() => setFormData({ ...formData, ai_provider: p.id })}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    formData.ai_provider === p.id
                      ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 ring-1 ring-blue-600/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {p.name}
                    </span>
                    {p.id === 'gemini' && (
                      <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950 px-1.5 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Provider Credentials Form */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                API Keys Vault
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* OpenAI */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                    <span>OpenAI API Key</span>
                    <button
                      type="button"
                      onClick={() => toggleKeyVisibility('openai')}
                      className="text-[11px] text-slate-400 hover:text-slate-600"
                    >
                      {showKeys['openai'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </label>
                  <input
                    type={showKeys['openai'] ? 'text' : 'password'}
                    placeholder="sk-..."
                    value={formData.openai_key || ''}
                    onChange={(e) => setFormData({ ...formData, openai_key: e.target.value })}
                    className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                  />
                </div>

                {/* Claude */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                    <span>Anthropic Claude API Key</span>
                    <button
                      type="button"
                      onClick={() => toggleKeyVisibility('claude')}
                      className="text-[11px] text-slate-400 hover:text-slate-600"
                    >
                      {showKeys['claude'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </label>
                  <input
                    type={showKeys['claude'] ? 'text' : 'password'}
                    placeholder="sk-ant-..."
                    value={formData.claude_key || ''}
                    onChange={(e) => setFormData({ ...formData, claude_key: e.target.value })}
                    className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                  />
                </div>

                {/* DeepSeek */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                    <span>DeepSeek API Key</span>
                    <button
                      type="button"
                      onClick={() => toggleKeyVisibility('deepseek')}
                      className="text-[11px] text-slate-400 hover:text-slate-600"
                    >
                      {showKeys['deepseek'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </label>
                  <input
                    type={showKeys['deepseek'] ? 'text' : 'password'}
                    placeholder="sk-..."
                    value={formData.deepseek_key || ''}
                    onChange={(e) => setFormData({ ...formData, deepseek_key: e.target.value })}
                    className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                  />
                </div>

                {/* Mistral */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                    <span>Mistral AI Key</span>
                    <button
                      type="button"
                      onClick={() => toggleKeyVisibility('mistral')}
                      className="text-[11px] text-slate-400 hover:text-slate-600"
                    >
                      {showKeys['mistral'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </label>
                  <input
                    type={showKeys['mistral'] ? 'text' : 'password'}
                    placeholder="mst-..."
                    value={formData.mistral_key || ''}
                    onChange={(e) => setFormData({ ...formData, mistral_key: e.target.value })}
                    className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                  />
                </div>
              </div>

              {/* Custom Provider Settings */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Custom OpenAI-Compatible Provider Setup (Groq, Together, Ollama, etc.)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                      Endpoint Base URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://api.groq.com/openai/v1"
                      value={formData.custom_api_url || ''}
                      onChange={(e) => setFormData({ ...formData, custom_api_url: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                      Model Identifier
                    </label>
                    <input
                      type="text"
                      placeholder="llama-3.3-70b-versatile"
                      value={formData.custom_model_name || ''}
                      onChange={(e) => setFormData({ ...formData, custom_model_name: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                      Bearer API Key (Optional)
                    </label>
                    <input
                      type="password"
                      placeholder="gsk_..."
                      value={formData.custom_api_key || ''}
                      onChange={(e) => setFormData({ ...formData, custom_api_key: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Workflow Agents & Prompt Studio */}
      {activeSubTab === 'prompts' && (
        <div className="space-y-6">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Agent Workflow & Prompt Studio
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Customize the specific instructions and constraints for each autonomous stage of the publication pipeline
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetPrompts}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Benchmarks</span>
              </button>
            </div>

            {/* Prompt 1: Research Agent */}
            <div className="space-y-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center font-mono text-[10px]">
                    01
                  </span>
                  Agent 1: HTA Research & Regulatory Intelligence Agent
                </span>
                <span className="text-[11px] text-slate-400">Source extraction & freshness rules</span>
              </div>
              <textarea
                rows={4}
                value={formData.agent_prompts.research_agent}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    agent_prompts: { ...formData.agent_prompts, research_agent: e.target.value },
                  })
                }
                className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono leading-relaxed"
              />
            </div>

            {/* Prompt 2: Copywriter Agent */}
            <div className="space-y-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center font-mono text-[10px]">
                    02
                  </span>
                  Agent 2: LinkedIn Executive Copywriter Agent
                </span>
                <span className="text-[11px] text-slate-400">150–220 words, hooks, 3 implications & hashtags</span>
              </div>
              <textarea
                rows={5}
                value={formData.agent_prompts.copywriter_agent}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    agent_prompts: { ...formData.agent_prompts, copywriter_agent: e.target.value },
                  })
                }
                className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono leading-relaxed"
              />
            </div>

            {/* Prompt 3: Graphic Template Agent */}
            <div className="space-y-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center font-mono text-[10px]">
                    03
                  </span>
                  Agent 3: 1080×1350 Visual Graphic Template Agent
                </span>
                <span className="text-[11px] text-slate-400">Headline max 10 words, Subtitle max 20 words, 3 points max 12 words</span>
              </div>
              <textarea
                rows={4}
                value={formData.agent_prompts.graphic_agent}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    agent_prompts: { ...formData.agent_prompts, graphic_agent: e.target.value },
                  })
                }
                className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono leading-relaxed"
              />
            </div>

            {/* Prompt 4: Compliance Auditor Agent */}
            <div className="space-y-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center font-mono text-[10px]">
                    04
                  </span>
                  Agent 4: Fact-Checking & Compliance Auditor Agent
                </span>
                <span className="text-[11px] text-slate-400">Verifying evidence quotes & preventing duplicate stories</span>
              </div>
              <textarea
                rows={4}
                value={formData.agent_prompts.compliance_agent}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    agent_prompts: { ...formData.agent_prompts, compliance_agent: e.target.value },
                  })
                }
                className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: LinkedIn & Visual Graphic Settings */}
      {activeSubTab === 'linkedin' && (
        <div className="space-y-6">
          {/* LinkedIn API Integration */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-600 text-white rounded-lg">
                  <Linkedin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    LinkedIn Company Page Publishing
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Publish directly to Optimax Access company page
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleTestConnection('linkedin')}
                disabled={testState.loading}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Verify Token
              </button>
            </div>

            {/* Quick Step-by-Step Helper Notice */}
            <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl text-xs space-y-2 text-slate-700 dark:text-slate-300">
              <div className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>راهنمای ۳ مرحله‌ای فعال‌سازی دسترسی‌ها و دریافت توکن:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                <li>
                  <strong>فعال‌سازی اسکوپ‌ها:</strong> در پنل لینکدین به تب <strong>Products</strong> بروید و دکمه <strong>Request access</strong> را برای محصولات <strong>Share on LinkedIn</strong> و <strong>Sign In with LinkedIn using OpenID Connect</strong> بزنید.
                </li>
                <li>
                  <strong>دریافت توکن بدون دردسر:</strong> از منوی بالای پنل لینکدین روی <strong>Docs and tools</strong> کلیک کرده و <strong>Token Generator</strong> را انتخاب کنید (یا لینک مستقیم:{' '}
                  <a
                    href="https://www.linkedin.com/developers/tools/oauth"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline font-semibold inline-flex items-center gap-0.5"
                  >
                    LinkedIn OAuth Token Generator <ExternalLink className="w-2.5 h-2.5 inline" />
                  </a>
                  ).
                </li>
                <li>
                  اپلیکیشن را انتخاب کرده، دسترسی‌ها را تیک بزنید و توکن دریافتی (شروع با AQX) را در فیلد زیر قرار دهید.
                </li>
              </ol>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Client ID (از تب Auth تصویر شما)
                </label>
                <input
                  type="text"
                  placeholder="86yqmlkww8szrk"
                  value={formData.linkedin_client_id || ''}
                  onChange={(e) => setFormData({ ...formData, linkedin_client_id: e.target.value })}
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>Client Secret</span>
                  <button
                    type="button"
                    onClick={() => toggleKeyVisibility('li_secret')}
                    className="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showKeys['li_secret'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </label>
                <input
                  type={showKeys['li_secret'] ? 'text' : 'password'}
                  placeholder="Primary Client Secret..."
                  value={formData.linkedin_client_secret || ''}
                  onChange={(e) => setFormData({ ...formData, linkedin_client_secret: e.target.value })}
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>LinkedIn OAuth 2.0 Access Token (Bearer Token)</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAutoDetectLinkedIn}
                      disabled={isDetectingIdentity}
                      className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-blue-600" />
                      <span>{isDetectingIdentity ? 'در حال بررسی هویت...' : 'تشخیص خودکار هویت با توکن'}</span>
                    </button>
                    <span>·</span>
                    <button
                      type="button"
                      onClick={() => toggleKeyVisibility('linkedin')}
                      className="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showKeys['linkedin'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </div>
                </label>
                <input
                  type={showKeys['linkedin'] ? 'text' : 'password'}
                  placeholder="AQX... (Paste the Bearer Token from Token Generator)"
                  value={formData.linkedin_access_token || ''}
                  onChange={(e) => setFormData({ ...formData, linkedin_access_token: e.target.value })}
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                />
              </div>

              {/* Detected Identity Notification */}
              {detectedIdentity && (
                <div className="sm:col-span-2 p-3 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      هویت لینکدین تأیید شد: {detectedIdentity.name}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                      {detectedIdentity.personUrn}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-emerald-200/60 dark:border-emerald-800/60 text-[11px]">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">مقصد انتشار:</span>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, linkedin_org_urn: detectedIdentity.personUrn }))}
                      className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                        formData.linkedin_org_urn === detectedIdentity.personUrn
                          ? 'bg-emerald-700 text-white'
                          : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200'
                      }`}
                    >
                      پروفایل شخصی ({detectedIdentity.name})
                    </button>
                    {detectedIdentity.organizations.map((org) => (
                      <button
                        key={org.urn}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, linkedin_org_urn: org.urn }))}
                        className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                          formData.linkedin_org_urn === org.urn
                            ? 'bg-emerald-700 text-white'
                            : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200'
                        }`}
                      >
                        صفحه شرکت ({org.id})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>Author URN (شناسه نویسنده برای ارسال)</span>
                  <span className="text-[10px] text-slate-400">person یا organization</span>
                </label>
                <input
                  type="text"
                  placeholder="urn:li:person:... یا urn:li:organization:..."
                  value={formData.linkedin_org_urn || ''}
                  onChange={(e) => setFormData({ ...formData, linkedin_org_urn: e.target.value })}
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Author / Organization Display Name
                </label>
                <input
                  type="text"
                  placeholder="Optimax Access"
                  value={formData.linkedin_org_name || ''}
                  onChange={(e) => setFormData({ ...formData, linkedin_org_name: e.target.value })}
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
                />
              </div>
            </div>
          </div>

          {/* Bannerbear Option */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Bannerbear Master Template (Optional)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Optional external rendering hook; the studio includes a built-in canvas renderer by default
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Bannerbear API Key
                </label>
                <input
                  type="password"
                  placeholder="bb_pr_..."
                  value={formData.bannerbear_api_key || ''}
                  onChange={(e) => setFormData({ ...formData, bannerbear_api_key: e.target.value })}
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Bannerbear Template ID
                </label>
                <input
                  type="text"
                  placeholder="optimax-1080x1350-master"
                  value={formData.bannerbear_template_id || ''}
                  onChange={(e) => setFormData({ ...formData, bannerbear_template_id: e.target.value })}
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: Cadence & Schedule Rules */}
      {activeSubTab === 'cadence' && (
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Publishing Cadence & Slot Schedule
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Suggested schedule: research weekdays, publish up to 3 posts per week at 09:00 London time
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
              Active Publication Days
            </label>
            <div className="flex flex-wrap gap-2">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
                const isSelected = (formData.schedule_days || []).includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Target Publish Time
              </label>
              <input
                type="time"
                value={formData.schedule_time || '09:00'}
                onChange={(e) => setFormData({ ...formData, schedule_time: e.target.value })}
                className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Timezone
              </label>
              <select
                value={formData.schedule_timezone || 'Europe/London'}
                onChange={(e) => setFormData({ ...formData, schedule_timezone: e.target.value })}
                className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
              >
                <option value="Europe/London">Europe / London (GMT/BST)</option>
                <option value="Europe/Paris">Europe / Paris (CET)</option>
                <option value="Europe/Berlin">Europe / Berlin (CET)</option>
                <option value="America/New_York">America / New York (EST)</option>
                <option value="Asia/Tokyo">Asia / Tokyo (JST)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Max Posts Per Week
              </label>
              <input
                type="number"
                min={1}
                max={7}
                value={formData.max_posts_per_week || 3}
                onChange={(e) => setFormData({ ...formData, max_posts_per_week: parseInt(e.target.value, 10) || 3 })}
                className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: Security & Password Change */}
      {activeSubTab === 'security' && (
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Change Portal Access Password
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Update the password required to access the studio from the landing page
              </p>
            </div>
          </div>

          {passwordStatus.message && (
            <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              passwordStatus.success
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
            }`}>
              {passwordStatus.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{passwordStatus.message}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Current Password
              </label>
              <input
                type="password"
                required
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder="Default: admin1234"
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                New Password
              </label>
              <input
                type="password"
                required
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Minimum 4 characters"
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Re-type new password"
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
              />
            </div>

            <button
              type="submit"
              disabled={passwordStatus.loading}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm disabled:opacity-50 transition-colors"
            >
              {passwordStatus.loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>
      )}

      {/* Persistent Save Bar */}
      <div className="flex items-center justify-between pt-2">
        {testState.message ? (
          <div className={`text-xs flex items-center gap-1.5 ${
            testState.success ? 'text-emerald-600' : 'text-amber-600'
          }`}>
            {testState.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{testState.message}</span>
          </div>
        ) : (
          <span className="text-xs text-slate-400">All configurations are saved to application state</span>
        )}

        <button
          type="button"
          onClick={() => handleSaveAll()}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 disabled:opacity-50 transition-colors"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>

    </div>
  );
};
