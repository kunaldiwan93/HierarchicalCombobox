import { useCallback, useState } from "react"
import { loadChildren } from "./MockApi"
import type { TreeNode } from "./types"

export function useTreeState() {
  const [nodes, setNodes] = useState<Map<string, TreeNode>>(new Map())
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggleNode = useCallback(
    async (id: string) => {
      const node = nodes.get(id)
      if (!node || !node.hasChildren) return

      // collapse
      if (expanded.has(id)) {
        setExpanded((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
        return
      }

      setExpanded((prev) => new Set(prev).add(id))

      if (node.children) return

      setNodes((prev) => {
        const next = new Map(prev)
        next.set(id, { ...node, isLoading: true, error: undefined })
        return next
      })

      try {
        const children = await loadChildren(id)

        setNodes((prev) => {
          const next = new Map(prev)
          next.set(id, {
            ...node,
            children,
            isLoading: false,
          })
          children.forEach((c) => next.set(c.id, c))
          return next
        })
      } catch {
        setNodes((prev) => {
          const next = new Map(prev)
          next.set(id, {
            ...node,
            isLoading: false,
            error: "Failed to load children",
          })
          return next
        })
      }
    },
    [nodes, expanded]
  )

  return {
    nodes,
    setNodes,
    expanded,
    toggleNode,
  }
}
