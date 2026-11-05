import React from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  Share2, 
  AlertCircle,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Story, AppSettings } from '../types';

interface ScheduleCalendarViewProps {
  stories: Story[];
  settings: AppSettings;
  onSelectStory: (story: Story) => void;
}

export const ScheduleCalendarView: React.FC<ScheduleCalendarViewProps> = ({
  stories,
  settings,
  onSelectStory,
}) => {
  const publishedStories = stories.filter((s) => s.status === 'published');
  const scheduledStories = stories.filter((s) => s.status === 'approved');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const activePublishDays = settings.schedule_days || ['Monday', 'Wednesday', 'Friday'];

  // Calculate posts published this week
  const postsThisWeek = publishedStories.length;
  const remainingSlots = Math.max(0, settings.max_posts_per_week - postsThisWeek);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Publishing Schedule & Audit Log
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cadence: Up to {settings.max_posts_per_week} posts/week at {settings.schedule_time} ({settings.schedule_timezone})
          </p>
        </div>

        {/* Weekly Capacity Indicator */}
        <div className="flex items-center gap-3 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium">Weekly Quota</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {postsThisWeek} / {settings.max_posts_per_week} posts
            </span>
          </div>
          <div className={`px-2.5 py-1 rounded-md text-xs font-bold font-mono ${
            remainingSlots > 0 
              ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
              : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
          }`}>
            {remainingSlots} slots left
          </div>
        </div>
      </div>

      {/* Week Slot Rhythm Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Target Weekly Publishing Slots
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {daysOfWeek.map((day) => {
            const isPublishDay = activePublishDays.includes(day);
            const matchingScheduled = scheduledStories.find(
              (s) => s.scheduled_time && new Date(s.scheduled_time).toLocaleDateString('en-US', { weekday: 'long' }) === day
            );

            return (
              <div
                key={day}
                className={`p-3.5 rounded-xl border transition-all ${
                  isPublishDay
                    ? 'bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-900/60 shadow-xs'
                    : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200/60 dark:border-slate-800/60 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {day}
                  </span>
                  {isPublishDay ? (
                    <span className="text-[10px] font-mono font-semibold text-blue-600 dark:text-blue-400">
                      {settings.schedule_time}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">Rest</span>
                  )}
                </div>

                {isPublishDay ? (
                  matchingScheduled ? (
                    <div 
                      onClick={() => onSelectStory(matchingScheduled)}
                      className="p-2 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-100 dark:border-blue-900 cursor-pointer"
                    >
                      <span className="text-[10px] font-bold text-blue-800 dark:text-blue-300 line-clamp-1">
                        {matchingScheduled.organization}
                      </span>
                      <p className="text-[10px] text-blue-600 dark:text-blue-400 line-clamp-1 mt-0.5">
                        {matchingScheduled.image_headline}
                      </p>
                    </div>
                  ) : (
                    <div className="p-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-center text-[10px] text-slate-400">
                      Slot Open
                    </div>
                  )
                ) : (
                  <div className="text-[10px] text-slate-400 text-center py-2">
                    No publishing
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Publishing Audit Log */}
      <div className="space-y-3 pt-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Published Stories History & LinkedIn Post IDs
        </h2>

        {publishedStories.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            No published posts yet. Approve and publish candidate stories in the Review Queue.
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
            {publishedStories.map((story) => (
              <div
                key={story.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {story.organization}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      {story.published_at ? new Date(story.published_at).toLocaleDateString() : story.publication_date}
                    </span>
                  </div>
                  <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {story.image_headline}
                  </h4>
                  <div className="text-[11px] font-mono text-slate-400">
                    ID: {story.linkedin_post_id || 'Simulated Post'}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => onSelectStory(story)}
                    className="text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 font-medium"
                  >
                    View Details
                  </button>

                  {story.linkedin_post_id && (
                    <a
                      href={`https://www.linkedin.com/feed/update/${story.linkedin_post_id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                    >
                      <span>Open on LinkedIn</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
