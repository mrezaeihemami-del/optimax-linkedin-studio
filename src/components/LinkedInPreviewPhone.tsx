import React, { useState, useEffect, useRef } from 'react';
import { 
  ThumbsUp, 
  MessageSquare, 
  Repeat2, 
  Send, 
  MoreHorizontal, 
  Globe, 
  Sparkles,
  Download,
  Check,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Layers,
  BarChart2,
  FileText,
  ExternalLink,
  Vote,
  Layout,
  CheckCircle
} from 'lucide-react';
import { Story, AppSettings, PostFormat, TemplateStyle } from '../types';
import { renderOptimaxPostImage } from '../utils/canvasRenderer';

interface LinkedInPreviewPhoneProps {
  story: Story;
  settings: AppSettings;
  onDownloadImage?: () => void;
  onPollVote?: (optionId: string) => void;
}

export const LinkedInPreviewPhone: React.FC<LinkedInPreviewPhoneProps> = ({
  story,
  settings,
  onDownloadImage,
  onPollVote,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [renderedImageUrl, setRenderedImageUrl] = useState<string>('');
  const [activeTemplate, setActiveTemplate] = useState<TemplateStyle>(story.template_style || 'executive_navy');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [votedOptionId, setVotedOptionId] = useState<string | undefined>(story.poll_data?.user_voted_option_id);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync activeTemplate when story changes
  useEffect(() => {
    setActiveTemplate(story.template_style || 'executive_navy');
    setActiveSlideIndex(0);
    setVotedOptionId(story.poll_data?.user_voted_option_id);
  }, [story.id, story.template_style, story.poll_data?.user_voted_option_id]);

  // Re-render canvas image whenever story or template changes
  useEffect(() => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = renderOptimaxPostImage(canvasRef.current, {
        style: activeTemplate,
        headline: story.image_headline,
        subtitle: story.image_subtitle,
        keyPoints: story.image_key_points,
        sourceFooter: story.image_source_footer,
        brandName: settings.brand_name || 'OPTIMAX ACCESS',
        statFigure: story.stat_figure,
        statLabel: story.stat_label,
        comparisonLeftTitle: story.comparison_left_title,
        comparisonLeftPoints: story.comparison_left_points,
        comparisonRightTitle: story.comparison_right_title,
        comparisonRightPoints: story.comparison_right_points,
      });
      setRenderedImageUrl(dataUrl);
    } catch (err) {
      console.error('Failed to render canvas image:', err);
    }
  }, [
    activeTemplate,
    story.image_headline,
    story.image_subtitle,
    story.image_key_points,
    story.image_source_footer,
    story.stat_figure,
    story.stat_label,
    story.comparison_left_title,
    story.comparison_left_points,
    story.comparison_right_title,
    story.comparison_right_points,
    settings.brand_name,
  ]);

  const handleDownload = () => {
    if (!renderedImageUrl) return;
    const a = document.createElement('a');
    a.href = renderedImageUrl;
    a.download = `optimax-${activeTemplate}-${story.organization.toLowerCase().replace(/[^a-z0-9]/g, '-')}-1080x1350.png`;
    a.click();
    if (onDownloadImage) onDownloadImage();
  };

  const handleVote = (optionId: string) => {
    setVotedOptionId(optionId);
    if (onPollVote) {
      onPollVote(optionId);
    }
  };

  const currentFormat = story.format || 'image';

  // Truncate caption preview if not expanded
  const shouldTruncate = story.post_text.length > 210;
  const displayText = !isExpanded && shouldTruncate
    ? story.post_text.slice(0, 190) + '...'
    : story.post_text;

  // Poll calculation helper
  const poll = story.poll_data;
  const totalVotes = (poll?.total_votes || 0) + (votedOptionId && !poll?.user_voted_option_id ? 1 : 0);

  // Carousel slides
  const slides = story.carousel_slides && story.carousel_slides.length > 0 
    ? story.carousel_slides 
    : [
        {
          id: 'slide-1',
          slide_number: 1,
          title: story.image_headline,
          subtitle: story.image_subtitle,
          key_points: story.image_key_points,
          footer_text: `Slide 1/3 · ${settings.brand_name || 'Optimax Access'}`
        },
        {
          id: 'slide-2',
          slide_number: 2,
          title: 'Strategic HEOR Assessment',
          subtitle: 'Implications for payer dossiers and commercial strategy',
          key_points: [
            'Early alignment with comparative evidence requirements',
            'Cross-functional taskforce review across oncology pipelines',
            'Pre-submission consultations to reduce pricing risks'
          ],
          footer_text: `Slide 2/3 · ${settings.brand_name || 'Optimax Access'}`
        },
        {
          id: 'slide-3',
          slide_number: 3,
          title: 'Actionable Roadmap',
          subtitle: 'Practical recommendations for European market access teams',
          key_points: [
            'Audit Phase 3 trial design against national comparator tables',
            'Prepare indirect treatment comparison models in advance',
            'Engage domestic payers during early assessment windows'
          ],
          footer_text: `Slide 3/3 · ${settings.brand_name || 'Optimax Access'}`
        }
      ];

  const currentSlide = slides[activeSlideIndex] || slides[0];

  return (
    <div className="flex flex-col items-center">
      {/* Hidden high-res canvas used for rendering 1080x1350 */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Control bar above preview */}
      <div className="w-full max-w-[390px] mb-3 flex items-center justify-between px-1 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5 font-medium">
          <Smartphone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          LinkedIn Mobile View ({currentFormat.toUpperCase()})
        </span>
        {currentFormat === 'image' && (
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
          >
            <Download className="w-3 h-3" />
            Export Card (1080×1350)
          </button>
        )}
      </div>

      {/* Template Switcher for Single Image Format */}
      {currentFormat === 'image' && (
        <div className="w-full max-w-[390px] mb-3 flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          {(['executive_navy', 'breaking_alert', 'comparative_grid', 'stat_spotlight', 'editorial_light'] as TemplateStyle[]).map((tmpl) => (
            <button
              key={tmpl}
              onClick={() => setActiveTemplate(tmpl)}
              className={`text-[10px] px-2 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                activeTemplate === tmpl
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700'
              }`}
            >
              {tmpl === 'executive_navy' && 'Navy'}
              {tmpl === 'breaking_alert' && 'Alert'}
              {tmpl === 'comparative_grid' && 'Compare'}
              {tmpl === 'stat_spotlight' && 'Stat'}
              {tmpl === 'editorial_light' && 'Editorial'}
            </button>
          ))}
        </div>
      )}

      {/* Smartphone chassis */}
      <div className="relative w-[360px] sm:w-[380px] bg-slate-900 dark:bg-black rounded-[42px] p-3 shadow-2xl ring-1 ring-slate-800/60 dark:ring-slate-800">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-20 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 mr-2" />
          <div className="w-2 h-2 rounded-full bg-blue-950/60" />
        </div>

        {/* Screen inner content */}
        <div className="w-full bg-white dark:bg-slate-950 rounded-[34px] overflow-hidden border border-slate-100 dark:border-slate-800 pt-7 pb-4">
          
          {/* LinkedIn App Header Bar */}
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-800 dark:text-slate-200">9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px]">5G</span>
              <div className="w-4 h-2 rounded-xs border border-slate-400 dark:border-slate-600 relative">
                <div className="absolute inset-0.5 bg-slate-400 dark:bg-slate-600" />
              </div>
            </div>
          </div>

          {/* Post Container */}
          <div className="p-3.5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
            
            {/* Author Lockup */}
            <div className="flex items-start justify-between gap-2.5 mb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-[#0B192C] flex items-center justify-center text-white font-bold text-xs shadow-inner shrink-0">
                  OA
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {settings.brand_name || 'Optimax Access'}
                    </span>
                    <span className="text-[10px] text-slate-400">· 1st</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    HEOR & Market Access Consultancy
                  </p>
                  <div className="flex items-center gap-1 text-[9px] text-slate-400">
                    <span>1d · Edited</span>
                    <span>·</span>
                    <Globe className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600 p-1">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Post Caption */}
            <div className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed mb-3 whitespace-pre-line font-normal">
              {displayText}
              {shouldTruncate && !isExpanded && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="ml-1 text-slate-500 dark:text-slate-400 hover:underline font-medium cursor-pointer"
                >
                  ...see more
                </button>
              )}
            </div>

            {/* FORMAT 1: SINGLE IMAGE (CANVAS 1080x1350) */}
            {currentFormat === 'image' && (
              <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#0B192C] shadow-sm mb-3">
                {renderedImageUrl ? (
                  <img
                    src={renderedImageUrl}
                    alt={story.alt_text}
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="aspect-[4/5] flex items-center justify-center text-slate-400 text-xs">
                    Rendering graphic template...
                  </div>
                )}
                {/* Visual badge indicator */}
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[9px] text-white font-mono">
                  {activeTemplate.replace('_', ' ').toUpperCase()}
                </div>
              </div>
            )}

            {/* FORMAT 2: MULTI-SLIDE CAROUSEL / DOCUMENT */}
            {currentFormat === 'carousel' && (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#0B192C] shadow-md mb-3">
                {/* Carousel Top Bar */}
                <div className="px-3 py-1.5 bg-[#07101E] text-slate-300 flex items-center justify-between text-[10px] border-b border-slate-800">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Layers className="w-3 h-3 text-sky-400" />
                    <span>Document ({slides.length} slides)</span>
                  </div>
                  <span className="font-mono text-sky-400 bg-sky-950/60 px-1.5 py-0.5 rounded">
                    {activeSlideIndex + 1} / {slides.length}
                  </span>
                </div>

                {/* Slide Card Content */}
                <div className="aspect-[4/5] p-5 flex flex-col justify-between bg-gradient-to-br from-[#0B192C] via-[#122644] to-[#07101E] text-white">
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 border-b border-sky-500/20 pb-2">
                      <span className="text-[10px] font-bold tracking-widest text-sky-400 uppercase">
                        OPTIMAX SLIDE DECK
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        P. {currentSlide.slide_number}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white leading-tight mb-2">
                      {currentSlide.title}
                    </h4>
                    {currentSlide.subtitle && (
                      <p className="text-xs text-sky-200/80 mb-4 leading-relaxed">
                        {currentSlide.subtitle}
                      </p>
                    )}

                    {/* Bullet Points */}
                    <div className="space-y-2 mt-4">
                      {currentSlide.key_points.map((pt, i) => (
                        <div key={i} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-sky-500/10">
                          <span className="text-[10px] font-mono font-bold text-sky-400 w-4 shrink-0">
                            0{i + 1}
                          </span>
                          <span className="text-[11px] text-slate-200 leading-snug">
                            {pt}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Slide Footer */}
                  <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[9px] text-slate-400">
                    <span>{currentSlide.footer_text || 'Optimax Access · HTA Intelligence'}</span>
                    <span className="text-sky-400 font-medium">Swipe to read →</span>
                  </div>
                </div>

                {/* Carousel Controls */}
                <div className="absolute inset-y-1/2 -translate-y-1/2 w-full flex items-center justify-between px-2 pointer-events-none">
                  <button
                    onClick={() => setActiveSlideIndex(Math.max(0, activeSlideIndex - 1))}
                    disabled={activeSlideIndex === 0}
                    className="p-1.5 rounded-full bg-black/60 text-white backdrop-blur-xs disabled:opacity-20 pointer-events-auto hover:bg-black/90 cursor-pointer transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveSlideIndex(Math.min(slides.length - 1, activeSlideIndex + 1))}
                    disabled={activeSlideIndex === slides.length - 1}
                    className="p-1.5 rounded-full bg-black/60 text-white backdrop-blur-xs disabled:opacity-20 pointer-events-auto hover:bg-black/90 cursor-pointer transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* FORMAT 3: INTERACTIVE LINKEDIN POLL */}
            {currentFormat === 'poll' && (
              <div className="rounded-xl p-4 border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 shadow-xs mb-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <Vote className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>The author can see how you vote. Learn more</span>
                </div>

                <p className="text-xs font-bold text-slate-900 dark:text-white mb-3">
                  {poll?.question || story.image_headline}
                </p>

                <div className="space-y-2 mb-3">
                  {(poll?.options || [
                    { id: 'opt-1', text: 'PICO divergence across 27 Member States', votes: 148 },
                    { id: 'opt-2', text: 'Compressed 90-day dossier delivery window', votes: 94 },
                    { id: 'opt-3', text: 'Complex Indirect Treatment Comparisons (ITCs)', votes: 68 },
                    { id: 'opt-4', text: 'Cross-functional governance silos', votes: 32 }
                  ]).map((opt) => {
                    const optionVotes = opt.votes + (votedOptionId === opt.id && !poll?.user_voted_option_id ? 1 : 0);
                    const percentage = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
                    const isSelected = votedOptionId === opt.id;

                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleVote(opt.id)}
                        className={`relative overflow-hidden rounded-lg border p-2.5 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900'
                        }`}
                      >
                        {/* Vote progress fill if voted */}
                        {votedOptionId && (
                          <div
                            className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                              isSelected ? 'bg-blue-500/20' : 'bg-slate-200/50 dark:bg-slate-800/50'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        )}

                        <div className="relative flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-400'
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5" />}
                            </div>
                            <span className={`font-medium ${isSelected ? 'text-blue-950 dark:text-blue-200 font-bold' : 'text-slate-800 dark:text-slate-200'}`}>
                              {opt.text}
                            </span>
                          </div>
                          {votedOptionId && (
                            <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300 ml-2">
                              {percentage}%
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                  <span>{totalVotes.toLocaleString()} votes · {poll?.duration_days || 7} days left</span>
                  {votedOptionId && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Voted
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* FORMAT 4: ARTICLE LINK PREVIEW */}
            {currentFormat === 'article_link' && (
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shadow-xs mb-3 group">
                {/* Simulated Article Banner */}
                <div className="aspect-[16/9] bg-gradient-to-r from-slate-800 via-blue-950 to-slate-900 p-4 flex flex-col justify-end text-white relative">
                  <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest mb-1">
                    HTA INTELLIGENCE REPORT
                  </span>
                  <h4 className="text-xs font-bold leading-snug line-clamp-2">
                    {story.image_headline}
                  </h4>
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/50 text-[9px] font-medium text-slate-200 flex items-center gap-1">
                    <ExternalLink className="w-2.5 h-2.5" />
                    <span>Report</span>
                  </div>
                </div>

                {/* Article Card Meta */}
                <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[10px] text-slate-400 font-medium block truncate uppercase tracking-wider mb-0.5">
                    {story.source_url.replace(/^https?:\/\//, '').split('/')[0]}
                  </span>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {story.image_headline}
                  </h5>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {story.image_subtitle}
                  </p>
                </div>
              </div>
            )}

            {/* FORMAT 5: TEXT ONLY */}
            {currentFormat === 'text_only' && (
              <div className="py-2 px-3 my-2 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border-l-2 border-blue-600 text-[11px] text-blue-900 dark:text-blue-300">
                <span className="font-semibold block">Executive Perspective Post</span>
                <span className="text-[10px] opacity-80">Clean, text-only narrative optimized for high comment engagement.</span>
              </div>
            )}

            {/* Social Engagement Stats */}
            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1">
                <div className="flex -space-x-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8px]">
                    👍
                  </span>
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[8px]">
                    💡
                  </span>
                </div>
                <span className="ml-1 font-mono tabular-nums">
                  {story.metrics?.reactions || 48}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono tabular-nums">
                <span>{story.metrics?.comments || 7} comments</span>
                <span>·</span>
                <span>{story.metrics?.reposts || 5} reposts</span>
              </div>
            </div>

            {/* LinkedIn Action Buttons */}
            <div className="grid grid-cols-4 pt-2 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
              <button className="flex items-center justify-center gap-1 py-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Like</span>
              </button>
              <button className="flex items-center justify-center gap-1 py-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Comment</span>
              </button>
              <button className="flex items-center justify-center gap-1 py-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">
                <Repeat2 className="w-3.5 h-3.5" />
                <span>Repost</span>
              </button>
              <button className="flex items-center justify-center gap-1 py-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
