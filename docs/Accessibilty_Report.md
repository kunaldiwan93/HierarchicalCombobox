# Accessibility Report

**Component:** Hierarchical Combobox (Async, Virtualized, Multi-Select)\
**Tech Stack:** React, TypeScript, Storybook, Vitest

This document outlines the accessibility design, implementation details,
and validation results for the **Hierarchical Combobox** component.

------------------------------------------------------------------------

## 1. Semantic Structure

The component uses native **ARIA tree semantics** to represent
hierarchical data.

  Element          Role / Implementation
  ---------------- ----------------------------------
  Tree container   `role="tree"`
  Tree item        `role="treeitem"`
  Error message    `role="alert"`
  Checkbox         Native `<input type="checkbox">`

This ensures correct interpretation by screen readers and other
assistive technologies.

------------------------------------------------------------------------

## 2. Keyboard Accessibility (Keyboard-First UX)

The component is **fully operable using the keyboard alone**.

### Supported Keyboard Interactions

  Key           Behavior
  ------------- -------------------------------------
  Arrow Down    Move focus to next visible node
  Arrow Up      Move focus to previous visible node
  Arrow Right   Expand node (if collapsible)
  Arrow Left    Collapse node
  Enter         Toggle expand / collapse
  Space         Toggle selection (checkbox)

### Focus Management

-   Focus is stable across virtualization\
-   Focused node remains visible via auto-scrolling\
-   No focus loss during async loading or re-renders

------------------------------------------------------------------------

## 3. Virtualization & Focus Stability

To support **large datasets**, the component implements custom
virtualization:

-   Only visible nodes are rendered\
-   Absolute index tracking preserves keyboard order\
-   Auto-scroll logic keeps the focused node in view

✅ **Requirement satisfied:** Stable focus during virtualization

------------------------------------------------------------------------

## 4. Async Loading Accessibility

### Loading State

-   Loading nodes expose `aria-busy="true"`\
-   Visual loading indicator (`⏳ Loading…`) is rendered\
-   Interaction is temporarily disabled to prevent confusion

### Error Handling

-   Async failures render inline error messages\
-   Errors are announced via `role="alert"`\
-   Retry action is fully keyboard accessible

✅ **Requirement satisfied:** Accessible async loading & error handling

------------------------------------------------------------------------

## 5. Multi-Select & Indeterminate States

The component supports **hierarchical multi-select** with accurate state
propagation.

### Selection Rules

-   Leaf nodes toggle directly\
-   Parent nodes reflect children via:
    -   ✅ Checked\
    -   ⬜ Unchecked\
    -   ➖ Indeterminate

### Implementation Details

-   Native checkbox `indeterminate` property is used\
-   Screen readers correctly announce mixed states\
-   Selection state propagates recursively

------------------------------------------------------------------------

## 6. Search Accessibility

-   Search preserves ancestry context\
-   Matching nodes automatically expand parent paths\
-   Non-matching nodes are hidden but retained in state\
-   Keyboard navigation continues to function during search

------------------------------------------------------------------------

## 7. Screen Reader Support

### Tested With

-   Chrome + NVDA (basic validation)\
-   Native browser accessibility tree inspection

### Observed Behavior

-   Tree hierarchy is announced correctly\
-   Selection state changes are announced\
-   Error messages are read immediately\
-   Loading states are discoverable

------------------------------------------------------------------------

## 8. Known Limitations

-   No live region for search result count (non-blocking)\
-   Virtualized off-screen nodes are not announced until scrolled into
    view (expected behavior)

These limitations **do not block WCAG 2.1 AA compliance**.

------------------------------------------------------------------------

## 9. Storybook Accessibility Coverage

Accessibility edge cases are documented and testable via Storybook.

  Story                 Purpose
  --------------------- ---------------------------------------
  Default               Baseline interaction
  Slow Network          Async loading behavior
  Error While Loading   Error announcement
  Heavy Dataset         Virtualization + keyboard stress test

All stories are tested using **Vitest + Playwright (Chromium)**.

------------------------------------------------------------------------

## 10. Conclusion

The **Hierarchical Combobox** meets the accessibility requirements
outlined in the assignment:

-   ✅ Keyboard-first UX\
-   ✅ Screen reader parity\
-   ✅ Stable focus during virtualization\
-   ✅ Accessible async loading & error handling\
-   ✅ Correct indeterminate selection states

The component is suitable for **production use in
accessibility-conscious applications**.
