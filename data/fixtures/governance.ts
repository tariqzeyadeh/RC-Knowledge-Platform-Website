import type { AuditEntry, Role } from "@/types/domain"

export const auditLog: AuditEntry[] = [
  { id: "A-9001", user: "عبدالعزيز العتيبي", action: "اعتماد محتوى", target: "KA-1051 قالب خطة إدارة مشروع", time: "2026-05-22 10:42", ip: "10.12.4.21", result: "نجاح" },
  { id: "A-9002", user: "ريم الشمري", action: "تعديل سياسة", target: "KA-1029 سياسة تصنيف البيانات", time: "2026-05-22 09:15", ip: "10.12.4.55", result: "نجاح" },
  { id: "A-9003", user: "مستخدم خارجي", action: "محاولة وصول مقيد", target: "KA-1070 تقرير خبرة", time: "2026-05-22 08:50", ip: "10.12.7.103", result: "رفض" },
  { id: "A-9004", user: "نورة الدوسري", action: "رفع محتوى", target: "KA-1038 درس مستفاد", time: "2026-05-21 16:30", ip: "10.12.4.32", result: "نجاح" },
  { id: "A-9005", user: "فهد القحطاني", action: "تسجيل دخول (SSO)", target: "بوابة المنصة", time: "2026-05-21 08:02", ip: "10.12.4.18", result: "نجاح" },
  { id: "A-9006", user: "سارة المطيري", action: "طلب وصول", target: "KA-1029 سياسة (سري)", time: "2026-05-20 14:11", ip: "10.12.4.77", result: "نجاح" },
  { id: "A-9007", user: "هند الزهراني", action: "تحديث إصدار", target: "KA-1085 دليل التدريب", time: "2026-05-20 11:48", ip: "10.12.4.61", result: "نجاح" },
]

import type { Role } from "@/types/domain"

export const roles: Role[] = [
  { id: "seeker", name: "باحث عن المعرفة", users: 1240, desc: "تصفح وبحث واستخدام المحتوى المعتمد.", permissions: { create: false, review: false, approve: false, publish: false, admin: false } },
  { id: "contributor", name: "مساهم محتوى", users: 386, desc: "إنشاء ورفع المحتوى وإرساله للمراجعة.", permissions: { create: true, review: false, approve: false, publish: false, admin: false } },
  { id: "reviewer", name: "مراجع", users: 64, desc: "مراجعة المحتوى والتعليق والإرجاع للتعديل.", permissions: { create: true, review: true, approve: false, publish: false, admin: false } },
  { id: "approver", name: "معتمد", users: 28, desc: "اعتماد المحتوى ونشره بعد المراجعة.", permissions: { create: true, review: true, approve: true, publish: true, admin: false } },
  { id: "km", name: "مدير معرفة", users: 9, desc: "إدارة التصنيفات والاحتياجات والمؤشرات.", permissions: { create: true, review: true, approve: true, publish: true, admin: false } },
  { id: "admin", name: "مشرف منصة", users: 5, desc: "إدارة المستخدمين والصلاحيات والإعدادات.", permissions: { create: true, review: true, approve: true, publish: true, admin: true } },
]

