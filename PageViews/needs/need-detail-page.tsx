import { notFound } from "next/navigation"
import { needs } from "@/data/fixtures/collaboration"
import { NeedDetailView } from "./need-detail-view"

export function generateStaticParams() {
  return needs.map((n) => ({ id: n.id }))
}

export async function NeedDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!needs.some((n) => n.id === id)) notFound()
  return <NeedDetailView id={id} />
}
