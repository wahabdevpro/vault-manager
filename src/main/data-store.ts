import { app } from 'electron'
import { readFileSync, writeFileSync, existsSync, renameSync } from 'fs'
import { join } from 'path'
import { randomUUID } from 'crypto'
import { encrypt, decrypt, EncryptedPayload } from './crypto'

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

let masterPassword: string | null = null

function getDataFile(): string {
  const basePath = app.isPackaged
    ? join(app.getPath('exe'), '..')
    : app.getAppPath()
  return join(basePath, 'clipboard-manager-data.enc')
}

export function hasDataFile(): boolean {
  return existsSync(getDataFile())
}

export function lockVault(): void {
  masterPassword = null
}

export function setupPassword(password: string): void {
  masterPassword = password
  saveData({ groups: [] })
}

export function unlockWithPassword(password: string): AppData {
  const dataFile = getDataFile()
  const raw = readFileSync(dataFile, 'utf-8')
  const payload: EncryptedPayload = JSON.parse(raw)
  const plaintext = decrypt(payload, password)
  const data: AppData = JSON.parse(plaintext)
  masterPassword = password
  return data
}

export function loadData(): AppData {
  try {
    const dataFile = getDataFile()
    if (existsSync(dataFile) && masterPassword) {
      const raw = readFileSync(dataFile, 'utf-8')
      const payload: EncryptedPayload = JSON.parse(raw)
      const plaintext = decrypt(payload, masterPassword)
      return JSON.parse(plaintext)
    }
  } catch (err) {
    console.error('Failed to load data:', err)
  }
  return { groups: [] }
}

function saveData(data: AppData): void {
  if (!masterPassword) throw new Error('Not authenticated')
  const dataFile = getDataFile()
  const tmpFile = dataFile + '.tmp'
  const plaintext = JSON.stringify(data)
  const payload = encrypt(plaintext, masterPassword)
  writeFileSync(tmpFile, JSON.stringify(payload), 'utf-8')
  renameSync(tmpFile, dataFile)
}

function findInTree(
  nodes: TreeNode[],
  id: string
): { node: TreeNode; siblings: TreeNode[]; index: number } | null {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      return { node: nodes[i], siblings: nodes, index: i }
    }
    if (nodes[i].type === 'group') {
      const result = findInTree((nodes[i] as GroupNode).children, id)
      if (result) return result
    }
  }
  return null
}

function findParentChildren(data: AppData, parentId: string | null): TreeNode[] | null {
  if (parentId === null) {
    return data.groups
  }
  const result = findInTree(data.groups, parentId)
  if (result && result.node.type === 'group') {
    return (result.node as GroupNode).children
  }
  return null
}

export function createGroup(parentId: string | null, name: string): AppData {
  const data = structuredClone(loadData())
  const newGroup: GroupNode = {
    id: randomUUID(),
    type: 'group',
    name,
    children: []
  }
  const children = findParentChildren(data, parentId)
  if (children) {
    children.push(newGroup)
  }
  saveData(data)
  return data
}

export function createItem(
  parentId: string | null,
  name: string,
  description: string,
  content: string
): AppData {
  const data = structuredClone(loadData())
  const newItem: ItemNode = {
    id: randomUUID(),
    type: 'item',
    name,
    description,
    content
  }
  const children = findParentChildren(data, parentId)
  if (children) {
    children.push(newItem)
  }
  saveData(data)
  return data
}

export function updateNode(
  id: string,
  updates: Partial<{ name: string; description: string; content: string }>
): AppData {
  const data = structuredClone(loadData())
  const result = findInTree(data.groups, id)
  if (result) {
    Object.assign(result.node, updates)
  }
  saveData(data)
  return data
}

export function deleteNode(id: string): AppData {
  const data = structuredClone(loadData())
  const result = findInTree(data.groups, id)
  if (result) {
    result.siblings.splice(result.index, 1)
  }
  saveData(data)
  return data
}

export function reorderNode(id: string, direction: 'up' | 'down'): AppData {
  const data = structuredClone(loadData())
  const result = findInTree(data.groups, id)
  if (result) {
    const { siblings, index } = result
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < siblings.length) {
      const temp = siblings[newIndex]
      siblings[newIndex] = siblings[index]
      siblings[index] = temp
    }
  }
  saveData(data)
  return data
}
