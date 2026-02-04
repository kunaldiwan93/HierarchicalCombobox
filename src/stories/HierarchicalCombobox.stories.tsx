import type { Meta, StoryObj } from "@storybook/react"
import { HierarchicalCombobox } from "../tree/HierarchicalCombobox"
import {
  __setLoadChildren,
  __resetLoadChildren,
  createSlowLoader,
  createErrorLoader,
} from "../tree/MockApi"
import { generateHeavyTree } from "./heavyData"
import type { LoadedNode } from "../tree/types"

const meta: Meta<typeof HierarchicalCombobox> = {
  title: "Components/HierarchicalCombobox",
  component: HierarchicalCombobox,
  parameters: {
    layout: "centered",
  },
}

export default meta
type Story = StoryObj<typeof HierarchicalCombobox>

/* =========================================================
   DEFAULT DATASET
   ========================================================= */

export const Default: Story = {
  render: () => {
    __resetLoadChildren()
    return <HierarchicalCombobox />
  },
}

/* =========================================================
   SLOW NETWORK (LOADING STATE)
   ========================================================= */

export const SlowNetwork: Story = {
  name: "Loading (Slow Network)",
  render: () => {
    __setLoadChildren(createSlowLoader(2500))
    return <HierarchicalCombobox />
  },
}

/* =========================================================
   ERROR WHILE LOADING
   ========================================================= */

export const ErrorWhileLoading: Story = {
  name: "Error While Loading",
  render: () => {
    __setLoadChildren(createErrorLoader("asia"))
    return <HierarchicalCombobox />
  },
}

/* =========================================================
   HEAVY DATASET (VIRTUALIZATION)
   ========================================================= */

export const HeavyDataset: Story = {
  render: () => {
    __setLoadChildren(async (id: string): Promise<LoadedNode[]> => {
      await new Promise((r) => setTimeout(r, 150))

      if (id === "root") {
        return generateHeavyTree(3, 40, "root")
      }

      return generateHeavyTree(3, 25, id)
    })

    return (
      <div style={{ width: 420 }}>
        <HierarchicalCombobox />
      </div>
    )
  },
}
