/**
 * Every word on the site lives here, in English and Arabic, so content updates
 * never touch layout. Source of truth: extended-portfolio-prompt.md (section 2,
 * "Verified content"). Do not add jobs, dates, numbers, clients or certificates
 * that are not confirmed by Fouad.
 *
 * In bilingual strings, <b>…</b> renders as <strong>. Tool and brand names stay
 * in Latin script in both languages.
 */

export type Lang = 'en' | 'ar';
/** A string in both languages. */
export type L = Readonly<Record<Lang, string>>;

const l = (en: string, ar: string): L => ({ en, ar });

/* ── Identity ─────────────────────────────────────────────────────────── */

export const identity = {
  name: 'Fouad Barkaoui',
  nameDisplay: ['FOUAD', 'BARKAOUI'] as const,
  nameLocal: l('Fouad Barkaoui', 'فؤاد البركاوي'),
  email: 'fouadbr2001@gmail.com',
  timeZone: 'Africa/Casablanca',
  country: l('Morocco', 'المغرب'),
  languages: l('Darija · Arabic · French · English', 'الدارجة · العربية · الفرنسية · الإنجليزية'),
  oneLine: l(
    'SOC analyst & fullstack developer — vibe coder & prompt engineer',
    'محلّل SOC ومطوّر ويب متكامل — مبرمج بأسلوب Vibe Coding ومهندس أوامر',
  ),
  promise: l(
    'I turn ideas into working products — fast, clean and <b>secure by default</b>.',
    'أحوّل الأفكار إلى منتجات تعمل فعلًا — بسرعة وإتقان، و<b>آمنة منذ البداية</b>.',
  ),
  portraitAlt: l(
    'Portrait of Fouad Barkaoui in a dark suit against a deep red wall',
    'صورة شخصية لفؤاد البركاوي ببدلة داكنة أمام جدار أحمر',
  ),
  roles: [
    l('Beginner SOC Analyst', 'محلّل SOC مبتدئ'),
    l('Fullstack Web Developer', 'مطوّر ويب متكامل'),
    l('Programmer', 'مبرمج'),
    l('Vibe Coder', 'مبرمج بأسلوب Vibe Coding'),
    l('Prompt Engineer', 'مهندس أوامر الذكاء الاصطناعي'),
    l('Problem Solver', 'بارع في حلّ المشكلات'),
    l('Analytical Thinker', 'مفكّر تحليلي'),
    l('Cybersecurity Enthusiast', 'شغوف بالأمن السيبراني'),
    l('Fast, Curious Learner', 'متعلّم سريع وفضولي'),
  ],
} as const;

/* ── Bio ──────────────────────────────────────────────────────────────── */

export const bio: readonly L[] = [
  l(
    "I'm <b>Fouad Barkaoui</b> — a <b>beginner SOC analyst</b> and <b>fullstack web developer</b> from Morocco.",
    'أنا <b>فؤاد البركاوي</b> — <b>محلّل SOC مبتدئ</b> و<b>مطوّر ويب متكامل</b> من المغرب.',
  ),
  l(
    'A <b>programmer</b>, <b>vibe coder</b> and <b>prompt engineer</b> who turns ideas into working products — fast, clean and <b>secure by default</b>.',
    '<b>مبرمج</b> و<b>Vibe Coder</b> و<b>مهندس أوامر للذكاء الاصطناعي</b>، أحوّل الأفكار إلى منتجات تعمل فعلًا — بسرعة وإتقان، و<b>آمنة منذ البداية</b>.',
  ),
  l(
    'My edge is <b>problem solving</b>: I break big, messy problems into small steps, stay curious, and keep learning how systems get built — and how they get attacked.',
    'نقطة قوّتي هي <b>حلّ المشكلات</b>: أفكّك المشكلات الكبيرة والمعقّدة إلى خطوات صغيرة، وأحافظ على فضولي، وأواصل تعلّم كيف تُبنى الأنظمة — وكيف تتعرّض للهجوم.',
  ),
];

/** "How I work" — only claims already in the bio. */
export const howIWork: readonly { title: L; line: L }[] = [
  {
    title: l('Break the problem down', 'تفكيك المشكلة'),
    line: l('Big, messy problems become small, clear steps.', 'المشكلات الكبيرة والمعقّدة تصبح خطوات صغيرة وواضحة.'),
  },
  {
    title: l('Build fast with AI', 'البناء بسرعة مع الذكاء الاصطناعي'),
    line: l('Vibe coding and prompt engineering turn ideas into working products.', 'الـ Vibe Coding وهندسة الأوامر يحوّلان الأفكار إلى منتجات تعمل.'),
  },
  {
    title: l('Secure by default', 'آمن منذ البداية'),
    line: l('Built knowing how systems get built — and how they get attacked.', 'أبني وأنا أعرف كيف تُبنى الأنظمة — وكيف تتعرّض للهجوم.'),
  },
  {
    title: l('Ship and measure', 'الإطلاق والقياس'),
    line: l('Real products, live — then keep learning from them.', 'منتجات حقيقية على الإنترنت — ثم مواصلة التعلّم منها.'),
  },
];

/* ── Projects (case studies) ─────────────────────────────────────────── */

export type ProjectStatus = 'dev' | 'live' | 'local';

export interface Project {
  id: 'assas' | 'kanz' | 'studio';
  name: string;
  role: L;
  kind: L;
  where: L;
  status: ProjectStatus;
  /** YYYY-MM */
  start: string;
  url?: string;
  problem: L;
  does: readonly L[];
  built: L;
  security: readonly L[];
  statusNote: L;
  tags: readonly string[];
  /** Features that work today. */
  shipped?: readonly L[];
}

