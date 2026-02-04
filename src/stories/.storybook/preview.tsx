// src/.storybook/preview.ts
import type { Decorator } from "@storybook/react"
import { __resetLoadChildren } from "../../tree/MockApi"

export const decorators: Decorator[] = [
  (StoryFn) => {
    __resetLoadChildren()
    return <StoryFn />
  },
]
