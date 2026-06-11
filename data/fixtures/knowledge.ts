import type { Category, KnowledgeAsset } from "@/types/domain"

export const categories: Category[] = [
  { id: "projects", name: "إدارة المشاريع والمبادرات", count: 184, icon: "FolderKanban", topics: ["تخطيط المشاريع", "إدارة المخاطر", "إغلاق المشاريع", "متابعة المبادرات"] },
  { id: "procurement", name: "المشتريات والعقود", count: 142, icon: "FileSignature", topics: ["تقييم الموردين", "إعداد العقود", "المنافسات", "إدارة المطالبات"] },
  { id: "policies", name: "السياسات والأدلة الإجرائية", count: 209, icon: "ScrollText", topics: ["أدلة الإجراءات", "السياسات الداخلية", "نماذج معتمدة", "اللوائح التنظيمية"] },
  { id: "lessons", name: "الدروس المستفادة", count: 97, icon: "Lightbulb", topics: ["دروس المشاريع", "أفضل الممارسات", "تحليل الإخفاقات", "قصص النجاح"] },
  { id: "hr", name: "الموارد البشرية والتطوير", count: 76, icon: "Users", topics: ["خطط التدريب", "إدارة الأداء", "نقل المعرفة", "التطوير المهني"] },
  { id: "digital", name: "التحول الرقمي والتقنية", count: 88, icon: "MonitorSmartphone", topics: ["البنية التقنية", "أمن المعلومات", "حوكمة البيانات", "التكامل"] },
  { id: "governance", name: "الحوكمة والامتثال", count: 64, icon: "Scale", topics: ["الامتثال التنظيمي", "إدارة المخاطر", "التدقيق الداخلي", "الأمن السيبراني"] },
  { id: "strategy", name: "التخطيط والاستراتيجية", count: 53, icon: "Target", topics: ["الخطط الاستراتيجية", "مؤشرات الأداء", "التميز المؤسسي", "إدارة التغيير"] },
]

export const confidentialityLevels: { id: string; name: string; color: string }[] = [
  { id: "public", name: "عام", color: "emerald" },
  { id: "internal", name: "داخلي", color: "sky" },
  { id: "confidential", name: "سري", color: "amber" },
  { id: "strict", name: "سري للغاية", color: "red" },
]

export const knowledgeTypes = ["دليل إجرائي", "درس مستفاد", "قالب / نموذج", "سياسة", "تقرير خبرة", "محضر اجتماع", "دراسة / بحث"]

/* ─────────────── الأصول المعرفية ─────────────── */
export type KnowledgeAsset = {
  id: string
  title: string
  type: string
  category: string
  department: string
  author: string
  confidentiality: "public" | "internal" | "confidential" | "strict"
  version: string
  updated: string
  nextReview: string
  views: number
  rating: number
  status: "published" | "review" | "draft"
  keywords: string[]
  summary: string
  fileType: string
}

