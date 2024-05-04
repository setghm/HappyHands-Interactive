const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
	toggleButton: (toggle) => ipcRenderer.on('button:toggle', toggle),
	buttonPressed: (callback) => ipcRenderer.on('button:pressed', callback),
	buttonReleased: (callback) => ipcRenderer.on('button:released', callback),
	getPortList: () => ipcRenderer.invoke('get:ports'),
	deviceOpen: (path) => ipcRenderer.send('device-open', path)
	//deviceSelected: (path) => ipcRenderer.send('device-selected', path),
})
