# SpeakEasy

英语口语练习与讨论系统

## 技术栈

- **前端框架**: Next.js 16.2.4 (App Router)
- **UI库**: React 19.2.4
- **语言**: TypeScript
- **样式**: Tailwind CSS 4 + CSS
- **图标**: Lucide React
- **AI API**: 阿里云通义千问 (DashScope / ARK)

## 功能特性

- 多人在线讨论房间
- 实时语音识别输入 (Web Speech API)
- 轮转发言机制
- 观点投票系统 (同意/反对)
- AI 智能生成讨论摘要

## 项目启动

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

在项目根目录创建 `.env.local` 文件：

```env
ARK_API_KEY=your_api_key_here
```

获取 API Key: [阿里云 ARK 控制台](https://dashscope.console.aliyun.com/)

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 访问应用

打开浏览器访问: http://localhost:3000

## 其他命令

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 代码检查
npm run lint
```

## 项目结构

```
src/app/
├── page.tsx              # 主页面 (状态管理)
├── layout.tsx            # 布局组件
├── globals.css          # 全局样式
├── components/          # UI 组件
│   ├── InitialView.tsx       # 初始页面
│   ├── GroupFoundView.tsx   # 分组完成
│   ├── ListenerView.tsx     # 听众视图
│   ├── QueuedView.tsx       # 排队视图
│   ├── TurnNotificationView.tsx  # 轮转通知
│   ├── SpeakingStageView.tsx      # 发言舞台
│   ├── AISummaryView.tsx          # AI 摘要
│   └── types.ts            # 类型定义
└── api/                  # API 路由
    ├── generate-summary/  # 生成摘要
    └── generate-prompt/   # 生成提示
```

## License

MIT