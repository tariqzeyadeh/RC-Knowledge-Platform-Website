import type { Category, KnowledgeAsset } from "@/types/domain"

export const categories: Category[] = [
  { id: "projects", name: "Project & Initiative Management", count: 184, icon: "FolderKanban", topics: ["Project planning", "Risk management", "Project closure", "Initiative tracking"] },
  { id: "procurement", name: "Procurement & Contracts", count: 142, icon: "FileSignature", topics: ["Vendor evaluation", "Contract preparation", "Tenders", "Claims management"] },
  { id: "policies", name: "Policies & Procedure Guides", count: 209, icon: "ScrollText", topics: ["Procedure guides", "Internal policies", "Approved templates", "Regulatory bylaws"] },
  { id: "lessons", name: "Lessons Learned", count: 97, icon: "Lightbulb", topics: ["Project lessons", "Best practices", "Failure analysis", "Success stories"] },
  { id: "hr", name: "Human Resources & Development", count: 76, icon: "Users", topics: ["Training plans", "Performance management", "Knowledge transfer", "Professional development"] },
  { id: "digital", name: "Digital Transformation & Technology", count: 88, icon: "MonitorSmartphone", topics: ["Technical architecture", "Information security", "Data governance", "Integration"] },
  { id: "governance", name: "Governance & Compliance", count: 64, icon: "Scale", topics: ["Regulatory compliance", "Risk management", "Internal audit", "Cybersecurity"] },
  { id: "strategy", name: "Planning & Strategy", count: 53, icon: "Target", topics: ["Strategic plans", "Performance indicators", "Organizational excellence", "Change management"] },
]

export const confidentialityLevels: { id: string; name: string; color: string }[] = [
  { id: "public", name: "Public", color: "emerald" },
  { id: "internal", name: "Internal", color: "sky" },
  { id: "confidential", name: "Confidential", color: "amber" },
  { id: "strict", name: "Strictly confidential", color: "red" },
]

export const knowledgeTypes = [
  "Procedure guide",
  "Lesson learned",
  "Template / Form",
  "Policy",
  "Expertise report",
  "Meeting minutes",
  "Study / Research",
]

export const assets: KnowledgeAsset[] = [
  {
    id: "KA-1042", title: "Vendor Evaluation & Bid Selection Guide", type: "Procedure guide", category: "procurement",
    department: "Procurement Department", author: "Abdulaziz Khalid Al-Otaibi", confidentiality: "internal", version: "1.3",
    updated: "2026-05-18", nextReview: "2026-11-18", views: 2412, rating: 4.6, status: "published",
    keywords: ["Vendor evaluation", "Tenders", "Award criteria"], fileType: "PDF",
    summary: "A procedure guide outlining technical and financial vendor evaluation methodology and bid weighting criteria in government tenders, with ready-made templates for evaluation minutes.",
  },
  {
    id: "KA-1038", title: "Lesson learned: Delay in digital archiving transformation project delivery", type: "Lesson learned", category: "lessons",
    department: "Digital Transformation Department", author: "Noura Saad Al-Dosari", confidentiality: "internal", version: "1.0",
    updated: "2026-05-12", nextReview: "2027-05-12", views: 1187, rating: 4.8, status: "published",
    keywords: ["Risk management", "Timeline", "Vendors"], fileType: "DOCX",
    summary: "Analysis of causes behind the electronic archiving project delay, corrective actions taken, and recommendations to avoid similar delays in comparable projects.",
  },
  {
    id: "KA-1051", title: "Approved Project Management Plan (PMP) Template", type: "Template / Form", category: "projects",
    department: "Project Management Office", author: "Fahad Mohammed Al-Qahtani", confidentiality: "public", version: "2.1",
    updated: "2026-04-30", nextReview: "2026-10-30", views: 3380, rating: 4.7, status: "published",
    keywords: ["Project planning", "Scope", "Timeline", "Risks"], fileType: "DOCX",
    summary: "A unified project management plan template covering scope, timeline, resources, risks, and communications, aligned with the office methodology for initiative management.",
  },
  {
    id: "KA-1029", title: "Data Classification & Protection Policy (NDMO)", type: "Policy", category: "governance",
    department: "Data Governance Department", author: "Reem Faisal Al-Shammari", confidentiality: "confidential", version: "1.2",
    updated: "2026-05-05", nextReview: "2026-08-05", views: 642, rating: 4.5, status: "published",
    keywords: ["Data governance", "Classification", "NDMO", "Privacy"], fileType: "PDF",
    summary: "A policy defining data classification levels and handling controls per National Data Management Office (NDMO) requirements and NCA cybersecurity controls.",
  },
  {
    id: "KA-1063", title: "Guide for Preparing Committee & Official Meeting Minutes", type: "Procedure guide", category: "policies",
    department: "Corporate Communications Department", author: "Sarah Abdullah Al-Mutairi", confidentiality: "public", version: "1.1",
    updated: "2026-03-22", nextReview: "2026-09-22", views: 1955, rating: 4.4, status: "published",
    keywords: ["Minutes", "Committees", "Documentation", "Decisions"], fileType: "PDF",
    summary: "A practical guide for writing committee minutes, documenting decisions and action items, and tracking follow-up, with a ready template and applied example.",
  },
  {
    id: "KA-1070", title: "Expertise report: Strategic initiative governance", type: "Expertise report", category: "strategy",
    department: "Strategic Planning Department", author: "Majed Sultan Al-Harbi", confidentiality: "internal", version: "1.0",
    updated: "2026-05-20", nextReview: "2027-05-20", views: 514, rating: 4.9, status: "published",
    keywords: ["Strategy", "Initiative governance", "Performance indicators"], fileType: "PDF",
    summary: "A report summarizing the office experience in governing strategic initiatives and linking them to national targets, with a performance tracking model.",
  },
  {
    id: "KA-1077", title: "Lesson learned documentation template", type: "Template / Form", category: "lessons",
    department: "Knowledge Management", author: "Knowledge Management", confidentiality: "public", version: "1.0",
    updated: "2026-02-15", nextReview: "2026-08-15", views: 2740, rating: 4.6, status: "published",
    keywords: ["Lesson learned", "Context", "Recommendation"], fileType: "DOCX",
    summary: "A unified template for documenting lessons learned including: context, problem, action, outcome, recommendation, and reusability.",
  },
  {
    id: "KA-1085", title: "Training plan & knowledge transfer guide", type: "Procedure guide", category: "hr",
    department: "Human Resources Department", author: "Hind Abdulrahman Al-Zahrani", confidentiality: "internal", version: "1.0",
    updated: "2026-04-10", nextReview: "2026-10-10", views: 803, rating: 4.3, status: "review",
    keywords: ["Training", "Knowledge transfer", "Capability development"], fileType: "PDF",
    summary: "A framework for planning training programs and transferring knowledge from experts, with mechanisms to measure training impact and issue certificates.",
  },
]

export const versionHistory = [
  { v: "1.3", date: "2026-05-18", by: "Abdulaziz Al-Otaibi", note: "Updated financial weighting criteria and minutes templates." },
  { v: "1.2", date: "2026-01-12", by: "Abdulaziz Al-Otaibi", note: "Added prior vendor performance evaluation section." },
  { v: "1.1", date: "2025-08-04", by: "Procurement Department", note: "Aligned with the new tendering system." },
  { v: "1.0", date: "2025-03-20", by: "Procurement Department", note: "First approved release." },
]
