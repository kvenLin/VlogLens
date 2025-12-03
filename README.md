<div align="center">

# 📷 VlogLens

**你的私人 AI 视频日记助手**

将随手拍的视频片段，一键转化为图文并茂的视觉日记和小红书风格种草文案

[![Deploy to GitHub Pages](https://github.com/kvenLin/VlogLens/actions/workflows/deploy.yml/badge.svg)](https://github.com/kvenLin/VlogLens/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/demo-online-brightgreen)](https://kvenlin.github.io/VlogLens/)

[在线体验](https://kvenlin.github.io/VlogLens/) · [获取 API Key](https://aistudio.google.com/apikey)

</div>

---

## ✨ 功能特点

- 🎬 **视频帧提取** — 自动从视频中均匀抽取关键帧，无需上传完整视频
- 🤖 **AI 智能分析** — 基于 Gemini 2.5 Flash 理解视频内容，生成结构化日记
- 📝 **视觉日记生成** — 时间轴式图文排版，每个时刻配上精选截图
- 📱 **种草文案** — 自动生成小红书/Instagram 风格的社交媒体文案
- 🔒 **隐私安全** — 视频纯前端处理，不上传任何服务器
- 💾 **本地存储** — API Key 保存在浏览器本地，刷新不丢失

## 🚀 快速开始

### 在线使用

1. 访问 [https://kvenlin.github.io/VlogLens/](https://kvenlin.github.io/VlogLens/)
2. 点击右上角设置按钮，输入你的 [Gemini API Key](https://aistudio.google.com/apikey)
3. 拖入或选择一个视频文件
4. 等待 AI 生成你的视觉日记！

### 本地开发

```bash
# 克隆项目
git clone https://github.com/kvenLin/VlogLens.git
cd VlogLens

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 查看应用。

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| React 19 | 前端框架 |
| TypeScript | 类型安全 |
| Vite | 构建工具 |
| Tailwind CSS | 样式 (CDN) |
| Google Gemini 2.5 Flash | AI 模型 |
| GitHub Actions | 自动部署 |

## 📁 项目结构

```
VlogLens/
├── components/
│   ├── ApiKeySettings.tsx   # API 密钥设置弹窗
│   ├── DiaryCard.tsx        # 日记卡片展示
│   ├── ProcessingStatus.tsx # 处理进度状态
│   └── VideoUploader.tsx    # 视频上传组件
├── services/
│   └── geminiService.ts     # Gemini API 调用
├── utils/
│   └── videoUtils.ts        # 视频帧提取工具
├── App.tsx                  # 主应用组件
├── types.ts                 # TypeScript 类型定义
└── index.html               # 入口 HTML
```

## 🔐 API Key 配置

### 方式一：浏览器设置（推荐）

点击页面右上角的设置按钮，输入你的 Gemini API Key。密钥将安全存储在浏览器的 localStorage 中。

### 方式二：环境变量

创建 `.env.local` 文件：

```env
GEMINI_API_KEY=your_api_key_here
```

## 📦 部署

### GitHub Actions 自动部署

本项目已配置 GitHub Actions，推送到 `main` 分支会自动构建并部署到 GitHub Pages。

如需配置 API Key 到构建中：
1. 进入仓库 Settings → Secrets and variables → Actions
2. 添加 `GEMINI_API_KEY` secret

### 手动部署

```bash
npm run build    # 构建生产版本
npm run deploy   # 部署到 gh-pages 分支
```

## 📄 License

MIT

---

<div align="center">
  <sub>Built with ❤️ and Gemini AI</sub>
</div>
