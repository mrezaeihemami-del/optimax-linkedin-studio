# Optimax Access — LinkedIn Automation Expansion: Multi-Template Canvas, All Post Formats & Analytics Dashboard

Comprehensive enhancement plan to eliminate template fatigue, cover every native LinkedIn content format, and provide a real, interactive Analytics & Performance Dashboard for Optimax Access.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The plan addresses all 3 core requirements with 100% working, non-decorative logic:
> 1. **5 Diverse Branded Graphic Templates** (Canvas-rendered at 1080×1350 px, selectable per post):
>    - **Executive Navy (Classic)**: 3 numbered strategic takeaways with cyan accents.
>    - **Regulatory Breaking Alert**: High-contrast urgency header, authority crest, date pill, and primary quote block.
>    - **Comparative Analysis Grid**: 2-column comparative layout (e.g. *Previous Standard* vs. *New Requirement* or *EU JCA* vs. *National HTA*).
>    - **Metric & Stat Spotlight**: Giant hero figure (e.g. `90 Days`, `€30M`, `-35%`) with bold empirical commentary.
>    - **Editorial Modern Light**: Crisp porcelain/slate minimalist aesthetic with refined serif-sans hierarchy.
> 2. **5 Full LinkedIn Post Formats (Modality Engine)**:
>    - **Single Image Post**: Formatted caption + 1080×1350 graphic card.
>    - **Multi-Slide Carousel / PDF**: 3 to 5 slide document deck with live slide-by-slide phone navigation, exportable as multi-page PDF/images.
>    - **Text-Only / Long-form Thought Leadership**: Clean typographic layout with unicode bullet formatting and spacing.
>    - **Interactive Poll Post**: Headline, question, 2–4 poll options, voting duration, and real interactive voting simulator.
>    - **Article / Canonical Link Post**: Rich link preview card with OpenGraph thumbnail, publisher domain, and external action.
> 3. **Real Analytics & Performance Dashboard (Working, Non-Decorative)**:
>    - Calculated live metrics: Total Impressions, Total Engagement, Average CTR, Total Reactions, Comments, Reposts.
>    - Performance breakdown by Authority (NICE vs. G-BA vs. EU JCA) and by Post Format (Carousels vs. Images vs. Polls).
>    - **Interactive Engagement Logger**: Allows consultants to record or simulate actual performance numbers per published post.
>    - **CSV Export**: One-click download of full publishing and engagement audit history.

---

## 1. Overview & Core Concept

- **Problem**: Relying on a single image template creates visual fatigue on the LinkedIn feed. Furthermore, LinkedIn algorithms prioritize diverse post formats (especially Carousels/PDFs and Polls), and editorial teams need measurable data on which HTA authorities and topics generate the highest executive engagement.
- **Solution**: A complete content studio supporting 5 distinct visual styles, 5 native LinkedIn modalities, a live mobile preview that adapts dynamically to every format (swipeable carousel slides, clickable polls, rich link cards), and a dedicated analytics engine.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Format & Template Selection**: When generating or editing a post, the user selects the **Post Format** (`Single Image`, `Carousel`, `Text-Only`, `Poll`, `Article Link`). If an image or carousel is selected, the user chooses from the **5 Graphic Templates**.
2. **Dynamic Live Mobile Simulator**: The smartphone preview immediately adapts:
   - For **Carousels**: Shows interactive previous/next slide buttons and slide counter (e.g., `1 / 4`).
   - For **Polls**: Renders functional radio buttons with percentage progress bars and vote counters.
   - For **Article Links**: Displays an authentic LinkedIn link card preview with domain badge and title.
   - For **Text-Only**: Simulates pure text with clean paragraph spacing and hashtag highlights.
3. **Template Switcher in Editor**: Live preview updates instantly on canvas without reloading.
4. **Analytics Dashboard Tab**:
   - 4 primary KPI metric cards with comparison figures.
   - Authority Engagement Bar Chart (e.g., NICE, G-BA, EU JCA).
   - Format Effectiveness Breakdown.
   - Recent Posts Performance Table with inline "Update Metrics" modal and CSV export.

