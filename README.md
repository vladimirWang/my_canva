# ai-image-panel-react

React 组件库，用于把「AI 图片处理」能力（本地分析 / 换背景 / 智能优化）封装成可直接安装的 npm 组件。

当前为 **发布流程验证版（0.0.1）**：只包含一个 `TestButton` 样板组件，用来跑通「本地开发 → 打包 → 发布 npm → 安装验证」全链路。后续会把 `repo_cms/repo_frontend` 中的 `ImageAIPanel` + `usePyodideImage` + `pyodideImageService` 抽取进来。

## 本地体验

```bash
npm install
npm run dev      # 打开 http://localhost:5173 查看测试按钮
```

## 构建

```bash
npm run build    # 产物输出到 dist/（ESM + CJS + d.ts）
npm pack --dry-run   # 检查将发布哪些文件
```

构建配置：

- [vite.config.ts](./vite.config.ts)：lib 模式打包，`react` / `react-dom` 作为 external（peer 依赖，不打进产物）
- [tsconfig.build.json](./tsconfig.build.json)：仅输出类型声明
- package.json 的 `files` 只包含 `dist`，`prepublishOnly` 自动执行构建

## 组件用法

```tsx
import { TestButton } from "ai-image-panel-react";

export default function Demo() {
	return (
		<TestButton size="medium" onClick={() => console.log("clicked")}>
			AI 智能处理
		</TestButton>
	);
}
```

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `children` | `ReactNode` | `"AI 智能处理"` | 按钮文案 |
| `onClick` | `() => void` | - | 点击回调 |
| `loading` | `boolean` | `false` | 加载态，自动禁用点击 |
| `disabled` | `boolean` | `false` | 禁用 |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | 尺寸 |
| `variant` | `"primary" \| "ghost"` | `"primary"` | 风格 |
| `fullWidth` | `boolean` | `false` | 撑满父容器 |
| `className` / `style` | - | - | 自定义样式 |

## 发布步骤

> 本机 npm registry 当前是 `https://registry.npmmirror.com`（只读镜像，**不能发布**）。发布时显式指定官方源即可，不用改全局配置。

1. 登录 npm 账号（首次需要先在 npmjs.com 注册并验证邮箱；开启 2FA 的账号发布会要求输入 OTP）：

   ```bash
   npm login --registry=https://registry.npmjs.org
   npm whoami --registry=https://registry.npmjs.org
   ```

2. 确认包名可用。`ai-image-panel-react` 在官方源查不到，当前可用；若名称已被占用，改用 scoped 名（例如 `@你的用户名/ai-image-panel-react`），并同步修改 `package.json` 的 `name`。

3. 升版本号（首次发布 0.0.1 可跳过；后续每次发布必须升版本，否则报 `E403`）：

   ```bash
   npm version patch   # 0.0.1 -> 0.0.2（minor / major 同理）
   ```

4. 构建并检查产物：

   ```bash
   npm run build
   npm pack --dry-run
   ```

5. 发布（`prepublishOnly` 会自动再构建一次）：

   ```bash
   npm publish --access public --registry=https://registry.npmjs.org
   ```

6. 验证：

   ```bash
   npm view ai-image-panel-react version --registry=https://registry.npmjs.org
   ```

   在任意 React 项目里安装并渲染（镜像同步约几分钟）：

   ```bash
   npm i ai-image-panel-react
   ```

   如果安装时镜像源还没同步，可临时用 `npm i ai-image-panel-react --registry=https://registry.npmjs.org`。

7. 发错了：24 小时内可撤回（超过 24h 只能发新版本 / 联系 npm 支持）：

   ```bash
   npm unpublish ai-image-panel-react@0.0.1 --force --registry=https://registry.npmjs.org
   ```

### 常见报错：E403 Two-factor authentication

```
403 403 Forbidden - PUT https://registry.npmjs.org/ai-image-panel-react
Two-factor authentication or granular access token with bypass 2fa enabled is required to publish packages.
```

npm 的 2FA 目前只支持 **security key（WebAuthn：Touch ID / Face ID / 系统通行密钥 / YubiKey）**，不再支持验证器 App 的 TOTP，所以 `--otp` 拿不到也用不上。发布要求满足其一：

**方式一（推荐）：账号开启 2FA，用安全密钥确认发布**

1. npmjs.com → Account → Settings → Two-Factor Authentication → 添加 security key（Touch ID 或 Apple 密码即可完成）
2. 用网页登录方式重新登录，让 CLI 拿到可发布的会话：

```bash
npm login --auth-type=web --registry=https://registry.npmjs.org
npm publish --access public --registry=https://registry.npmjs.org
```

发布时 npm 会通过浏览器完成一次安全密钥确认（Touch ID / 通行密钥），不需要输入验证码。

**方式二：使用带「Bypass 2FA」的 Granular Access Token**

1. 打开 npmjs.com → Access Tokens → Generate New Token → Granular Access Token
2. 勾选 `Read and write`，Packages 选 `All packages`，并勾选 `Bypass 2FA`
3. 写入用户级配置（不要提交到仓库）后正常发布：

```bash
npm config set //registry.npmjs.org/:_authToken=<TOKEN>
npm publish --access public --registry=https://registry.npmjs.org
```

注意：从 2026-08 起 bypass-2FA token 不能用于账号身份/治理类操作，2027-01 起直接发布也会受限，长期还是建议走方式一。

## 后续规划

- 抽取 `ImageAIPanel`（分析结果 / 主色调换背景 / 一键优化）
- 抽取 `usePyodideImage` + `pyodideImageService`，把 `public/py/image_processor.py` 作为组件包内置资源
- 去掉对宿主项目 `antd` 的强依赖，改为可选 peer 依赖或内置轻量 UI
