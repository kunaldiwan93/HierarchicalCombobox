## 🧪 Integration Testing

Integration testing was implemented using **Storybook + Vitest + Playwright** to validate real user behavior across asynchronous, keyboard-driven, and large-data scenarios.

Instead of unit-level mocks, tests are executed against **actual Storybook stories**, ensuring parity between development, documentation, and test environments.

---

### 🔧 Testing Stack

- **Vitest** – Test runner
- **@storybook/test** – Story-driven testing
- **Playwright (Chromium)** – Real browser execution
- **Chromatic** – Visual + interaction validation

---

### 🎯 Testing Strategy

Each major scenario is represented as a **Storybook story**, and the same stories are reused in integration tests:

| Scenario | Purpose |
|--------|--------|
| Default | Core functionality & keyboard navigation |
| Slow Network | Async loading & loading indicators |
| Error While Loading | Error messaging & retry handling |
| Heavy Dataset | Virtualization stability & performance |

This guarantees that:
- Documented behavior is test-verified
- Edge cases are reproducible
- No divergence exists between demos and tests

---

### ⌨️ Keyboard Interaction Coverage

The following keyboard behaviors are validated:

- `ArrowUp / ArrowDown` – Tree navigation
- `ArrowRight` – Expand node
- `ArrowLeft` – Collapse node
- `Space` – Select / deselect node
- `Enter` – Toggle expand on focused node

Focus is preserved during virtualization and async loading, meeting accessibility and UX constraints.

---

### 🔄 Async Loading Validation

Integration tests confirm:

- Loading indicators appear during async fetch
- UI remains interactive during slow networks
- Children render correctly after resolution
- Focus remains stable after async updates

---

### ❌ Error Handling Validation

Error scenarios are simulated via Storybook-only API overrides.

Tests verify:

- Errors are announced via `role="alert"`
- Error messages are visible and readable
- Retry actions are present and functional
- Errors do not crash or lock the tree

---

### 🧱 Large Dataset & Virtualization

The heavy dataset scenario validates:

- Virtualized rendering (only visible rows mounted)
- Keyboard navigation beyond visible range
- Auto-scroll during keyboard navigation
- Stable selection state across recycled rows

This ensures scalability for datasets with thousands of nodes.

---

### ♿ Accessibility Guarantees

Integration tests indirectly validate accessibility by enforcing:

- Keyboard-first navigation
- Proper ARIA roles (`tree`, `treeitem`, `alert`)
- Screen-reader compatible loading & error states
- Indeterminate checkbox states for partial selection

---

### ✅ Test Execution

All integration tests are executed using:

```bash
npx vitest --run