export const projects: readonly Project[] = [
  {
    id: 'kanz',
    name: 'Kanz',
    role: l('Founder & Fullstack Developer', 'المؤسس والمطوّر المتكامل'),
    kind: l('Own product', 'منتج خاص'),
    where: l('Morocco (Remote)', 'المغرب (عن بُعد)'),
    status: 'live',
    start: '2026-09',
    url: 'https://kanz-workspace.vercel.app',
    problem: l(
      'Notes, tasks, articles, courses, docs and analytics usually live in separate apps. Kanz keeps them together — privately — on one spatial canvas.',
      'الملاحظات والمهام والمقالات والدورات والوثائق والتحليلات تعيش عادةً في تطبيقات منفصلة. كنز يجمعها — بخصوصية — على لوحة مكانية واحدة.',
    ),
    does: [
      l(
        'A private workspace that keeps notes, tasks, articles, courses, docs and analytics on one spatial canvas.',
        'مساحة عمل خاصة تجمع الملاحظات والمهام والمقالات والدورات والوثائق والتحليلات على لوحة مكانية واحدة.',
      ),
      l('Google sign-in, team invites and roles, and a private contact inbox.', 'تسجيل الدخول عبر Google، ودعوات الفريق والأدوار، وصندوق رسائل خاص للتواصل.'),
      l(
        'Designed the brand end to end: the KANZ wordmark, the star icon and the founder page.',
        'صمّمت الهوية البصرية من البداية إلى النهاية: شعار KANZ الكتابي، وأيقونة النجمة، وصفحة المؤسس.',
      ),
    ],
    built: l(
      'A React + TypeScript app built with Vite and Tailwind CSS. It works offline first on the device, then syncs through Supabase (PostgreSQL). Deployed on Vercel, built with Claude Code.',
      'تطبيق React + TypeScript مبنيّ بـ Vite وTailwind CSS. يعمل دون اتصال أولًا على الجهاز، ثم يتزامن عبر Supabase (PostgreSQL). منشور على Vercel، ومبنيّ بمساعدة Claude Code.',
    ),
    security: [
      l('Row-level security on every table — each row is guarded in the database itself.', 'أمان على مستوى الصفوف في كل جدول — كل صفّ محميّ داخل قاعدة البيانات نفسها.'),
      l('Google sign-in — identity is handled by a trusted provider.', 'تسجيل الدخول عبر Google — الهوية يتولّاها مزوّد موثوق.'),
      l('Team roles decide who can see and change what.', 'أدوار الفريق تحدّد من يرى ماذا ومن يعدّل ماذا.'),
      l('Offline first: work stays on the device until you choose to sync.', 'دون اتصال أولًا: يبقى عملك على الجهاز حتى تختار المزامنة.'),
    ],
    statusNote: l(
      'Live since 09.2026 and still growing — new features are announced in the in-app News feed.',
      'متاح منذ 09.2026 وما زال ينمو — تُعلَن الميزات الجديدة في صفحة الأخبار داخل التطبيق.',
    ),
    tags: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Vercel', 'Claude Code'],
    shipped: [
      l('English / Arabic with full right-to-left layout', 'الإنجليزية / العربية مع تخطيط كامل من اليمين إلى اليسار'),
      l('Light, dark and system theme', 'مظهر فاتح وداكن وحسب النظام'),
      l('News feed', 'صفحة الأخبار'),
      l('Salary Planner — admin beta + animated public preview', 'مخطّط الراتب — نسخة تجريبية للمشرف + معاينة عامة متحرّكة'),
      l('Medications catalog (Pro)', 'كتالوج الأدوية (Pro)'),
      l('Cookie and terms onboarding', 'ترحيب بملفات تعريف الارتباط والشروط'),
      l('A "Start here" tour', 'جولة «ابدأ من هنا»'),
    ],
  },
  {
    id: 'studio',
    name: 'Resume Studio',
    role: l('Creator & Developer', 'المُنشئ والمطوّر'),
    kind: l('Own tool · local AI', 'أداة خاصة · ذكاء اصطناعي محلي'),
    where: l('Morocco', 'المغرب'),
    status: 'local',
    start: '2026-09',
    problem: l(
      'Most resumes are rejected by an applicant tracking system before a person reads them — and the online fixers want you to upload your resume to their servers.',
      'تُرفض معظم السير الذاتية من نظام تتبّع المتقدّمين (ATS) قبل أن يقرأها أي إنسان — والأدوات التي تعد بإصلاحها تطلب رفع سيرتك إلى خوادمها.',
    ),
    does: [
      l(
        'A 100% offline resume optimizer: a local AI runs four focused passes — ATS diagnostic, recruiter keyword scan, XYZ bullet rewrite, LaTeX assembly.',
        'محسّن سير ذاتية يعمل دون اتصال بالكامل: ذكاء اصطناعي محلي ينفّذ أربع مراحل مركّزة — تشخيص ATS، ومسح كلمات المجنِّدين، وإعادة صياغة النقاط بصيغة XYZ، وتجميع LaTeX.',
      ),
      l(
        'An instant parse check with no AI: text layer, contact details, section headings, dates, share of quantified lines and buzzwords.',
        'فحص فوري للقراءة دون ذكاء اصطناعي: طبقة النص، وبيانات التواصل، وعناوين الأقسام، والتواريخ، ونسبة الأسطر المقيسة بالأرقام، والكلمات الرنّانة.',
      ),
      l(
        'Never invents numbers: missing figures become [estimate] markers you must confirm, and image-only PDFs are recovered with offline OCR instead of guessed.',
        'لا يخترع الأرقام أبدًا: الأرقام الناقصة تصبح علامات [estimate] يجب تأكيدها، وملفات PDF المصوّرة تُقرأ بالتعرّف الضوئي دون اتصال بدل التخمين.',
      ),
      l(
        'Builds two PDFs: a marked copy that highlights every new, rewritten or keyword line against the original, and a clean one to send.',
        'يُنتج ملفّي PDF: نسخة مُعلَّمة تُبرز كل سطر جديد أو مُعاد صياغته أو كلمة مفتاحية مقارنةً بالأصل، ونسخة نظيفة للإرسال.',
      ),
      l(
        'Runs from the terminal — drag a resume onto start.bat — or from a local web dashboard with a guide, glossary and Ctrl+K command palette.',
        'يعمل من الطرفية — اسحب السيرة إلى start.bat — أو من لوحة ويب محلية مع دليل ومسرد ولوحة أوامر Ctrl+K.',
      ),
    ],
    built: l(
      'Python with FastAPI and Uvicorn, pypdf for parsing, a local LLM through Ollama (llama3.2) with streamed answers, and pdflatex for the PDF. The dashboard is vanilla HTML, CSS and JavaScript with zero CDN dependencies.',
      'Python مع FastAPI وUvicorn، وpypdf لقراءة الملفات، ونموذج لغوي محلي عبر Ollama (llama3.2) بإجابات متدفّقة، وpdflatex لإنتاج PDF. اللوحة مبنيّة بـ HTML وCSS وJavaScript خالصة دون أي اعتماد على CDN.',
    ),
    security: [
      l('Listens on 127.0.0.1 only — the resume never leaves the computer.', 'يستمع على 127.0.0.1 فقط — السيرة الذاتية لا تغادر الحاسوب أبدًا.'),
      l(
        'Blocks DNS rebinding and cross-site requests: foreign Host or Origin headers get a 403, and every response carries a CSP and anti-framing headers.',
        'يصدّ هجمات DNS rebinding والطلبات العابرة للمواقع: أي ترويسة Host أو Origin غريبة تُرفض بـ 403، وكل استجابة تحمل CSP وترويسات تمنع التضمين.',
      ),
      l(
        'A LaTeX safety gate refuses file and shell primitives and unknown packages, so a booby-trapped job description cannot make the model write hostile LaTeX.',
        'بوّابة أمان لـ LaTeX ترفض أوامر الملفات والصدفة والحزم غير المعروفة، فلا يستطيع وصف وظيفي مفخّخ دفع النموذج إلى كتابة LaTeX عدائي.',
      ),
      l('pdflatex runs with shell escape off and paranoid file access; uploads and text fields have hard size limits.', 'يعمل pdflatex مع تعطيل shell escape ووصول متشدّد إلى الملفات؛ وللرفع والحقول النصية حدود حجم صارمة.'),
    ],
    statusNote: l(
      'Working end to end since 09.2026 on a laptop CPU — about 1–2 minutes per stage, using half the processor so the PC stays usable.',
      'يعمل من البداية إلى النهاية منذ 09.2026 على معالج حاسوب محمول — نحو دقيقة إلى دقيقتين لكل مرحلة، باستخدام نصف المعالج ليبقى الحاسوب قابلًا للاستعمال.',
    ),
    tags: ['Python', 'FastAPI', 'Ollama', 'llama3.2', 'pypdf', 'LaTeX', 'OCR', 'Prompt engineering'],
    shipped: [
      l('Terminal mode and web dashboard, sharing one session', 'وضع الطرفية ولوحة الويب، بجلسة واحدة مشتركة'),
      l('Marked vs clean PDF compare view with a change summary', 'عرض مقارنة بين PDF المُعلَّم والنظيف مع ملخّص التغييرات'),
      l('Offline OCR for scanned or image-only resumes', 'تعرّف ضوئي دون اتصال للسير الممسوحة أو المصوّرة'),
      l('Every run saved as Markdown, LaTeX and PDF reports', 'كل تشغيل محفوظ كتقارير Markdown وLaTeX وPDF'),
      l('One-step MiKTeX install and a compile-only mode', 'تثبيت MiKTeX بخطوة واحدة ووضع للبناء فقط'),
    ],
  },
  {
    id: 'assas',
    name: 'ASSAS',
    role: l('Founder & Security Developer', 'المؤسس ومطوّر الأمن'),
    kind: l('Own SaaS', 'منصة SaaS خاصة'),
    where: l('Morocco (Remote)', 'المغرب (عن بُعد)'),
    status: 'dev',
    start: '2026-09',
    problem: l(
      'Security checks are scattered across tools and checklists. ASSAS scans a whole codebase and reports every finding in one place.',
      'فحوصات الأمان متفرّقة بين الأدوات وقوائم التحقّق. ASSAS يفحص قاعدة الشيفرة كاملة ويجمع كل النتائج في مكان واحد.',
    ),
    does: [
      l('A SaaS that scans a full codebase for threats, bugs and violations of security rules.', 'منصة SaaS تفحص قاعدة الشيفرة بالكامل بحثًا عن التهديدات والأخطاء ومخالفات قواعد الأمان.'),
      l(
        'Checks authentication, encryption, session handling, input validation, rate limiting and error handling.',
        'تتحقّق من المصادقة والتشفير وإدارة الجلسات والتحقّق من المدخلات وتحديد معدّل الطلبات ومعالجة الأخطاء.',
      ),
      l(
        'Covers logging, backups, monitoring and dependency scanning, then reports every finding in one place.',
        'تغطّي السجلات والنسخ الاحتياطي والمراقبة وفحص الاعتماديات، ثم تجمع كل النتائج في مكان واحد.',
      ),
      l(
        'A web crawler walks each flagged file\'s full source line by line, stops on every open finding, clamps onto the exact word and shows the rule that caught it.',
        'زاحف ويب يمشي على الشيفرة الكاملة لكل ملف مُعلَّم سطرًا بسطر، ويتوقّف عند كل نتيجة مفتوحة، ويقبض على الكلمة المعنيّة بالضبط ويعرض القاعدة التي رصدتها.',
      ),
      l(
        'Monitors live targets with Firecrawl, crawling sites to catch new exposures as they appear.',
        'تراقب الأهداف الحيّة عبر Firecrawl، فتزحف على المواقع لرصد أي نقاط انكشاف جديدة فور ظهورها.',
      ),
    ],
    built: l(
      'Python with static analysis and dependency scanning, REST APIs and Docker — built as a multi-tenant cloud service, one workspace per team.',
      'Python مع التحليل الثابت وفحص الاعتماديات، وواجهات REST APIs وDocker — مبنيّة كخدمة سحابية متعدّدة المستأجرين، بمساحة عمل مستقلّة لكل فريق.',
    ),
    security: [
      l('One workspace per team — each tenant\'s code and findings stay in their own space.', 'مساحة عمل لكل فريق — شيفرة كل مستأجر ونتائجه تبقى في مساحته الخاصة.'),
      l('Checks the basics attackers go for first: auth, sessions, input, rate limits.', 'تفحص الأساسيات التي يستهدفها المهاجمون أولًا: المصادقة والجلسات والمدخلات وحدود الطلبات.'),
      l('Watches the dependency tree, not only your own code.', 'تراقب شجرة الاعتماديات، لا شيفرتك وحدها.'),
      l('Keeps watching after launch: live targets are crawled for new exposures.', 'تواصل المراقبة بعد الإطلاق: تُزحف الأهداف الحيّة لرصد نقاط انكشاف جديدة.'),
    ],
    statusNote: l(
      'In development since 09.2026. The diagram is a concept — not the final architecture.',
      'قيد التطوير منذ 09.2026. المخطّط تصوّر مبدئي — وليس البنية النهائية.',
    ),
    tags: ['Python', 'Static analysis', 'Dependency scanning', 'Firecrawl', 'REST APIs', 'Docker', 'SaaS'],
    shipped: [
      l('A security grade and a release gate on every scan', 'درجة أمان وبوّابة إطلاق مع كل فحص'),
      l('Scan sweep — a web crawler that walks the source and stops on each finding', 'مسح الشيفرة — زاحف ويب يمشي على الشيفرة ويتوقّف عند كل نتيجة'),
      l('Repository map — each folder\'s share of the total risk', 'خريطة المستودع — حصّة كل مجلّد من إجمالي المخاطر'),
      l('Report builder — mark findings up by hand, export as PNG or PDF', 'منشئ التقارير — تعليم النتائج يدويًا وتصديرها PNG أو PDF'),
      l('Offline install from bundled wheels — no internet needed', 'تثبيت دون اتصال من حزم مرفقة — لا حاجة إلى الإنترنت'),
    ],
  },
];

