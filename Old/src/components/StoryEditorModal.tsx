import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Sparkles, 
  Hash, 
  AlertCircle, 
  FileText, 
  Image as ImageIcon,
  Layers,
  Vote,
  ExternalLink,
  AlignLeft,
  Plus,
  Trash2,
  Columns
} from 'lucide-react';
import { Story, AnnouncementStatus, PostFormat, TemplateStyle, CarouselSlide } from '../types';

interface StoryEditorModalProps {
  story: Story;
  onSave: (updatedStory: Story) => void;
  onClose: () => void;
}

export const StoryEditorModal: React.FC<StoryEditorModalProps> = ({
  story,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<Story>({ 
    ...story,
    format: story.format || 'image',
    template_style: story.template_style || 'executive_navy',
    carousel_slides: story.carousel_slides || [
      {
        id: 's-1',
        slide_number: 1,
        title: story.image_headline,
        subtitle: story.image_subtitle,
        key_points: [...story.image_key_points],
        footer_text: 'Slide 1/3 · Optimax Access'
      },
      {
        id: 's-2',
        slide_number: 2,
        title: 'Evidence Generation Priorities',
        subtitle: 'Key data requirements for dossier preparation',
        key_points: [
          'Indirect treatment comparisons across national PICOs',
          'Synthetic control arm benchmark compliance',
          'Pre-submission regulatory alignment'
        ],
        footer_text: 'Slide 2/3 · Optimax Access'
      },
      {
        id: 's-3',
        slide_number: 3,
        title: 'Strategic Recommendations',
        subtitle: 'Operational steps for access leaders',
        key_points: [
          'Establish cross-functional rapid response taskforce',
          'Audit Phase 3 comparator arms early',
          'Adapt national economic models swiftly'
        ],
        footer_text: 'Slide 3/3 · Optimax Access'
      }
    ],
    poll_data: story.poll_data || {
      question: story.image_headline || 'Which factor poses the greatest operational risk to your HTA submission?',
      duration_days: 7,
      total_votes: 120,
      options: [
        { id: 'opt-1', text: 'PICO divergence across Member States', votes: 55 },
        { id: 'opt-2', text: 'Compressed 90-day appraisal timeline', votes: 35 },
        { id: 'opt-3', text: 'Indirect treatment comparison gaps', votes: 20 },
        { id: 'opt-4', text: 'Internal cross-functional governance', votes: 10 },
      ]
    }
  });

  const [hashtagInput, setHashtagInput] = useState(story.hashtags.join(', '));
  const [activeTab, setActiveTab] = useState<'copy' | 'visual' | 'format_details' | 'meta'>('copy');

  const wordCount = formData.post_text.trim().split(/\s+/).filter(Boolean).length;

  const handleKeyPointChange = (index: number, val: string) => {
    const updated = [...formData.image_key_points];
    updated[index] = val;
    setFormData({ ...formData, image_key_points: updated });
  };

  const handleSlideChange = (slideIndex: number, field: keyof CarouselSlide, val: any) => {
    const slides = [...(formData.carousel_slides || [])];
    slides[slideIndex] = { ...slides[slideIndex], [field]: val };
    setFormData({ ...formData, carousel_slides: slides });
  };

  const handleSlidePointChange = (slideIndex: number, ptIndex: number, val: string) => {
    const slides = [...(formData.carousel_slides || [])];
    const points = [...slides[slideIndex].key_points];
    points[ptIndex] = val;
    slides[slideIndex] = { ...slides[slideIndex], key_points: points };
    setFormData({ ...formData, carousel_slides: slides });
  };

  const handlePollOptionChange = (optIndex: number, text: string) => {
    if (!formData.poll_data) return;
    const options = [...formData.poll_data.options];
    options[optIndex] = { ...options[optIndex], text };
    setFormData({
      ...formData,
      poll_data: { ...formData.poll_data, options }
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedHashtags = hashtagInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    onSave({
      ...formData,
      hashtags: parsedHashtags,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Edit LinkedIn Post & Presentation
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formData.organization} · Format: {formData.format?.toUpperCase()} · Style: {formData.template_style?.replace('_', ' ')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-white dark:bg-slate-900 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('copy')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'copy'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            1. Post Caption & Text
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'visual'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            2. Graphic Templates (5 Styles)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('format_details')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'format_details'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            3. Native Post Formats (Poll/Carousel)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('meta')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'meta'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            4. Source & Status
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: POST CAPTION */}
          {activeTab === 'copy' && (
            <div className="space-y-4">
              {/* Format Switcher */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                  Select LinkedIn Post Format
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'image', label: 'Single Image', icon: ImageIcon, desc: '1080x1350 card' },
                    { id: 'carousel', label: 'PDF Carousel', icon: Layers, desc: 'Multi-slide doc' },
                    { id: 'poll', label: 'Interactive Poll', icon: Vote, desc: 'Community voting' },
                    { id: 'article_link', label: 'Article Link', icon: ExternalLink, desc: 'Rich preview' },
                    { id: 'text_only', label: 'Text Only', icon: AlignLeft, desc: 'Thought piece' },
                  ].map((fmt) => {
                    const Icon = fmt.icon;
                    const isSelected = formData.format === fmt.id;
                    return (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, format: fmt.id as PostFormat })}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-500'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-900'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{fmt.label}</div>
                        <div className="text-[10px] text-slate-400">{fmt.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Caption */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    LinkedIn Caption (Target: 150–220 words)
                  </label>
                  <span className={`text-xs font-mono font-medium ${
                    wordCount >= 140 && wordCount <= 230
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    {wordCount} words
                  </span>
                </div>
                <textarea
                  rows={9}
                  value={formData.post_text}
                  onChange={(e) => setFormData({ ...formData, post_text: e.target.value })}
                  className="w-full text-sm p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-sans leading-relaxed"
                  required
                />
              </div>

              {/* Hashtags */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  Hashtags (comma separated)
                </label>
                <input
                  type="text"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  placeholder="MarketAccess, HTA, HEOR"
                />
              </div>
            </div>
          )}

          {/* TAB 2: VISUAL TEMPLATES */}
          {activeTab === 'visual' && (
            <div className="space-y-6">
              {/* Template Style Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                  Select Visual Graphic Template (1080×1350)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {[
                    { id: 'executive_navy', name: 'Executive Navy', desc: 'Classic navy gradient with subtle tech grid' },
                    { id: 'breaking_alert', name: 'Breaking Alert', desc: 'High-contrast red banner for urgent changes' },
                    { id: 'comparative_grid', name: 'Comparative Grid', desc: 'Two-column policy or pathway comparison' },
                    { id: 'stat_spotlight', name: 'Stat Spotlight', desc: 'Massive stat callout with badge explanation' },
                    { id: 'editorial_light', name: 'Editorial Light', desc: 'Clean white background with blue accents' },
                  ].map((style) => {
                    const isSelected = formData.template_style === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, template_style: style.id as TemplateStyle })}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-500'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-900'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                          {style.name}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">
                          {style.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Common Template Fields */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                    Headline (Maximum 10 words)
                  </label>
                  <input
                    type="text"
                    value={formData.image_headline}
                    onChange={(e) => setFormData({ ...formData, image_headline: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                    Subtitle (Maximum 20 words)
                  </label>
                  <input
                    type="text"
                    value={formData.image_subtitle}
                    onChange={(e) => setFormData({ ...formData, image_subtitle: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Stat Spotlight specifics */}
                {formData.template_style === 'stat_spotlight' && (
                  <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800 space-y-3">
                    <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300">
                      Stat Spotlight Callout Fields
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                          Large Figure (e.g., €30M, 90 Days, 85%)
                        </label>
                        <input
                          type="text"
                          value={formData.stat_figure || ''}
                          onChange={(e) => setFormData({ ...formData, stat_figure: e.target.value })}
                          className="w-full text-sm font-bold font-mono px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                          placeholder="€30M"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                          Stat Label / Description
                        </label>
                        <input
                          type="text"
                          value={formData.stat_label || ''}
                          onChange={(e) => setFormData({ ...formData, stat_label: e.target.value })}
                          className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                          placeholder="Statutory Revenue Threshold Trigger"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Comparative Grid specifics */}
                {formData.template_style === 'comparative_grid' && (
                  <div className="p-4 bg-sky-50/50 dark:bg-sky-950/20 rounded-xl border border-sky-200 dark:border-sky-800 space-y-3">
                    <h4 className="text-xs font-bold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
                      <Columns className="w-4 h-4" /> Comparative Columns
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                          Left Column Title
                        </label>
                        <input
                          type="text"
                          value={formData.comparison_left_title || ''}
                          onChange={(e) => setFormData({ ...formData, comparison_left_title: e.target.value })}
                          className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                          placeholder="Pathway A"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                          Right Column Title
                        </label>
                        <input
                          type="text"
                          value={formData.comparison_right_title || ''}
                          onChange={(e) => setFormData({ ...formData, comparison_right_title: e.target.value })}
                          className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                          placeholder="Pathway B"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3 Key Points */}
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 block">
                    Three Key Takeaways (Max 12 words each)
                  </label>
                  <div className="space-y-2">
                    {[0, 1, 2].map((idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 w-6">
                          0{idx + 1}
                        </span>
                        <input
                          type="text"
                          value={formData.image_key_points[idx] || ''}
                          onChange={(e) => handleKeyPointChange(idx, e.target.value)}
                          className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                          placeholder={`Takeaway ${idx + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Source Footer */}
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                    Image Footer Credit
                  </label>
                  <input
                    type="text"
                    value={formData.image_source_footer}
                    onChange={(e) => setFormData({ ...formData, image_source_footer: e.target.value })}
                    className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FORMAT DETAILS (POLL & CAROUSEL) */}
          {activeTab === 'format_details' && (
            <div className="space-y-6">
              {/* Poll Configuration */}
              {formData.format === 'poll' && formData.poll_data && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <Vote className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      LinkedIn Poll Question & Options
                    </h3>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                      Poll Question (Max 140 chars)
                    </label>
                    <input
                      type="text"
                      value={formData.poll_data.question}
                      onChange={(e) => setFormData({
                        ...formData,
                        poll_data: { ...formData.poll_data!, question: e.target.value }
                      })}
                      className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                      Poll Options (Max 30 chars each)
                    </label>
                    {formData.poll_data.options.map((opt, optIdx) => (
                      <div key={opt.id} className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400 w-5">
                          #{optIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => handlePollOptionChange(optIdx, e.target.value)}
                          maxLength={30}
                          className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                        />
                        <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                          {opt.votes} votes
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Carousel Configuration */}
              {formData.format === 'carousel' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-600" />
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Carousel Slides ({formData.carousel_slides?.length || 0} slides)
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {formData.carousel_slides?.map((slide, sIdx) => (
                      <div key={slide.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                            Slide {sIdx + 1}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {slide.footer_text}
                          </span>
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                            Slide Title
                          </label>
                          <input
                            type="text"
                            value={slide.title}
                            onChange={(e) => handleSlideChange(sIdx, 'title', e.target.value)}
                            className="w-full text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                            Slide Subtitle
                          </label>
                          <input
                            type="text"
                            value={slide.subtitle || ''}
                            onChange={(e) => handleSlideChange(sIdx, 'subtitle', e.target.value)}
                            className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block">
                            Key Bullet Points
                          </label>
                          {slide.key_points.map((pt, pIdx) => (
                            <input
                              key={pIdx}
                              type="text"
                              value={pt}
                              onChange={(e) => handleSlidePointChange(sIdx, pIdx, e.target.value)}
                              className="w-full text-xs px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                              placeholder={`Point ${pIdx + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.format === 'article_link' && (
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Article Link Card Settings
                  </h4>
                  <p className="text-xs text-slate-500">
                    This post will render with a clickable preview card generated directly from the canonical source URL.
                  </p>
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                      Canonical Source URL
                    </label>
                    <input
                      type="url"
                      value={formData.source_url}
                      onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                      className="w-full text-xs font-mono px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>
              )}

              {formData.format === 'text_only' && (
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <h4 className="font-bold text-slate-900 dark:text-white">Text-Only Thought Leadership Format</h4>
                  <p>
                    Text posts on LinkedIn often achieve higher comment depth and algorithmic reach among senior executives.
                    Make sure the opening two sentences serve as an arresting hook.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SOURCE & STATUS */}
          {activeTab === 'meta' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Announcement Status
                </label>
                <select
                  value={formData.announcement_status}
                  onChange={(e) => setFormData({ ...formData, announcement_status: e.target.value as AnnouncementStatus })}
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="final_decision">Final Decision / Guidance</option>
                  <option value="draft_guidance">Draft Guidance / Appraisal</option>
                  <option value="consultation">Public Consultation</option>
                  <option value="proposal">Policy Proposal</option>
                  <option value="implementation">Implementation Notice</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Target Authority / Organization
                </label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Source Announcement URL
                </label>
                <input
                  type="url"
                  value={formData.source_url}
                  onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Primary Supporting Evidence / Direct Excerpt
                </label>
                <textarea
                  rows={4}
                  value={formData.supporting_evidence}
                  onChange={(e) => setFormData({ ...formData, supporting_evidence: e.target.value })}
                  className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[11px] text-slate-400">
              Format: <span className="font-semibold text-blue-600">{formData.format}</span> | Style: <span className="font-semibold text-blue-600">{formData.template_style}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                Save Changes & Update Preview
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
