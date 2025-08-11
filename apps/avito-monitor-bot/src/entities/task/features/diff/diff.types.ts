export interface DiffItem {
  id: string
  title?: string | null
  price?: string | null
  link?: string | null
  description?: string | null
}

export interface DiffResult {
  newItems: DiffItem[]
}
