import { GoogleGenAI } from '@google/genai';
import { SettingsRepository } from '../db/settingsRepository.ts';
import { Story, PostFormat, TemplateStyle } from '../../src/types/index.ts';

// Initialize Gemini SDK Client
export function getGeminiClient(): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'optimax-linkedin-studio',
      },
    },
  });
}

export async function generateGeminiWithFallback(
  aiClient: GoogleGenAI,
  prompt: string,
  systemInstruction?: string,
  preferredModel = 'gemini-3.1-flash-lite'
): Promise<{ text: string; modelUsed: string }> {
  const modelsToTry = preferredModel === 'gemini-3.8-flash'
    ? ['gemini-3.8-flash', 'gemini-3.1-flash-lite']
    : ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];

  let lastErr: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[Gemini Engine] Calling ${model} (attempt ${attempt})...`);
        const config: any = {
          responseMimeType: 'application/json',
        };
        if (systemInstruction) config.systemInstruction = systemInstruction;

        const resp = await aiClient.models.generateContent({
          model,
          contents: prompt,
          config,
        });

        if (resp.text) {
          return { text: resp.text, modelUsed: model };
        }
      } catch (err: any) {
        lastErr = err;
        const msg = err?.message || String(err);
        const isTemporary =
          msg.includes('503') ||
          msg.includes('high demand') ||
          msg.includes('UNAVAILABLE') ||
          msg.includes('429') ||
          msg.includes('RESOURCE_EXHAUSTED');

        console.warn(`[Gemini Engine] ${model} attempt ${attempt} warning:`, msg);

        if (isTemporary && attempt === 1) {
          await new Promise((resolve) => setTimeout(resolve, 800));
        } else {
          break; // proceed to fallback model
        }
      }
    }
  }

  throw lastErr || new Error('Gemini API is currently experiencing high demand. Please try again or switch model in Settings.');
}

export interface GeneratePostParams {
  organization: string;
  source_url: string;
  topic_hint?: string;
  supporting_passage?: string;
  preferred_provider?: string;
  format?: PostFormat;
  template_style?: TemplateStyle;
}

export async function executeMultiAgentGeneration(params: GeneratePostParams): Promise<Partial<Story>> {
  const settings = SettingsRepository.getSettings();
  const provider = params.preferred_provider || settings.ai_provider || 'gemini';
  const format = params.format || 'image';
  const template_style = params.template_style || 'executive_navy';
  const nowIso = new Date().toISOString();

  const prompts = settings.agent_prompts || {
    research_agent: 'Analyze HTA updates and verify publication dates and factual excerpts.',
    copywriter_agent: 'Write a 150-220 word executive LinkedIn post with 2-3 implications and hashtags.',
    graphic_agent: 'Create headline (max 10 words), subtitle (max 20 words), and 3 bullet points (max 12 words each).',
    compliance_agent: 'Ensure every claim is substantiated and avoid hallucinations.',
  };

  const systemInstruction = `You are the AI Workflow Engine for Optimax Access, coordinating 4 specialized agents:
[AGENT 1: HTA RESEARCH & EXTRACTION]
${prompts.research_agent}

[AGENT 2: LINKEDIN EXECUTIVE COPYWRITER]
${prompts.copywriter_agent}

[AGENT 3: VISUAL GRAPHIC & TEMPLATE DESIGNER]
${prompts.graphic_agent}

[AGENT 4: FACT-CHECK & REGULATORY COMPLIANCE]
${prompts.compliance_agent}

Target LinkedIn Post Format: ${format}
Visual Template Style: ${template_style}

