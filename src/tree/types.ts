export type TreeNode = {
  id: string
  label: string
  hasChildren: boolean
  children?: TreeNode[]
  isLoading?: boolean
  error?: string  
}


export type LoadedNode = TreeNode & {
  children?: TreeNode[]
  isLoading?: boolean
  error?: string
}