---

## 3. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Optimax Studio Dashboard                        │
├──────────────────┬──────────────────┬─────────────────┬────────────────┤
│   Review Queue   │  Analytics Tab   │ Source Register │ Settings Vault │
│  - 5 Modalities  │  - Live Metrics  │ - 13 HTA Bodies │ - AI Providers │
│  - 5 Templates   │  - Auth Breakdown│ - News Feeds    │ - Password Mgmt│
│  - Mobile Phone  │  - Format Stats  │ - Quick Draft   │ - Agent Prompts│
│    Simulator     │  - CSV Export    │                 │                │
└─────────┬────────┴─────────┬────────┴────────┬────────┴────────┬───────┘
          │                  │                 │                 │
          ▼                  ▼                 ▼                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                Modular Canvas & Multi-Format Renderers                 │
│  • Canvas Engine (Executive, Breaking Alert, Compare Grid, Stat, Light)│
│  • Multi-Slide Carousel Generator (Slide 1 Cover -> Slide 4 Takeaway)  │
│  • Poll State Manager (Questions, Options, Votes, Durations)          │
│  • Analytics Aggregator (Calculates CTR, ER, and Authority Trends)     │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Server API & Storage Layer (/api/*)                  │
│  • /api/analytics/metrics (Calculates aggregate & historical trends)   │
│  • /api/analytics/record (Updates real LinkedIn metrics per post)      │
│  • /api/stories (Stores post format, template id, poll data, slides)   │
│  • /api/generate-post (Supports carousel generation & poll prompts)    │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model Enhancements (`src/types/index.ts`)
- **PostFormat**: `'image' | 'carousel' | 'text_only' | 'poll' | 'article_link'`
- **TemplateStyle**: `'executive_navy' | 'breaking_alert' | 'comparative_grid' | 'stat_spotlight' | 'editorial_light'`
- **PollData**:
  - `question: string`
  - `options: { text: string; votes: number }[]`
  - `duration_days: number`
  - `total_votes: number`
- **CarouselSlide**:
  - `title: string`
  - `subtitle: string`
  - `content: string[]`
  - `slide_number: number`
- **PostMetrics**:
  - `impressions: number`
  - `clicks: number`
  - `reactions: number`
  - `comments: number`
  - `reposts: number`
  - `engagement_rate: number`

---

## 4. Implementation Steps

1. **Canvas Multi-Template Engine (`src/utils/canvasRenderer.ts`)**:
   - Implement rendering functions for all 5 templates: `renderExecutiveNavy`, `renderBreakingAlert`, `renderComparativeGrid`, `renderStatSpotlight`, and `renderEditorialLight`.
   - Implement carousel slide batch rendering.
2. **LinkedIn Mobile Simulator Extension (`src/components/LinkedInPreviewPhone.tsx`)**:
   - Extend the smartphone screen to natively display:
     - Multi-slide interactive carousel viewer (with swipe / arrow controls).
     - Live LinkedIn Poll widget with clickable votes and percentage animations.
     - Rich external link card preview.
     - Pure long-form text layout.
3. **Editor Expansion (`src/components/StoryEditorModal.tsx`)**:
   - Add template selector with live visual thumbnails.
   - Add format switcher (Image / Carousel / Poll / Text / Link).
   - Dynamic inputs based on format (e.g. Poll options, Carousel slides, Stat figures).
4. **Analytics & Performance Dashboard (`src/components/AnalyticsDashboardView.tsx`)**:
   - KPI metrics: Total Impressions, Average Engagement Rate, Total Clicks, Total Reactions.
   - Performance by HTA Authority (comparing NICE, HAS, G-BA, EU JCA).
   - Format ROI comparison (Carousels vs. Single Images vs. Polls).
   - Table of all published posts with inline "Log LinkedIn Performance" action and CSV download.
5. **Server Analytics Endpoints & Data Migration (`server.ts`)**:
   - Update initial stories to include realistic metrics and diverse post formats.
   - Endpoints `/api/analytics` and `/api/stories/:id/metrics`.
   - Update navigation with the new `Analytics` tab.
