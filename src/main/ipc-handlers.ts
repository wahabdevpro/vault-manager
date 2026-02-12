import { ipcMain, clipboard } from 'electron'
import {
  loadData,
  createGroup,
  createItem,
  updateNode,
  deleteNode,
  reorderNode,
  hasDataFile,
  setupPassword,
  unlockWithPassword,
  lockVault
} from './data-store'

export function registerIpcHandlers(): void {
  ipcMain.handle('auth:check-status', () => {
    return { hasData: hasDataFile() }
  })

  ipcMain.handle('auth:setup', (_event, args: { password: string }) => {
    try {
      setupPassword(args.password)
      return { success: true }
    } catch {
      return { success: false, error: 'Failed to setup password' }
    }
  })

  ipcMain.handle('auth:unlock', (_event, args: { password: string }) => {
    try {
      const data = unlockWithPassword(args.password)
      return { success: true, data }
    } catch {
      return { success: false, error: 'Wrong password' }
    }
  })

  ipcMain.handle('auth:lock', () => {
    lockVault()
  })

  ipcMain.handle('data:load', () => {
    return loadData()
  })

  ipcMain.handle(
    'data:create-group',
    (_event, args: { parentId: string | null; name: string }) => {
      return createGroup(args.parentId, args.name)
    }
  )

  ipcMain.handle(
    'data:create-item',
    (
      _event,
      args: { parentId: string | null; name: string; description: string; content: string }
    ) => {
      return createItem(args.parentId, args.name, args.description, args.content)
    }
  )

  ipcMain.handle(
    'data:update-node',
    (_event, args: { id: string; updates: Record<string, unknown> }) => {
      return updateNode(args.id, args.updates)
    }
  )

  ipcMain.handle('data:delete-node', (_event, args: { id: string }) => {
    return deleteNode(args.id)
  })

  ipcMain.handle(
    'data:reorder',
    (_event, args: { id: string; direction: 'up' | 'down' }) => {
      return reorderNode(args.id, args.direction)
    }
  )

  ipcMain.handle('clipboard:write', (_event, args: { text: string }) => {
    clipboard.writeText(args.text)
    return { success: true }
  })
}