/** Arabic labels for the two non-brand ASSAS tags. */
export const tagLabels: Record<string, L> = {
  'Static analysis': l('Static analysis', 'التحليل الثابت'),
  'Dependency scanning': l('Dependency scanning', 'فحص الاعتماديات'),
  'Prompt engineering': l('Prompt engineering', 'هندسة الأوامر'),
};

/* ── Security corner — learning path / labs, not job titles ──────────── */

export const security: readonly { id: string; kind: L; title: L; line: L; tools: readonly string[] }[] = [
  {
    id: 'soc',
    kind: l('Learning path', 'مسار تعلّم'),
    title: l('SOC monitoring', 'المراقبة في مركز العمليات الأمنية'),
    line: l('Collecting, searching and visualising logs to spot what doesn\'t belong.', 'جمع السجلات والبحث فيها وعرضها بصريًا لرصد ما لا ينبغي أن يكون هناك.'),
    tools: ['ELK Stack', 'OpenSearch', 'Kibana'],
  },
  {
    id: 'cti',
    kind: l('Learning path', 'مسار تعلّم'),
    title: l('Threat intel & OSINT', 'استخبارات التهديدات وOSINT'),
    line: l('Reading threat intelligence and open sources to understand who attacks, and how.', 'قراءة استخبارات التهديدات والمصادر المفتوحة لفهم من يهاجم، وكيف.'),
    tools: ['CTI', 'OSINT', 'Firecrawl'],
  },
  {
    id: 'attack',
    kind: l('Practice', 'تطبيق'),
    title: l('MITRE ATT&CK mapping', 'الربط بإطار MITRE ATT&CK'),
    line: l('Placing what happens on a system onto ATT&CK tactics and techniques.', 'وضع ما يحدث على النظام ضمن تكتيكات وتقنيات ATT&CK.'),
    tools: ['MITRE ATT&CK'],
  },
  {
    id: 'kali',
    kind: l('Labs', 'مختبرات'),
    title: l('Offensive labs', 'مختبرات هجومية'),
    line: l('Hands-on work in Kali Linux — learning how attacks work to defend against them.', 'عمل تطبيقي على Kali Linux — تعلّم كيف تعمل الهجمات للدفاع ضدّها.'),
    tools: ['Kali Linux'],
  },
];

