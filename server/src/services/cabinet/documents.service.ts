import { and, desc, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { userDocuments, type UserDocument } from '../../db/schema.js';
import type { DocumentDto, CreateDocumentRequest, UpdateDocumentRequest } from '@freestyle/shared';

function toDto(d: UserDocument): DocumentDto {
  return {
    id: d.id,
    type: d.type,
    name: d.name,
    number: d.number,
    issuedAt: d.issuedAt?.toISOString() ?? null,
    expiresAt: d.expiresAt?.toISOString() ?? null,
    countryCode: d.countryCode,
    fileUrl: d.fileUrl,
    meta: d.meta,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
  };
}

export const documentsService = {
  async list(userId: string): Promise<DocumentDto[]> {
    const rows = await db.query.userDocuments.findMany({
      where: eq(userDocuments.userId, userId),
      orderBy: [desc(userDocuments.createdAt)],
    });
    return rows.map(toDto);
  },

  async create(userId: string, payload: CreateDocumentRequest): Promise<DocumentDto> {
    const [doc] = await db
      .insert(userDocuments)
      .values({
        userId,
        type: payload.type,
        name: payload.name,
        number: payload.number ?? null,
        issuedAt: payload.issuedAt ? new Date(payload.issuedAt) : null,
        expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : null,
        countryCode: payload.countryCode ?? null,
        fileUrl: payload.fileUrl ?? null,
        meta: payload.meta ?? {},
      })
      .returning();
    return toDto(doc);
  },

  async update(userId: string, id: string, payload: UpdateDocumentRequest): Promise<DocumentDto | null> {
    const [doc] = await db
      .update(userDocuments)
      .set({
        ...(payload.type !== undefined && { type: payload.type }),
        ...(payload.name !== undefined && { name: payload.name }),
        ...(payload.number !== undefined && { number: payload.number ?? null }),
        ...(payload.issuedAt !== undefined && { issuedAt: payload.issuedAt ? new Date(payload.issuedAt) : null }),
        ...(payload.expiresAt !== undefined && { expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : null }),
        ...(payload.countryCode !== undefined && { countryCode: payload.countryCode ?? null }),
        ...(payload.fileUrl !== undefined && { fileUrl: payload.fileUrl ?? null }),
        ...(payload.meta !== undefined && { meta: payload.meta }),
        updatedAt: new Date(),
      })
      .where(and(eq(userDocuments.id, id), eq(userDocuments.userId, userId)))
      .returning();
    return doc ? toDto(doc) : null;
  },

  async remove(userId: string, id: string): Promise<boolean> {
    const result = await db
      .delete(userDocuments)
      .where(and(eq(userDocuments.id, id), eq(userDocuments.userId, userId)))
      .returning({ id: userDocuments.id });
    return result.length > 0;
  },

  async listExpiringSoon(userId: string, daysAhead = 90): Promise<DocumentDto[]> {
    const cutoff = new Date(Date.now() + daysAhead * 86_400_000);
    const rows = await db.query.userDocuments.findMany({
      where: eq(userDocuments.userId, userId),
    });
    return rows
      .filter((d) => d.expiresAt && d.expiresAt <= cutoff && d.expiresAt > new Date())
      .map(toDto);
  },
};
