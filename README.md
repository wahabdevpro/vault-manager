# Vault Manager

A secure desktop vault manager built with Electron, React, and TypeScript. Store sensitive credentials and text snippets in an encrypted, password-protected vault with nested group organization.

## Features

- **AES-256 Encryption** — All data is encrypted at rest with a master password. No recovery option; your data stays private.
- **Nested Groups** — Organize items into groups and sub-groups to any depth.
- **Quick Copy** — Click any item to instantly copy its content to the clipboard.
- **Smart Search** — Search items globally or use `group->sub-> query` syntax to drill into nested groups.
- **System Tray** — Runs in the background with a tray icon for quick access.
- **Dark Theme** — Clean, dark UI designed for everyday use.

## Tech Stack

- **Electron** — Cross-platform desktop app
- **React 18** — UI framework
- **TypeScript** — Type-safe codebase
- **electron-vite** — Fast build tooling with HMR
- **Node.js Crypto** — AES-256-GCM encryption with PBKDF2 key derivation

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
git clone https://github.com/wahabdevpro/vault-manager.git
cd vault-manager
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
npm run start
```

## Project Structure

```
src/
  main/           # Electron main process (window, tray, IPC, encryption)
  preload/        # Preload bridge (context-isolated API)
  renderer/       # React frontend
    src/
      components/ # UI components (Header, SearchBar, ListView, Modal, etc.)
      context/    # React context for app state
      styles/     # Global CSS and theme variables
      types/      # TypeScript type definitions
      utils/      # Search and tree navigation utilities
resources/        # App icons
```

## Search Syntax

| Query | Behavior |
|---|---|
| `keyword` | Search all items and groups globally |
| `group-> keyword` | Find groups starting with "group", search within for "keyword" |
| `group->sub-> keyword` | Nested group path — drill through multiple levels |
| `group->` | Show the matching group itself |

## License

MIT
