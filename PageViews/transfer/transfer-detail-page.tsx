import { notFound } from "next/navigation"
import { transferSessions } from "@/data/fixtures/collaboration"
import { TransferDetailView } from "./transfer-detail-view"

export function generateStaticParams() {
  return transferSessions.map((s) => ({ id: s.id }))
}

export async function TransferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!transferSessions.some((s) => s.id === id)) notFound()
  return <TransferDetailView id={id} />
}
