export type PostStatus = 'pending' | 'approved' | 'rejected' | 'published';

export type AnnouncementStatus = 
  | 'proposal' 
  | 'consultation' 
  | 'draft_guidance' 
  | 'final_decision' 
  | 'implementation';

export type PostFormat = 'image' | 'carousel' | 'text_only' | 'poll' | 'article_link';

export type TemplateStyle = 
  | 'executive_navy' 
  | 'breaking_alert' 
  | 'comparative_grid' 
  | 'stat_spotlight' 
  | 'editorial_light';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollData {
  question: string;
  options: PollOption[];
  duration_days: number;
  total_votes: number;
  user_voted_option_id?: string;
}

export interface CarouselSlide {
  id: string;
  slide_number: number;
  title: string;
  subtitle?: string;
  key_points: string[];
  footer_text?: string;
}

export interface PostMetrics {
  impressions: number;
  clicks: number;
  reactions: number;
  comments: number;
  reposts: number;
  engagement_rate: number;
  recorded_at?: string;
}

export interface Story {
  id: string;
  status: PostStatus;
  format: PostFormat;
  template_style: TemplateStyle;
  organization: string;
  source_url: string;
  publication_date: string;
  event_date?: string;
  announcement_status: AnnouncementStatus;
  supporting_evidence: string;
  relevance: string;
  post_text: string;
  hashtags: string[];
  
  // Single image and template fields
  image_headline: string;
  image_subtitle: string;
  image_key_points: string[];
  image_source_footer: string;
  alt_text: string;
  image_data_url?: string;
  
  // Specific format fields
  poll_data?: PollData;
  carousel_slides?: CarouselSlide[];
  stat_figure?: string;
  stat_label?: string;
  comparison_left_title?: string;
  comparison_left_points?: string[];
  comparison_right_title?: string;
  comparison_right_points?: string[];
  
  // Performance and scheduling
  scheduled_time?: string;
  linkedin_post_id?: string;
  created_at: string;
  published_at?: string;
  reviewed_at?: string;
  metrics?: PostMetrics;
}

export interface SourceRegisterItem {
  id: string;
  organization: string;
  country: string;
  type: 'Authority' | 'Payer Body' | 'Consultancy' | 'Professional Org' | 'Joint Assessment';
  website: string;
  news_url: string;
  rss_url?: string;
  topics: string;
  date_verified: string;
  active: boolean;
}

export type AIProvider = 'gemini' | 'gemini-lite' | 'openai' | 'claude' | 'deepseek' | 'mistral' | 'custom';

export interface WorkflowAgentPrompts {
  research_agent: string;
  copywriter_agent: string;
  graphic_agent: string;
  compliance_agent: string;
}

export interface AppSettings {
  ai_provider: AIProvider;
  openai_key?: string;
  claude_key?: string;
  deepseek_key?: string;
  mistral_key?: string;
  custom_provider_name?: string;
  custom_api_url?: string;
  custom_api_key?: string;
  custom_model_name?: string;
  agent_prompts: WorkflowAgentPrompts;
  linkedin_client_id?: string;
  linkedin_client_secret?: string;
  linkedin_access_token?: string;
  linkedin_org_urn?: string;
  linkedin_org_name?: string;
  bannerbear_api_key?: string;
  bannerbear_template_id?: string;
  schedule_days: string[];
  schedule_time: string;
  schedule_timezone: string;
  max_posts_per_week: number;
  brand_name: string;
  brand_primary_color: string;
  brand_accent_color: string;
  admin_username?: string;
  admin_password?: string;
}
