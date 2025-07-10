/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

interface I_DB_API_RESPONSE<T> {
  data: T
  success: boolean
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer
  databaseApi: {
    onMessage: (args: I_OnMessageParams) => void
    getMessages: (args: I_GetMessagesParams) => I_DB_API_RESPONSE<[]>
    getSessions: (args: I_GetSessionsParams) => I_DB_API_RESPONSE<[]>
  }
  bridge: {
    toggleDevTool: () => void,
    minimize: () => void,
    closeWindow: () => void,
    toggleMaximize: () => void,
  }
}
