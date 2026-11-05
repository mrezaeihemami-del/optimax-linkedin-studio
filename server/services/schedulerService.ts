import { StoryRepository } from '../db/storyRepository.ts';
import { publishStoryToLinkedIn } from './linkedinService.ts';

let schedulerInterval: NodeJS.Timeout | null = null;
let isProcessing = false;

export function startBackgroundScheduler(intervalMs = 30000) {
  if (schedulerInterval) return;

  console.log(`[Scheduler Service] Started automated posting scheduler (polling every ${intervalMs / 1000}s)`);

  schedulerInterval = setInterval(async () => {
    if (isProcessing) return;
    isProcessing = true;

    try {
      const dueStories = StoryRepository.getDueScheduledStories();
      if (dueStories.length > 0) {
        console.log(`[Scheduler Service] Found ${dueStories.length} scheduled stories ready for automated publication.`);
        for (const story of dueStories) {
          try {
            console.log(`[Scheduler Service] Auto-publishing scheduled story: "${story.image_headline || story.id}"...`);
            const res = await publishStoryToLinkedIn(story.id);
            console.log(`[Scheduler Service] Successfully published story ${story.id} (${res.mode} mode, Post ID: ${res.postId})`);
          } catch (pubErr) {
            console.error(`[Scheduler Service] Failed to auto-publish story ${story.id}:`, pubErr);
          }
        }
      }
    } catch (err) {
      console.error('[Scheduler Service] Error during scheduled check:', err);
    } finally {
      isProcessing = false;
    }
  }, intervalMs);
}

export function stopBackgroundScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log('[Scheduler Service] Stopped automated posting scheduler.');
  }
}

