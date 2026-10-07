/**
 * "Start a project" brief — every question, option and label in EN + AR.
 * The form (BriefForm.tsx) is generated from this file, and so is the
 * Markdown brief the client sends or downloads.
 */
import type { L } from './content';

const l = (en: string, ar: string): L => ({ en, ar });

export interface Option {
  id: string;
  label: L;
  hint?: L;
}

export type FieldKind = 'text' | 'email' | 'tel' | 'url' | 'date' | 'textarea' | 'radio' | 'cards' | 'checks' | 'select';

export interface Field {
  id: string;
  kind: FieldKind;
  label: L;
  hint?: L;
  placeholder?: L;
  required?: boolean;
  options?: readonly Option[];
  /** Half-width on wide screens. */
  half?: boolean;
  rows?: number;
}

export interface Step {
  id: string;
  title: L;
  intro: L;
  fields: readonly Field[];
}

export const briefSteps: readonly Step[] = [
  {
    id: 'you',
    title: l('About you', 'عنك'),
    intro: l('Who I will be talking to, and how to reach you.', 'مع من سأتحدّث، وكيف أتواصل معك.'),
    fields: [
      { id: 'name', kind: 'text', label: l('Full name', 'الاسم الكامل'), required: true, half: true },
      { id: 'email', kind: 'email', label: l('Email', 'البريد الإلكتروني'), required: true, half: true, placeholder: l('you@company.com', 'you@company.com') },
      { id: 'company', kind: 'text', label: l('Company or organisation', 'الشركة أو المؤسسة'), half: true, hint: l('Leave empty if it is a personal project.', 'اتركه فارغًا إن كان المشروع شخصيًا.') },
      { id: 'role', kind: 'text', label: l('Your role', 'دورك'), half: true, placeholder: l('Founder, IT manager…', 'مؤسس، مسؤول تقنية المعلومات…') },
      { id: 'location', kind: 'text', label: l('Country and city', 'البلد والمدينة'), half: true },
      { id: 'phone', kind: 'tel', label: l('Phone or WhatsApp', 'الهاتف أو واتساب'), half: true, hint: l('Optional.', 'اختياري.') },
      {
        id: 'contactBy',
        kind: 'radio',
        label: l('Best way to reach you', 'أفضل طريقة للتواصل معك'),
        options: [
          { id: 'email', label: l('Email', 'البريد الإلكتروني') },
          { id: 'whatsapp', label: l('WhatsApp', 'واتساب') },
          { id: 'call', label: l('Video call', 'مكالمة فيديو') },
        ],
      },
      {
        id: 'language',
        kind: 'checks',
        label: l('Languages we can work in', 'اللغات التي يمكننا العمل بها'),
        options: [
          { id: 'en', label: l('English', 'الإنجليزية') },
          { id: 'ar', label: l('Arabic', 'العربية') },
          { id: 'fr', label: l('French', 'الفرنسية') },
          { id: 'darija', label: l('Darija', 'الدارجة') },
        ],
      },
    ],
  },
  {
    id: 'project',
    title: l('The project', 'المشروع'),
    intro: l('What you want to build, for whom, and where it stands today.', 'ما تريد بناءه، ولمن، وأين وصل اليوم.'),
    fields: [
      { id: 'projectName', kind: 'text', label: l('Project name', 'اسم المشروع'), hint: l('A working title is fine.', 'يكفي اسم مؤقت.') },
      {
        id: 'type',
        kind: 'cards',
        label: l('What kind of project is it?', 'ما نوع المشروع؟'),
        required: true,
        options: [
          { id: 'website', label: l('Website or landing page', 'موقع أو صفحة هبوط'), hint: l('Present a brand, product or person.', 'تقديم علامة أو منتج أو شخص.') },
          { id: 'webapp', label: l('Web app or SaaS', 'تطبيق ويب أو SaaS'), hint: l('Accounts, data, a real product.', 'حسابات وبيانات ومنتج فعلي.') },
          { id: 'internal', label: l('Internal tool or dashboard', 'أداة داخلية أو لوحة تحكّم'), hint: l('For your team, often offline or on an intranet.', 'لفريقك، غالبًا دون اتصال أو على شبكة داخلية.') },
          { id: 'audit', label: l('Security review or code audit', 'مراجعة أمنية أو تدقيق شيفرة'), hint: l('Check an existing app before or after launch.', 'فحص تطبيق قائم قبل الإطلاق أو بعده.') },
          { id: 'soc', label: l('Monitoring and logging (SOC)', 'المراقبة والسجلات (SOC)'), hint: l('ELK, OpenSearch, dashboards, alerts.', 'ELK وOpenSearch ولوحات وتنبيهات.') },
          { id: 'ai', label: l('Automation or AI tool', 'أتمتة أو أداة ذكاء اصطناعي'), hint: l('Local or cloud AI, scripts, workflows.', 'ذكاء اصطناعي محلي أو سحابي، سكربتات، مسارات عمل.') },
          { id: 'other', label: l('Something else', 'شيء آخر'), hint: l('Describe it below.', 'صِفه في الأسفل.') },
        ],
      },
      {
        id: 'stage',
        kind: 'radio',
        label: l('Where does it stand today?', 'أين وصل المشروع اليوم؟'),
        options: [
          { id: 'idea', label: l('Just an idea', 'مجرّد فكرة') },
          { id: 'design', label: l('Designs are ready', 'التصاميم جاهزة') },
          { id: 'existing', label: l('Existing product to improve', 'منتج قائم يحتاج تحسينًا') },
          { id: 'rescue', label: l('A project that needs rescuing', 'مشروع يحتاج إلى إنقاذ') },
        ],
      },
      {
        id: 'description',
        kind: 'textarea',
        label: l('Describe the project', 'صِف المشروع'),
        required: true,
        rows: 5,
        hint: l('What it is, the problem it solves, and what success looks like for you.', 'ما هو، والمشكلة التي يحلّها، وكيف يبدو النجاح بالنسبة إليك.'),
      },
      { id: 'users', kind: 'textarea', label: l('Who will use it?', 'من سيستخدمه؟'), rows: 2, hint: l('Customers, staff or the public, and roughly how many.', 'عملاء، موظفون، الجمهور — وتقريبًا كم عددهم.') },
      { id: 'features', kind: 'textarea', label: l('Must-have features', 'الميزات الأساسية'), rows: 4, hint: l('One per line. Start with the most important.', 'ميزة في كل سطر. ابدأ بالأهم.') },
      {
        id: 'assets',
        kind: 'checks',
        label: l('What do you already have?', 'ماذا لديك بالفعل؟'),
        options: [
          { id: 'brand', label: l('Logo and brand', 'شعار وهوية بصرية') },
          { id: 'designs', label: l('Designs (Figma…)', 'تصاميم (Figma…)') },
          { id: 'content', label: l('Texts and images', 'نصوص وصور') },
          { id: 'code', label: l('Existing code', 'شيفرة قائمة') },
          { id: 'domain', label: l('Domain name', 'اسم نطاق') },
          { id: 'hosting', label: l('Hosting or servers', 'استضافة أو خوادم') },
        ],
      },
      { id: 'links', kind: 'textarea', label: l('Links', 'روابط'), rows: 2, hint: l('Current site, repository, or apps you like.', 'الموقع الحالي، المستودع، أو تطبيقات تعجبك.') },
    ],
  },
  {
    id: 'security',
    title: l('Security', 'الأمان'),
    intro: l(
      'This decides how the project is built and tested. If you are unsure, pick the closest level and we will refine it together.',
      'هذا يحدّد طريقة بناء المشروع واختباره. إن لم تكن متأكدًا، اختر أقرب مستوى وسنضبطه معًا.',
    ),
    fields: [
      {
        id: 'level',
        kind: 'cards',
        label: l('Security level', 'مستوى الأمان'),
        required: true,
        options: [
          { id: '1', label: l('1 · Standard', '1 · عادي'), hint: l('Public information only. No accounts, no personal data.', 'معلومات عامة فقط. لا حسابات ولا بيانات شخصية.') },
          { id: '2', label: l('2 · Protected', '2 · محمي'), hint: l('User accounts and personal data such as names, emails and phone numbers.', 'حسابات مستخدمين وبيانات شخصية مثل الأسماء والبريد وأرقام الهاتف.') },
          { id: '3', label: l('3 · Sensitive', '3 · حسّاس'), hint: l('Payments, health, financial or legal records, or confidential company data.', 'مدفوعات أو بيانات صحية أو مالية أو قانونية أو بيانات سرّية للشركة.') },
          { id: '4', label: l('4 · Critical', '4 · حرج'), hint: l('Regulated, government or defence work that must resist targeted attacks, offline or air-gapped if needed.', 'عمل خاضع للتنظيم أو حكومي أو دفاعي يجب أن يصمد أمام هجمات موجّهة — دون اتصال أو بشبكة معزولة عند الحاجة.') },
        ],
      },
      {
        id: 'data',
        kind: 'checks',
        label: l('Which data will it handle?', 'ما البيانات التي سيتعامل معها؟'),
        options: [
          { id: 'personal', label: l('Personal data', 'بيانات شخصية') },
          { id: 'accounts', label: l('Accounts and passwords', 'حسابات وكلمات مرور') },
          { id: 'payments', label: l('Payments', 'مدفوعات') },
          { id: 'health', label: l('Health data', 'بيانات صحية') },
          { id: 'financial', label: l('Financial records', 'سجلات مالية') },
          { id: 'files', label: l('Uploaded files and documents', 'ملفات ووثائق مرفوعة') },
          { id: 'location', label: l('Location', 'الموقع الجغرافي') },
          { id: 'confidential', label: l('Confidential business data', 'بيانات أعمال سرّية') },
        ],
      },
      {
        id: 'auth',
        kind: 'radio',
        label: l('How should people sign in?', 'كيف يجب أن يسجّل المستخدمون الدخول؟'),
        options: [
          { id: 'none', label: l('No sign-in', 'دون تسجيل دخول') },
          { id: 'password', label: l('Email and password', 'بريد وكلمة مرور') },
          { id: 'social', label: l('Google or Microsoft', 'Google أو Microsoft') },
          { id: 'sso', label: l('Company single sign-on', 'دخول موحّد للشركة') },
          { id: 'mfa', label: l('Two-factor required', 'التحقّق بخطوتين إلزامي') },
        ],
      },
      {
        id: 'roles',
        kind: 'radio',
        label: l('Who can see and change what?', 'من يرى ماذا ومن يعدّل ماذا؟'),
        options: [
          { id: 'single', label: l('One kind of user', 'نوع واحد من المستخدمين') },
          { id: 'roles', label: l('Several roles (admin, staff, client…)', 'عدّة أدوار (مشرف، موظف، عميل…)') },
          { id: 'tenants', label: l('Separate spaces per team or client', 'مساحات منفصلة لكل فريق أو عميل') },
        ],
      },
      {
        id: 'compliance',
        kind: 'checks',
        label: l('Rules you must follow', 'قواعد يجب الالتزام بها'),
        options: [
          { id: 'cndp', label: l('Morocco: Law 09-08 (CNDP)', 'المغرب: القانون 09-08 (CNDP)') },
          { id: 'gdpr', label: l('GDPR (users in Europe)', 'GDPR (مستخدمون في أوروبا)') },
          { id: 'pci', label: l('PCI DSS (card payments)', 'PCI DSS (الدفع بالبطاقات)') },
          { id: 'iso', label: l('ISO 27001', 'ISO 27001') },
          { id: 'internal', label: l('Internal security policy', 'سياسة أمنية داخلية') },
          { id: 'unsure', label: l('Not sure', 'لست متأكدًا') },
        ],
      },
      {
        id: 'hosting',
        kind: 'radio',
        label: l('Where should it run?', 'أين يجب أن يعمل؟'),
        options: [
          { id: 'cloud', label: l('Cloud (Vercel, Supabase…)', 'السحابة (Vercel وSupabase…)') },
          { id: 'vps', label: l('Our own server or VPS', 'خادمنا الخاص أو VPS') },
          { id: 'onprem', label: l('On-premise', 'داخل مقرّاتنا') },
          { id: 'airgap', label: l('Offline / air-gapped network', 'دون اتصال / شبكة معزولة') },
          { id: 'any', label: l('No preference', 'لا تفضيل') },
        ],
      },
      {
        id: 'extras',
        kind: 'checks',
        label: l('Security work you want included', 'أعمال أمنية تريد تضمينها'),
        options: [
          { id: 'review', label: l('Code security review', 'مراجعة أمنية للشيفرة') },
          { id: 'pentest', label: l('Attack simulation (pentest)', 'محاكاة هجوم (اختبار اختراق)') },
          { id: 'monitoring', label: l('Logging, monitoring and alerts', 'سجلات ومراقبة وتنبيهات') },
          { id: 'backups', label: l('Backups and recovery plan', 'نسخ احتياطي وخطة استعادة') },
          { id: 'docs', label: l('Security documentation and training', 'توثيق أمني وتدريب') },
        ],
      },
      { id: 'concerns', kind: 'textarea', label: l('Anything that worries you?', 'هل هناك ما يقلقك؟'), rows: 3, hint: l('A past incident, a sensitive feature, an audit coming up…', 'حادثة سابقة، ميزة حسّاسة، تدقيق قادم…') },
    ],
  },
  {
    id: 'scope',
    title: l('Timing and budget', 'المدّة والميزانية'),
    intro: l('So I can plan honestly and tell you early what fits.', 'لأخطّط بصدق وأخبرك مبكرًا بما يناسب.'),
    fields: [
      {
        id: 'timeline',
        kind: 'radio',
        label: l('When do you need it?', 'متى تحتاجه؟'),
        options: [
          { id: 'asap', label: l('As soon as possible', 'في أقرب وقت ممكن') },
          { id: '1m', label: l('Within a month', 'خلال شهر') },
          { id: '3m', label: l('In 1–3 months', 'خلال 1–3 أشهر') },
          { id: 'later', label: l('Later than 3 months', 'بعد أكثر من 3 أشهر') },
          { id: 'flex', label: l('Flexible', 'مرن') },
        ],
      },
      { id: 'deadline', kind: 'date', label: l('Hard deadline', 'موعد نهائي ثابت'), half: true, hint: l('Only if there is one.', 'فقط إن وُجد.') },
      {
        id: 'currency',
        kind: 'select',
        label: l('Currency', 'العملة'),
        half: true,
        options: [
          { id: 'MAD', label: l('MAD (Moroccan dirham)', 'MAD (درهم مغربي)') },
          { id: 'EUR', label: l('EUR (Euro)', 'EUR (يورو)') },
          { id: 'USD', label: l('USD (US dollar)', 'USD (دولار أمريكي)') },
        ],
      },
      { id: 'budget', kind: 'text', label: l('Budget range', 'نطاق الميزانية'), hint: l('A rough range is enough, or "not sure yet".', 'يكفي نطاق تقريبي، أو «لست متأكدًا بعد».') },
      {
        id: 'siteLanguages',
        kind: 'checks',
        label: l('Languages the product must support', 'اللغات التي يجب أن يدعمها المنتج'),
        options: [
          { id: 'en', label: l('English', 'الإنجليزية') },
          { id: 'ar', label: l('Arabic (right to left)', 'العربية (من اليمين إلى اليسار)') },
          { id: 'fr', label: l('French', 'الفرنسية') },
          { id: 'other', label: l('Other', 'أخرى') },
        ],
      },
      {
        id: 'maintenance',
        kind: 'radio',
        label: l('Help after launch?', 'دعم بعد الإطلاق؟'),
        options: [
          { id: 'yes', label: l('Yes, ongoing maintenance', 'نعم، صيانة مستمرة') },
          { id: 'handover', label: l('No, hand it over to my team', 'لا، سلّمه لفريقي') },
          { id: 'unsure', label: l('Not sure yet', 'لست متأكدًا بعد') },
        ],
      },
      { id: 'notes', kind: 'textarea', label: l('Anything else I should know?', 'هل هناك ما يجب أن أعرفه أيضًا؟'), rows: 3 },
    ],
  },
];

