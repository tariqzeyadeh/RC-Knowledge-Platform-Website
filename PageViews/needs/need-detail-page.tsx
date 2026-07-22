import { NeedDetailView } from "./need-detail-view"

export async function NeedDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <NeedDetailView id={id} />
}