/** The 14 MITRE ATT&CK Enterprise tactics, in order (public framework). */
export const attackTactics = [
  'Reconnaissance',
  'Resource Development',
  'Initial Access',
  'Execution',
  'Persistence',
  'Privilege Escalation',
  'Defense Evasion',
  'Credential Access',
  'Discovery',
  'Lateral Movement',
  'Collection',
  'Command and Control',
  'Exfiltration',
  'Impact',
] as const;

/* ── Stack (grouped exactly like the brief) ──────────────────────────── */

export interface StackGroup {
  id: string;
  group: L;
  items: readonly { name: string; label?: L; usedIn?: readonly Project['id'][] }[];
}

export const stack: readonly StackGroup[] = [
  {
    id: 'security',
    group: l('Security', 'الأمن'),
    items: [
      { name: 'ELK Stack' },
      { name: 'OpenSearch' },
      { name: 'Kibana' },
      { name: 'Threat intel (CTI)', label: l('Threat intel (CTI)', 'استخبارات التهديدات (CTI)') },
      { name: 'OSINT' },
      { name: 'Firecrawl', usedIn: ['assas'] },
    ],
  },
  {
    id: 'languages',
    group: l('Languages', 'لغات البرمجة'),
    items: [
      { name: 'Python', usedIn: ['studio', 'assas'] },
      { name: 'TypeScript', usedIn: ['kanz'] },
      { name: 'JavaScript' },
      { name: 'SQL' },
    ],
  },
  {
    id: 'frontend',
    group: l('Frontend', 'الواجهة الأمامية'),
    items: [{ name: 'React', usedIn: ['kanz'] }, { name: 'Vite', usedIn: ['kanz'] }, { name: 'Tailwind CSS', usedIn: ['kanz'] }, { name: 'Three.js' }],
  },
  {
    id: 'backend',
    group: l('Backend & data', 'الخلفية والبيانات'),
    items: [
      { name: 'REST APIs', usedIn: ['studio', 'assas'] },
      { name: 'FastAPI', usedIn: ['studio'] },
      { name: 'Supabase', usedIn: ['kanz'] },
      { name: 'PostgreSQL', usedIn: ['kanz'] },
      { name: 'IndexedDB' },
    ],
  },
  {
    id: 'infra',
    group: l('Infra & tools', 'البنية التحتية والأدوات'),
    items: [
      { name: 'Kali Linux' },
      { name: 'Docker', usedIn: ['assas'] },
      { name: 'Git' },
      { name: 'GitHub' },
      { name: 'Vercel', usedIn: ['kanz'] },
      { name: 'Ollama', usedIn: ['studio'] },
      { name: 'LaTeX', usedIn: ['studio'] },
      { name: 'Claude' },
    ],
  },
];

/* ── Built with (logo wall) ──────────────────────────────────────────── */

/**
 * Official logo files go in src/assets/logos/<slug>.svg (see the README there).
 * Until a file exists, the name is shown as text — never a redrawn logo.
 */
export const builtWith = [
  { name: 'Supabase', slug: 'supabase', url: 'https://supabase.com' },
  { name: 'Claude', slug: 'claude', url: 'https://claude.ai' },
  { name: 'Claude Code', slug: 'claude-code', url: 'https://claude.com/claude-code' },
  { name: 'Vercel', slug: 'vercel', url: 'https://vercel.com' },
  { name: 'GitHub', slug: 'github', url: 'https://github.com' },
  { name: 'MITRE ATT&CK', slug: 'mitre-attack', url: 'https://attack.mitre.org' },
] as const;

/* ── Socials ─────────────────────────────────────────────────────────── */

