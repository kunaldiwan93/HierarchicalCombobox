# HierarchicalCombobox -- Component API Documentation

The **HierarchicalCombobox** is an accessible, async, virtualized
tree-based selection component built with **React + TypeScript**.\
It supports **large datasets**, **keyboard-first interaction**,
**multi-select**, and **screen reader parity**.

------------------------------------------------------------------------

## 📦 Import

``` tsx
import { HierarchicalCombobox } from "@/tree/HierarchicalCombobox"
```

------------------------------------------------------------------------

## 🧩 Component Overview

The component renders a combobox-triggered tree view that allows users
to:

-   Navigate deeply nested hierarchical data\
-   Load nodes asynchronously\
-   Select multiple values with correct indeterminate states\
-   Search while preserving ancestry context\
-   Operate fully using keyboard or screen reader

------------------------------------------------------------------------

## 🧪 Basic Usage

``` tsx
export default function Example() {
  return <HierarchicalCombobox />
}
```

The component is **uncontrolled by default** and manages:

-   Async loading\
-   Selection state\
-   Focus management\
-   Virtualized rendering

------------------------------------------------------------------------

## ⚙️ Props API

### `<HierarchicalCombobox />`

  ------------------------------------------------------------------------------------------
  Prop         Type                           Required   Default    Description
  ------------ ------------------------------ ---------- ---------- ------------------------
  `value`      `Set<string>`                  ❌         internal   Controlled selected node
                                                                    IDs

  `onChange`   `(ids: Set<string>) => void`   ❌         internal   Called when selection
                                                                    changes

  `disabled`   `boolean`                      ❌         `false`    Disables the entire
                                                                    combobox
  ------------------------------------------------------------------------------------------

------------------------------------------------------------------------

### Controlled Example

``` tsx
const [value, setValue] = useState<Set<string>>(new Set())

<HierarchicalCombobox
  value={value}
  onChange={setValue}
/>
```

------------------------------------------------------------------------

## 🌳 Tree Data Model

Each node follows this shape:

``` ts
export type TreeNode = {
  id: string
  label: string
  hasChildren: boolean
  children?: TreeNode[]
  isLoading?: boolean
  error?: string
}
```

------------------------------------------------------------------------

## 🔌 Async Loader Contract

The component relies on an async loader:

``` ts
loadChildren(parentId: string): Promise<TreeNode[]>
```

### Behavior

-   Called lazily when a node is expanded\
-   Supports retry on failure\
-   Loading & error states are per-node\
-   Loader can be overridden (used in Storybook)

------------------------------------------------------------------------

## 🔍 Search Behavior

-   Case-insensitive\
-   Matches node labels\
-   Automatically expands ancestor paths\
-   Works even if nodes were never expanded before\
-   Preserves hierarchical context

------------------------------------------------------------------------

## ☑️ Selection Logic

-   Supports multi-select\
-   Selecting a parent selects all descendants\
-   Deselecting removes all descendants\
-   Parent shows indeterminate state when partially selected\
-   State derived recursively

------------------------------------------------------------------------

## 🧱 Virtualization

-   Only visible rows are rendered\
-   No external virtualization libraries used\
-   Stable focus during scroll\
-   Keyboard navigation automatically scrolls items into view

------------------------------------------------------------------------

## ⌨️ Keyboard Contract

  Key           Behavior
  ------------- -------------------------------------
  Arrow Down    Move focus to next visible node
  Arrow Up      Move focus to previous visible node
  Arrow Right   Expand node
  Arrow Left    Collapse node
  Space         Toggle selection
  Enter         Expand / collapse
  Tab           Exit tree

------------------------------------------------------------------------

## ♿ Accessibility (ARIA)

### Roles Used

-   `combobox`\
-   `tree`\
-   `treeitem`\
-   `alert`

### ARIA Attributes

-   `aria-expanded`\
-   `aria-selected`\
-   `aria-level`\
-   `aria-busy`

### Accessibility Guarantees

-   Fully operable without mouse\
-   Screen reader announcements for:
    -   Loading\
    -   Errors\
    -   Selection changes\
-   Focus never jumps during virtualization

------------------------------------------------------------------------

## 🚦 Loading & Error States

### Loading

-   Per-node spinner\
-   `aria-busy="true"`\
-   Screen reader announcement

### Error

-   Inline error message\
-   `role="alert"`\
-   Retry button provided

------------------------------------------------------------------------

## 🧪 Storybook Coverage

The component is documented and tested via Storybook:

  Story                 Purpose
  --------------------- ------------------------
  Default               Normal async tree
  Slow Network          Artificial latency
  Error While Loading   Async failure handling
  Heavy Dataset         Large virtualized tree

Each story also runs as an **integration test**.

------------------------------------------------------------------------

## 🧪 Integration Testing

Powered by **Vitest + Storybook Test Runner + Playwright**.

Validated behaviors:

-   Keyboard navigation\
-   Async loading\
-   Error recovery\
-   Virtualized focus stability

------------------------------------------------------------------------

## ✅ Guarantees

-   No tree libraries\
-   No select/combobox libraries\
-   No virtualization libraries\
-   Fully compliant with assignment constraints
