import type { LoadedNode } from "./types"

export type FlatNode = {
  id: string
  label: string
  depth: number
  hasChildren: boolean
  isLoading?: boolean
  error?: string
}

export function flattenTree(
  rootIds: string[],
  nodes: Map<string, LoadedNode>,
  expanded: Set<string>
): FlatNode[] {
  const result: FlatNode[] = []

  function walk(id: string, depth: number) {
    const node = nodes.get(id)
    if (!node) return

    result.push({
      id: node.id,
      label: node.label,
      depth,
      hasChildren: node.hasChildren,
      isLoading: node.isLoading,
      error: node.error,
    })

    if (node.hasChildren && expanded.has(id) && node.children) {
      node.children.forEach((child) => {
        walk(child.id, depth + 1)
      })
    }
  }

  rootIds.forEach((id) => walk(id, 0))

  return result
}