export type SocialStatus = 'soon' | 'building' | 'inProgress';

export interface Social {
  id: 'resume' | 'github' | 'linkedin' | 'instagram' | 'facebook';
  name: L;
  handle: L;
  url?: string;
  status?: SocialStatus;
  note?: L;
}

export const socials: readonly Social[] = [
  {
    id: 'resume',
    name: l('Resume', 'السيرة الذاتية'),
    handle: l('PDF · on its way', 'PDF · في الطريق'),
    status: 'soon',
    note: l('My resume is coming soon.', 'سيرتي الذاتية ستكون متاحة قريبًا.'),
  },
  {
    id: 'github',
    name: l('GitHub', 'GitHub'),
    handle: l('fouad-barkaoui', 'fouad-barkaoui'),
    url: 'https://github.com/fouad-barkaoui',
    status: 'building',
    note: l('A brand-new account — repositories are on their way.', 'حساب جديد كليًا — والمستودعات في الطريق.'),
  },
  {
    id: 'linkedin',
    name: l('LinkedIn', 'LinkedIn'),
    handle: l('fouad-barkaoui', 'fouad-barkaoui'),
    url: 'https://www.linkedin.com/in/fouad-barkaoui/',
    status: 'inProgress',
    note: l('The profile is still being put together.', 'ما زلت أجهّز الملف الشخصي.'),
  },
  {
    id: 'instagram',
    name: l('Instagram', 'Instagram'),
    handle: l('@heyfouad', '@heyfouad'),
    url: 'https://www.instagram.com/heyfouad/',
  },
  {
    id: 'facebook',
    name: l('Facebook', 'Facebook'),
    handle: l('Fouad Barkaoui', 'فؤاد البركاوي'),
    url: 'https://www.facebook.com/share/16E8VLshmwD/',
  },
];

/* ── Empty on purpose ────────────────────────────────────────────────── */

export const soon = {
  experience: l('Roles, internships and positions will be listed here.', 'ستُدرَج هنا الوظائف والتدريبات والمناصب.'),
  recognition: l('Certificates, awards and programs will be listed here.', 'ستُدرَج هنا الشهادات والجوائز والبرامج.'),
} as const;

/* ── Motto — Fouad's own line ────────────────────────────────────────── */

export const motto = {
  lead: l('Inspired by the fear of', 'يُلهمني الخوف من أن أكون'),
  big: l('being average.', 'شخصًا عاديًا.'),
} as const;

/* ── Interface strings ───────────────────────────────────────────────── */

