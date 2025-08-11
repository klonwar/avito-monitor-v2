export interface ParsedItem {
  id: string
  title?: string | null
  price?: string | null
  link?: string | null
  description?: string | null
}

export type ParsedData = Array<ParsedItem>
