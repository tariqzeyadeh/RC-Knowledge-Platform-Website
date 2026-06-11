import { notFound } from "next/navigation"
import { assets } from "@/data/fixtures/knowledge"
import { KnowledgeDetailView } from "./knowledge-detail-view"

export function generateStaticParams() {
  return assets.map((a) => ({ id: a.id }))
}

export async function KnowledgeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!assets.some((a) => a.id === id)) notFound()
  return <KnowledgeDetailView id={id} />
}