export const ui = {
  skip: l('Skip to content', 'انتقل إلى المحتوى'),
  nav: {
    about: l('About', 'نبذة'),
    work: l('Work', 'المشاريع'),
    security: l('Security', 'الأمن'),
    stack: l('Stack', 'الأدوات'),
    contact: l('Contact', 'تواصل'),
  },
  menu: l('Menu', 'القائمة'),
  close: l('Close', 'إغلاق'),
  langSwitch: l('العربية', 'English'),
  langSwitchAria: l('Read this page in Arabic', 'اقرأ هذه الصفحة بالإنجليزية'),
  themeToLight: l('Switch to light theme', 'التبديل إلى المظهر الفاتح'),
  themeToDark: l('Switch to dark theme', 'التبديل إلى المظهر الداكن'),
  writeToMe: l('Write to me', 'راسلني'),
  seeWork: l('See the work', 'شاهد الأعمال'),
  greeting: {
    morning: l('Good morning', 'صباح الخير'),
    afternoon: l('Good afternoon', 'طاب يومك'),
    evening: l('Good evening', 'مساء الخير'),
  },
  gap: {
    same: l('same time as you', 'نفس توقيتك'),
    ahead: l('{amount} ahead of you', 'متقدّم عنك بـ{amount}'),
    behind: l('{amount} behind you', 'متأخّر عنك بـ{amount}'),
  },
  inMorocco: l('in Morocco', 'في المغرب'),
  localTime: l('Local time', 'التوقيت المحلي'),
  notes: {
    sayHi: l('say hi', 'قل مرحبًا'),
    basics: l('the basics', 'الأساسيات'),
    building: l("what I'm building", 'ما أبنيه الآن'),
    practise: l('what I practise', 'ما أتدرّب عليه'),
    tools: l('my daily tools', 'أدواتي اليومية'),
    thanks: l('big thanks', 'شكرًا جزيلًا'),
    worked: l("where I've worked", 'أين عملت'),
    milestones: l('milestones', 'محطّات'),
    findMe: l('find me here', 'تجدني هنا'),
  },
  section: {
    about: l('About', 'نبذة'),
    howIWork: l('How I work', 'طريقة عملي'),
    projects: l('Projects', 'المشاريع'),
    security: l('Security corner', 'ركن الأمن'),
    securitySub: l(
      'What I practise — a learning path and hands-on labs, not job titles.',
      'ما أتدرّب عليه — مسار تعلّم ومختبرات تطبيقية، لا مسمّيات وظيفية.',
    ),
    stack: l('Stack', 'الأدوات والتقنيات'),
    builtWith: l('Built with', 'بُني باستخدام'),
    experience: l('Experience', 'الخبرة'),
    recognition: l('Recognition', 'الشهادات والتقدير'),
    contact: l('Write to me', 'راسلني'),
    contactSub: l(
      'Hiring for a SOC role, need a fullstack builder, or just want to talk security? My inbox is open.',
      'توظيف لدور في SOC، أو حاجة إلى مطوّر متكامل، أو رغبة في الحديث عن الأمن؟ بريدي مفتوح.',
    ),
    socials: l('Socials', 'حساباتي'),
  },
  overview: {
    role: l('Role', 'الدور'),
    based: l('Based in', 'المقرّ'),
    time: l('Local time', 'التوقيت'),
    languages: l('Languages', 'اللغات'),
    email: l('Email', 'البريد'),
  },
  copyEmail: l('Copy email address', 'نسخ عنوان البريد الإلكتروني'),
  copied: l('Copied', 'تم النسخ'),
  copiedLive: l('Email address copied to clipboard', 'تم نسخ البريد الإلكتروني إلى الحافظة'),
  project: {
    problem: l('The problem', 'المشكلة'),
    does: l('What it does', 'ماذا يفعل'),
    built: l('How it is built', 'كيف بُني'),
    security: l('Security decisions', 'قرارات الأمان'),
    status: l('Status & next', 'الحالة والخطوة التالية'),
    shipped: l('Shipped so far', 'ما تمّ إطلاقه حتى الآن'),
    working: l('Working today', 'يعمل اليوم'),
    screens: l('Screens from the live app', 'لقطات من التطبيق الفعلي'),
    screensScan: l('Screens from a real scan', 'لقطات من فحص حقيقي'),
    screensSample: l('Screens from a run on a sample resume', 'لقطات من تشغيل على سيرة ذاتية تجريبية'),
    statusLocal: l('Works offline', 'يعمل دون اتصال'),
    zoom: l('View larger', 'عرض بحجم أكبر'),
    prev: l('Previous screenshot', 'اللقطة السابقة'),
    next: l('Next screenshot', 'اللقطة التالية'),
    visit: l('Visit Kanz', 'زيارة كنز'),
    since: l('since', 'منذ'),
    present: l('present', 'حتى الآن'),
    statusLive: l('Live', 'متاح الآن'),
    statusDev: l('In development', 'قيد التطوير'),
    concept: l('Concept diagram — in development', 'مخطّط مبدئي — قيد التطوير'),
    architecture: l('Architecture sketch', 'رسم تخطيطي للبنية'),
  },
  status: {
    soon: l('Soon', 'قريبًا'),
    building: l('Building', 'قيد البناء'),
    inProgress: l('In progress', 'قيد الإعداد'),
  },
  attackCaption: l('The 14 ATT&CK Enterprise tactics — the map I learn to place activity on.', 'تكتيكات ATT&CK الأربعة عشر للمؤسسات — الخريطة التي أتعلّم وضع النشاط عليها.'),
  usedIn: l('used in', 'استُخدم في'),
  hire: {
    badge: l('Open to work', 'متاح للعمل'),
    badgeRoles: l('SOC analyst & fullstack roles', 'أدوار محلّل SOC والتطوير المتكامل'),
    title: l('Hiring? Here is the short version.', 'توظّف؟ إليك النسخة المختصرة.'),
    looking: l('Looking for', 'أبحث عن'),
    roles: [l('Junior SOC analyst', 'محلّل SOC مبتدئ'), l('Fullstack web developer', 'مطوّر ويب متكامل')],
    based: l('Based in Morocco', 'مقيم في المغرب'),
    proof: l('Proof, not promises', 'أدلّة لا وعود'),
    proofs: [
      { id: 'case-kanz', text: l('Shipped a live product end to end', 'أطلقت منتجًا حيًّا من البداية إلى النهاية'), name: 'Kanz' },
      { id: 'case-studio', text: l('Built an offline AI tool with a real security model', 'بنيت أداة ذكاء اصطناعي تعمل دون اتصال بنموذج أمان حقيقي'), name: 'Resume Studio' },
      { id: 'case-assas', text: l('Building a codebase security scanner', 'أبني ماسحًا أمنيًا لقواعد الشيفرة'), name: 'ASSAS' },
    ],
    resume: l('Resume on request — ask by email.', 'السيرة الذاتية عند الطلب — اطلبها عبر البريد.'),
    email: l('Email me', 'راسلني بالبريد'),
  },
  home: l('Fouad Barkaoui — back to the top', 'فؤاد البركاوي — العودة إلى الأعلى'),
  index: {
    title: l('Index', 'الفهرس'),
    open: l('Page index', 'فهرس الصفحة'),
    progress: l('Reading progress', 'تقدّم القراءة'),
    top: l('Back to top', 'العودة إلى الأعلى'),
    current: l('current section', 'القسم الحالي'),
  },
  footer: {
    rights: l('All rights reserved', 'جميع الحقوق محفوظة'),
    top: l('Back to top', 'إلى الأعلى'),
    links: l('Links', 'روابط'),
    resume: l('Resume', 'السيرة الذاتية'),
    email: l('Email', 'البريد'),
    socials: l('Elsewhere', 'في أماكن أخرى'),
    localTime: l('Morocco time', 'توقيت المغرب'),
    ctaKicker: l('Have an idea?', 'لديك فكرة؟'),
    ctaTitle: l("Let's build it — secure by default.", 'لنبنِها معًا — آمنة منذ البداية.'),
    ctaButton: l('Write to me', 'راسلني'),
  },
  meta: {
    title: l('Fouad Barkaoui — SOC analyst & fullstack developer', 'فؤاد البركاوي — محلّل SOC ومطوّر ويب متكامل'),
    description: l(
      'Fouad Barkaoui — a security-minded builder from Morocco, open to SOC analyst and fullstack roles. Projects: Kanz, Resume Studio and ASSAS.',
      'فؤاد البركاوي — مطوّر من المغرب يفكّر بعقلية أمنية، ومتاح لأدوار محلّل SOC والتطوير المتكامل. المشاريع: كنز وResume Studio وASSAS.',
    ),
  },
} as const;

/* ── Architecture sketches (labels only; tool names stay Latin) ──────── */

export interface DiagramNode {
  title: L;
  items: readonly (string | L)[];
  accent?: boolean;
}
export interface Diagram {
  lanes: readonly { label: L; nodes: readonly DiagramNode[] }[];
  /** Label on the arrow between lane n and n+1. */
  links: readonly L[];
  frame?: L;
  foot: L;
}

