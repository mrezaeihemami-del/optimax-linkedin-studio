import { getDatabase } from '../server/db/database.ts';
import { StoryRepository } from '../server/db/storyRepository.ts';
import { SourceRepository } from '../server/db/sourceRepository.ts';
import { SettingsRepository } from '../server/db/settingsRepository.ts';

console.log('=== TEST 1: Database Initialization ===');
const db = getDatabase();
console.log('Database instance created successfully.');

console.log('\n=== TEST 2: Settings Repository ===');
const settings = SettingsRepository.getSettings();
console.log('Brand Name:', settings.brand_name);
console.log('AI Provider:', settings.ai_provider);
if (!settings.brand_name) throw new Error('Settings verification failed');

console.log('\n=== TEST 3: Sources Repository ===');
const sources = SourceRepository.getAll();
console.log(`Total HTA Sources loaded: ${sources.length}`);
if (sources.length === 0) throw new Error('No sources found');
console.log('First Source:', sources[0].organization, `(${sources[0].country})`);

// Test create new source
const testSource = SourceRepository.create({
  organization: 'Test HTA Agency',
  country: 'Testland',
  type: 'Authority',
  website: 'https://example.com',
  news_url: 'https://example.com/news',
  topics: 'Testing HTA',
  date_verified: '2026-11-05',
  active: true,
});
console.log('Created test source with ID:', testSource.id);
SourceRepository.delete(testSource.id);
console.log('Cleaned up test source successfully.');

console.log('\n=== TEST 4: Stories Repository & Modalities ===');
const stories = StoryRepository.getAll();
console.log(`Total Stories in SQLite: ${stories.length}`);
if (stories.length === 0) throw new Error('No stories found');
console.log('Sample Story 1 Headline:', stories[0].image_headline);
console.log('Sample Story 1 Format:', stories[0].format);
console.log('Sample Story 1 Template Style:', stories[0].template_style);

// Test Poll voting
const pollStory = stories.find((s) => s.format === 'poll');
if (pollStory && pollStory.poll_data) {
  const optId = pollStory.poll_data.options[0].id;
  const initialVotes = pollStory.poll_data.options[0].votes;
  const votedStory = StoryRepository.recordPollVote(pollStory.id, optId);
  const updatedVotes = votedStory?.poll_data?.options[0].votes;
  console.log(`Poll voting verification: option "${optId}" votes went from ${initialVotes} to ${updatedVotes}`);
  if (updatedVotes !== initialVotes + 1) throw new Error('Poll vote calculation failed');
}

// Test Metrics calculation
const sampleStory = stories[0];
const updatedWithMetrics = StoryRepository.updateMetrics(sampleStory.id, {
  impressions: 2000,
  clicks: 100,
  reactions: 50,
  comments: 10,
  reposts: 5,
});
console.log('Metrics test updated:', {
  impressions: updatedWithMetrics?.metrics?.impressions,
  engagement_rate: `${updatedWithMetrics?.metrics?.engagement_rate}%`,
});
if (updatedWithMetrics?.metrics?.engagement_rate !== 8.25) {
  throw new Error(`Expected ER 8.25%, got ${updatedWithMetrics?.metrics?.engagement_rate}%`);
}

console.log('\n=== ALL DATABASE TESTS PASSED SUCCESSFULLY! ===');
process.exit(0);

