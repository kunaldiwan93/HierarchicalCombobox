import type { LoadedNode } from "./types"

type Loader = (id: string) => Promise<LoadedNode[]>

const defaultLoader: Loader = async (id: string) => {
  await new Promise((r) => setTimeout(r, 300))

  switch (id) {
    case "root":
      return [
        { id: "asia", label: "Asia", hasChildren: true },
        { id: "europe", label: "Europe", hasChildren: true },
      ]

    case "asia":
      return [
        { id: "india", label: "India", hasChildren: true },
        { id: "china", label: "China", hasChildren: true },
      ]

    case "india":
      return [
        { id: "delhi", label: "Delhi", hasChildren: false },
        { id: "mumbai", label: "Mumbai", hasChildren: false },
      ]

    case "china":
      return [
        { id: "beijing", label: "Beijing", hasChildren: false },
        { id: "shanghai", label: "Shanghai", hasChildren: false },
      ]

    case "europe":
      return [
        { id: "germany", label: "Germany", hasChildren: true },
        { id: "france", label: "France", hasChildren: true },
      ]

    case "germany":
      return [
        { id: "berlin", label: "Berlin", hasChildren: false },
        { id: "munich", label: "Munich", hasChildren: false },
      ]

    case "france":
      return [
        { id: "paris", label: "Paris", hasChildren: false },
        { id: "lyon", label: "Lyon", hasChildren: false },
      ]

    default:
      return []
  }
}


let loadChildrenImpl: Loader = defaultLoader

export function loadChildren(id: string) {
  return loadChildrenImpl(id)
}

export function __setLoadChildren(fn: Loader) {
  loadChildrenImpl = fn
}

export function __resetLoadChildren() {
  loadChildrenImpl = defaultLoader
}


export function createSlowLoader(delay = 3000): Loader {
  return async (id: string) => {
    await new Promise((r) => setTimeout(r, delay))
    return defaultLoader(id)
  }
}

export function createErrorLoader(failId = "root"): Loader {
  return async (id: string) => {
    await new Promise((r) => setTimeout(r, 500))
    if (id === failId) {
      throw new Error("Network error")
    }
    return defaultLoader(id)
  }
}
