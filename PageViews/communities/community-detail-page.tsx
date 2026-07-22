import { CommunityDetailView } from "./community-detail-view"

export async function CommunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <CommunityDetailView id={id} />
}
