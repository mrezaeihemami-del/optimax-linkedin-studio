# UNIVERSAL AGENTIC FRAMEWORK & STARTER KIT
> **سیستم‌عامل جامع و چارچوب بالادستی برای مهندسی هوش مصنوعی، ضدتوهم و معماری پایدار در پروژه‌های نرم‌افزاری**

---

## 🎯 هدف این کیت چیست؟
این کیت یک **چارچوب مهندسی مستقل از دامنه (Domain-Agnostic)** است. شما می‌توانید محتویات این پوشه را در **هر پروژه نرم‌افزاری جدید** (Next.js, Python, FastAPI, Go, Rust, React, AI Automation و...) کپی کنید تا از روز اول:
1. **از توهم و داده‌های ساختگی مدل‌ها جلوگیری کند (Zero-Hallucination & Fail-Fast).**
2. **از ساخت رابط‌های کاربری دکوری و ادعاهای توخالی ممانعت کند (Anti-Decorative & Proof-First).**
3. **گراف دانش کدبیس را از همان روز اول با Graphify بسازد (Graphify Knowledge Graph on Day 1)** تا مصرف توکن کاهش یافته و ایجنت به مغز کل معماری مسلط شود.
4. **سیستم ماژولار مهارت‌ها و پلاگین‌ها (Skills & Plugins)** را فعال کند تا برای هر کار تخصصی، دانش مربوطه به صورت دینامیک و بر اساس تقاضا بارگذاری شود.
5. **معماری سه‌لایه (Directives $\rightarrow$ Orchestration $\rightarrow$ Execution)** و **حلقه خودترمیم‌گری (Self-Annealing Loop)** را پیاده‌سازی کند.

---

## 📂 ساختار این چارچوب (Directory Structure)

```text
agentic-framework-starter/
├── README.md                      # همین سند راهنما
├── AGENTS.md                      # قانون اساسی مادر و دستورالعمل اجرایی ایجنت
├── CLAUDE.md                      # قرینه دقیق برای محیط‌های Claude / Cursor
├── GEMINI.md                      # قرینه دقیق برای محیط‌های Antigravity / Gemini
│
├── .agents/
│   ├── rules/                     # قوانین غیرقابل مذاکره ایجنت
│   │   ├── 01_universal_constitution.md  # ۴ اصل بنیادین (ضد توهم، ضد دکور، اثبات ملموس، صداقت رادیکال)
│   │   ├── 02_three_layer_architecture.md# معماری سه‌لایه (دستورالعمل، هدایت، اجرا)
│   │   ├── 03_self_annealing_loop.md     # حلقه ۵ مرحله‌ای حل ریشه‌ای خطا
│   │   ├── 04_graphify_knowledge.md      # قوانین الزام‌آور Graphify از روز اول
│   │   ├── 05_skills_and_plugins.md      # ساختار مهارت‌ها و پلاگین‌ها
│   │   └── 06_file_hygiene.md            # تفکیک خروجی‌های اصلی از فایل‌های موقت
│   │
│   ├── skills/                    # مهارت‌های ماژولار ایجنت (On-Demand Knowledge)
│   │   ├── graphify/
│   │   │   └── SKILL.md           # مهارت راه‌اندازی، کوئری و نگاشت کد با Graphify
│   │   └── system-design/
│   │       └── SKILL.md           # مهارت استاندارد طراحی سیستم و معماری تمیز
│   │
│   └── workflows/                 # دستورالعمل‌های گام‌به‌گام گردش‌کارها
│       ├── day1_bootstrap.md      # چک‌لیست اقدامات روز اول در پروژه جدید
│       └── graphify.md            # گردش کار کامل کوئری و آپدیت گراف
│
├── directives/                    # لایه ۱: SOPها و دستورالعمل‌های تسک‌ها
│   ├── README.md
│   └── template_task_sop.md       # تمپلیت استاندارد نگارش SOP
│
├── execution/                     # لایه ۳: اسکریپت‌های قطعی و تست‌پذیر (Python/TS)
│   ├── README.md
│   └── bootstrap_project.py       # اسکریپت خودکار راه‌اندازی Graphify و بررسی محیط
│
├── docs/                          # اسناد معماری و تصمیمات
│   ├── DECISIONS_TEMPLATE.md      # تمپلیت ثبت لاگ تصمیمات معماری (ADR)
│   └── ARCHITECTURE_TEMPLATE.md   # تمپلیت مستندسازی معماری سیستم
│
├── setup-project.ps1              # اسکریپت راه‌اندازی در ویندوز (PowerShell)
└── setup-project.sh               # اسکریپت راه‌اندازی در لینوکس / مک (Bash)
```

---

## 🚀 نحوه استفاده در یک پروژه جدید (در ۳۰ ثانیه)

کافیست در پوشه پروژه جدید خود، یکی از دو اسکریپت را اجرا کنید:

### در ویندوز (PowerShell):
```powershell
.\setup-project.ps1
```

### در لینوکس / مک (Bash):
```bash
chmod +x setup-project.sh
./setup-project.sh
```

این اسکریپت به صورت خودکار:
1. قوانین مادر (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`) را در پروژه شما مستقر می‌کند.
2. پوشه `.agents/` شامل اسکیل‌ها، قوانین و گردش‌کارهای استاندارد را می‌سازد.
3. ابزار `graphify` را بررسی و در صورت نیاز نصب می‌کند و گراف معرفتی کدبیس (`graphify-out/`) را در همان روز اول تولید می‌نماید.
4. قالب ثبت تصمیمات معماری (`docs/DECISIONS.md`) را می‌سازد.
