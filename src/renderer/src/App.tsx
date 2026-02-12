import React, { useState, useEffect } from 'react'
import { AppContextProvider, useAppContext } from './context/AppContext'
import Header from './components/Header/Header'
import SearchBar from './components/SearchBar/SearchBar'
import ListView from './components/ListView/ListView'
import ContextMenu from './components/ContextMenu/ContextMenu'
import Modal from './components/Modal/Modal'
import GroupForm from './components/GroupForm/GroupForm'
import ItemForm from './components/ItemForm/ItemForm'
import PasswordScreen from './components/PasswordScreen/PasswordScreen'
import styles from './App.module.css'

type AuthState = 'checking' | 'needs-setup' | 'locked' | 'unlocked'

function AppContent({ onLock }: { onLock: () => void }): React.ReactElement {
  const { modal, closeModal, toast } = useAppContext()

  const getModalTitle = (): string => {
    switch (modal.type) {
      case 'create-group':
        return 'Create Group'
      case 'create-item':
        return 'Create Item'
      case 'edit-group':
        return 'Edit Group'
      case 'edit-item':
        return 'Edit Item'
      default:
        return ''
    }
  }

  return (
    <div className={styles.app}>
      <Header onLock={onLock} />
      <SearchBar />
      <ListView />
      <ContextMenu />

      <Modal isOpen={modal.isOpen} title={getModalTitle()} onClose={closeModal}>
        {modal.type === 'create-group' && <GroupForm mode="create" />}
        {modal.type === 'edit-group' && (
          <GroupForm mode="edit" targetNode={modal.targetNode} />
        )}
        {modal.type === 'create-item' && <ItemForm mode="create" />}
        {modal.type === 'edit-item' && (
          <ItemForm mode="edit" targetNode={modal.targetNode} />
        )}
      </Modal>

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  )
}

export default function App(): React.ReactElement {
  const [authState, setAuthState] = useState<AuthState>('checking')

  useEffect(() => {
    window.api.checkAuthStatus().then(({ hasData }) => {
      setAuthState(hasData ? 'locked' : 'needs-setup')
    })
  }, [])

  if (authState === 'checking') {
    return <div className={styles.app} />
  }

  if (authState === 'needs-setup' || authState === 'locked') {
    return (
      <PasswordScreen
        mode={authState === 'needs-setup' ? 'setup' : 'unlock'}
        onAuthenticated={() => setAuthState('unlocked')}
      />
    )
  }

  const handleLock = async (): Promise<void> => {
    await window.api.lockVault()
    setAuthState('locked')
  }

  return (
    <AppContextProvider>
      <AppContent onLock={handleLock} />
    </AppContextProvider>
  )
}
