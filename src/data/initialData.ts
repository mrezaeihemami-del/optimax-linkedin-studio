import { SourceRegisterItem, Story, AppSettings, WorkflowAgentPrompts } from '../types';

export const INITIAL_SOURCES: SourceRegisterItem[] = [
  {
    id: 'src-nice',
    organization: 'NICE (National Institute for Health and Care Excellence)',
    country: 'United Kingdom',
    type: 'Authority',
    website: 'https://www.nice.org.uk',
    news_url: 'https://www.nice.org.uk/news',
    rss_url: 'https://www.nice.org.uk/feeds/news',
    topics: 'Technology appraisals, clinical guidelines, early value assessment, RWE framework',
    date_verified: '2026-10-15',
    active: true,
  },
  {
    id: 'src-smc',
    organization: 'Scottish Medicines Consortium (SMC)',
    country: 'Scotland (UK)',
    type: 'Authority',
    website: 'https://www.scottishmedicines.org.uk',
    news_url: 'https://www.scottishmedicines.org.uk/news',
    topics: 'New medicine reviews, orphan medicine pathway, PACE meetings',
    date_verified: '2026-10-18',
    active: true,
  },
  {
    id: 'src-has',
    organization: 'Haute Autorité de Santé (HAS)',
    country: 'France',
    type: 'Authority',
    website: 'https://www.has-sante.fr',
    news_url: 'https://www.has-sante.fr/jcms/c_1725514/fr/actualites',
    topics: 'SMR/ASMR evaluations, early access (accès précoce), diagnostic assessments',
    date_verified: '2026-10-20',
    active: true,
  },
  {
    id: 'src-gba',
    organization: 'Federal Joint Committee (G-BA)',
    country: 'Germany',
    type: 'Payer Body',
    website: 'https://www.g-ba.de',
    news_url: 'https://www.g-ba.de/presse/pressemitteilungen-meldungen',
    topics: 'AMNOG benefit assessment, appropriate comparator therapy (ZVT), directive decisions',
    date_verified: '2026-10-22',
    active: true,
  },
  {
    id: 'src-iqwig',
    organization: 'Institute for Quality and Efficiency in Health Care (IQWiG)',
    country: 'Germany',
    type: 'Authority',
    website: 'https://www.iqwig.de',
    news_url: 'https://www.iqwig.de/presse/pressemitteilungen',
    topics: 'Dossier evaluations, general methods (Allgemeine Methoden), rapid reports',
    date_verified: '2026-10-22',
    active: true,
  },
  {
    id: 'src-aifa',
    organization: 'Italian Medicines Agency (AIFA)',
    country: 'Italy',
    type: 'Authority',
    website: 'https://www.aifa.gov.it',
    news_url: 'https://www.aifa.gov.it/en/news',
    topics: 'Reimbursement classification (Class A/H), price negotiation, monitoring registries',
    date_verified: '2026-10-12',
    active: true,
  },
  {
    id: 'src-aemps',
    organization: 'Spanish Agency of Medicines and Medical Devices (AEMPS)',
    country: 'Spain',
    type: 'Authority',
    website: 'https://www.aemps.gob.es',
    news_url: 'https://www.aemps.gob.es/informa',
    topics: 'Therapeutic Positioning Reports (IPT), regulatory evaluation, pricing committee input',
    date_verified: '2026-10-14',
    active: true,
  },
  {
    id: 'src-cda',
    organization: "Canada's Drug Agency (CDA-AMC, formerly CADTH)",
    country: 'Canada',
    type: 'Authority',
    website: 'https://www.cda-amc.ca',
    news_url: 'https://www.cda-amc.ca/news-events',
    topics: 'Pan-Canadian oncology reviews, reimbursement recommendations, clinical & cost-effectiveness',
    date_verified: '2026-10-25',
    active: true,
  },
  {
    id: 'src-inesss',
    organization: "Institut national d'excellence en santé et en services sociaux (INESSS)",
    country: 'Canada (Quebec)',
    type: 'Authority',
    website: 'https://www.inesss.qc.ca',
    news_url: 'https://www.inesss.qc.ca/actualites',
    topics: 'Quebec formulary inclusion, therapeutic value assessment, economic modeling',
    date_verified: '2026-10-25',
    active: true,
  },
  {
    id: 'src-pbac',
    organization: 'Pharmaceutical Benefits Advisory Committee (PBAC)',
    country: 'Australia',
    type: 'Authority',
    website: 'https://www.pbs.gov.au/info/browse/committees/pbac',
    news_url: 'https://www.pbs.gov.au/info/news',
    topics: 'PBS listing recommendations, cost-effectiveness thresholds, risk-sharing agreements',
    date_verified: '2026-10-19',
    active: true,
  },
  {
    id: 'src-msac',
    organization: 'Medical Services Advisory Committee (MSAC)',
    country: 'Australia',
    type: 'Authority',
    website: 'http://www.msac.gov.au',
    news_url: 'http://www.msac.gov.au/internet/msac/publishing.nsf/Content/news',
    topics: 'MBS public funding, medical technologies, diagnostic procedures and prostheses',
    date_verified: '2026-10-19',
    active: true,
  },
  {
    id: 'src-icer',
    organization: 'Institute for Clinical and Economic Review (ICER)',
    country: 'United States',
    type: 'Consultancy',
    website: 'https://icer.org',
    news_url: 'https://icer.org/news-insights/press-releases',
    topics: 'Value assessment frameworks, health-benefit price benchmarks (HBPB), voting meetings',
    date_verified: '2026-10-26',
    active: true,
  },
  {
    id: 'src-eujca',
    organization: 'EU Member State Coordination Group on HTA (HTACG / EU JCA)',
    country: 'European Union',
    type: 'Joint Assessment',
    website: 'https://health.ec.europa.eu/health-technology-assessment',
    news_url: 'https://health.ec.europa.eu/latest-updates_en',
    topics: 'Regulation (EU) 2021/2282, Joint Clinical Assessments, PICO consolidation, methodology guidance',
    date_verified: '2026-10-28',
    active: true,
  }
];

