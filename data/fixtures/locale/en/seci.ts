import type { SeciLayer } from "@/types/domain"

export const seciLayers: SeciLayer[] = [
  {
    id: "socialization",
    title: "Sharing & Interaction",
    seci: "Socialization – المشاركة",
    knowledgeType: "Tacit knowledge",
    color: "var(--chart-1)",
    desc: "Exchange of tacit knowledge among individuals and departments through formal and informal channels before documentation.",
  },
  {
    id: "externalization",
    title: "Extraction & Documentation",
    seci: "Externalization – الاستخراج",
    knowledgeType: "Tacit to explicit conversion",
    color: "var(--chart-2)",
    desc: "Converting tacit expertise into documented, approved content within knowledge repositories.",
  },
  {
    id: "combination",
    title: "Organization & Integration",
    seci: "Combination – الدمج والتحليل",
    knowledgeType: "Explicit knowledge",
    color: "var(--chart-3)",
    desc: "Classifying, integrating, and analyzing explicit knowledge to improve access and use.",
  },
  {
    id: "internalization",
    title: "Application & Absorption",
    seci: "Internalization – الاستيعاب",
    knowledgeType: "Explicit to experiential conversion",
    color: "var(--chart-4)",
    desc: "Turning available knowledge into daily practice and practical value in decision-making.",
  },
  {
    id: "governance",
    title: "Governance & Enablement",
    seci: "طبقة حوكمة – تدعم جميع مراحل SECI",
    knowledgeType: "Cycle support layer",
    color: "var(--chart-5)",
    desc: "Governing the full knowledge cycle per security, regulatory, and national requirements.",
  },
]
