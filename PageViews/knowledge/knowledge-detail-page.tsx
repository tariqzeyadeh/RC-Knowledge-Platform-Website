import { KnowledgeDetailView } from "./knowledge-detail-view"

export async function KnowledgeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <KnowledgeDetailView id={id} />
}
