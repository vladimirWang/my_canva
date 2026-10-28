import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { TestButton } from "../src/index";

function Demo() {
	const [count, setCount] = useState(0);
	const [loading, setLoading] = useState(false);

	const simulate = () => {
		setLoading(true);
		window.setTimeout(() => {
			setLoading(false);
			setCount(c => c + 1);
		}, 1200);
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				boxSizing: "border-box",
				padding: "64px 24px",
				fontFamily:
					'-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif',
				background: "linear-gradient(160deg, #fff7ed 0%, #ffffff 60%)",
				color: "#1f2937",
			}}
		>
			<div style={{ maxWidth: 720, margin: "0 auto" }}>
				<h1 style={{ fontSize: 28, margin: "0 0 8px" }}>ai-image-panel-react</h1>
				<p style={{ color: "#6b7280", margin: "0 0 40px" }}>
					本地体验页 · 点击按钮可模拟一次 AI 处理流程
				</p>

				<Section title="尺寸">
					<TestButton size="small" onClick={simulate} />
					<TestButton size="medium" onClick={simulate} />
					<TestButton size="large" onClick={simulate} />
				</Section>

				<Section title="风格">
					<TestButton variant="primary" onClick={simulate} />
					<TestButton variant="ghost" onClick={simulate}>
						幽灵按钮
					</TestButton>
				</Section>

				<Section title="状态">
					<TestButton loading>加载中</TestButton>
					<TestButton disabled>已禁用</TestButton>
					<TestButton variant="ghost" disabled>
						已禁用
					</TestButton>
				</Section>

				<Section title="自定义">
					<TestButton
						fullWidth
						loading={loading}
						onClick={simulate}
						style={{ maxWidth: 320 }}
					>
						模拟处理（{count} 次完成）
					</TestButton>
				</Section>

				<p style={{ marginTop: 40, fontSize: 12, color: "#9ca3af" }}>
					组件源码：src/TestButton.tsx · 打包产物：dist/index.js
				</p>
			</div>
		</div>
	);
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<div style={{ marginBottom: 32 }}>
			<div
				style={{
					fontSize: 12,
					fontWeight: 600,
					color: "#9ca3af",
					letterSpacing: 1,
					marginBottom: 12,
				}}
			>
				{title}
			</div>
			<div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
				{children}
			</div>
		</div>
	);
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Demo />
	</StrictMode>
);
