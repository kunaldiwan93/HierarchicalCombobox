import type { LoadedNode } from "../tree/types"

export function generateHeavyTree(
  depth: number,
  breadth: number,
  parentId: string
): LoadedNode[] {
  if (depth === 0) return []

  return Array.from({ length: breadth }).map((_, i) => {
    const id = `${parentId}-${i}`

    return {
      id,
      label: `Node ${id}`,
      hasChildren: depth > 1,
    }
  })
}
