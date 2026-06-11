export const kpis = [
  { label: "أصول معرفية منشورة", value: "913", trend: "+8.4%", up: true, icon: "Library" },
  { label: "معدل البحث الناجح", value: "92%", trend: "+3.1%", up: true, icon: "Search" },
  { label: "مستخدمون نشطون", value: "1,247", trend: "+12%", up: true, icon: "Users" },
  { label: "بانتظار المراجعة", value: "37", trend: "-5", up: false, icon: "ClipboardCheck" },
]

export const monthlyActivity = [
  { month: "محرم", published: 42, searches: 1820, contributions: 58 },
  { month: "صفر", published: 51, searches: 2010, contributions: 64 },
  { month: "ربيع 1", published: 47, searches: 1975, contributions: 60 },
  { month: "ربيع 2", published: 63, searches: 2340, contributions: 79 },
  { month: "جمادى 1", published: 58, searches: 2510, contributions: 72 },
  { month: "جمادى 2", published: 74, searches: 2890, contributions: 91 },
]

export const departmentContribution = [
  { name: "المشاريع", value: 184 },
  { name: "المشتريات", value: 142 },
  { name: "السياسات", value: 209 },
  { name: "التقنية", value: 88 },
  { name: "الموارد البشرية", value: 76 },
  { name: "الحوكمة", value: 64 },
]

export const contentHealth = [
  { name: "محدّث", value: 642, color: "var(--chart-1)" },
  { name: "يحتاج مراجعة", value: 187, color: "var(--chart-2)" },
  { name: "غير محدّث", value: 84, color: "var(--chart-3)" },
]

export const topSearches = [
  { term: "إدارة العقود", count: 412, success: 86 },
  { term: "قالب خطة مشروع", count: 388, success: 95 },
  { term: "محضر لجنة", count: 341, success: 91 },
  { term: "تقييم الموردين", count: 297, success: 78 },
  { term: "حوكمة البيانات", count: 254, success: 88 },
  { term: "دروس مستفادة", count: 231, success: 82 },
  { term: "إغلاق مشروع", count: 198, success: 90 },
]

export const topContributors = [
  { name: "عبدالعزيز العتيبي", contributions: 47, assets: 12, department: "المشتريات" },
  { name: "فهد القحطاني", contributions: 41, assets: 15, department: "إدارة المشاريع" },
  { name: "سارة المطيري", contributions: 38, assets: 11, department: "الاتصال المؤسسي" },
  { name: "نورة الدوسري", contributions: 34, assets: 9, department: "التحول الرقمي" },
  { name: "ريم الشمري", contributions: 29, assets: 8, department: "حوكمة البيانات" },
  { name: "ماجد الحربي", contributions: 26, assets: 7, department: "التخطيط الاستراتيجي" },
]

export const topCommunities = [
  { name: "مجتمع إدارة المبادرات", members: 184, posts: 612, assets: 8 },
  { name: "ممارسو التحول الرقمي", members: 142, posts: 524, assets: 5 },
  { name: "خبراء المشتريات والعقود", members: 96, posts: 388, assets: 6 },
  { name: "التميز المؤسسي والجودة", members: 73, posts: 297, assets: 3 },
  { name: "حوكمة وامتثال", members: 58, posts: 211, assets: 2 },
]

/* ─────────────── برامج التدريب ─────────────── */
export const trainingPrograms = [
  { id: "T-01", title: "أساسيات استخدام المنصة للمستخدمين", audience: "المستخدم العادي", duration: "ساعتان", format: "فيديو + دليل PDF", lessons: 6, level: "تمهيدي" },
  { id: "T-02", title: "سير عمل المراجعة والاعتماد", audience: "المراجع والمعتمد", duration: "3 ساعات", format: "جلسة مباشرة + تقييم", lessons: 8, level: "متوسط" },
  { id: "T-03", title: "إدارة النظام والصلاحيات", audience: "مدير النظام", duration: "4 ساعات", format: "ورشة عملية", lessons: 10, level: "متقدم" },
  { id: "T-04", title: "توثيق الدروس المستفادة بفعالية", audience: "مساهم المحتوى", duration: "ساعة ونصف", format: "فيديو + قالب", lessons: 5, level: "تمهيدي" },
]

/* ─────────────── الامتثال والحوكمة ─────────────── */
export const complianceMatrix = [
  { standard: "ISO 30401:2018", scope: "نظام إدارة المعرفة", coverage: 96, status: "متوافق" },
  { standard: "NDMO", scope: "حوكمة وإدارة البيانات", coverage: 92, status: "متوافق" },
  { standard: "NCA – ECC", scope: "الضوابط الأساسية للأمن السيبراني", coverage: 94, status: "متوافق" },
  { standard: "DGA", scope: "هيئة الحكومة الرقمية", coverage: 88, status: "قيد الاستكمال" },
  { standard: "EFQM 2025", scope: "نموذج التميز الأوروبي", coverage: 90, status: "متوافق" },
  { standard: "النموذج الوطني للتميز", scope: "معايير التميز الحكومي", coverage: 91, status: "متوافق" },
]

export const securityControls = [
  { name: "تشفير البيانات أثناء النقل (TLS)", value: "مفعّل" },
  { name: "تشفير البيانات أثناء التخزين (AES-256)", value: "مفعّل" },
  { name: "الاستضافة On-Premises", value: "مركز بيانات المكتب" },
  { name: "هدف زمن الاستعادة (RTO)", value: "≤ 4 ساعات" },
  { name: "هدف نقطة الاستعادة (RPO)", value: "≤ 24 ساعة" },
  { name: "النسخ الاحتياطي", value: "يومي / أسبوعي / شهري" },
  { name: "تكامل SIEM", value: "مفعّل" },
  { name: "الدخول الموحد SSO", value: "Active Directory" },
]

export const searchSuggestions = [
  "إدارة العقود",
  "قالب خطة مشروع",
  "محضر لجنة",
  "تقييم الموردين",
  "حوكمة البيانات",
  "درس مستفاد",
]
