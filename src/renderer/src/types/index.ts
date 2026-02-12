export interface BaseNode {
  id: string
  type: 'group' | 'item'
  name: string
}

export interface GroupNode extends BaseNode {
  type: 'group'
  children: TreeNode[]
}

export interface ItemNode extends BaseNode {
  type: 'item'
  description: string
  content: string
}

export type TreeNode = GroupNode | ItemNode

export interface AppData {
  groups: TreeNode[]
}

export interface SearchResult {
  node: TreeNode
  path: string[]
}

export interface ModalState {
  isOpen: boolean
  type: 'create-group' | 'create-item' | 'edit-group' | 'edit-item' | null
  targetNode: TreeNode | null
}

export interface ContextMenuState {
  isOpen: boolean
  x: number
  y: number
  targetNode: TreeNode | null
}
