const information = document.getElementById("info");
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;

let version = window.location.hash.substring(1);
document.getElementById("version").innerText = version;

const func = async () => {
	//! 渲染进程，调用主进程方法
	const response = await window.versions.ping();
	console.log("渲染进程接收主进程的消息：", response); // prints out 'pong'
};

func();

//! 1.渲染进程往主进程发送消息
window.electronAPI.sendMessageToMain("Hello from the renderer process!");
//! 2.渲染进程接收到主进程的消息
window.electronAPI.receiveMessageFromMain((message) => {
	console.log(`Received message from main process: ${message}`);
});
//! 3.渲染进程接收到主进程的更新消息
window.electronAPI.receiveUpdateMessageFromMain((message) => {
	console.log(`receiveUpdateMessageFromMain: ${message}`);
	var container = document.getElementById("message");
	var div = document.createElement("div");
	div.innerHTML = message;
	container.appendChild(div);
});
