# Hierarchical Combobox (Async + Accessible)

A production-ready **hierarchical multi-select combobox** built with **React + TypeScript**, supporting **async loading**, **large datasets**, **keyboard navigation**, and **full accessibility**.

This component was developed as part of a frontend engineering assignment with an emphasis on **UX, performance, accessibility, and testing**.

---

## 🔗 Live Storybook (Public)

Explore the component and all edge cases here:

👉 https://6983cbbf4bb97f7f3364ab52-gvzkybeefz.chromatic.com

### Available Stories
- **Default** – Standard tree behavior
- **Loading (Slow Network)** – Simulated async delay
- **Error While Loading** – API failure handling
- **Heavy Dataset** – Virtualized rendering for large trees

---

## ✨ Features

- 🌳 Hierarchical tree structure
- 🔄 Async loading of child nodes
- ⚡ Handles large datasets efficiently
- ⌨️ Full keyboard navigation
- ♿ Screen-reader friendly (ARIA compliant)
- 🔍 Search with ancestor context
- ☑️ Multi-select with indeterminate state
- 🧪 Integration tested with real browser

---

## 🚀 Getting Started

### Install dependencies
```bash
npm install
Run the app
npm run dev
Run Storybook locally
npm run storybook
Run integration tests
npx vitest
📦 Component API
<HierarchicalCombobox />
A reusable component that renders a hierarchical, async, multi-select combobox.

Tree Node Type
type TreeNode = {
  id: string
  label: string
  hasChildren: boolean
  children?: TreeNode[]
}
Props
Prop	Type	Description
query	string	Current search query
selectedIds	Set<string>	Selected node IDs
setSelectedIds	(ids: Set<string>) => void	Selection updater
Async loading is handled internally via a mocked API layer for testing and Storybook scenarios.

⌨️ Keyboard Interaction
Key	Action
ArrowDown	Move focus to next node
ArrowUp	Move focus to previous node
ArrowRight	Expand node
ArrowLeft	Collapse node
Enter	Expand / Collapse
Space	Toggle selection
Keyboard focus remains stable even during async loading and virtualization.

♿ Accessibility
Accessibility was a first-class concern:

role="tree" and role="treeitem"

aria-expanded for expandable nodes

aria-selected for selection state

aria-busy during async loading

role="alert" for error states

Fully operable using keyboard only

Compatible with screen readers

Accessibility behavior can be verified directly in the Storybook environment.

🧪 Testing
Integration tests cover:

Async loading behavior

Error handling UI

Keyboard navigation

Performance with heavy datasets

Tech Stack
Vitest

Storybook Test Runner

Playwright (Chromium)

Tests are executed in a real browser environment.