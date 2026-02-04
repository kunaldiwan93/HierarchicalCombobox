import { useEffect, useRef, useState } from "react"
import { TreeList } from "./TreeList"

export function HierarchicalCombobox() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  const displayValue =
    selectedIds.size === 0
      ? ""
      : `${selectedIds.size} item${selectedIds.size > 1 ? "s" : ""} selected`

  return (
    <div
      ref={wrapperRef}
      style={{ width: 320, position: "relative", fontFamily: "system-ui" }}
    >

      <div
        role="combobox"
        aria-expanded={open}
        aria-haspopup="tree"
        onClick={() => setOpen(true)}
        style={{
          border: "1px solid #d1d5db",
          borderRadius: 6,
          padding: "6px 8px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "#fff",
          cursor: "text",
        }}
      >
        <input
          value={query}
          placeholder="Select locations…"
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          style={{
            border: "none",
            outline: "none",
            flex: 1,
            fontSize: 14,
          }}
        />

        {displayValue && (
          <span style={{ fontSize: 12, color: "#475569" }}>
            {displayValue}
          </span>
        )}
      </div>

      {open && (
        <div
          role="dialog"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 4,
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            boxShadow: "0 10px 15px rgba(0,0,0,0.08)",
            zIndex: 10,
          }}
        >
          <TreeList
            query={query}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
          />
        </div>
      )}
    </div>
  )
}