export const DEFAULT_AGENT_PROMPTS: WorkflowAgentPrompts = {
  research_agent: `You are the Senior Research Editor for Optimax Access, an elite HEOR, HTA, and market access consultancy.
Analyze official announcements from registered HTA and reimbursement authorities published or updated within the past 7 days.
Prioritize:
1. HTA methods and reimbursement policy changes.
2. EU joint clinical assessment (JCA) developments and PICO surveys.
3. Evidence requirements for pharmaceuticals, medical devices, diagnostics, and digital health.
4. Economic modeling, RWE, and evidence synthesis guidance.
5. Significant assessment decisions with wider lessons for manufacturers.
Extract canonical source URL, verifiable supporting quotes, publication dates vs event dates, and distinguish proposals from final rules.`,

  copywriter_agent: `You are the Executive LinkedIn Copywriter for Optimax Access.
Write a high-credibility, professional LinkedIn post of 150–220 words.
Structure:
- Strong opening sentence explaining the development clearly.
- Two or three practical implications, clearly separating source facts from Optimax's interpretation.
- Natural closing thought or question that invites executive engagement.
- Include the source URL.
- 3 to 5 targeted hashtags (e.g., #MarketAccess, #HTA, #HEOR).
Style: American English, concise, authoritative, insightful.`,

  graphic_agent: `You are the Visual Content Director for Optimax Access social graphics (1080x1350 master canvas).
Generate punchy, high-impact copy matching the visual layout:
- Image Headline: Maximum 10 words. High-impact summary.
- Image Subtitle: Maximum 20 words. Core context for pharma market access teams.
- Three Key Points: Exactly 3 numbered takeaways, maximum 12 words each.
- Source Footer: Organization name and publication month/year.
- Alt Text: Descriptive accessibility description.`,

  compliance_agent: `You are the Compliance and Fact-Checking Auditor for Optimax Access.
Audit the candidate story against primary evidence:
- Verify that every claim is grounded in the source passage.
- Ensure regulatory uncertainty and qualifications are strictly preserved.
- Prevent duplicate coverage by cross-referencing previously published story logs.
- Enforce human-in-the-loop review status before any live broadcast.`
};

