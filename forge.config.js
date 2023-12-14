module.exports = {
	packagerConfig: {
		asar: true,
	},
	rebuildConfig: {},
	makers: [
		{
			name: "@electron-forge/maker-squirrel",
			config: {
				certificateFile: "./cert/server.pfx",
				certificatePassword: "7758258",
			},
		},
		{
			name: "@electron-forge/maker-zip",
			platforms: ["darwin"],
		},
		{
			name: "@electron-forge/maker-deb",
			config: {},
		},
		{
			name: "@electron-forge/maker-rpm",
			config: {},
		},
	],
	plugins: [
		{
			name: "@electron-forge/plugin-auto-unpack-natives",
			config: {},
		},
	],
	publishers: [
		{
			name: "@electron-forge/publisher-github",
			config: {
				repository: {
					owner: "yxw007",
					name: "electron_app",
				},
				prerelease: false,
				draft: true,
			},
		},
	],
};
