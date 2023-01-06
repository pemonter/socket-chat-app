export interface IMessage {
  authorId: string
  authorName: string
  body: string | File | null
  sendAt: Date
  mimeType?: string
  fileName?: string
}
