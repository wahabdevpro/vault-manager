export interface AppData {
  groups: TreeNode[]
}

export type TreeNode = GroupNode | ItemNode

export interface GroupNode {
  id: string
  type: 'group'
  name: string
  children: TreeNode[]
}

export interface ItemNode {
  id: string
  type: 'item'
  name: string
  description: string
  content: string
}

export interface ElectronAPI {
  checkAuthStatus: () => Promise<{ hasData: boolean }>
  setupPassword: (password: string) => Promise<{ success: boolean; error?: string }>
  unlock: (password: string) => Promise<{ success: boolean; data?: AppData; error?: string }>
  lockVault: () => Promise<void>
  loadData: () => Promise<AppData>
  createGroup: (parentId: string | null, name: string) => Promise<AppData>
  createItem: (
    parentId: string | null,
    name: string,
    description: string,
    content: string
  ) => Promise<AppData>
  updateNode: (id: string, updates: Record<string, unknown>) => Promise<AppData>
  deleteNode: (id: string) => Promise<AppData>
  reorderNode: (id: string, direction: 'up' | 'down') => Promise<AppData>
  copyToClipboard: (text: string) => Promise<{ success: boolean }>
}

declare global {
  interface Window {
    api: ElectronAPI
  }
}