export const INITIAL_SETTINGS: AppSettings = {
  ai_provider: 'gemini-lite',
  openai_key: '',
  claude_key: '',
  deepseek_key: '',
  mistral_key: '',
  custom_provider_name: 'Custom Provider (OpenAI Compatible)',
  custom_api_url: 'https://api.together.xyz/v1',
  custom_api_key: '',
  custom_model_name: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
  agent_prompts: DEFAULT_AGENT_PROMPTS,
  linkedin_client_id: '',
  linkedin_client_secret: '',
  linkedin_access_token: '',
  linkedin_org_urn: 'urn:li:organization:98471203',
  linkedin_org_name: 'Optimax Access',
  bannerbear_api_key: '',
  bannerbear_template_id: 'optimax-1080x1350-master',
  schedule_days: ['Monday', 'Wednesday', 'Friday'],
  schedule_time: '09:00',
  schedule_timezone: 'Europe/London',
  max_posts_per_week: 3,
  brand_name: 'Optimax Access',
  brand_primary_color: '#0B192C',
  brand_accent_color: '#0284C7',
  admin_username: 'admin',
  admin_password: 'admin1234',
};

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story-eujca-carousel-2026',
    status: 'pending',
    format: 'carousel',
    template_style: 'executive_navy',
    organization: 'EU HTACG (European Commission)',
    source_url: 'https://health.ec.europa.eu/health-technology-assessment/regulation_en',
    publication_date: '2026-10-31',
    event_date: '2026-11-01',
    announcement_status: 'final_decision',
    supporting_evidence: 'The EU Coordination Group on HTA finalized the operational template for PICO survey consolidation across Member States, confirming a maximum 90-day window for dossier assessment upon EMA filing.',
    relevance: 'Biopharma sponsors preparing oncologic EU market entries in 2026-2027 must prepare harmonized indirect treatment comparisons (ITCs) capable of addressing diverging national comparator standards simultaneously.',
    post_text: `The EU HTA Coordination Group has formally finalized its consolidated PICO survey mechanics, establishing a strict 90-day assessment timeframe for Joint Clinical Assessments alongside EMA regulatory reviews.

Swipe through our 4-slide executive breakdown to see how global value dossiers must adapt:

 Slide 1: The New 90-Day Operational Clock
 Slide 2: Multi-Comparator PICO Harmonization
 Slide 3: Essential Evidence Generation Shifts
 Slide 4: Strategic Action Plan for Biopharma

Is your HEOR team prepared to align clinical development endpoints with concurrent EU JCA requirements?

Read the full guidance: https://health.ec.europa.eu/health-technology-assessment/regulation_en

#MarketAccess #HTA #EUJCA #HEOR #PharmaStrategy #Carousel`,
    hashtags: ['MarketAccess', 'HTA', 'EUJCA', 'HEOR', 'PharmaStrategy'],
    image_headline: 'EU JCA PICO Consolidation Finalized',
    image_subtitle: 'Operational 90-day timeline set for joint clinical assessments alongside EMA filings',
    image_key_points: [
      'Multi-comparator PICO surveys consolidated across Member States',
      'Mandatory pre-submission indirect treatment comparisons',
      'National HTA bodies shift focus strictly to economic appraisal'
    ],
    image_source_footer: 'Source: EU HTACG / European Commission · Oct 2026',
    alt_text: 'Optimax Access summary of EU HTA Coordination Group PICO consolidation and 90-day assessment guidelines.',
    carousel_slides: [
      {
        id: 'slide-1',
        slide_number: 1,
        title: 'EU JCA Operational Reality',
        subtitle: 'The 90-day assessment countdown starts upon EMA dossier validation',
        key_points: [
          'JCA timeline runs strictly in parallel with CHMP regulatory review',
          'Consolidated PICO questions delivered to sponsors within 30 days',
          'Sponsors must deliver finalized clinical dossier within tight 60-day window'
        ],
        footer_text: 'Slide 1/4 · Optimax Access Market Intelligence'
      },
      {
        id: 'slide-2',
        slide_number: 2,
        title: 'Multi-Comparator PICO Matrix',
        subtitle: 'Managing diverging standard-of-care across 27 Member States',
        key_points: [
          'Member States submit national comparator preferences independently',
          'Consolidation algorithm groups requirements into primary & secondary PICOs',
          'Failure to address a mandatory national comparator risks domestic rejection'
        ],
        footer_text: 'Slide 2/4 · Optimax Access Market Intelligence'
      },
      {
        id: 'slide-3',
        slide_number: 3,
        title: 'HEOR & Evidence Generation Shift',
        subtitle: 'Front-loading network meta-analyses well before phase 3 readout',
        key_points: [
          'Synthesized trial endpoints must align across disparate global definitions',
          'Indirect treatment comparisons (ITCs) must accommodate non-proportional hazards',
          'Subgroup evidence must be pre-planned to prevent unadjusted post-hoc scrutiny'
        ],
        footer_text: 'Slide 3/4 · Optimax Access Market Intelligence'
      },
      {
        id: 'slide-4',
        slide_number: 4,
        title: 'Strategic Sponsor Checklist',
        subtitle: 'Four concrete steps commercial and access teams must take today',
        key_points: [
          'Audit Phase 3 comparator arms against top 5 European market registries',
          'Establish a cross-functional JCA rapid-response taskforce by Q1',
          'Reserve domestic resources strictly for budget impact & cost-effectiveness models'
        ],
        footer_text: 'Slide 4/4 · Optimax Access Market Intelligence'
      }
    ],
    created_at: '2026-11-02T08:30:00Z',
    scheduled_time: '2026-11-06T09:00:00Z',
  },
  {
    id: 'story-poll-risk-2026',
    status: 'pending',
    format: 'poll',
    template_style: 'editorial_light',
    organization: 'Optimax Market Access Intelligence',
    source_url: 'https://health.ec.europa.eu/health-technology-assessment',
    publication_date: '2026-11-03',
    event_date: '2026-11-03',
    announcement_status: 'proposal',
    supporting_evidence: 'Industry surveys reveal diverging concerns regarding the January 2025/2026 implementation of mandatory EU Joint Clinical Assessments for advanced therapies and oncology products.',
    relevance: 'Gathers community benchmark data on whether biopharma teams are most vulnerable to methodological PICO splits, calendar compression, or indirect comparison complexity.',
    post_text: `With the EU Health Technology Assessment Regulation (HTAR) now actively reshaping European product launches, access executives face unprecedented operational synchronization challenges.

In your organization's preparation for Joint Clinical Assessments (JCA), which dimension presents the highest operational risk?

Vote in our community pulse poll below and share your team's perspective in the comments.

#EUJCA #HTA #MarketAccess #PharmaStrategy #Poll`,
    hashtags: ['EUJCA', 'HTA', 'MarketAccess', 'PharmaStrategy', 'Poll'],
    image_headline: 'Industry Pulse: Key Risk in EU JCA Delivery',
    image_subtitle: 'Evaluating sponsor readiness across 27 Member State appraisal expectations',
    image_key_points: [
      'PICO divergence across national payer archetypes',
      'Compressed 90-day response turnaround window',
      'Pre-submission indirect treatment comparison synthesis'
    ],
    image_source_footer: 'Optimax Access Community Benchmark · Nov 2026',
    alt_text: 'LinkedIn Poll on EU JCA operational vulnerability for biopharma sponsors.',
    poll_data: {
      question: 'Which factor poses the greatest operational risk to your EU JCA dossier?',
      duration_days: 7,
      total_votes: 342,
      options: [
        { id: 'opt-1', text: 'PICO divergence across 27 Member States', votes: 148 },
        { id: 'opt-2', text: 'Compressed 90-day dossier delivery window', votes: 94 },
        { id: 'opt-3', text: 'Complex Indirect Treatment Comparisons (ITCs)', votes: 68 },
        { id: 'opt-4', text: 'Internal cross-functional governance silos', votes: 32 }
      ]
    },
    created_at: '2026-11-03T10:00:00Z',
    scheduled_time: '2026-11-08T09:00:00Z',
  },
  {
    id: 'story-nice-rwe-2026',
    status: 'approved',
    format: 'image',
    template_style: 'breaking_alert',
    organization: 'NICE (United Kingdom)',
    source_url: 'https://www.nice.org.uk/about/what-we-do/our-programmes/nice-guidance/real-world-evidence',
    publication_date: '2026-10-27',
    event_date: '2026-11-15',
    announcement_status: 'implementation',
    supporting_evidence: 'NICE has expanded its Real-World Evidence Framework, establishing quantitative quality benchmarks for external control arms (ECAs) and synthetic controls in single-arm oncology trials.',
    relevance: 'Provides unprecedented methodological clarity for rare disease and precision oncology submissions, but raises the documentation burden on data curation provenance and confounding bias mitigation.',
    post_text: `BREAKING METHODOLOGICAL GUIDANCE: NICE has officially expanded its Real-World Evidence (RWE) Framework, publishing definitive quantitative standards for synthetic control arms and observational data in single-arm oncology submissions.

Here is what this means for evidence generation across UK market access:

1. External control arms (ECAs) now face standardized validation criteria for patient-level matching, residual confounding, and baseline covariate balance.
2. Submissions utilizing registry linkages must supply documented provenance on data curation and lost-to-follow-up audits.
3. Transparent sensitivity analyses comparing multiple propensity score weighting methods will become a baseline requirement during technical committee review.

While this expands reimbursement opportunities for rare indications, methodological rigor cannot be an afterthought.

How is your pipeline structuring observational data pipelines to satisfy UK payer expectations?

Source: https://www.nice.org.uk/about/what-we-do/our-programmes/nice-guidance/real-world-evidence

#NICE #RealWorldEvidence #HealthEconomics #Oncology #UKMarketAccess`,
    hashtags: ['NICE', 'RealWorldEvidence', 'HealthEconomics', 'Oncology', 'UKMarketAccess'],
    image_headline: 'NICE Updates Real-World Evidence Framework',
    image_subtitle: 'New quantitative quality standards for external control arms in oncology appraisals',
    image_key_points: [
      'Standardized matching criteria for synthetic control cohorts',
      'Audited data provenance required for registry linkages',
      'Mandatory sensitivity checks across propensity weighting methods'
    ],
    image_source_footer: 'Source: NICE RWE Programme · Oct 2026',
    alt_text: 'Optimax Access graphic breaking down NICE new quality standards for external control arms.',
    created_at: '2026-11-01T11:15:00Z',
    reviewed_at: '2026-11-01T15:00:00Z',
    scheduled_time: '2026-11-09T09:00:00Z',
  },
  {
    id: 'story-gba-orphan-2026',
    status: 'published',
    format: 'image',
    template_style: 'stat_spotlight',
    organization: 'Federal Joint Committee (G-BA) & IQWiG',
    source_url: 'https://www.g-ba.de/presse/pressemitteilungen-meldungen/1182/',
    publication_date: '2026-10-20',
    event_date: '2026-10-20',
    announcement_status: 'final_decision',
    supporting_evidence: 'G-BA implemented revised procedural rules for the €30 million statutory sales threshold for orphan medicinal products, clarifying comparative assessment submission triggers.',
    relevance: 'Specialty manufacturers must maintain dual-track AMNOG dossiers (with and without standard comparator therapy) as revenues approach the statutory boundary.',
    post_text: `The German Federal Joint Committee (G-BA) has released finalized implementation guidance on the €30 million statutory revenue threshold for orphan drugs under AMNOG.

Key takeaways for European commercial teams:

1. Crossing the €30M threshold triggers immediate full benefit dossier requirements against an active Appropriate Comparator Therapy (zVT).
2. The G-BA clarified that observational data collected under registry mandates can be leveraged for the secondary assessment if predefined quality metrics are met.
3. Early price negotiations now reflect cumulative risk-sharing arrangements earlier in product lifecycles.

Dual-track HEOR preparation from launch is no longer optional for high-growth orphan indications.

Source: https://www.g-ba.de/presse/pressemitteilungen-meldungen/1182/

#AMNOG #GBA #OrphanDrugs #PricingAndReimbursement #Germany`,
    hashtags: ['AMNOG', 'GBA', 'OrphanDrugs', 'PricingAndReimbursement', 'Germany'],
    image_headline: 'AMNOG €30M Orphan Cap Guidance Finalized',
    image_subtitle: 'Operational rules established for dossier submissions upon crossing €30M statutory sales threshold',
    image_key_points: [
      'Immediate full comparative assessment triggered at €30M revenue',
      'Registry data permissible for secondary benefit verification',
      'Dual-track HEOR planning required from initial commercial launch'
    ],
    stat_figure: '€30M',
    stat_label: 'Statutory Sales Threshold for Full AMNOG Dossier Trigger',
    image_source_footer: 'Source: Federal Joint Committee (G-BA) · Oct 2026',
    alt_text: 'Optimax Access infographic detailing G-BA orphan drug AMNOG threshold rules.',
    created_at: '2026-10-21T09:00:00Z',
    published_at: '2026-10-22T09:00:00Z',
    reviewed_at: '2026-10-21T16:20:00Z',
    linkedin_post_id: 'urn:li:share:725489012398471203',
    metrics: {
      impressions: 14850,
      clicks: 864,
      reactions: 326,
      comments: 48,
      reposts: 31,
      engagement_rate: 8.54,
      recorded_at: '2026-10-25T14:30:00Z'
    }
  },
  {
    id: 'story-has-comparative-2026',
    status: 'published',
    format: 'image',
    template_style: 'comparative_grid',
    organization: 'Haute Autorité de Santé (HAS)',
    source_url: 'https://www.has-sante.fr/jcms/c_1725514/fr/actualites',
    publication_date: '2026-10-18',
    event_date: '2026-10-18',
    announcement_status: 'implementation',
    supporting_evidence: 'HAS updated criteria governing the distinction between Accès Précoce (early access with presumption of innovation) and Accès Compassionnel (compassionate use for unapproved drugs).',
    relevance: 'Clear differentiation allows commercial teams to map France early access timing with precision, mitigating rebate clawback exposure under LFSS rules.',
    post_text: `Understanding French market access: HAS and ANSM have issued coordinated guidance clarifying the operational boundary between Early Access (Accès Précoce) and Compassionate Access (Accès Compassionnel).

For manufacturers planning French launches, distinguishing these pathways is critical for clinical trial continuity and commercial pricing:

Accès Précoce (AP): Requires a presumption of major innovation (ASMR potential) with intention to commercialize in France. Unlocks paid early availability with structured real-world data collection mandates.
Accès Compassionnel (AC): Designed for exceptional non-commercialized circumstances without clinical research intent.

Swipe through the comparative table in our graphic to evaluate eligibility criteria for your pipeline asset.

Full briefing: https://www.has-sante.fr/jcms/c_1725514/fr/actualites

#HAS #MarketAccess #France #EarlyAccess #HEOR`,
    hashtags: ['HAS', 'MarketAccess', 'France', 'EarlyAccess', 'HEOR'],
    image_headline: 'France Early Access Framework Compared',
    image_subtitle: 'Strategic comparison between Accès Précoce and Accès Compassionnel pathways',
    image_key_points: [
      'Presumption of innovation required for paid Early Access',
      'Mandatory registry data collection protocols under AP',
      'Compassionate access reserved strictly for exceptional clinical need'
    ],
    comparison_left_title: 'Accès Précoce (AP)',
    comparison_left_points: [
      'Presumption of clinical innovation (ASMR I-IV potential)',
      'Direct commercial compensation prior to formal price decree',
      'Mandatory patient registry & real-world evidence protocol',
      'Application tied to active or imminent EMA marketing authorization'
    ],
    comparison_right_title: 'Accès Compassionnel (AC)',
    comparison_right_points: [
      'Exceptional individual treatment need with no therapeutic alternative',
      'Non-innovative or unlicensed indication compassionate use',
      'Limited commercial price flexibility with standard rebate clawbacks',
      'Not intended to substitute for formal clinical trial participation'
    ],
    image_source_footer: 'Source: HAS & ANSM France · Oct 2026',
    alt_text: 'Comparative grid showing differences between Accès Précoce and Accès Compassionnel in France.',
    created_at: '2026-10-18T10:00:00Z',
    published_at: '2026-10-19T09:00:00Z',
    reviewed_at: '2026-10-18T17:00:00Z',
    linkedin_post_id: 'urn:li:share:725192837482910482',
    metrics: {
      impressions: 11420,
      clicks: 612,
      reactions: 245,
      comments: 32,
      reposts: 19,
      engagement_rate: 7.95,
      recorded_at: '2026-10-23T11:00:00Z'
    }
  },
  {
    id: 'story-cda-cadth-link-2026',
    status: 'published',
    format: 'article_link',
    template_style: 'editorial_light',
    organization: "Canada's Drug Agency (CDA-AMC)",
    source_url: 'https://www.cda-amc.ca/news-events/new-reimbursement-guidelines-rare-diseases',
    publication_date: '2026-10-14',
    event_date: '2026-10-14',
    announcement_status: 'final_decision',
    supporting_evidence: "CDA-AMC (formerly CADTH) published finalized methodological guidelines on time-limited reimbursement recommendations for rare disease therapies, contingent on confirmatory real-world evidence.",
    relevance: "Establishes a structured Canadian pathway for conditional coverage while Phase 3 extension and registry data mature.",
    post_text: `Canada's Drug Agency (CDA-AMC, formerly CADTH) has officially instituted its conditional reimbursement framework for rare disease therapies.

Under the new policy, the pan-Canadian advisory committees can now issue "Reimburse with Managed Access" recommendations for high-uncertainty treatments, contingent on 2-3 year real-world data collection registries.

Key impacts for North American market access strategies:
• Bridges the evidentiary chasm for orphan therapies where randomized phase 3 trials are unfeasible.
• Links initial pCPA pricing negotiations directly to prospective milestone reviews.
• Standardizes patient-reported outcomes (PRO) protocols across participating provincial health plans.

Explore CDA's comprehensive guidance document via the link below:
https://www.cda-amc.ca/news-events/new-reimbursement-guidelines-rare-diseases

#CDA #CADTH #CanadaAccess #RareDiseases #ManagedAccess`,
    hashtags: ['CDA', 'CADTH', 'CanadaAccess', 'RareDiseases', 'ManagedAccess'],
    image_headline: "CDA Releases Managed Access Framework for Rare Diseases",
    image_subtitle: 'Time-limited reimbursement recommendations linked to real-world evidence registries',
    image_key_points: [
      'Conditional coverage for high-uncertainty orphan therapies',
      'Provincial coordination through synchronized pCPA negotiations',
      'Mandatory prospective milestone reviews at 24 and 36 months'
    ],
    image_source_footer: "Source: Canada's Drug Agency (CDA-AMC) · Oct 2026",
    alt_text: "CDA-AMC rare disease managed access guidance report preview.",
    created_at: '2026-10-14T08:00:00Z',
    published_at: '2026-10-15T09:00:00Z',
    reviewed_at: '2026-10-14T14:00:00Z',
    linkedin_post_id: 'urn:li:share:724982736192837461',
    metrics: {
      impressions: 8960,
      clicks: 742,
      reactions: 198,
      comments: 24,
      reposts: 14,
      engagement_rate: 10.92,
      recorded_at: '2026-10-18T16:00:00Z'
    }
  },
  {
    id: 'story-icer-thought-leadership-2026',
    status: 'published',
    format: 'text_only',
    template_style: 'editorial_light',
    organization: 'Institute for Clinical and Economic Review (ICER)',
    source_url: 'https://icer.org/news-insights/press-releases/value-assessment-framework-update',
    publication_date: '2026-10-08',
    event_date: '2026-10-08',
    announcement_status: 'consultation',
    supporting_evidence: 'ICER proposed updating its Value Assessment Framework to include equal value of life years gained (evLYG) alongside traditional QALYs in baseline cost-effectiveness analyses.',
    relevance: 'Signals a continuing shift in US payer-facing assessments to guard against discrimination in disability and life-extension metrics.',
    post_text: `The debate over QALYs versus evLYG in US health technology assessment is reaching a critical inflection point.

In ICER's latest proposed updates to its Value Assessment Framework, the institute is elevating the Equal Value of Life Years Gained (evLYG) to equal prominence with traditional cost-per-QALY models across all future evaluation dossiers.

Why does this matter for biopharma executives navigating US commercialization?

1. evLYG eliminates penalties for treatments that extend life in populations with pre-existing disabilities or chronic baseline impairments.
2. In rare diseases and pediatric oncology, this dual reporting significantly alters the calculated Health-Benefit Price Benchmark (HBPB).
3. US private payers and state Medicaid programs increasingly reference ICER's dual-endpoint tables during formulary tiering.

The question isn't whether your health economics team models evLYG, but how early in your clinical development program you define the parameters to support it.

What is your experience presenting evLYG alongside QALYs to US pharmacy and therapeutics (P&T) committees?

Full ICER proposal: https://icer.org/news-insights/press-releases/value-assessment-framework-update

#ICER #HealthEconomics #ValueAssessment #evLYG #PharmaAccess`,
    hashtags: ['ICER', 'HealthEconomics', 'ValueAssessment', 'evLYG', 'PharmaAccess'],
    image_headline: 'ICER Elevates evLYG in Value Framework',
    image_subtitle: 'Dual reporting standards for QALY and evLYG across US cost-effectiveness models',
    image_key_points: [
      'evLYG elevated to co-primary value benchmark',
      'Direct impact on Health-Benefit Price Benchmark ranges',
      'P&T committees demanding dual-metric economic dossiers'
    ],
    image_source_footer: 'Source: ICER Value Assessment Framework · Oct 2026',
    alt_text: 'Executive discussion on ICER value assessment evolution and evLYG adoption.',
    created_at: '2026-10-08T09:00:00Z',
    published_at: '2026-10-09T09:00:00Z',
    reviewed_at: '2026-10-08T16:00:00Z',
    linkedin_post_id: 'urn:li:share:724726152918273619',
    metrics: {
      impressions: 16200,
      clicks: 490,
      reactions: 412,
      comments: 67,
      reposts: 42,
      engagement_rate: 6.24,
      recorded_at: '2026-10-12T15:00:00Z'
    }
  }
];
