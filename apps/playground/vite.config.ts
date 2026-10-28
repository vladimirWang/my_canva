import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	// 直接指向源码，改组件后 playground 立即热更新，不需要先 build
	resolve: {
		alias: {
			"ai-image-panel-react": fileURLToPath(
				new URL("../../packages/react/src/index.ts", import.meta.url)
			),
		},
	},
	server: {
		port: 5173,
	},
});
