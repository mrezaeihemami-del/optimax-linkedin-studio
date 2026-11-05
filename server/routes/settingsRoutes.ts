import { Router } from 'express';
import { SettingsRepository } from '../db/settingsRepository.ts';
import { getGeminiClient } from '../services/geminiService.ts';

export const settingsRouter = Router();

settingsRouter.get('/', (req, res) => {
  const settings = SettingsRepository.getSettings();
  res.json({ success: true, data: settings });
});

settingsRouter.put('/', (req, res) => {
  const updated = SettingsRepository.updateSettings(req.body);
  res.json({ success: true, data: updated });
});

settingsRouter.post('/test-connection', async (req, res) => {
  const { type } = req.body;
  const settings = SettingsRepository.getSettings();

  try {
    if (type === 'gemini' || type === 'gemini-lite') {
      const preferred = type === 'gemini' ? 'gemini-3.8-flash' : 'gemini-3.1-flash-lite';
      const ai = getGeminiClient();
      try {
        const response = await ai.models.generateContent({
          model: preferred,
          contents: 'Ping test. Reply with: OK',
        });
        return res.json({ success: true, message: `${preferred} connected: "${response.text?.trim()}"` });
      } catch (geminiErr: any) {
        if (preferred !== 'gemini-3.1-flash-lite') {
          const fallback = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: 'Ping test. Reply with: OK',
          });
          return res.json({
            success: true,
            message: `Gemini 3.8 was at capacity, but lighter model Gemini 3.1 Flash-Lite connected successfully: "${fallback.text?.trim()}"`,
          });
        }
        throw geminiErr;
      }
    }

    if (type === 'openai') {
      if (!settings.openai_key) return res.status(400).json({ success: false, error: 'No OpenAI API key provided' });
      const resp = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${settings.openai_key}` },
      });
      if (!resp.ok) throw new Error(`OpenAI verification status ${resp.status}`);
      return res.json({ success: true, message: 'OpenAI API key verified successfully' });
    }

    if (type === 'claude') {
      if (!settings.claude_key) return res.status(400).json({ success: false, error: 'No Anthropic API key provided' });
      const resp = await fetch('https://api.anthropic.com/v1/models', {
        headers: { 'x-api-key': settings.claude_key, 'anthropic-version': '2023-06-01' },
      });
      if (!resp.ok) throw new Error(`Claude verification status ${resp.status}`);
      return res.json({ success: true, message: 'Anthropic Claude API key verified successfully' });
    }

    if (type === 'deepseek') {
      if (!settings.deepseek_key) return res.status(400).json({ success: false, error: 'No DeepSeek API key provided' });
      const resp = await fetch('https://api.deepseek.com/models', {
        headers: { Authorization: `Bearer ${settings.deepseek_key}` },
      });
      if (!resp.ok) throw new Error(`DeepSeek verification status ${resp.status}`);
      return res.json({ success: true, message: 'DeepSeek API connection verified' });
    }

    if (type === 'mistral') {
      if (!settings.mistral_key) return res.status(400).json({ success: false, error: 'No Mistral API key provided' });
      const resp = await fetch('https://api.mistral.ai/v1/models', {
        headers: { Authorization: `Bearer ${settings.mistral_key}` },
      });
      if (!resp.ok) throw new Error(`Mistral verification status ${resp.status}`);
      return res.json({ success: true, message: 'Mistral AI connection verified' });
    }

    if (type === 'custom') {
      if (!settings.custom_api_url) return res.status(400).json({ success: false, error: 'No Custom API URL provided' });
      return res.json({ success: true, message: `Custom endpoint (${settings.custom_api_url}) configured` });
    }

    if (type === 'linkedin') {
      if (!settings.linkedin_access_token) {
        return res.status(400).json({
          success: false,
          error: 'No LinkedIn Access Token provided. Add an OAuth 2.0 access token with w_organization_social scope.',
        });
      }
      const resp = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: { Authorization: `Bearer ${settings.linkedin_access_token}` },
      });
      if (!resp.ok) throw new Error(`LinkedIn token returned HTTP ${resp.status}`);
      const data = await resp.json();
      return res.json({ success: true, message: `LinkedIn authorized as ${data.name || 'User'}` });
    }

    return res.status(400).json({ success: false, error: 'Unknown connection test type' });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message || 'Connection test failed' });
  }
});

