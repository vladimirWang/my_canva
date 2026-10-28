# ai-image-panel-react

React 组件库（pnpm monorepo）：把「AI 图片处理」能力封装成可安装的 npm 组件。

当前是**最小可发布版本 `0.0.1`**，只有一个 `TestButton` 样板组件，用来跑通「开发 → 构建 → 发布 → 安装」链路；后续再抽 `ImageAIPanel` 等真实业务组件。

## 目录结构

```
my_canva/
├── package.json          # 根：private，只放 workspace 脚本
├── pnpm-workspace.yaml   # 声明 packages/* 和 apps/* 为 workspace
├── packages/
│   └── react/            # 唯一可发布的包：ai-image-panel-react
│       ├── src/          # 组件源码（TestButton.tsx / index.ts）
│       ├── vite.config.ts      # lib 模式打包，react 外置
│       ├── tsconfig.json       # 开发用（noEmit）
│       └── tsconfig.build.json # 只输出 d.ts
└── apps/
    └── playground/       # 本地体验页，不发布
```

两个 workspace 各自管理依赖；根目录不装 React/Vite。以后要加 `packages/core`（框架无关的服务），直接建目录，`packages/*` 会自动纳入 workspace，无需改配置。

## 常用命令

```bash
pnpm install     # 安装全部 workspace 依赖
pnpm dev         # 启动 playground：http://localhost:5173
pnpm build       # 构建 packages/react 到 dist/（ESM + CJS + d.ts）
pnpm publish:pkg # 发布 packages/react 到 npm
```

playground 通过 alias 直接引用 `packages/react/src`，改组件即时热更新，不用先 build。

## 组件用法

```tsx
import { TestButton } from "ai-image-panel-react";

<TestButton size="medium" onClick={() => console.log("clicked")}>
	AI 智能处理
</TestButton>
```

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `children` | `ReactNode` | `"AI 智能处理"` | 文案 |
| `onClick` | `() => void` | - | 点击回调 |
| `loading` | `boolean` | `false` | 加载态并禁用 |
| `disabled` | `boolean` | `false` | 禁用 |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | 尺寸 |
| `variant` | `"primary" \| "ghost"` | `"primary"` | 风格 |
| `fullWidth` | `boolean` | `false` | 撑满父容器 |
| `className` / `style` | - | - | 自定义样式 |

## 发布步骤

> 本机 registry 是 `https://registry.npmmirror.com`（只读镜像，不能发布），发布命令已显式指定官方源。

1. 登录（npm 2FA 只支持 security key，用浏览器 + Touch ID 完成）：

   ```bash
   npm login --auth-type=web --registry=https://registry.npmjs.org
   ```

2. 升版本（首次 0.0.1 可跳过）。工作区有未提交改动时用 `--no-git-tag-version`：

   ```bash
   cd packages/react && npm version patch --no-git-tag-version
   ```

3. 构建并检查打包内容：

   ```bash
   pnpm build
   cd packages/react && npm pack --dry-run
   ```

4. 发布（根目录执行，已带 `--no-git-checks`）：

   ```bash
   pnpm publish:pkg
   ```

5. 验证：

   ```bash
   npm view ai-image-panel-react version --registry=https://registry.npmjs.org
   ```

### 常见报错：E403 Two-factor authentication

```
403 403 Forbidden - PUT https://registry.npmjs.org/ai-image-panel-react
Two-factor authentication or granular access token with bypass 2fa enabled is required to publish packages.
```

npm 的 2FA 只支持 **security key（WebAuthn：Touch ID / Face ID / 系统通行密钥 / YubiKey）**，没有验证器 App 的 TOTP，所以 `--otp` 用不上。发布满足其一即可：

**方式一（推荐）：账号开启 2FA**

1. npmjs.com → Account → Settings → Two-Factor Authentication → 添加 security key
2. `npm login --auth-type=web --registry=https://registry.npmjs.org` 后发布，会通过浏览器做一次安全密钥确认

**方式二：带 Bypass 2FA 的 Granular Access Token**

1. npmjs.com → Access Tokens → Granular Access Token，勾选 `Read and write` + `All packages` + `Bypass 2FA`
2. 写入用户级配置（不要提交到仓库）后发布：

```bash
npm config set //registry.npmjs.org/:_authToken=<TOKEN>
pnpm publish:pkg
```

注意：2026-08 起 bypass-2FA token 不能用于账号身份/治理操作，2027-01 起直接发布也会受限，长期建议方式一。

### 发布后

```bash
npm i ai-image-panel-react
# 镜像同步前可临时指定官方源
npm i ai-image-panel-react --registry=https://registry.npmjs.org
```

撤回（24 小时内）：`npm unpublish ai-image-panel-react@0.0.1 --force --registry=https://registry.npmjs.org`

## 后续规划

- `packages/core`：抽 `usePyodideImage` + `pyodideImageService`（框架无关）
- `packages/react`：抽 `ImageAIPanel`，py 脚本作为包内资源
- 去掉宿主项目对 `antd` 的强依赖