export const diagrams: Record<Project['id'], Diagram> = {
  kanz: {
    lanes: [
      {
        label: l('On the device', 'على الجهاز'),
        nodes: [
          { title: l('Kanz app', 'تطبيق كنز'), items: ['React · TypeScript', 'Vite · Tailwind CSS'] },
          { title: l('Offline-first store', 'تخزين محلي أولًا'), items: [l('works without a connection', 'يعمل دون اتصال')] },
        ],
      },
      {
        label: l('In the cloud', 'في السحابة'),
        nodes: [
          { title: l('Supabase Auth', 'Supabase Auth'), items: [l('Google sign-in', 'تسجيل الدخول عبر Google'), l('team invites & roles', 'دعوات الفريق والأدوار')] },
          {
            title: l('PostgreSQL', 'PostgreSQL'),
            items: [l('row-level security on every table', 'أمان على مستوى الصفوف في كل جدول')],
            accent: true,
          },
        ],
      },
    ],
    links: [l('sync', 'مزامنة')],
    foot: l('Hosted on Vercel · built with Claude Code', 'مستضاف على Vercel · مبنيّ بمساعدة Claude Code'),
  },
  studio: {
    frame: l('Your computer — 127.0.0.1 only, nothing leaves it', 'حاسوبك — 127.0.0.1 فقط، لا شيء يغادره'),
    lanes: [
      {
        label: l('Inputs', 'المدخلات'),
        nodes: [
          { title: l('Resume', 'السيرة الذاتية'), items: ['PDF · .docx · .txt', l('OCR for scanned PDFs', 'تعرّف ضوئي للملفات الممسوحة')] },
          { title: l('Target role', 'الدور المستهدف'), items: [l('+ optional job description', '+ وصف وظيفي اختياري')] },
        ],
      },
      {
        label: l('Local pipeline', 'المعالجة المحلية'),
        nodes: [
          { title: l('Parse check', 'فحص القراءة'), items: [l('deterministic, no AI', 'حتمي، دون ذكاء اصطناعي')] },
          {
            title: l('4 prompt stages', '4 مراحل أوامر'),
            items: [l('diagnose · keywords', 'تشخيص · كلمات مفتاحية'), l('XYZ rewrite · LaTeX', 'إعادة صياغة XYZ · LaTeX'), 'Ollama · llama3.2'],
          },
          { title: l('LaTeX safety gate', 'بوّابة أمان LaTeX'), items: [l('no shell, no file access', 'لا صدفة ولا وصول إلى الملفات')], accent: true },
        ],
      },
      {
        label: l('Output', 'المخرجات'),
        nodes: [{ title: l('Two PDFs', 'ملفّا PDF'), items: [l('marked — every change', 'مُعلَّم — كل تغيير'), l('clean — the one to send', 'نظيف — للإرسال')], accent: true }],
      },
    ],
    links: [l('stream', 'تدفّق'), l('pdflatex', 'pdflatex')],
    foot: l('Python · FastAPI · vanilla JS dashboard · zero CDN', 'Python · FastAPI · لوحة JS خالصة · دون CDN'),
  },
  assas: {
    frame: l('Team workspace — multi-tenant, one per team', 'مساحة عمل الفريق — متعدّدة المستأجرين، واحدة لكل فريق'),
    lanes: [
      {
        label: l('Inputs', 'المدخلات'),
        nodes: [
          { title: l('Codebase', 'قاعدة الشيفرة'), items: [l('the full project', 'المشروع كاملًا')] },
          { title: l('Live targets', 'الأهداف الحيّة'), items: [l('sites to watch', 'مواقع للمراقبة')] },
        ],
      },
      {
        label: l('Scan engine', 'محرّك الفحص'),
        nodes: [
          { title: l('Static analysis', 'التحليل الثابت'), items: ['Python'] },
          { title: l('Dependency scanning', 'فحص الاعتماديات'), items: [l('the whole dependency tree', 'شجرة الاعتماديات كاملة')] },
          {
            title: l('Security rules', 'قواعد الأمان'),
            items: [
              l('auth · encryption · sessions', 'المصادقة · التشفير · الجلسات'),
              l('input validation · rate limiting', 'التحقّق من المدخلات · حدود الطلبات'),
              l('error handling', 'معالجة الأخطاء'),
              l('logging · backups · monitoring', 'السجلات · النسخ الاحتياطي · المراقبة'),
            ],
          },
          { title: l('Crawler', 'الزاحف'), items: ['Firecrawl', l('new exposures', 'نقاط انكشاف جديدة')] },
        ],
      },
      {
        label: l('Output', 'المخرجات'),
        nodes: [{ title: l('One report', 'تقرير واحد'), items: [l('every finding in one place', 'كل النتائج في مكان واحد'), 'REST APIs'], accent: true }],
      },
    ],
    links: [l('scan', 'فحص'), l('report', 'تقرير')],
    foot: l('Packaged with Docker · cloud SaaS', 'مُعبّأ بـ Docker · خدمة SaaS سحابية'),
  },
};

/* ── Real screenshots of the live Kanz app (src/assets/kanz) ─────────── */

/** A screenshot shown under a case study; `wide` spans the full row. */
export interface Screen {
  id: string;
  wide?: boolean;
  caption: L;
  alt: L;
}

export const kanzScreens = [
  {
    id: 'news-dark' as const,
    wide: true,
    caption: { en: 'News feed — dark theme', ar: 'صفحة الأخبار — المظهر الداكن' },
    alt: {
      en: 'Kanz News page in dark theme: a "Welcome to Kanz" card with three first steps, next to cards for Pro and the Salary Planner beta.',
      ar: 'صفحة الأخبار في كنز بالمظهر الداكن: بطاقة «مرحبًا بك في كنز» بثلاث خطوات أولى، بجانب بطاقات Pro ومخطّط الراتب التجريبي.',
    },
  },
  {
    id: 'arabic-rtl' as const,
    caption: { en: 'Arabic — full right-to-left layout', ar: 'العربية — تخطيط كامل من اليمين إلى اليسار' },
    alt: {
      en: 'The same News page in Arabic, with the sidebar and every card mirrored right to left.',
      ar: 'صفحة الأخبار نفسها بالعربية، مع الشريط الجانبي وكل البطاقات معكوسة من اليمين إلى اليسار.',
    },
  },
  {
    id: 'salary-light' as const,
    caption: { en: 'Salary Planner public preview — light theme', ar: 'المعاينة العامة لمخطّط الراتب — المظهر الفاتح' },
    alt: {
      en: 'Salary Planner preview in light theme: an animated demo where a monthly salary of MAD 12,000 is split with a 50/30/20 rule.',
      ar: 'معاينة مخطّط الراتب بالمظهر الفاتح: عرض متحرّك يُقسَّم فيه راتب شهري قدره 12,000 درهم وفق قاعدة 50/30/20.',
    },
  },
  {
    id: 'start-here' as const,
    caption: { en: '"Start here" tour', ar: 'جولة «ابدأ من هنا»' },
    alt: {
      en: 'The "Here\'s what\'s in Kanz" tour dialog, with tabs for Start here, Free tools, Pro, Coming next and Your ideas.',
      ar: 'نافذة جولة «إليك ما في كنز»، مع تبويبات ابدأ من هنا والأدوات المجانية وPro والقادم وأفكارك.',
    },
  },
] satisfies readonly Screen[];

/* ── Resume Studio on a fictional sample resume (src/assets/studio) ─────── */

