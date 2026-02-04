import { useEffect, useMemo, useRef, useState } from "react"
import { useTreeState } from "./useTreeState"
import { loadChildren } from "./MockApi"
import { flattenTree } from "./flattenTree"
import { useVirtualList } from "./useVirtualList"

type Props = {
  query: string
  selectedIds: Set<string>
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>
}

const ITEM_HEIGHT = 32
const CONTAINER_HEIGHT = 260

export function TreeList({ query, selectedIds, setSelectedIds }: Props) {
  const { nodes, expanded, toggleNode, setNodes } = useTreeState()

  const [rootIds, setRootIds] = useState<string[]>([])
  const [rootLoading, setRootLoading] = useState(false)
  const [rootError, setRootError] = useState<string | null>(null)

  const [focusedIndex, setFocusedIndex] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)

  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadRoot() {
      setRootLoading(true)
      setRootError(null)

      try {
        const root = await loadChildren("root")
        if (cancelled) return

        setRootIds(root.map((n) => n.id))
        setNodes((prev) => {
          const next = new Map(prev)
          root.forEach((n) => next.set(n.id, n))
          return next
        })
      } catch {
        if (!cancelled) setRootError("Failed to load tree")
      } finally {
        if (!cancelled) setRootLoading(false)
      }
    }

    loadRoot()
    return () => {
      cancelled = true
    }
  }, [setNodes])

  async function loadAllDescendants(id: string) {
    const node = nodes.get(id)
    if (!node) return

    if (node.hasChildren && !node.children && !node.isLoading) {
      setNodes((prev) => {
        const next = new Map(prev)
        next.set(id, { ...node, isLoading: true, error: undefined })
        return next
      })

      try {
        const children = await loadChildren(id)

        setNodes((prev) => {
          const next = new Map(prev)
          next.set(id, { ...node, children, isLoading: false })
          children.forEach((c) => next.set(c.id, c))
          return next
        })

        for (const c of children) {
          await loadAllDescendants(c.id)
        }
      } catch {
        setNodes((prev) => {
          const next = new Map(prev)
          next.set(id, {
            ...node,
            isLoading: false,
            error: "Failed to load",
          })
          return next
        })
      }
    } else if (node.children) {
      for (const c of node.children) {
        await loadAllDescendants(c.id)
      }
    }
  }

  useEffect(() => {
    if (!query.trim()) return
    rootIds.forEach(loadAllDescendants)
  }, [query, rootIds])

  const parentMap = useMemo(() => {
    const map = new Map<string, string | null>()
    rootIds.forEach((id) => map.set(id, null))
    nodes.forEach((n, id) => {
      n.children?.forEach((c) => map.set(c.id, id))
    })
    return map
  }, [nodes, rootIds])

  function getAncestors(id: string): string[] {
    const res: string[] = []
    let cur = parentMap.get(id)
    while (cur) {
      res.push(cur)
      cur = parentMap.get(cur) ?? null
    }
    return res
  }

  const searchMatches = useMemo(() => {
    if (!query.trim()) return null
    const q = query.toLowerCase()
    const set = new Set<string>()
    nodes.forEach((n, id) => {
      if (n.label.toLowerCase().includes(q)) set.add(id)
    })
    return set
  }, [query, nodes])

  const effectiveExpanded = useMemo(() => {
    if (!searchMatches) return expanded
    const forced = new Set<string>()
    searchMatches.forEach((id) =>
      getAncestors(id).forEach((a) => forced.add(a))
    )
    return forced
  }, [searchMatches, expanded])

  const flat = flattenTree(rootIds, nodes, effectiveExpanded)

  const visibleIds = useMemo(() => {
    if (!searchMatches) return null
    const s = new Set(searchMatches)
    searchMatches.forEach((id) =>
      getAncestors(id).forEach((a) => s.add(a))
    )
    return s
  }, [searchMatches])

  const filtered = visibleIds
    ? flat.filter((n) => visibleIds.has(n.id))
    : flat

  const { startIndex, endIndex, offsetTop } = useVirtualList({
    itemCount: filtered.length,
    itemHeight: ITEM_HEIGHT,
    containerHeight: CONTAINER_HEIGHT,
    scrollTop,
  })

  const visible = filtered.slice(startIndex, endIndex + 1)

  function ensureVisible(index: number) {
    const el = containerRef.current
    if (!el) return

    const top = index * ITEM_HEIGHT
    const bottom = top + ITEM_HEIGHT

    if (top < el.scrollTop) el.scrollTop = top
    else if (bottom > el.scrollTop + CONTAINER_HEIGHT)
      el.scrollTop = bottom - CONTAINER_HEIGHT
  }

  function getSelectionState(
    id: string
  ): "checked" | "unchecked" | "indeterminate" {
    const node = nodes.get(id)
    if (!node) return "unchecked"

    const children = node.children
    if (!children || children.length === 0) {
      return selectedIds.has(id) ? "checked" : "unchecked"
    }

    let hasChecked = false
    let hasUnchecked = false

    for (const c of children) {
      const s = getSelectionState(c.id)
      if (s === "indeterminate") return "indeterminate"
      if (s === "checked") hasChecked = true
      if (s === "unchecked") hasUnchecked = true
    }

    if (hasChecked && !hasUnchecked) return "checked"
    if (!hasChecked && hasUnchecked) return "unchecked"
    return "indeterminate"
  }

  function toggleSelection(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)

      function walk(nid: string) {
        next.has(nid) ? next.delete(nid) : next.add(nid)
        nodes.get(nid)?.children?.forEach((c) => walk(c.id))
      }

      walk(id)
      return next
    })
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const node = filtered[focusedIndex]
    if (!node) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setFocusedIndex((i) => {
          const n = Math.min(i + 1, filtered.length - 1)
          ensureVisible(n)
          return n
        })
        break

      case "ArrowUp":
        e.preventDefault()
        setFocusedIndex((i) => {
          const n = Math.max(i - 1, 0)
          ensureVisible(n)
          return n
        })
        break

      case "ArrowRight":
        if (node.hasChildren && !expanded.has(node.id)) toggleNode(node.id)
        break

      case "ArrowLeft":
        if (expanded.has(node.id)) toggleNode(node.id)
        break

      case " ":
        e.preventDefault()
        toggleSelection(node.id)
        break

      case "Enter":
        if (node.hasChildren) toggleNode(node.id)
        break
    }
  }

  if (rootLoading) {
    return (
      <div role="status" aria-live="polite" style={{ padding: 12 }}>
        Loading tree…
      </div>
    )
  }

  if (rootError) {
    return (
      <div role="alert" style={{ padding: 12, color: "#dc2626" }}>
        {rootError}
        <button
          onClick={() => location.reload()}
          style={{
            marginLeft: 8,
            background: "none",
            border: "none",
            color: "#2563eb",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      role="tree"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      style={{
        height: CONTAINER_HEIGHT,
        overflow: "auto",
        border: "1px solid #e5e7eb",
        borderRadius: 6,
        background: "#fff",
      }}
    >
      <div style={{ height: filtered.length * ITEM_HEIGHT, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetTop}px)` }}>
          {visible.map((n, i) => {
            const abs = startIndex + i
            const state = getSelectionState(n.id)

            return (
              <div key={n.id}>
                <div
                  role="treeitem"
                  aria-selected={abs === focusedIndex}
                  style={{
                    height: ITEM_HEIGHT,
                    paddingLeft: n.depth * 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: abs === focusedIndex ? "#dbeafe" : "#fff",
                    borderBottom: "1px solid #f1f5f9",
                    fontWeight: n.depth === 0 ? 600 : 400,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={state === "checked"}
                    ref={(el) => {
                      if (el) el.indeterminate = state === "indeterminate"
                    }}
                    onChange={() => toggleSelection(n.id)}
                  />

                  {n.hasChildren && (
                    <button
                      onClick={() => toggleNode(n.id)}
                      disabled={n.isLoading}
                      aria-busy={n.isLoading}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: n.isLoading ? "not-allowed" : "pointer",
                        fontSize: 12,
                      }}
                    >
                      {n.isLoading ? "⏳" : expanded.has(n.id) ? "▼" : "▶"}
                    </button>
                  )}

                  <span>{n.label}</span>

                  {n.isLoading && (
                    <span style={{ fontSize: 12, color: "#64748b" }}>
                      Loading…
                    </span>
                  )}
                </div>

                {n.error && (
                  <div
                    role="alert"
                    style={{
                      marginLeft: n.depth * 16 + 24,
                      fontSize: 12,
                      color: "#dc2626",
                    }}
                  >
                    {n.error}
                    <button
                      onClick={() => toggleNode(n.id)}
                      style={{
                        marginLeft: 8,
                        fontSize: 12,
                        background: "none",
                        border: "none",
                        color: "#2563eb",
                        cursor: "pointer",
                      }}
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
