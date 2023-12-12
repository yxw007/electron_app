const information = document.getElementById("info");
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;

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
