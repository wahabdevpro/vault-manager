import { TreeNode, GroupNode, ItemNode, SearchResult } from '../types'

interface ParsedQuery {
  groupPath: string[]
  itemQuery: string
}

function parseQuery(raw: string): ParsedQuery {
  const parts = raw.split('->')
  if (parts.length <= 1) {
    return { groupPath: [], itemQuery: raw }
  }
  const groupPath = parts.slice(0, -1).map((p) => p.trim()).filter((p) => p.length > 0)
  const itemQuery = parts[parts.length - 1].trim()
  return { groupPath, itemQuery }
}

function groupMatches(name: string, filter: string): boolean {
  return name.toLowerCase().startsWith(filter.toLowerCase())
}

function searchInChildren(
  nodes: TreeNode[],
  query: string,
  groupsOnly: boolean,
  parentPath: string[]
): SearchResult[] {
  const results: SearchResult[] = []
  const lowerQuery = query.toLowerCase()

  for (const node of nodes) {
    if (node.type === 'group') {
      if (node.name.toLowerCase().includes(lowerQuery)) {
        results.push({ node, path: parentPath })
      }
      results.push(
        ...searchInChildren(
          (node as GroupNode).children,
          query,
          groupsOnly,
          [...parentPath, node.name]
        )
      )
    } else if (node.type === 'item' && !groupsOnly) {
      const nameMatch = node.name.toLowerCase().includes(lowerQuery)
      const descMatch = (node as ItemNode).description?.toLowerCase().includes(lowerQuery)
      if (nameMatch || descMatch) {
        results.push({ node, path: parentPath })
      }
    }
  }
  return results
}

function searchWithGroupPath(
  nodes: TreeNode[],
  groupPath: string[],
  itemQuery: string,
  groupsOnly: boolean,
  parentPath: string[] = []
): SearchResult[] {
  const results: SearchResult[] = []
  const currentFilter = groupPath[0]
  const remainingPath = groupPath.slice(1)

  for (const node of nodes) {
    if (node.type !== 'group') continue
    const group = node as GroupNode
    const path = [...parentPath, group.name]

    if (groupMatches(group.name, currentFilter)) {
      if (remainingPath.length === 0) {
        // Deepest group segment matched
        if (itemQuery) {
          results.push(...searchInChildren(group.children, itemQuery, groupsOnly, path))
        } else {
          // No item query, return the matched group itself
          results.push({ node: group, path: parentPath })
        }
      } else {
        // More group segments to match, search within this group's children
        results.push(
          ...searchWithGroupPath(group.children, remainingPath, itemQuery, groupsOnly, path)
        )
      }
    } else {
      // Group didn't match, but keep searching deeper in its children
      results.push(
        ...searchWithGroupPath(group.children, groupPath, itemQuery, groupsOnly, path)
      )
    }
  }

  return results
}

export function searchTree(
  nodes: TreeNode[],
  query: string,
  groupsOnly: boolean,
  parentPath: string[] = []
): SearchResult[] {
  const parsed = parseQuery(query)

  if (parsed.groupPath.length > 0) {
    return searchWithGroupPath(nodes, parsed.groupPath, parsed.itemQuery, groupsOnly)
  }

  return searchInChildren(nodes, parsed.itemQuery, groupsOnly, parentPath)
}
