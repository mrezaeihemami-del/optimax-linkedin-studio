import { TemplateStyle } from '../types';

export interface CanvasTemplateData {
  style?: TemplateStyle;
  headline: string;
  subtitle: string;
  keyPoints: string[];
  sourceFooter: string;
  brandName?: string;
  badgeText?: string;
  statFigure?: string;
  statLabel?: string;
  comparisonLeftTitle?: string;
  comparisonLeftPoints?: string[];
  comparisonRightTitle?: string;
  comparisonRightPoints?: string[];
}

export function renderOptimaxPostImage(
  canvas: HTMLCanvasElement,
  data: CanvasTemplateData
): string {
  const style = data.style || 'executive_navy';

  switch (style) {
    case 'breaking_alert':
      return renderBreakingAlert(canvas, data);
    case 'comparative_grid':
      return renderComparativeGrid(canvas, data);
    case 'stat_spotlight':
      return renderStatSpotlight(canvas, data);
    case 'editorial_light':
      return renderEditorialLight(canvas, data);
    case 'executive_navy':
    default:
      return renderExecutiveNavy(canvas, data);
  }
}

// ================= 1. EXECUTIVE NAVY (CLASSIC) =================
function renderExecutiveNavy(canvas: HTMLCanvasElement, data: CanvasTemplateData): string {
  const width = 1080;
  const height = 1350;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background - Deep Navy
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0B192C');
  bgGrad.addColorStop(0.45, '#122644');
  bgGrad.addColorStop(1, '#07101E');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle geometric grid
  ctx.save();
  ctx.strokeStyle = 'rgba(14, 165, 233, 0.08)';
  ctx.lineWidth = 1;
  const gridSize = 48;
  for (let x = 600; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 420);
    ctx.stroke();
  }
  for (let y = 0; y < 420; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(600, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();

  // Glow orb accent
  const glow = ctx.createRadialGradient(900, 150, 20, 900, 150, 360);
  glow.addColorStop(0, 'rgba(2, 132, 199, 0.18)');
  glow.addColorStop(1, 'rgba(2, 132, 199, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(500, 0, 580, 500);

  // Top Accent Bar
  const accentBar = ctx.createLinearGradient(80, 0, 1000, 0);
  accentBar.addColorStop(0, '#0284C7');
  accentBar.addColorStop(0.5, '#38BDF8');
  accentBar.addColorStop(1, '#0284C7');
  ctx.fillStyle = accentBar;
  ctx.fillRect(80, 60, width - 160, 4);

  // Brand Header
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(data.brandName || 'OPTIMAX ACCESS', 80, 130);

  ctx.fillStyle = '#38BDF8';
  ctx.font = '600 16px "JetBrains Mono", monospace';
  const categoryBadge = (data.badgeText || 'HTA & MARKET ACCESS BRIEFING').toUpperCase();
  ctx.fillText(categoryBadge, 80, 164);

  // Separator line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(80, 195);
  ctx.lineTo(width - 80, 195);
  ctx.stroke();

  // Headline
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 52px "Plus Jakarta Sans", sans-serif';
  let currentY = wrapText(ctx, data.headline || 'Market Access Update', 80, 270, width - 160, 64);

  // Subtitle
  currentY += 16;
  ctx.fillStyle = '#94A3B8';
  ctx.font = '400 24px "DM Sans", sans-serif';
  currentY = wrapText(ctx, data.subtitle || '', 80, currentY, width - 160, 36);

  // 3 Key Points Cards
  currentY = Math.max(currentY + 36, 520);
  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 17px "JetBrains Mono", monospace';
  ctx.fillText('CRITICAL IMPLICATIONS FOR MANUFACTURERS', 80, currentY);
  currentY += 28;

  const points = data.keyPoints && data.keyPoints.length > 0
    ? data.keyPoints.slice(0, 3)
    : ['Evidence synthesis standard updated', 'Payer comparator requirements revised', 'Budget impact models impacted'];

  const cardHeight = 145;
  const cardGap = 20;

  points.forEach((point, index) => {
    const cardY = currentY + index * (cardHeight + cardGap);

    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
    ctx.lineWidth = 1;
    roundRect(ctx, 80, cardY, width - 160, cardHeight, 14);
    ctx.fill();
    ctx.stroke();

    // Left accent pill
    ctx.fillStyle = '#0284C7';
    roundRect(ctx, 80, cardY, 6, cardHeight, { tl: 14, bl: 14, tr: 0, br: 0 });
    ctx.fill();

    // Circle number
    const circleX = 135;
    const circleY = cardY + cardHeight / 2;
    ctx.fillStyle = 'rgba(2, 132, 199, 0.2)';
    ctx.beginPath();
    ctx.arc(circleX, circleY, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`0${index + 1}`, circleX, circleY);

    // Text
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#F1F5F9';
    ctx.font = '500 24px "DM Sans", sans-serif';
    wrapText(ctx, point, 185, cardY + 54, width - 160 - 130, 34);
    ctx.restore();
  });

  renderFooter(ctx, width, data.sourceFooter);
  return canvas.toDataURL('image/png');
}

// ================= 2. BREAKING REGULATORY ALERT =================
function renderBreakingAlert(canvas: HTMLCanvasElement, data: CanvasTemplateData): string {
  const width = 1080;
  const height = 1350;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background - Dark slate with top red/amber urgency glow
  ctx.fillStyle = '#090D16';
  ctx.fillRect(0, 0, width, height);

  // Red/Amber radial glow top
  const redGlow = ctx.createRadialGradient(540, -100, 50, 540, 200, 600);
  redGlow.addColorStop(0, 'rgba(239, 68, 68, 0.25)');
  redGlow.addColorStop(0.7, 'rgba(217, 119, 6, 0.08)');
  redGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = redGlow;
  ctx.fillRect(0, 0, width, 600);

  // Top Red Alert Badge Strip
  ctx.fillStyle = '#DC2626';
  ctx.fillRect(80, 70, width - 160, 4);

  // Alert Pill
  ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
  ctx.strokeStyle = '#EF4444';
  ctx.lineWidth = 1.5;
  roundRect(ctx, 80, 100, 280, 42, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FCA5A5';
  ctx.font = 'bold 15px "JetBrains Mono", monospace';
  ctx.fillText('CRITICAL REGULATORY NOTICE', 98, 126);

  // Brand Right
  ctx.fillStyle = '#94A3B8';
  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(data.brandName || 'OPTIMAX ACCESS', width - 80, 126);
  ctx.textAlign = 'left';

  // Major Announcement Headline
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 56px "Plus Jakarta Sans", sans-serif';
  let currentY = wrapText(ctx, data.headline || 'Urgent Regulatory Revision', 80, 215, width - 160, 68);

  // Subtitle
  currentY += 12;
  ctx.fillStyle = '#CBD5E1';
  ctx.font = '500 25px "DM Sans", sans-serif';
  currentY = wrapText(ctx, data.subtitle || '', 80, currentY, width - 160, 38);

  // Big Quote Callout Box
  currentY = Math.max(currentY + 30, 480);
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, 80, currentY, width - 160, 210, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#EF4444';
  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  ctx.fillText('PRIMARY AUTHORITY DIRECTIVE', 115, currentY + 45);

  ctx.fillStyle = '#F8FAFC';
  ctx.font = 'italic 500 24px "DM Sans", sans-serif';
  const quoteText = data.keyPoints[0] || 'Mandatory revision to assessment timeline and comparator evidentiary standards effective immediately.';
  wrapText(ctx, `"${quoteText}"`, 115, currentY + 95, width - 230, 36);
  ctx.restore();

  // 2 Dual Takeaway Cards side by side or stacked
  currentY += 235;
  ctx.fillStyle = '#FCA5A5';
  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  ctx.fillText('STRATEGIC ACTION ITEMS', 80, currentY);
  currentY += 24;

  const remaining = (data.keyPoints || []).slice(1, 3);
  const dualCardHeight = 160;

  remaining.forEach((item, idx) => {
    const cardY = currentY + idx * (dualCardHeight + 18);
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    roundRect(ctx, 80, cardY, width - 160, dualCardHeight, 14);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 20px "JetBrains Mono", monospace';
    ctx.fillText(`IMPLICATION 0${idx + 2}`, 115, cardY + 44);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '500 23px "DM Sans", sans-serif';
    wrapText(ctx, item, 115, cardY + 86, width - 230, 34);
    ctx.restore();
  });

  renderFooter(ctx, width, data.sourceFooter);
  return canvas.toDataURL('image/png');
}

// ================= 3. COMPARATIVE ANALYSIS GRID =================
function renderComparativeGrid(canvas: HTMLCanvasElement, data: CanvasTemplateData): string {
  const width = 1080;
  const height = 1350;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background - Dark Blue Slate
  ctx.fillStyle = '#0A1120';
  ctx.fillRect(0, 0, width, height);

  // Top Brand Bar
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 34px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(data.brandName || 'OPTIMAX ACCESS', 80, 110);

  ctx.fillStyle = '#38BDF8';
  ctx.font = '600 16px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText('COMPARATIVE HTA FRAMEWORK', width - 80, 110);
  ctx.textAlign = 'left';

  // Divider
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, 140);
  ctx.lineTo(width - 80, 140);
  ctx.stroke();

  // Headline
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 48px "Plus Jakarta Sans", sans-serif';
  let currentY = wrapText(ctx, data.headline || 'Policy Shift Comparison', 80, 205, width - 160, 58);

  currentY += 10;
  ctx.fillStyle = '#94A3B8';
  ctx.font = '400 22px "DM Sans", sans-serif';
  currentY = wrapText(ctx, data.subtitle || 'Side-by-side assessment of evidentiary requirements', 80, currentY, width - 160, 32);

  currentY = Math.max(currentY + 30, 380);

  // 2 Side-by-Side Columns
  const colWidth = (width - 160 - 30) / 2;
  const colHeight = 760;

  // Left Column (Status Quo / Previous Framework)
  const leftX = 80;
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  roundRect(ctx, leftX, currentY, colWidth, colHeight, 16);
  ctx.fill();
  ctx.stroke();

  // Left Header
  ctx.fillStyle = '#64748B';
  ctx.font = 'bold 18px "JetBrains Mono", monospace';
  ctx.fillText((data.comparisonLeftTitle || 'PREVIOUS STANDARD').toUpperCase(), leftX + 30, currentY + 50);

  const leftPoints = data.comparisonLeftPoints && data.comparisonLeftPoints.length > 0
    ? data.comparisonLeftPoints
    : [
        'National comparator arm flexibility',
        'Post-hoc observational evidence accepted',
        'Standard 180-day dossier preparation window'
      ];

  let leftTextY = currentY + 110;
  leftPoints.forEach((pt, i) => {
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillText(`— 0${i + 1}`, leftX + 30, leftTextY);

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '400 21px "DM Sans", sans-serif';
    leftTextY = wrapText(ctx, pt, leftX + 30, leftTextY + 28, colWidth - 60, 30) + 40;
  });
  ctx.restore();

  // Right Column (New Policy / JCA Directive)
  const rightX = leftX + colWidth + 30;
  ctx.save();
  ctx.fillStyle = 'rgba(2, 132, 199, 0.06)';
  ctx.strokeStyle = '#0284C7';
  ctx.lineWidth = 1.5;
  roundRect(ctx, rightX, currentY, colWidth, colHeight, 16);
  ctx.fill();
  ctx.stroke();

  // Right Header
  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 18px "JetBrains Mono", monospace';
  ctx.fillText((data.comparisonRightTitle || 'NEW REIMBURSEMENT DIRECTIVE').toUpperCase(), rightX + 30, currentY + 50);

  const rightPoints = data.comparisonRightPoints && data.comparisonRightPoints.length > 0
    ? data.comparisonRightPoints
    : (data.keyPoints && data.keyPoints.length >= 3 ? data.keyPoints.slice(0, 3) : [
        'Multi-comparator consolidated PICO submission',
        'Mandatory pre-submission network meta-analysis',
        'Strict 90-day assessment timetable upon EMA filing'
      ]);

  let rightTextY = currentY + 110;
  rightPoints.forEach((pt, i) => {
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillText(`✓ 0${i + 1}`, rightX + 30, rightTextY);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '500 21px "DM Sans", sans-serif';
    rightTextY = wrapText(ctx, pt, rightX + 30, rightTextY + 28, colWidth - 60, 30) + 40;
  });
  ctx.restore();

  renderFooter(ctx, width, data.sourceFooter);
  return canvas.toDataURL('image/png');
}

// ================= 4. METRIC & STAT SPOTLIGHT =================
function renderStatSpotlight(canvas: HTMLCanvasElement, data: CanvasTemplateData): string {
  const width = 1080;
  const height = 1350;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background - Deep midnight with central cyan highlight
  ctx.fillStyle = '#060B14';
  ctx.fillRect(0, 0, width, height);

  const statGlow = ctx.createRadialGradient(540, 520, 40, 540, 520, 500);
  statGlow.addColorStop(0, 'rgba(14, 165, 233, 0.22)');
  statGlow.addColorStop(0.8, 'rgba(14, 165, 233, 0.02)');
  statGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = statGlow;
  ctx.fillRect(0, 200, width, 700);

  // Brand Header
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 34px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(data.brandName || 'OPTIMAX ACCESS', 80, 110);

  ctx.fillStyle = '#38BDF8';
  ctx.font = '600 16px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText('EMPIRICAL BENCHMARK', width - 80, 110);
  ctx.textAlign = 'left';

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, 140);
  ctx.lineTo(width - 80, 140);
  ctx.stroke();

  // Headline
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 50px "Plus Jakarta Sans", sans-serif';
  let currentY = wrapText(ctx, data.headline || 'Key Benchmark Assessment', 80, 210, width - 160, 62);

  // Giant Stat Box
  currentY = Math.max(currentY + 20, 350);
  const boxHeight = 320;
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, 80, currentY, width - 160, boxHeight, 20);
  ctx.fill();
  ctx.stroke();

  // Giant Stat Number
  const statText = data.statFigure || '90 DAYS';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#38BDF8';
  ctx.font = '900 110px "JetBrains Mono", monospace';
  ctx.fillText(statText, 540, currentY + 160);

  // Stat Description label
  ctx.fillStyle = '#E2E8F0';
  ctx.font = 'bold 26px "DM Sans", sans-serif';
  const statLabel = data.statLabel || data.subtitle || 'Statutory review window established for Joint Clinical Assessment';
  wrapText(ctx, statLabel, 540, currentY + 235, width - 260, 36, true);
  ctx.restore();

  // 3 Key Takeaways below
  currentY += boxHeight + 45;
  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 17px "JetBrains Mono", monospace';
  ctx.fillText('CRITICAL IMPLICATIONS FOR COMMERCIAL PIPELINES', 80, currentY);
  currentY += 28;

  const points = data.keyPoints.slice(0, 3);
  const cardHeight = 115;
  const cardGap = 16;

  points.forEach((pt, i) => {
    const cardY = currentY + i * (cardHeight + cardGap);
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    roundRect(ctx, 80, cardY, width - 160, cardHeight, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 22px "JetBrains Mono", monospace';
    ctx.fillText(`0${i + 1}`, 115, cardY + 68);

    ctx.fillStyle = '#F1F5F9';
    ctx.font = '500 22px "DM Sans", sans-serif';
    wrapText(ctx, pt, 175, cardY + 46, width - 280, 32);
    ctx.restore();
  });

  renderFooter(ctx, width, data.sourceFooter);
  return canvas.toDataURL('image/png');
}

// ================= 5. EDITORIAL MODERN LIGHT =================
function renderEditorialLight(canvas: HTMLCanvasElement, data: CanvasTemplateData): string {
  const width = 1080;
  const height = 1350;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background - Crisp porcelain / warm ivory slate
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(0, 0, width, height);

  // Top Dark Border
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(80, 60, width - 160, 5);

  // Brand Name in Dark
  ctx.fillStyle = '#0F172A';
  ctx.font = '800 36px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(data.brandName || 'OPTIMAX ACCESS', 80, 130);

  ctx.fillStyle = '#0284C7';
  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText('MARKET ACCESS DISPATCH', width - 80, 130);
  ctx.textAlign = 'left';

  // Hairline separator
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(80, 160);
  ctx.lineTo(width - 80, 160);
  ctx.stroke();

  // Big Editorial Headline
  ctx.fillStyle = '#0F172A';
  ctx.font = '800 52px "Plus Jakarta Sans", sans-serif';
  let currentY = wrapText(ctx, data.headline || 'Health Economics Policy Briefing', 80, 240, width - 160, 64);

  // Subtitle
  currentY += 12;
  ctx.fillStyle = '#475569';
  ctx.font = '500 24px "DM Sans", sans-serif';
  currentY = wrapText(ctx, data.subtitle || '', 80, currentY, width - 160, 36);

  // Editorial Callout Cards (Crisp White with Soft Border)
  currentY = Math.max(currentY + 36, 490);
  ctx.fillStyle = '#0284C7';
  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  ctx.fillText('STRATEGIC ASSESSMENT TAKEAWAYS', 80, currentY);
  currentY += 26;

  const points = data.keyPoints.slice(0, 3);
  const cardHeight = 150;
  const cardGap = 20;

  points.forEach((pt, i) => {
    const cardY = currentY + i * (cardHeight + cardGap);
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.5;
    roundRect(ctx, 80, cardY, width - 160, cardHeight, 14);
    ctx.fill();
    ctx.stroke();

    // Dark slate accent pill on left
    ctx.fillStyle = '#0F172A';
    roundRect(ctx, 80, cardY, 6, cardHeight, { tl: 14, bl: 14, tr: 0, br: 0 });
    ctx.fill();

    // Circle number
    const circleX = 135;
    const circleY = cardY + cardHeight / 2;
    ctx.fillStyle = '#F1F5F9';
    ctx.beginPath();
    ctx.arc(circleX, circleY, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 20px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`0${i + 1}`, circleX, circleY);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#1E293B';
    ctx.font = '500 23px "DM Sans", sans-serif';
    wrapText(ctx, pt, 185, cardY + 54, width - 290, 34);
    ctx.restore();
  });

  // Light Footer
  const footerY = 1220;
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, footerY);
  ctx.lineTo(width - 80, footerY);
  ctx.stroke();

  ctx.fillStyle = '#64748B';
  ctx.font = '500 18px "DM Sans", sans-serif';
  ctx.fillText(data.sourceFooter || 'Source: Official HTA Authority Record', 80, footerY + 45);

  ctx.fillStyle = '#0284C7';
  ctx.font = 'bold 18px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText('optimaxaccess.com', width - 80, footerY + 45);

  return canvas.toDataURL('image/png');
}

