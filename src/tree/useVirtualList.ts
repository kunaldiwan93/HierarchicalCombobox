import { useMemo } from "react"

type VirtualListParams = {
  itemCount: number
  itemHeight: number
  containerHeight: number
  scrollTop: number
}

export function useVirtualList({
  itemCount,
  itemHeight,
  containerHeight,
  scrollTop,
}: VirtualListParams) {
  return useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight)

    const visibleCount = Math.ceil(containerHeight / itemHeight)

    const endIndex = Math.min(
      itemCount - 1,
      startIndex + visibleCount + 2 
    )

    const offsetTop = startIndex * itemHeight

    return {
      startIndex,
      endIndex,
      offsetTop,
    }
  }, [itemCount, itemHeight, containerHeight, scrollTop])
}
