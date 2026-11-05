import http from 'http';
import express from 'express';
import { getDatabase } from '../server/db/database.ts';
import { authRouter } from '../server/routes/authRoutes.ts';
import { settingsRouter } from '../server/routes/settingsRoutes.ts';
import { sourcesRouter } from '../server/routes/sourcesRoutes.ts';
import { storiesRouter } from '../server/routes/storiesRoutes.ts';
import { analyticsRouter } from '../server/routes/analyticsRoutes.ts';
import { linkedinRouter } from '../server/routes/linkedinRoutes.ts';

const app = express();
app.use(express.json());

getDatabase();

app.use('/api/auth', authRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/sources', sourcesRouter);
app.use('/api/stories', storiesRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/linkedin', linkedinRouter);

const server = http.createServer(app);
const TEST_PORT = 3999;

server.listen(TEST_PORT, async () => {
  console.log(`Test server running on port ${TEST_PORT}`);
  const baseUrl = `http://localhost:${TEST_PORT}`;

  try {
    // 1. Test Auth
    console.log('\n--- 1. Testing /api/auth/login ---');
    const authRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin1234' }),
    });
    const authJson = await authRes.json();
    console.log('Auth status:', authRes.status, 'Success:', authJson.success, 'Token:', authJson.token?.slice(0, 15) + '...');
    if (!authJson.success) throw new Error('Auth failed');

    // 2. Test Settings
    console.log('\n--- 2. Testing /api/settings ---');
    const setRes = await fetch(`${baseUrl}/api/settings`);
    const setJson = await setRes.json();
    console.log('Settings status:', setRes.status, 'Brand:', setJson.data?.brand_name);
    if (!setJson.success) throw new Error('Settings GET failed');

    // 3. Test Sources
    console.log('\n--- 3. Testing /api/sources ---');
    const srcRes = await fetch(`${baseUrl}/api/sources`);
    const srcJson = await srcRes.json();
    console.log('Sources status:', srcRes.status, 'Total count:', srcJson.data?.length);
    if (!srcJson.success || srcJson.data.length === 0) throw new Error('Sources GET failed');

    // 4. Test Stories
    console.log('\n--- 4. Testing /api/stories ---');
    const stoRes = await fetch(`${baseUrl}/api/stories`);
    const stoJson = await stoRes.json();
    console.log('Stories status:', stoRes.status, 'Total count:', stoJson.data?.length);
    if (!stoJson.success || stoJson.data.length === 0) throw new Error('Stories GET failed');

    // 5. Test Analytics
    console.log('\n--- 5. Testing /api/analytics ---');
    const anaRes = await fetch(`${baseUrl}/api/analytics`);
    const anaJson = await anaRes.json();
    console.log('Analytics status:', anaRes.status, 'Overview total published:', anaJson.data?.overview?.total_published);
    console.log('Analytics avg ER:', `${anaJson.data?.overview?.avg_engagement_rate}%`);
    if (!anaJson.success) throw new Error('Analytics GET failed');

    // 6. Test LinkedIn simulation publish
    console.log('\n--- 6. Testing /api/linkedin/publish (simulation) ---');
    const testStory = stoJson.data[0];
    const pubRes = await fetch(`${baseUrl}/api/linkedin/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storyId: testStory.id, forceSimulate: true }),
    });
    const pubJson = await pubRes.json();
    console.log('Publish status:', pubRes.status, 'Mode:', pubJson.mode, 'Post ID:', pubJson.postId);
    if (!pubJson.success) throw new Error('LinkedIn publish failed');

    console.log('\n=== ALL API ENDPOINTS VERIFIED & FUNCTIONAL! ===');
    server.close(() => process.exit(0));
  } catch (err) {
    console.error('API Verification error:', err);
    server.close(() => process.exit(1));
  }
});

