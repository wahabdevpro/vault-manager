import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { AppData, TreeNode, GroupNode, ModalState, ContextMenuState, SearchResult } from '../types'
import { getCurrentChildren, getCurrentGroupId, getNavigationPath, getIdPathToNode } from '../utils/tree-utils'
import { searchTree } from '../utils/search-utils'

interface AppContextType {
  data: AppData
  navigationStack: string[]
  currentChildren: TreeNode[]
  currentGroupId: string | null
  currentPath: string[]
  searchQuery: string
  groupsOnly: boolean
  searchResults: SearchResult[]
  isSearching: boolean
  modal: ModalState
  contextMenu: ContextMenuState
  copiedItemId: string | null
  toast: string | null

  navigateInto: (groupId: string) => void
  navigateBack: () => void
  navigateToRoot: () => void
  navigateToLevel: (level: number) => void
  setSearchQuery: (query: string) => void
  setGroupsOnly: (value: boolean) => void
  openModal: (type: ModalState['type'], targetNode?: TreeNode | null) => void
  closeModal: () => void
  openContextMenu: (x: number, y: number, targetNode: TreeNode | null) => void
  closeContextMenu: () => void
  refreshData: () => Promise<void>
  updateData: (newData: AppData) => void
  showCopied: (itemId: string) => void
  showToast: (message: string) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppContextProvider')
  return ctx
}

export function AppContextProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [data, setData] = useState<AppData>({ groups: [] })
  const [navigationStack, setNavigationStack] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [groupsOnly, setGroupsOnly] = useState(false)
  const [modal, setModal] = useState<ModalState>({ isOpen: false, type: null, targetNode: null })
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
    targetNode: null
  })
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const toastTimerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    window.api.loadData().then(setData)
  }, [])

  const currentChildren = getCurrentChildren(data, navigationStack)
  const currentGroupId = getCurrentGroupId(navigationStack)
  const currentPath = getNavigationPath(data, navigationStack)
  const isSearching = searchQuery.trim().length > 0
  const searchResults = isSearching
    ? searchTree(data.groups, searchQuery.trim(), groupsOnly)
    : []

  const navigateInto = useCallback((groupId: string) => {
    const fullPath = getIdPathToNode(data.groups, groupId)
    if (fullPath) {
      setNavigationStack(fullPath)
    } else {
      setNavigationStack((prev) => [...prev, groupId])
    }
    setSearchQuery('')
  }, [data])

  const navigateBack = useCallback(() => {
    setNavigationStack((prev) => prev.slice(0, -1))
  }, [])

  const navigateToRoot = useCallback(() => {
    setNavigationStack([])
  }, [])

  const navigateToLevel = useCallback((level: number) => {
    setNavigationStack((prev) => prev.slice(0, level))
  }, [])

  const openModal = useCallback(
    (type: ModalState['type'], targetNode: TreeNode | null = null) => {
      setModal({ isOpen: true, type, targetNode })
    },
    []
  )

  const closeModal = useCallback(() => {
    setModal({ isOpen: false, type: null, targetNode: null })
  }, [])

  const openContextMenu = useCallback((x: number, y: number, targetNode: TreeNode | null) => {
    setContextMenu({ isOpen: true, x, y, targetNode })
  }, [])

  const closeContextMenu = useCallback(() => {
    setContextMenu({ isOpen: false, x: 0, y: 0, targetNode: null })
  }, [])

  const refreshData = useCallback(async () => {
    const newData = await window.api.loadData()
    setData(newData)
  }, [])

  const updateData = useCallback((newData: AppData) => {
    setData(newData)
  }, [])

  const showCopied = useCallback((itemId: string) => {
    if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current)
    setCopiedItemId(itemId)
    copiedTimerRef.current = setTimeout(() => setCopiedItemId(null), 1500)
  }, [])

  const showToast = useCallback((message: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast(message)
    toastTimerRef.current = setTimeout(() => setToast(null), 1500)
  }, [])

  return (
    <AppContext.Provider
      value={{
        data,
        navigationStack,
        currentChildren,
        currentGroupId,
        currentPath,
        searchQuery,
        groupsOnly,
        searchResults,
        isSearching,
        modal,
        contextMenu,
        copiedItemId,
        toast,
        navigateInto,
        navigateBack,
        navigateToRoot,
        navigateToLevel,
        setSearchQuery,
        setGroupsOnly,
        openModal,
        closeModal,
        openContextMenu,
        closeContextMenu,
        refreshData,
        updateData,
        showCopied,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
