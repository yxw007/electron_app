const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");

const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});

	win.loadFile("index.html");
};

app.whenReady().then(() => {
	//! 主进程，处理渲染进程的消息
	ipcMain.handle("ping", () => {
		return `I'm ipcMain`;
	});

	// ! 1.监听来自渲染进程的消息
	ipcMain.on("message-from-renderer", (event, arg) => {
		console.log("Renderer Process Message:", arg);

		//! 2.发送回复消息到渲染进程
		event.sender.send("message-from-main", "Hello from main process!");
	});

	createWindow();
	console.log(process.platform);
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		console.log("quit");
		app.quit();
	}
});
