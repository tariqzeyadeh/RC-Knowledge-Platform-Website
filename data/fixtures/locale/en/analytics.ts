export const kpis = [
  { label: "Published knowledge assets", value: "913", trend: "+8.4%", up: true, icon: "Library" },
  { label: "Successful search rate", value: "92%", trend: "+3.1%", up: true, icon: "Search" },
  { label: "Active users", value: "1,247", trend: "+12%", up: true, icon: "Users" },
  { label: "Pending review", value: "37", trend: "-5", up: false, icon: "ClipboardCheck" },
]

export const monthlyActivity = [
  { month: "Jan", published: 42, searches: 1820, contributions: 58 },
  { month: "Feb", published: 51, searches: 2010, contributions: 64 },
  { month: "Mar", published: 47, searches: 1975, contributions: 60 },
  { month: "Apr", published: 63, searches: 2340, contributions: 79 },
  { month: "May", published: 58, searches: 2510, contributions: 72 },
  { month: "Jun", published: 74, searches: 2890, contributions: 91 },
]

export const departmentContribution = [
  { name: "Projects", value: 184 },
  { name: "Procurement", value: 142 },
  { name: "Policies", value: 209 },
  { name: "Technology", value: 88 },
  { name: "Human Resources", value: 76 },
  { name: "Governance", value: 64 },
]

export const contentHealth = [
  { name: "Up to date", value: 642, color: "var(--chart-1)" },
  { name: "Needs review", value: 187, color: "var(--chart-2)" },
  { name: "Outdated", value: 84, color: "var(--chart-3)" },
]

export const topSearches = [
  { term: "Contract management", count: 412, success: 86 },
  { term: "Project plan template", count: 388, success: 95 },
  { term: "Committee minutes", count: 341, success: 91 },
  { term: "Vendor evaluation", count: 297, success: 78 },
  { term: "Data governance", count: 254, success: 88 },
  { term: "Lessons learned", count: 231, success: 82 },
  { term: "Project closure", count: 198, success: 90 },
]

export const topContributors = [
  { name: "Abdulaziz Al-Otaibi", contributions: 47, assets: 12, department: "Procurement" },
  { name: "Fahad Al-Qahtani", contributions: 41, assets: 15, department: "Project Management" },
  { name: "Sarah Al-Mutairi", contributions: 38, assets: 11, department: "Corporate Communications" },
  { name: "Noura Al-Dosari", contributions: 34, assets: 9, department: "Digital Transformation" },
  { name: "Reem Al-Shammari", contributions: 29, assets: 8, department: "Data Governance" },
  { name: "Majed Al-Harbi", contributions: 26, assets: 7, department: "Strategic Planning" },
]

export const topCommunities = [
  { name: "Initiative Management Community", members: 184, posts: 612, assets: 8 },
  { name: "Digital Transformation Practitioners", members: 142, posts: 524, assets: 5 },
  { name: "Procurement & Contracts Experts", members: 96, posts: 388, assets: 6 },
  { name: "Organizational Excellence & Quality", members: 73, posts: 297, assets: 3 },
  { name: "Governance & Compliance", members: 58, posts: 211, assets: 2 },
]

export const trainingPrograms = [
  { id: "T-01", title: "Platform basics for end users", audience: "General user", duration: "2 hours", format: "Video + PDF guide", lessons: 6, level: "Introductory" },
  { id: "T-02", title: "Review & approval workflow", audience: "Reviewer & approver", duration: "3 hours", format: "Live session + assessment", lessons: 8, level: "Intermediate" },
  { id: "T-03", title: "System administration & permissions", audience: "System administrator", duration: "4 hours", format: "Hands-on workshop", lessons: 10, level: "Advanced" },
  { id: "T-04", title: "Effective lesson learned documentation", audience: "Content contributor", duration: "1.5 hours", format: "Video + template", lessons: 5, level: "Introductory" },
]

export const complianceMatrix = [
  { standard: "ISO 30401:2018", scope: "Knowledge management system", coverage: 96, status: "Compliant" },
  { standard: "NDMO", scope: "Data governance & management", coverage: 92, status: "Compliant" },
  { standard: "NCA – ECC", scope: "Essential cybersecurity controls", coverage: 94, status: "Compliant" },
  { standard: "DGA", scope: "Digital Government Authority", coverage: 88, status: "In progress" },
  { standard: "EFQM 2025", scope: "European Excellence Model", coverage: 90, status: "Compliant" },
  { standard: "National Excellence Model", scope: "Government excellence criteria", coverage: 91, status: "Compliant" },
]

export const securityControls = [
  { name: "Data encryption in transit (TLS)", value: "Enabled" },
  { name: "Data encryption at rest (AES-256)", value: "Enabled" },
  { name: "On-Premises hosting", value: "Office data center" },
  { name: "Recovery time objective (RTO)", value: "≤ 4 hours" },
  { name: "Recovery point objective (RPO)", value: "≤ 24 hours" },
  { name: "Backup", value: "Daily / Weekly / Monthly" },
  { name: "SIEM integration", value: "Enabled" },
  { name: "Single sign-on (SSO)", value: "Active Directory" },
]

export const searchSuggestions = [
  "Contract management",
  "Project plan template",
  "Committee minutes",
  "Vendor evaluation",
  "Data governance",
  "Lesson learned",
]
