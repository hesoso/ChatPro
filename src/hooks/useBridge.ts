const bridgeHandlers = {
  minimize: () => window.bridge.minimize(),
  closeWindow: () => window.bridge.closeWindow(),
  toggleMaximize: () => window.bridge.toggleMaximize()
}

export const useBridge = () => {
  return bridgeHandlers
}
