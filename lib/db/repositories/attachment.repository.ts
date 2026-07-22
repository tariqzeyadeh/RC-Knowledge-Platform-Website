import { and, desc, eq } from "drizzle-orm"
import { getDb } from "@/lib/db"
import { attachments } from "@/lib/db/schema"

export type AttachmentRecord = {
  id: string
  entityType: string
  entityId: string
  fileName: string
  mimeType: string
  fileTypeId: string | null
  sizeBytes: number
  uploadedBy: string
  createdAt: string
}

const EXT_TO_FILE_TYPE: Record<string, string> = {
  pdf: "pdf",
  doc: "doc",
  docx: "docx",
  xls: "xls",
  xlsx: "xlsx",
  ppt: "ppt",
  pptx: "pptx",
  png: "pdf",
  jpg: "pdf",
  jpeg: "pdf",
}

export function resolveFileTypeId(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "pdf"
  return EXT_TO_FILE_TYPE[ext] ?? "pdf"
}

export async function createAttachment(data: {
  id: string
  entityType: string
  entityId: string
  fileName: string
  mimeType: string
  fileTypeId?: string
  sizeBytes: number
  contentBase64: string
  uploadedBy: string
}) {
  const db = getDb()
  const createdAt = new Date().toISOString()
  await db.insert(attachments).values({
    ...data,
    fileTypeId: data.fileTypeId ?? resolveFileTypeId(data.fileName),
    createdAt,
  })
  return getAttachment(data.id)
}

export async function getAttachment(id: string) {
  const db = getDb()
  const row = await db.select().from(attachments).where(eq(attachments.id, id)).get()
  if (!row) return null
  return {
    id: row.id,
    entityType: row.entityType,
    entityId: row.entityId,
    fileName: row.fileName,
    mimeType: row.mimeType,
    fileTypeId: row.fileTypeId,
    sizeBytes: row.sizeBytes,
    uploadedBy: row.uploadedBy,
    createdAt: row.createdAt,
  } satisfies AttachmentRecord
}

export async function getAttachmentWithContent(id: string) {
  const db = getDb()
  return db.select().from(attachments).where(eq(attachments.id, id)).get()
}

export async function listAttachments(entityType: string, entityId: string) {
  const db = getDb()
  const rows = await db
    .select()
    .from(attachments)
    .where(and(eq(attachments.entityType, entityType), eq(attachments.entityId, entityId)))
    .orderBy(desc(attachments.createdAt))

  return rows.map(
    (row) =>
      ({
        id: row.id,
        entityType: row.entityType,
        entityId: row.entityId,
        fileName: row.fileName,
        mimeType: row.mimeType,
        fileTypeId: row.fileTypeId,
        sizeBytes: row.sizeBytes,
        uploadedBy: row.uploadedBy,
        createdAt: row.createdAt,
      }) satisfies AttachmentRecord,
  )
}

export async function linkAttachments(entityType: string, entityId: string, attachmentIds: string[]) {
  const db = getDb()
  for (const attachmentId of attachmentIds) {
    await db
      .update(attachments)
      .set({ entityType, entityId })
      .where(eq(attachments.id, attachmentId))
  }
}
