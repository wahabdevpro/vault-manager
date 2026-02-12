import { TreeNode, GroupNode, AppData } from '../types'

export function findNodeById(nodes: TreeNode[], id: string): TreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.type === 'group') {
      const found = findNodeById((node as GroupNode).children, id)
      if (found) return found
    }
  }
  return null
}

export function getPathToNode(
  nodes: TreeNode[],
  id: string,
  currentPath: string[] = []
): string[] | null {
  for (const node of nodes) {
    if (node.id === id) {
      return [...currentPath, node.name]
    }
    if (node.type === 'group') {
      const result = getPathToNode(
        (node as GroupNode).children,
        id,
        [...currentPath, node.name]
      )
      if (result) return result
    }
  }
  return null
}

export function getIdPathToNode(
  nodes: TreeNode[],
  id: string,
  currentPath: string[] = []
): string[] | null {
  for (const node of nodes) {
    if (node.id === id) {
      return [...currentPath, node.id]
    }
    if (node.type === 'group') {
      const result = getIdPathToNode(
        (node as GroupNode).children,
        id,
        [...currentPath, node.id]
      )
      if (result) return result
    }
  }
  return null
}

export function getCurrentChildren(
  data: AppData,
  navigationStack: string[]
): TreeNode[] {
  let current: TreeNode[] = data.groups
  for (const groupId of navigationStack) {
    const group = current.find((n) => n.id === groupId && n.type === 'group')
    if (group && group.type === 'group') {
      current = (group as GroupNode).children
    } else {
      return []
    }
  }
  return current
}

export function getCurrentGroupId(navigationStack: string[]): string | null {
  if (navigationStack.length === 0) return null
  return navigationStack[navigationStack.length - 1]
}

export function getNavigationPath(
  data: AppData,
  navigationStack: string[]
): string[] {
  const path: string[] = []
  let current: TreeNode[] = data.groups
  for (const groupId of navigationStack) {
    const group = current.find((n) => n.id === groupId)
    if (group) {
      path.push(group.name)
      if (group.type === 'group') {
        current = (group as GroupNode).children
      }
    }
  }
  return path
}
