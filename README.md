<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1tGf7yY1d3s-vBVk-Ra6b91KQggveITqV

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

### 方式一：本地手动部署

1. 运行 `npm run predeploy`（等价于 `npm run build`）产出最新 `dist/`。
2. 执行 `npm run deploy`，`gh-pages` 会将 `dist` 推送到仓库的 `gh-pages` 分支。
3. 在 GitHub 仓库 **Settings → Pages** 中，将 Source 设为 `gh-pages` 分支根目录，几分钟后即可通过 <https://kvenlin.github.io/VlogLens/> 访问。

> 注意：部署前请确保 `vite.config.ts` 的 `base` 已设置为 `/VlogLens/`，否则静态资源路径会错误。

### 方式二：GitHub Actions 自动部署

本仓库包含 `.github/workflows/deploy.yml`，push 到 `main` 或手动触发 workflow 即可：

1. 在仓库 Settings → Pages 中确认 Source 选择 **GitHub Actions**。
2. 提交代码到 `main`，Actions 会自动执行 `npm ci && npm run build` 并将 `dist` 发布到 Pages。
3. Workflow 内使用的 Node 版本为 20，可根据需要调整 `node-version`。

如需自定义域名，可在根目录添加 `CNAME` 文件，并在 GitHub Pages 中设置自定义域。
