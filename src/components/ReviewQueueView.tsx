import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Send, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  AlertTriangle,
  Sparkles,
  Share2,
  Calendar,
  XCircle,
  FileCheck,
  Building2,
  Layers
} from 'lucide-react';
import { Story, AppSettings, PostStatus } from '../types';
import { LinkedInPreviewPhone } from './LinkedInPreviewPhone';

interface ReviewQueueViewProps {
  stories: Story[];
  settings: AppSettings;
  onUpdateStory: (story: Story) => void;
  onDeleteStory: (id: string) => void;
  onEditStory: (story: Story) => void;
  onPublishStory: (storyId: string) => Promise<void>;
  isPublishing: boolean;
  onOpenRunModal: () => void;
  onPollVote?: (storyId: string, optionId: string) => void;
}

export const ReviewQueueView: React.FC<ReviewQueueViewProps> = ({
  stories,
  settings,
  onUpdateStory,
  onDeleteStory,
  onEditStory,
  onPublishStory,
  isPublishing,
  onOpenRunModal,
  onPollVote,
}) => {
  const [filter, setFilter] = useState<PostStatus | 'all'>('pending');
  const [selectedStoryId, setSelectedStoryId] = useState<string>(
    stories.find((s) => s.status === 'pending')?.id || stories[0]?.id || ''
  );

  const filteredStories = stories.filter((s) => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  const selectedStory = stories.find((s) => s.id === selectedStoryId) || filteredStories[0] || stories[0];

  const handleStatusChange = (newStatus: PostStatus) => {
    if (!selectedStory) return;
    onUpdateStory({
      ...selectedStory,
      status: newStatus,
      reviewed_at: new Date().toISOString(),
    });
  };

  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            Pending Approval
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
            <FileCheck className="w-3.5 h-3.5" />
            Approved for Slot
          </span>
        );
      case 'published':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Published
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Filter Segmented Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Editorial Review & Sign-Off Queue
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Human-in-the-loop validation: review evidence passages, edit captions, and approve before LinkedIn publication
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          {(['pending', 'approved', 'published', 'all'] as const).map((tab) => {
            const count = tab === 'all' 
              ? stories.length 
              : stories.filter((s) => s.status === tab).length;
            const label = tab === 'pending' ? 'Pending' : tab === 'approved' ? 'Approved' : tab === 'published' ? 'Published' : 'All';
            return (
              <button
                key={tab}
                onClick={() => {
                  setFilter(tab);
                  const firstInTab = stories.find((s) => tab === 'all' || s.status === tab);
                  if (firstInTab) setSelectedStoryId(firstInTab.id);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  filter === tab
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {stories.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Sparkles className="w-10 h-10 text-blue-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Stories in Queue
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-5">
            Run the research engine to scan the HTA source register and draft your first executive post.
          </p>
          <button
            onClick={onOpenRunModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Run Research Engine
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Post Queue List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between px-1">
              <span>{filteredStories.length} Drafts in view</span>
              <span>Sorted by latest</span>
            </div>

            <div className="space-y-2.5 max-h-[820px] overflow-y-auto pr-1">
              {filteredStories.map((story) => {
                const isSelected = story.id === selectedStory?.id;
                return (
                  <div
                    key={story.id}
                    onClick={() => setSelectedStoryId(story.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-500/80 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                          {story.organization}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-[11px]">{story.publication_date}</span>
                      </div>
                      <div>{getStatusBadge(story.status)}</div>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mb-1.5">
                      {story.image_headline}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-2.5 leading-relaxed">
                      {story.post_text}
                    </p>

                    {/* Format & Style Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {story.format || 'IMAGE'}
                      </span>
                      {story.template_style && (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {story.template_style.replace('_', ' ')}
                        </span>
                      )}
                      {story.metrics && story.status === 'published' && (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                          {story.metrics.impressions.toLocaleString()} views · {story.metrics.engagement_rate}% ER
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <span className="capitalize">{story.announcement_status.replace('_', ' ')}</span>
                      <span className="font-mono">{story.hashtags.length} hashtags</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Story Inspection & LinkedIn Phone Simulator (7 cols) */}
          {selectedStory && (
            <div className="lg:col-span-7 space-y-6">
              
              {/* Approval Action Ribbon */}
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Current Status:</span>
                  {getStatusBadge(selectedStory.status)}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditStory(selectedStory)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Draft</span>
                  </button>

                  {selectedStory.status !== 'rejected' && (
                    <button
                      onClick={() => handleStatusChange('rejected')}
                      className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                  )}

                  {selectedStory.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange('approved')}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-950/80 dark:text-blue-300 rounded-lg transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Approve for Schedule</span>
                    </button>
                  )}

                  <button
                    onClick={() => onPublishStory(selectedStory.id)}
                    disabled={isPublishing}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isPublishing ? 'Publishing to LinkedIn...' : 'Approve & Publish Now'}</span>
                  </button>
                </div>
              </div>

              {/* Published notice if already live */}
              {selectedStory.status === 'published' && selectedStory.linkedin_post_id && (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Post published to Optimax Access LinkedIn page</span>
                  </div>
                  <a
                    href={`https://www.linkedin.com/feed/update/${selectedStory.linkedin_post_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-semibold hover:underline"
                  >
                    <span>View on LinkedIn</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Grid: Evidence Details & Phone Simulator */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                
                {/* Column 1: Source Verification Evidence */}
                <div className="space-y-4">
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Editorial Fact Check & Sources
                    </h3>

                    <div>
                      <span className="text-[11px] text-slate-400 block">Authority / Body</span>
                      <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                        {selectedStory.organization}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Publication Date</span>
                        <span className="font-mono text-slate-700 dark:text-slate-300">
                          {selectedStory.publication_date}
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block">Event / Effective</span>
                        <span className="font-mono text-slate-700 dark:text-slate-300">
                          {selectedStory.event_date || 'Immediate'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">Supporting Evidence Quote</span>
                      <blockquote className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800 leading-relaxed italic">
                        "{selectedStory.supporting_evidence}"
                      </blockquote>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">Practical Manufacturer Relevance</span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-blue-50/50 dark:bg-blue-950/20 p-2.5 rounded-lg border border-blue-100 dark:border-blue-900/30">
                        {selectedStory.relevance}
                      </p>
                    </div>

                    <div className="pt-2">
                      <a
                        href={selectedStory.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-mono"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Inspect Primary Authority Announcement</span>
                      </a>
                    </div>
                  </div>

                  {/* Danger Zone: Delete Draft */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => onDeleteStory(selectedStory.id)}
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Discard this draft</span>
                    </button>
                  </div>
                </div>

                {/* Column 2: Realistic Phone Simulator */}
                <div className="flex justify-center">
                  <LinkedInPreviewPhone
                    story={selectedStory}
                    settings={settings}
                    onPollVote={(optId) => onPollVote && onPollVote(selectedStory.id, optId)}
                  />
                </div>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
