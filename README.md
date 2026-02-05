# Hierarchical Combobox (Accessible, Async & Virtualized)

An **accessible, keyboard-first hierarchical combobox** built with
**React + TypeScript**, capable of handling **large async datasets**
with **virtualized rendering**, **multi-select**, and **full screen
reader parity**.

🔗 **Live Storybook (Chromatic)**\
https://6983cbbf4bb97f7f3364ab52-gvzkybeefz.chromatic.com/?path=/story/components-hierarchicalcombobox--default

------------------------------------------------------------------------

## ✨ Features

-   🌳 Hierarchical tree-based selection
-   ⚡ Async loading of tree nodes
-   🔍 Search with ancestry context preservation
-   🧱 Virtualized rendering (no external libraries)
-   ☑️ Multi-select with indeterminate states
-   ⌨️ Full keyboard navigation
-   ♿ WAI-ARIA compliant
-   🚦 Loading & error handling
-   🧪 Storybook-based integration tests
-   📦 Scales to very large datasets

------------------------------------------------------------------------

## 🛠 Tech Stack

-   React 18
-   TypeScript
-   Vite
-   Storybook
-   Vitest
-   Playwright
-   Chromatic

------------------------------------------------------------------------

## 📦 Installation

``` bash
git clone <your-repository-url>
cd combobox
npm install
npm run dev
```

To run Storybook:

``` bash
npm run storybook
```

------------------------------------------------------------------------

## 🧩 Combobox Component API

### `<HierarchicalCombobox />`

An accessible, async, virtualized hierarchical combobox supporting
multi-select and keyboard navigation.

------------------------------------------------------------------------

### Basic Usage

``` tsx
import { HierarchicalCombobox } from "./tree/HierarchicalCombobox"

export default function Example() {
  return <HierarchicalCombobox />
}
```

------------------------------------------------------------------------

### Props

  ---------------------------------------------------------------------------------
  Prop         Type                           Default    Description
  ------------ ------------------------------ ---------- --------------------------
  `value`      `Set<string>`                  internal   Controlled selected node
                                                         IDs

  `onChange`   `(ids: Set<string>) => void`   internal   Fired when selection
                                                         changes

  `disabled`   `boolean`                      `false`    Disables the entire
                                                         combobox
  ---------------------------------------------------------------------------------

> The component is **uncontrolled by default** and manages async
> loading, selection, and focus internally.

------------------------------------------------------------------------

## 🔁 Component Behavior

### Selection

-   Multi-select supported
-   Selecting a parent selects all descendants
-   Partial selection shows **indeterminate** checkbox
-   Fully keyboard and mouse accessible

### Async Loading

-   Children load lazily on expand
-   Per-node loading indicators
-   Error states announced via screen readers
-   Retry supported

### Search

-   Case-insensitive
-   Automatically expands ancestors
-   Preserves hierarchy context
-   Works even if nodes were never expanded

### Virtualization

-   Only visible rows are rendered
-   Stable keyboard focus while scrolling
-   No virtualization libraries used

------------------------------------------------------------------------

## ⌨️ Keyboard Interaction

  Key           Action
  ------------- -------------------
  Arrow Down    Move focus down
  Arrow Up      Move focus up
  Arrow Right   Expand node
  Arrow Left    Collapse node
  Space         Toggle selection
  Enter         Expand / collapse
  Tab           Exit combobox

------------------------------------------------------------------------

## ♿ Accessibility

### Roles

-   `combobox`
-   `tree`
-   `treeitem`
-   `alert`

### ARIA Attributes

-   `aria-expanded`
-   `aria-selected`
-   `aria-busy`
-   `aria-level`

### Accessibility Guarantees

-   Fully operable without mouse
-   Screen reader parity with visual state
-   Async loading and errors announced correctly
-   Stable focus during virtualization

------------------------------------------------------------------------

## 🔌 Async Data Loader

Tree data is loaded via an overridable async API:

``` ts
loadChildren(parentId: string): Promise<LoadedNode[]>
```

This allows:

-   Slow network simulation
-   Error injection
-   Heavy dataset testing
-   Storybook edge cases

------------------------------------------------------------------------

## 📘 Storybook Scenarios

  Story                 Description
  --------------------- ---------------------------
  Default               Normal async tree
  Slow Network          Simulated network latency
  Error While Loading   Async error handling
  Heavy Dataset         Large virtualized tree

Each story is also executed as an **integration test**.

------------------------------------------------------------------------

## 🧪 Integration Tests

Integration tests are powered by **Storybook + Vitest + Playwright**.

Run tests:

``` bash
npx vitest --run
```

✔ Keyboard navigation\
✔ Async loading\
✔ Error handling\
✔ Virtualized focus stability

------------------------------------------------------------------------

## 📋 Assignment Coverage

  Requirement             Status
  ----------------------- --------
  Async tree loading      ✅
  Virtualized rendering   ✅
  Search with context     ✅
  Multi-select            ✅
  Keyboard-first UX       ✅
  Screen reader parity    ✅
  Edge case stories       ✅
  Public Storybook        ✅

------------------------------------------------------------------------

## 🚀 Deployment

Storybook is deployed using **Chromatic**.

``` bash
npx chromatic --project-token=<token>
```