export const studioScreens = [
  {
    id: 'studio-compare' as const,
    wide: true,
    caption: { en: 'Stage 4 — marked and clean PDFs side by side', ar: 'المرحلة 4 — ملفّا PDF المُعلَّم والنظيف جنبًا إلى جنب' },
    alt: {
      en: 'Resume Studio, Stage 4 compare view: a summary of 5 new lines, 4 rewritten, 3 keywords added and 5 estimates to verify, above the marked PDF with coloured changes and the clean PDF ready to send.',
      ar: 'Resume Studio، عرض المقارنة في المرحلة 4: ملخّص بـ 5 أسطر جديدة و4 معاد صياغتها و3 كلمات مفتاحية مضافة و5 تقديرات للتحقّق، فوق ملف PDF المُعلَّم بالألوان والملف النظيف الجاهز للإرسال.',
    },
  },
  {
    id: 'studio-home' as const,
    wide: true,
    caption: { en: 'Home — the four-stage pipeline, all done', ar: 'الرئيسية — المراحل الأربع مكتملة' },
    alt: {
      en: 'Resume Studio home: "Make your resume readable to every ATS", with four coloured stage cards — ATS Diagnostic, Keyword Scan, XYZ Rewrite and LaTeX & PDF — each marked Done.',
      ar: 'الصفحة الرئيسية لـ Resume Studio: «اجعل سيرتك مقروءة لكل نظام ATS»، مع أربع بطاقات ملوّنة للمراحل — تشخيص ATS ومسح الكلمات وإعادة صياغة XYZ وLaTeX وPDF — وكلها مكتملة.',
    },
  },
  {
    id: 'studio-parse' as const,
    caption: { en: 'Parse check — instant, no AI', ar: 'فحص القراءة — فوري ودون ذكاء اصطناعي' },
    alt: {
      en: 'Parse check: 7 of 10 checks passed, with OK, WARN and FAIL rows for text layer, contact details, section headings, dates, quantified lines and buzzwords.',
      ar: 'فحص القراءة: 7 من 10 فحوصات ناجحة، مع صفوف OK وWARN وFAIL لطبقة النص وبيانات التواصل وعناوين الأقسام والتواريخ والأسطر المقيسة والكلمات الرنّانة.',
    },
  },
  {
    id: 'studio-keywords' as const,
    caption: { en: 'Stage 2 — recruiter keyword scan', ar: 'المرحلة 2 — مسح كلمات المجنِّدين' },
    alt: {
      en: 'Keyword scan for a SOC Analyst role: a ranked table of the top keywords, each marked as missing, buried or present in the resume.',
      ar: 'مسح الكلمات المفتاحية لدور محلّل SOC: جدول مرتّب لأهم الكلمات، وكل منها معلّم كناقص أو مدفون أو موجود في السيرة.',
    },
  },
  {
    id: 'studio-xyz' as const,
    caption: { en: 'Stage 3 — XYZ bullets with [estimate] markers', ar: 'المرحلة 3 — نقاط XYZ مع علامات [estimate]' },
    alt: {
      en: 'XYZ Bullet Rewriter: experience bullets rewritten as result, metric and method, with highlighted "estimate — verify before sending" markers where a number is missing.',
      ar: 'معيد صياغة النقاط بصيغة XYZ: نقاط الخبرة مكتوبة كنتيجة ومقياس وطريقة، مع علامات «estimate — تحقّق قبل الإرسال» مظلّلة حيث ينقص الرقم.',
    },
  },
] satisfies readonly Screen[];

/* ── Real screenshots of an ASSAS scan (src/assets/assas) ──────────────── */

export const assasScreens = [
  {
    id: 'report-summary' as const,
    wide: true,
    caption: { en: 'Scan report — security grade and release gate', ar: 'تقرير الفحص — درجة الأمان وبوّابة الإطلاق' },
    alt: {
      en: 'ASSAS security review of the HeyfouadKit repository: 198 files scanned, grade A at 96.5 / 100, passes the release gate with 0 critical, 0 high, 4 medium, 2 low and 6 info findings.',
      ar: 'مراجعة ASSAS الأمنية لمستودع HeyfouadKit: فحص 198 ملفًا، الدرجة A بنتيجة 96.5 / 100، ويجتاز بوّابة الإطلاق بـ 0 حرجة و0 عالية و4 متوسطة و2 منخفضة و6 معلوماتية.',
    },
  },
  {
    id: 'scan-sweep' as const,
    wide: true,
    caption: { en: 'Scan sweep — the web crawler walking a flagged file', ar: 'مسح الشيفرة — زاحف الويب يمشي على ملف مُعلَّم' },
    alt: {
      en: 'The scan sweep in action: a web crawler moves down the full source of index.html, its legs grabbing the code around it as it stops on line 19 of 65.',
      ar: 'مسح الشيفرة أثناء العمل: زاحف ويب ينزل على الشيفرة الكاملة لملف index.html، وأرجله تمسك بالشيفرة من حوله وهو يتوقّف عند السطر 19 من 65.',
    },
  },
  {
    id: 'repo-map' as const,
    caption: { en: 'Repository map — risk share per folder', ar: 'خريطة المستودع — حصّة المخاطر لكل مجلّد' },
    alt: {
      en: 'Repository map: each folder and file with its share of the total risk, findings counts, and clean files marked in green.',
      ar: 'خريطة المستودع: كل مجلّد وملف مع حصّته من إجمالي المخاطر وعدد النتائج، والملفات السليمة معلّمة بالأخضر.',
    },
  },
  {
    id: 'create-report' as const,
    caption: { en: 'Report builder — mark up findings, export PNG or PDF', ar: 'منشئ التقارير — تعليم النتائج وتصديرها PNG أو PDF' },
    alt: {
      en: 'The Create report screen: findings to drag onto a page, drawing tools like pen, highlighter and arrow, and the export buttons.',
      ar: 'شاشة إنشاء التقرير: نتائج تُسحب إلى الصفحة، وأدوات رسم مثل القلم والمُظلِّل والسهم، وأزرار التصدير.',
    },
  },
  {
    id: 'offline-install' as const,
    caption: { en: 'Runs offline — installs from bundled wheels', ar: 'يعمل دون اتصال — يُثبَّت من حزم مرفقة' },
    alt: {
      en: 'Terminal: "ASSAS - codebase security review", installing dependencies from the bundled wheels folder with no internet needed, then asking which folder or archive to scan.',
      ar: 'الطرفية: «ASSAS - codebase security review»، تثبيت الاعتماديات من مجلّد الحزم المرفقة دون حاجة إلى الإنترنت، ثم سؤال عن المجلّد أو الأرشيف المراد فحصه.',
    },
  },
] satisfies readonly Screen[];
