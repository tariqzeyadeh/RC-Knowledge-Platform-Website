import { TransferDetailView } from "./transfer-detail-view"

export async function TransferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <TransferDetailView id={id} />
}
