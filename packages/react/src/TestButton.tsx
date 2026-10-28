import { useState, type CSSProperties, type ReactNode } from "react";

export interface TestButtonProps {
	/** 按钮文案 */
	children?: ReactNode;
	/** 点击回调 */
	onClick?: () => void;
	/** 加载态（显示转圈并禁用点击） */
	loading?: boolean;
	/** 禁用 */
	disabled?: boolean;
	/** 尺寸 */
	size?: "small" | "medium" | "large";
	/** 样式风格 */
	variant?: "primary" | "ghost";
	/** 是否撑满父容器宽度 */
	fullWidth?: boolean;
	/** 自定义 className（追加在最外层） */
	className?: string;
	/** 自定义样式（与内置样式合并） */
	style?: CSSProperties;
}

const SIZES = {
	small: { height: 28, padding: "0 12px", fontSize: 12, icon: 14, gap: 6 },
	medium: { height: 36, padding: "0 16px", fontSize: 14, icon: 16, gap: 8 },
	large: { height: 44, padding: "0 22px", fontSize: 16, icon: 18, gap: 10 },
} as const;

function SparkleIcon({ size }: { size: number }) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
			<path d="M18.5 15.5l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7.7-1.9z" />
		</svg>
	);
}

function Spinner({ size, color }: { size: number; color: string }) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth="2.2"
			strokeLinecap="round"
			style={{ animation: "ai-test-button-spin 0.8s linear infinite" }}
			aria-hidden="true"
		>
			<path d="M12 3a9 9 0 1 0 9 9" />
		</svg>
	);
}

/** 供演示体验的测试按钮，也是组件库发布流程的样板组件 */
export function TestButton({
	children = "AI 智能处理",
	onClick,
	loading = false,
	disabled = false,
	size = "medium",
	variant = "primary",
	fullWidth = false,
	className,
	style,
}: TestButtonProps) {
	const [hovered, setHovered] = useState(false);
	const [active, setActive] = useState(false);

	const s = SIZES[size];
	const isDisabled = disabled || loading;
	const isPrimary = variant === "primary";

	const base: CSSProperties = {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		gap: s.gap,
		height: s.height,
		padding: s.padding,
		fontSize: s.fontSize,
		fontWeight: 600,
		fontFamily: "inherit",
		lineHeight: 1,
		borderRadius: 8,
		border: isPrimary ? "1px solid transparent" : "1px solid #fdba74",
		color: isPrimary ? "#fff" : "#ea580c",
		background: isPrimary
			? "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)"
			: "#fff",
		boxShadow: isPrimary
			? hovered && !isDisabled
				? "0 6px 18px rgba(249, 115, 22, 0.35)"
				: "0 2px 8px rgba(249, 115, 22, 0.25)"
			: "none",
		cursor: isDisabled ? "not-allowed" : "pointer",
		opacity: isDisabled ? 0.55 : 1,
		transform: active && !isDisabled ? "translateY(1px)" : "none",
		transition: "box-shadow 160ms ease, transform 160ms ease, opacity 160ms ease",
		userSelect: "none",
		width: fullWidth ? "100%" : undefined,
		...style,
	};

	return (
		<>
			<style>{"@keyframes ai-test-button-spin { to { transform: rotate(360deg); } }"}</style>
			<button
				type="button"
				className={className}
				style={base}
				disabled={isDisabled}
				aria-busy={loading}
				onClick={onClick}
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => {
					setHovered(false);
					setActive(false);
				}}
				onMouseDown={() => setActive(true)}
				onMouseUp={() => setActive(false)}
			>
				{loading ? (
					<Spinner size={s.icon} color={isPrimary ? "#fff" : "#ea580c"} />
				) : (
					<SparkleIcon size={s.icon} />
				)}
				<span>{loading ? "处理中..." : children}</span>
			</button>
		</>
	);
}

export default TestButton;
