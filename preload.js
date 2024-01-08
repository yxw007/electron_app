const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("versions", {
	node: () => process.versions.node,
	chrome: () => process.versions.chrome,
	electron: () => process.versions.electron,
	//! 给桥上线添加对应方法
	ping: (name) => ipcRenderer.invoke("ping", name),
	// we can also expose variables, not just functions
});

//! 3.添加渲染进程与主进程的桥梁接口
contextBridge.exposeInMainWorld("electronAPI", {
	sendMessageToMain: (message) => {
		ipcRenderer.send("message-from-renderer", message);
	},
	receiveMessageFromMain: (callback) => {
		ipcRenderer.on("message-from-main", (event, message) => {
			callback(message);
		});
	},
	receiveUpdateMessageFromMain: (callback) => {
		ipcRenderer.on("message", (event, message) => {
			console.log("receiveUpdateMessageFromMain:", message);
			callback(message.message);
			console.log("receiveUpdateMessageFromMain:", callback);
		});
	},
});
