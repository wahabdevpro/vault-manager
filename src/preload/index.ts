import { contextBridge, ipcRenderer } from 'electron'

const api = {
  checkAuthStatus: () => ipcRenderer.invoke('auth:check-status'),
  setupPassword: (password: string) => ipcRenderer.invoke('auth:setup', { password }),
  unlock: (password: string) => ipcRenderer.invoke('auth:unlock', { password }),
  lockVault: () => ipcRenderer.invoke('auth:lock'),
  loadData: () => ipcRenderer.invoke('data:load'),
  createGroup: (parentId: string | null, name: string) =>
    ipcRenderer.invoke('data:create-group', { parentId, name }),
  createItem: (parentId: string | null, name: string, description: string, content: string) =>
    ipcRenderer.invoke('data:create-item', { parentId, name, description, content }),
  updateNode: (id: string, updates: Record<string, unknown>) =>
    ipcRenderer.invoke('data:update-node', { id, updates }),
  deleteNode: (id: string) => ipcRenderer.invoke('data:delete-node', { id }),
  reorderNode: (id: string, direction: 'up' | 'down') =>
    ipcRenderer.invoke('data:reorder', { id, direction }),
  copyToClipboard: (text: string) => ipcRenderer.invoke('clipboard:write', { text })
}

contextBridge.exposeInMainWorld('api', api)