export const briefUi = {
  menu: l('Start a project', 'ابدأ مشروعًا'),
  title: l('Project brief', 'ملف المشروع'),
  intro: l(
    'Tell me about your project. It takes about 5 minutes. Your answers stay in this browser until you choose to send them.',
    'أخبرني عن مشروعك. يستغرق ذلك نحو 5 دقائق. تبقى إجاباتك في هذا المتصفح حتى تختار إرسالها.',
  ),
  step: l('Step', 'الخطوة'),
  of: l('of', 'من'),
  review: l('Review and send', 'المراجعة والإرسال'),
  reviewIntro: l('Check your answers, then send the brief by email or download it as a file.', 'راجع إجاباتك، ثم أرسل الملف بالبريد أو حمّله كملف.'),
  next: l('Continue', 'متابعة'),
  back: l('Back', 'رجوع'),
  edit: l('Edit', 'تعديل'),
  required: l('Required', 'مطلوب'),
  optional: l('optional', 'اختياري'),
  errRequired: l('Please fill this in.', 'يرجى ملء هذا الحقل.'),
  errEmail: l('Please enter a valid email address.', 'يرجى إدخال بريد إلكتروني صحيح.'),
  errConsent: l('Please confirm to continue.', 'يرجى التأكيد للمتابعة.'),
  consent: l(
    'I agree that Fouad uses these details only to reply about this project.',
    'أوافق على أن يستخدم فؤاد هذه البيانات فقط للردّ بخصوص هذا المشروع.',
  ),
  send: l('Send by email', 'إرسال بالبريد'),
  sendHint: l('Opens your email app with the brief ready to send.', 'يفتح تطبيق البريد لديك والملف جاهز للإرسال.'),
  download: l('Download the brief', 'تحميل الملف'),
  copy: l('Copy', 'نسخ'),
  copied: l('Copied', 'تم النسخ'),
  print: l('Print or save as PDF', 'طباعة أو حفظ كـ PDF'),
  saved: l('Draft saved in this browser', 'المسودّة محفوظة في هذا المتصفح'),
  clear: l('Clear the form', 'مسح النموذج'),
  close: l('Close the brief', 'إغلاق الملف'),
  notAnswered: l('—', '—'),
  sentTitle: l('Your email app should be open', 'يُفترض أن يكون تطبيق البريد مفتوحًا'),
  sentText: l(
    'Press send there. If nothing opened, download the brief and email it to fouadbr2001@gmail.com.',
    'اضغط إرسال هناك. إن لم يُفتح شيء، حمّل الملف وأرسله إلى fouadbr2001@gmail.com.',
  ),
  ref: l('Reference', 'المرجع'),
  levelHeading: l('Security level', 'مستوى الأمان'),
  cta: l('Fill in the project brief', 'املأ ملف المشروع'),
  ctaHint: l('Have a project? Describe it in 5 minutes, including the security level it needs.', 'لديك مشروع؟ صِفه في 5 دقائق، بما في ذلك مستوى الأمان الذي يحتاجه.'),
} as const;
