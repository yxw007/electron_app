const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const log = require("electron-log");
const { autoUpdater } = require("electron-updater");

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
log.info("App starting...");

let win;
const createWindow = () => {
	win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});

	// win.loadFile("index.html");
	win.loadURL(`file://${__dirname}/index.html#v${app.getVersion()}`);
};

function sendStatusToWindow(text) {
	log.info(text);
	win.webContents.send("message", { message: text });
}

autoUpdater.on("checking-for-update", () => {
	sendStatusToWindow("Checking for update...");
});
autoUpdater.on("update-available", (info) => {
	sendStatusToWindow("Update available.");
});
autoUpdater.on("update-not-available", (info) => {
	sendStatusToWindow("Update not available.");
});
autoUpdater.on("error", (err) => {
	sendStatusToWindow("Error in auto-updater. " + err);
});
autoUpdater.on("download-progress", (progressObj) => {
	let log_message = "Download speed: " + progressObj.bytesPerSecond;
	log_message = log_message + " - Downloaded " + progressObj.percent + "%";
	log_message =
		log_message +
		" (" +
		progressObj.transferred +
		"/" +
		progressObj.total +
		")";
	sendStatusToWindow(log_message);
});
autoUpdater.on("update-downloaded", (info) => {
	sendStatusToWindow("Update downloaded");
	//! 下载完后立即更新
	autoUpdater.quitAndInstall();
});

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

app.whenReady().then(() => {
	autoUpdater.checkForUpdatesAndNotify();
	console.log("app ready: checkForUpdatesAndNotify");
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		console.log("quit");
		app.quit();
	}
});