export const assets: KnowledgeAsset[] = [
  {
    id: "KA-1042", title: "دليل تقييم الموردين واختيار العروض", type: "دليل إجرائي", category: "procurement",
    department: "إدارة المشتريات", author: "عبدالعزيز خالد العتيبي", confidentiality: "internal", version: "1.3",
    updated: "2026-05-18", nextReview: "2026-11-18", views: 2412, rating: 4.6, status: "published",
    keywords: ["تقييم الموردين", "المنافسات", "معايير الترسية"], fileType: "PDF",
    summary: "دليل إجرائي يوضح منهجية تقييم الموردين الفنية والمالية ومعايير ترجيح العروض في المنافسات الحكومية، مع نماذج جاهزة لمحاضر التقييم.",
  },
  {
    id: "KA-1038", title: "درس مستفاد: تأخر تسليم مشروع التحول الرقمي للأرشفة", type: "درس مستفاد", category: "lessons",
    department: "إدارة التحول الرقمي", author: "نورة سعد الدوسري", confidentiality: "internal", version: "1.0",
    updated: "2026-05-12", nextReview: "2027-05-12", views: 1187, rating: 4.8, status: "published",
    keywords: ["إدارة المخاطر", "الجدول الزمني", "الموردين"], fileType: "DOCX",
    summary: "تحليل لأسباب تأخر مشروع الأرشفة الإلكترونية والإجراءات التصحيحية المتخذة وتوصيات لتفادي تكرار التأخير في المشاريع المماثلة.",
  },
  {
    id: "KA-1051", title: "قالب خطة إدارة مشروع (PMP) معتمد", type: "قالب / نموذج", category: "projects",
    department: "مكتب إدارة المشاريع", author: "فهد محمد القحطاني", confidentiality: "public", version: "2.1",
    updated: "2026-04-30", nextReview: "2026-10-30", views: 3380, rating: 4.7, status: "published",
    keywords: ["تخطيط المشاريع", "النطاق", "الجدول الزمني", "المخاطر"], fileType: "DOCX",
    summary: "قالب موحد لخطة إدارة المشروع يغطي النطاق والجدول الزمني والموارد والمخاطر والاتصالات، متوافق مع منهجية المكتب لإدارة المبادرات.",
  },
  {
    id: "KA-1029", title: "سياسة تصنيف وحماية البيانات (NDMO)", type: "سياسة", category: "governance",
    department: "إدارة حوكمة البيانات", author: "ريم فيصل الشمري", confidentiality: "confidential", version: "1.2",
    updated: "2026-05-05", nextReview: "2026-08-05", views: 642, rating: 4.5, status: "published",
    keywords: ["حوكمة البيانات", "التصنيف", "NDMO", "الخصوصية"], fileType: "PDF",
    summary: "سياسة تحدد مستويات تصنيف البيانات وضوابط التعامل معها وفق متطلبات مكتب إدارة البيانات الوطنية NDMO وضوابط الأمن السيبراني NCA.",
  },
  {
    id: "KA-1063", title: "دليل إعداد محاضر اللجان والاجتماعات الرسمية", type: "دليل إجرائي", category: "policies",
    department: "إدارة الاتصال المؤسسي", author: "سارة عبدالله المطيري", confidentiality: "public", version: "1.1",
    updated: "2026-03-22", nextReview: "2026-09-22", views: 1955, rating: 4.4, status: "published",
    keywords: ["محاضر", "اللجان", "التوثيق", "القرارات"], fileType: "PDF",
    summary: "دليل عملي لكتابة محاضر اللجان وتوثيق القرارات والمهام وتتبع تنفيذها، مع قالب جاهز ومثال تطبيقي.",
  },
  {
    id: "KA-1070", title: "تقرير خبرة: حوكمة المبادرات الاستراتيجية", type: "تقرير خبرة", category: "strategy",
    department: "إدارة التخطيط الاستراتيجي", author: "ماجد سلطان الحربي", confidentiality: "internal", version: "1.0",
    updated: "2026-05-20", nextReview: "2027-05-20", views: 514, rating: 4.9, status: "published",
    keywords: ["الاستراتيجية", "حوكمة المبادرات", "مؤشرات الأداء"], fileType: "PDF",
    summary: "تقرير يلخص خبرة المكتب في حوكمة المبادرات الاستراتيجية وربطها بالمستهدفات الوطنية مع نموذج لمتابعة الأداء.",
  },
  {
    id: "KA-1077", title: "نموذج توثيق درس مستفاد", type: "قالب / نموذج", category: "lessons",
    department: "إدارة المعرفة", author: "إدارة المعرفة", confidentiality: "public", version: "1.0",
    updated: "2026-02-15", nextReview: "2026-08-15", views: 2740, rating: 4.6, status: "published",
    keywords: ["درس مستفاد", "السياق", "التوصية"], fileType: "DOCX",
    summary: "نموذج موحد لتوثيق الدروس المستفادة يتضمن: السياق، المشكلة، الإجراء، النتيجة، التوصية، وقابلية إعادة الاستخدام.",
  },
  {
    id: "KA-1085", title: "دليل خطة التدريب ونقل المعرفة", type: "دليل إجرائي", category: "hr",
    department: "إدارة الموارد البشرية", author: "هند عبدالرحمن الزهراني", confidentiality: "internal", version: "1.0",
    updated: "2026-04-10", nextReview: "2026-10-10", views: 803, rating: 4.3, status: "review",
    keywords: ["التدريب", "نقل المعرفة", "تطوير القدرات"], fileType: "PDF",
    summary: "إطار لتخطيط برامج التدريب ونقل المعرفة من الخبراء، مع آلية قياس الأثر التدريبي ومنح الشهادات.",
  },
]

export const versionHistory = [
  { v: "1.3", date: "2026-05-18", by: "عبدالعزيز العتيبي", note: "تحديث معايير الترجيح المالي ونماذج المحاضر." },
  { v: "1.2", date: "2026-01-12", by: "عبدالعزيز العتيبي", note: "إضافة قسم تقييم الأداء السابق للموردين." },
  { v: "1.1", date: "2025-08-04", by: "إدارة المشتريات", note: "مواءمة مع نظام المنافسات الجديد." },
  { v: "1.0", date: "2025-03-20", by: "إدارة المشتريات", note: "الإصدار الأول المعتمد." },
]