// ================= SHARED CANVAS UTILITIES =================
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  isCentered = false
): number {
  const words = (text || '').split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line ? `${line} ${words[n]}` : words[n];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      if (isCentered) {
        ctx.fillText(line, x, currentY);
      } else {
        ctx.fillText(line, x, currentY);
      }
      line = words[n];
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
  return currentY;
}

function renderFooter(ctx: CanvasRenderingContext2D, width: number, sourceFooter?: string) {
  const footerY = 1220;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, footerY);
  ctx.lineTo(width - 80, footerY);
  ctx.stroke();

  ctx.fillStyle = '#94A3B8';
  ctx.font = '500 18px "DM Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(sourceFooter || 'Source: Official HTA Authority Record', 80, footerY + 45);

  ctx.fillStyle = '#38BDF8';
  ctx.font = '600 18px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText('optimaxaccess.com', width - 80, footerY + 45);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number | { tl: number; tr: number; br: number; bl: number }
) {
  const r = typeof radius === 'number'
    ? { tl: radius, tr: radius, br: radius, bl: radius }
    : radius;

  ctx.beginPath();
  ctx.moveTo(x + r.tl, y);
  ctx.lineTo(x + w - r.tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
  ctx.lineTo(x + w, y + h - r.br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
  ctx.lineTo(x + r.bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
  ctx.lineTo(x + r.tl, y);
  ctx.quadraticCurveTo(x, y, x + r.tl, y);
  ctx.closePath();
}