Produce valid raw JSON matching this exact structure:
{
  "status": "candidate",
  "format": "${format}",
  "template_style": "${template_style}",
  "organization": "${params.organization}",
  "source_url": "${params.source_url}",
  "publication_date": "${new Date().toISOString().split('T')[0]}",
  "event_date": "${new Date().toISOString().split('T')[0]}",
  "announcement_status": "final_decision",
  "supporting_evidence": "Verifiable excerpt from the authority announcement",
  "relevance": "Concise summary of practical implications for biopharma manufacturers",
  "post_text": "Complete formatted LinkedIn caption (150-220 words) with clear spacing, numbered takeaways, closing question, source link, and hashtags",
  "hashtags": ["HTA", "MarketAccess", "HEOR", "Pharma"],
  "image_headline": "Maximum 10 words headline",
  "image_subtitle": "Maximum 20 words subtitle",
  "image_key_points": [
    "Key takeaway one (max 12 words)",
    "Key takeaway two (max 12 words)",
    "Key takeaway three (max 12 words)"
  ],
  "image_source_footer": "Source: ${params.organization} · ${new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' })}",
  "alt_text": "Optimax Access briefing card summarizing the regulatory update.",
  ${format === 'poll' ? `"poll_data": {
    "question": "Clear, engaging 1-sentence poll question",
    "duration_days": 7,
    "total_votes": 0,
    "options": [
      { "id": "opt-1", "text": "Option 1 (max 30 chars)", "votes": 0 },
      { "id": "opt-2", "text": "Option 2 (max 30 chars)", "votes": 0 },
      { "id": "opt-3", "text": "Option 3 (max 30 chars)", "votes": 0 },
      { "id": "opt-4", "text": "Option 4 (max 30 chars)", "votes": 0 }
    ]
  },` : ''}
  ${format === 'carousel' ? `"carousel_slides": [
    { "id": "s-1", "slide_number": 1, "title": "Slide 1 Title", "subtitle": "Slide 1 Subtitle", "key_points": ["Point A", "Point B", "Point C"], "footer_text": "Slide 1/4 · Optimax Access" },
    { "id": "s-2", "slide_number": 2, "title": "Slide 2 Title", "subtitle": "Slide 2 Subtitle", "key_points": ["Point A", "Point B", "Point C"], "footer_text": "Slide 2/4 · Optimax Access" },
    { "id": "s-3", "slide_number": 3, "title": "Slide 3 Title", "subtitle": "Slide 3 Subtitle", "key_points": ["Point A", "Point B", "Point C"], "footer_text": "Slide 3/4 · Optimax Access" },
    { "id": "s-4", "slide_number": 4, "title": "Slide 4 Title", "subtitle": "Slide 4 Subtitle", "key_points": ["Point A", "Point B", "Point C"], "footer_text": "Slide 4/4 · Optimax Access" }
  ],` : ''}
  ${template_style === 'stat_spotlight' ? `"stat_figure": "€30M", "stat_label": "Key Regulatory or Statutory Threshold",` : ''}
  ${template_style === 'comparative_grid' ? `"comparison_left_title": "Current Standard", "comparison_left_points": ["Point 1", "Point 2", "Point 3"], "comparison_right_title": "New Requirement", "comparison_right_points": ["Point 1", "Point 2", "Point 3"],` : ''}
  "template_style": "${template_style}"
}`;

  const userPrompt = `Execute the complete 4-agent workflow on this HTA intelligence candidate:
Target Authority: ${params.organization}
Official URL: ${params.source_url}
Format: ${format}
Template Style: ${template_style}
Focus Area: ${params.topic_hint || 'Latest HTA methods, joint assessment, or reimbursement policy change'}
Source Text Excerpt: ${params.supporting_passage || 'A significant update regarding clinical and economic evaluation methods, reimbursement thresholds, or evidence requirements.'}
Current Run DateTime: ${nowIso}`;

  let jsonResultText = '';

  if (provider === 'openai' && settings.openai_key) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.openai_key}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: userPrompt },
        ],
      }),
    });
    if (!response.ok) throw new Error(`OpenAI error (${response.status}): ${await response.text()}`);
    const data = await response.json();
    jsonResultText = data.choices?.[0]?.message?.content || '{}';
  } else if (provider === 'claude' && settings.claude_key) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': settings.claude_key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1600,
        system: systemInstruction + '\nReturn ONLY valid JSON.',
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });
    if (!response.ok) throw new Error(`Claude error (${response.status}): ${await response.text()}`);
    const data = await response.json();
    jsonResultText = data.content?.[0]?.text || '{}';
  } else {
    // Default Gemini Engine
    const ai = getGeminiClient();
    const preferred = provider === 'gemini' ? 'gemini-3.8-flash' : 'gemini-3.1-flash-lite';
    const result = await generateGeminiWithFallback(ai, userPrompt, systemInstruction, preferred);
    jsonResultText = result.text;
  }

  const cleanJson = jsonResultText.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleanJson);

  return {
    status: 'pending',
    format: parsed.format || format,
    template_style: parsed.template_style || template_style,
    organization: parsed.organization || params.organization,
    source_url: parsed.source_url || params.source_url,
    publication_date: parsed.publication_date || new Date().toISOString().split('T')[0],
    event_date: parsed.event_date || new Date().toISOString().split('T')[0],
    announcement_status: parsed.announcement_status || 'final_decision',
    supporting_evidence: parsed.supporting_evidence || '',
    relevance: parsed.relevance || '',
    post_text: parsed.post_text || '',
    hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : ['HTA', 'MarketAccess', 'HEOR'],
    image_headline: parsed.image_headline || 'HTA Policy Briefing',
    image_subtitle: parsed.image_subtitle || 'Implications for biopharma strategy',
    image_key_points: Array.isArray(parsed.image_key_points)
      ? parsed.image_key_points.slice(0, 3)
      : ['Evidence synthesis standard updated', 'Payer comparator requirements revised', 'Budget impact models impacted'],
    image_source_footer: parsed.image_source_footer || `Source: ${params.organization}`,
    alt_text: parsed.alt_text || 'Optimax Access HTA briefing graphic',
    poll_data: parsed.poll_data,
    carousel_slides: parsed.carousel_slides,
    stat_figure: parsed.stat_figure,
    stat_label: parsed.stat_label,
    comparison_left_title: parsed.comparison_left_title,
    comparison_left_points: parsed.comparison_left_points,
    comparison_right_title: parsed.comparison_right_title,
    comparison_right_points: parsed.comparison_right_points,
    scheduled_time: new Date(Date.now() + 86400000 * 2).toISOString(),
  };
}

