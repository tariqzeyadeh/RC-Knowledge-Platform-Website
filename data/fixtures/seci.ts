import type { SeciLayer } from "@/types/domain"

export const seciLayers: SeciLayer[] = [
  {
    id: "socialization",
    title: "المشاركة والتفاعل",
    seci: "Socialization – المشاركة",
    knowledgeType: "المعرفة الضمنية",
    color: "var(--chart-1)",
    desc: "تبادل المعرفة الضمنية بين الأفراد والأقسام عبر قنوات رسمية وغير رسمية قبل التوثيق.",
  },
  {
    id: "externalization",
    title: "الاستخراج والتوثيق",
    seci: "Externalization – الاستخراج",
    knowledgeType: "تحويل الضمنية إلى صريحة",
    color: "var(--chart-2)",
    desc: "تحويل الخبرات الضمنية إلى محتوى موثّق ومعتمد داخل مستودعات المعرفة.",
  },
  {
    id: "combination",
    title: "التنظيم والدمج",
    seci: "Combination – الدمج والتحليل",
    knowledgeType: "المعرفة الصريحة",
    color: "var(--chart-3)",
    desc: "تصنيف ودمج وتحليل المعرفة الصريحة لتسهيل الوصول إليها واستخدامها.",
  },
  {
    id: "internalization",
    title: "الاستخدام والاستيعاب",
    seci: "Internalization – الاستيعاب",
    knowledgeType: "تحويل الصريحة إلى خبرة",
    color: "var(--chart-4)",
    desc: "تحويل المعرفة المتاحة إلى ممارسة يومية وقيمة عملية في اتخاذ القرار.",
  },
  {
    id: "governance",
    title: "الحوكمة والتمكين",
    seci: "طبقة حوكمة – تدعم جميع مراحل SECI",
    knowledgeType: "طبقة داعمة للدورة",
    color: "var(--chart-5)",
    desc: "ضبط دورة المعرفة بالكامل وفق متطلبات أمنية وتنظيمية وطنية.",
  },
]

