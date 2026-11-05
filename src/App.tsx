/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { ReviewQueueView } from './components/ReviewQueueView';
import { SourceRegisterView } from './components/SourceRegisterView';
import { ScheduleCalendarView } from './components/ScheduleCalendarView';
import { SettingsView } from './components/SettingsView';
import { StoryEditorModal } from './components/StoryEditorModal';
import { RunResearchModal } from './components/RunResearchModal';
import { AnalyticsDashboardView } from './components/AnalyticsDashboardView';
import { LandingPage } from './components/LandingPage';
import { Story, SourceRegisterItem, AppSettings, PostMetrics } from './types';
import { INITIAL_SOURCES, INITIAL_SETTINGS, INITIAL_STORIES } from './data/initialData';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!sessionStorage.getItem('optimax_auth_token');
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('queue');
  const [isDark, setIsDark] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [sources, setSources] = useState<SourceRegisterItem[]>(INITIAL_SOURCES);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);

  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Toggle Dark Mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDark = () => setIsDark((prev) => !prev);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Fetch data from server
  const fetchData = async () => {
    try {
      const [settingsRes, sourcesRes, storiesRes] = await Promise.all([
        fetch('/api/settings').then((r) => r.json()),
        fetch('/api/sources').then((r) => r.json()),
        fetch('/api/stories').then((r) => r.json()),
      ]);

      if (settingsRes.success && settingsRes.data) setSettings(settingsRes.data);
      if (sourcesRes.success && sourcesRes.data) setSources(sourcesRes.data);
      if (storiesRes.success && storiesRes.data) setStories(storiesRes.data);
    } catch (err) {
      console.warn('Could not connect to backend store, using client defaults:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Story Management
  const handleUpdateStory = async (updated: Story) => {
    setStories((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    try {
      await fetch(`/api/stories/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      showToast(`Story status updated to ${updated.status}`);
    } catch (err) {
      console.error('Failed to update story on server:', err);
    }
  };

  const handleDeleteStory = async (id: string) => {
    setStories((prev) => prev.filter((s) => s.id !== id));
    try {
      await fetch(`/api/stories/${id}`, { method: 'DELETE' });
      showToast('Draft removed from queue', 'info');
    } catch (err) {
      console.error('Failed to delete story on server:', err);
    }
  };

  const handleSaveEditedStory = async (updated: Story) => {
    setStories((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setEditingStory(null);
    try {
      await fetch(`/api/stories/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      showToast('Post caption, format, and template updated successfully');
    } catch (err) {
      console.error('Failed to save edited story:', err);
    }
  };

  const handleUpdateMetrics = async (storyId: string, metrics: PostMetrics) => {
    try {
      const res = await fetch(`/api/stories/${storyId}/metrics`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metrics),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setStories((prev) => prev.map((s) => (s.id === storyId ? data.data : s)));
        showToast('Performance metrics logged and engagement rate recalculated!');
      }
    } catch (err) {
      console.error('Failed to update metrics:', err);
      showToast('Failed to update metrics on server', 'error');
    }
  };

  const handlePollVote = async (storyId: string, optionId: string) => {
    try {
      const res = await fetch(`/api/stories/${storyId}/poll-vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setStories((prev) => prev.map((s) => (s.id === storyId ? data.data : s)));
        showToast('Your vote was counted in the LinkedIn poll preview!');
      }
    } catch (err) {
      console.error('Failed to register poll vote:', err);
    }
  };

  const handlePublishStory = async (storyId: string) => {
    setIsPublishing(true);
    try {
      const response = await fetch('/api/publish-linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to publish to LinkedIn');
      }

      setStories((prev) =>
        prev.map((s) => (s.id === storyId ? data.story : s))
      );

      if (data.mode === 'live') {
        showToast('Successfully published post directly to Optimax Access LinkedIn page!');
      } else {
        showToast('Published in Authenticated Simulation Mode (Post ID created). Ready for LinkedIn broadcast!');
      }
    } catch (err: any) {
      showToast(err.message || 'Publishing failed', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  // Source Register Management
  const handleAddSource = async (newSrc: Partial<SourceRegisterItem>) => {
    try {
      const resp = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSrc),
      });
      const data = await resp.json();
      if (data.success && data.data) {
        setSources((prev) => [data.data, ...prev]);
        showToast('New HTA source added to registry');
      }
    } catch (err) {
      console.error('Failed to add source:', err);
    }
  };

  const handleUpdateSource = async (updated: SourceRegisterItem) => {
    setSources((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    try {
      await fetch(`/api/sources/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      showToast('Source updated');
    } catch (err) {
      console.error('Failed to update source:', err);
    }
  };

  const handleDeleteSource = async (id: string) => {
    setSources((prev) => prev.filter((s) => s.id !== id));
    try {
      await fetch(`/api/sources/${id}`, { method: 'DELETE' });
      showToast('Source removed from register', 'info');
    } catch (err) {
      console.error('Failed to delete source:', err);
    }
  };

  const handleTriggerFromSource = (source: SourceRegisterItem) => {
    setIsRunModalOpen(true);
  };

  // Settings Management
  const handleSaveSettings = async (newSettings: AppSettings) => {
    setSettings(newSettings);
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      showToast('Settings saved');
    } catch (err) {
      console.error('Failed to update settings:', err);
      throw err;
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('optimax_auth_token');
    setIsAuthenticated(false);
    showToast('Logged out of studio session', 'info');
  };

  const pendingCount = stories.filter((s) => s.status === 'pending').length;

  if (!isAuthenticated) {
    return (
      <LandingPage
        onLoginSuccess={(user) => {
          setIsAuthenticated(true);
          showToast(`Welcome back, ${user.username}! Studio dashboard ready.`);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Toast notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto p-3 rounded-xl shadow-lg border flex items-center justify-between gap-2.5 text-xs font-medium animate-in slide-in-from-bottom-2 ${
              t.type === 'error'
                ? 'bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200'
                : 'bg-slate-900 dark:bg-white border-slate-800 dark:border-slate-100 text-white dark:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2">
              {t.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span>{t.message}</span>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
              className="p-1 opacity-70 hover:opacity-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingCount}
        isDark={isDark}
        toggleDark={toggleDark}
        onOpenRunModal={() => setIsRunModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'queue' && (
          <ReviewQueueView
            stories={stories}
            settings={settings}
            onUpdateStory={handleUpdateStory}
            onDeleteStory={handleDeleteStory}
            onEditStory={(st) => setEditingStory(st)}
            onPublishStory={handlePublishStory}
            isPublishing={isPublishing}
            onOpenRunModal={() => setIsRunModalOpen(true)}
            onPollVote={handlePollVote}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboardView
            stories={stories}
            onUpdateMetrics={handleUpdateMetrics}
            onRefresh={fetchData}
          />
        )}

        {activeTab === 'calendar' && (
          <ScheduleCalendarView
            stories={stories}
            settings={settings}
            onSelectStory={(st) => {
              setActiveTab('queue');
            }}
          />
        )}

        {activeTab === 'sources' && (
          <SourceRegisterView
            sources={sources}
            onAddSource={handleAddSource}
            onUpdateSource={handleUpdateSource}
            onDeleteSource={handleDeleteSource}
            onTriggerFromSource={handleTriggerFromSource}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onSaveSettings={handleSaveSettings}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Story Edit Drawer / Modal */}
      {editingStory && (
        <StoryEditorModal
          story={editingStory}
          onSave={handleSaveEditedStory}
          onClose={() => setEditingStory(null)}
        />
      )}

      {/* Run Autonomous Research Modal */}
      {isRunModalOpen && (
        <RunResearchModal
          sources={sources}
          settings={settings}
          onSuccess={(newStory) => {
            setStories((prev) => [newStory, ...prev]);
            setIsRunModalOpen(false);
            setActiveTab('queue');
            showToast('New candidate post drafted and placed in Pending Approval queue!');
          }}
          onClose={() => setIsRunModalOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-4 px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Optimax Access · HEOR & Market Access LinkedIn Publishing Studio</span>
          <span className="font-mono text-[11px]">Human-in-the-Loop Editorial Governance</span>
        </div>
      </footer>

    </div>
  );
}
