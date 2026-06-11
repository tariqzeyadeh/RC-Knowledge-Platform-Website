import { notFound } from "next/navigation"
import { communities } from "@/data/fixtures/collaboration"
import { CommunityDetailView } from "./community-detail-view"

export function generateStaticParams() {
  return communities.map((c) => ({ id: c.id }))
}

export async function CommunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!communities.some((c) => c.id === id)) notFound()
  return <CommunityDetailView id={id} />
}
