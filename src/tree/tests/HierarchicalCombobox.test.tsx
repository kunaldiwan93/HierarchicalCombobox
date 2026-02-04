import { render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { HierarchicalCombobox } from "../HierarchicalCombobox"
import {
  __setLoadChildren,
  __resetLoadChildren,
  loadChildren as defaultLoader,
} from "../MockApi"

beforeEach(() => {
  __resetLoadChildren()
})

afterEach(() => {
  __resetLoadChildren()
})


test("loads root nodes asynchronously", async () => {
  render(<HierarchicalCombobox />)

  expect(await screen.findByText("Asia")).toBeInTheDocument()
  expect(await screen.findByText("Europe")).toBeInTheDocument()
})


test("keyboard navigation works with arrow keys", async () => {
  const user = userEvent.setup()
  render(<HierarchicalCombobox />)

  const tree = await screen.findByRole("tree")
  tree.focus()

  await user.keyboard("{ArrowDown}")
  await user.keyboard("{ArrowDown}")

  const items = screen.getAllByRole("treeitem")
  expect(items.length).toBeGreaterThan(0)
})


test("expands node with Enter key", async () => {
  const user = userEvent.setup()
  render(<HierarchicalCombobox />)

  const tree = await screen.findByRole("tree")
  tree.focus()

  await user.keyboard("{Enter}")

  expect(await screen.findByText("India")).toBeInTheDocument()
})


test("selects node with Space key", async () => {
  const user = userEvent.setup()
  render(<HierarchicalCombobox />)

  const tree = await screen.findByRole("tree")
  tree.focus()

  await user.keyboard(" ")

  const checkbox = screen.getAllByRole("checkbox")[0]
  expect(checkbox).toBeChecked()
})


test("shows error message when loader fails", async () => {
  __setLoadChildren(async (id: string) => {
    if (id === "asia") {
      throw new Error("Boom")
    }
    return defaultLoader(id)
  })

  render(<HierarchicalCombobox />)

  const asia = await screen.findByText("Asia")
  await userEvent.click(asia)

  expect(await screen.findByRole("alert")).toHaveTextContent("Failed to load")
})


test("shows loading indicator while fetching children", async () => {
  __setLoadChildren(async (id: string) => {
    await new Promise((r) => setTimeout(r, 1000))
    return defaultLoader(id)
  })

  render(<HierarchicalCombobox />)

  const asia = await screen.findByText("Asia")
  await userEvent.click(asia)

  expect(await screen.findByText("Loading…")).toBeInTheDocument()
})
