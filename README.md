# Yishe Agent

基于 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（`dsh`）插件内核与 [Hermes Agent](https://github.com/NousResearch/hermes-agent) 能力模型二次开发的智能体工具。

## 架构

- **内核**：`dsh`（Cordis「一切皆插件」）——模型、工具、技能、会话、沙箱、存储、执行循环、调度、UI 全部以插件形式组合或替换。
- **能力参考**：Hermes Agent 的持久记忆、自动技能创建、cron 调度、多通道网关。
- **本项目形态**：在 `dsh` 内核上叠加 `yishe` 自有插件，先用 `--patch` 覆盖层加载本地插件，后续可演化为独立的能力分层包（Service Definition / Provider / Consumer）。

## 目录结构

```
yishe-agent/
├── cordis.yml              # 本地插件覆盖层，注册 plugins/* 到 dsh
├── plugins/
│   ├── core/               # 基础服务：运行时配置、日志、公共上下文
│   └── tools-yishe/        # yishe 业务工具（示例：yishe_agent_info）
└── package.json            # npm workspaces + dsh 依赖
```

## 运行

```bash
npm install
npm run dev        # 启动 dsh Web UI，默认 http://127.0.0.1:3080 并自动打开浏览器
npm start          # 同上，但不自动打开浏览器
```

启动后终端会打印带 token 的访问地址（`http://127.0.0.1:3080/?token=...`），首次访问必须带 token。
进入后：**设置 → 模型** 填入 DeepSeek API Key，**选择工作区** 选中本仓库目录，即可开始对话。

> Node 版本：官方 `dsh` CLI 依赖 `import.meta.main`（Node >= 24）。本仓库的 `bin/dsh.mjs`
> 直接调用 dsh 的 `runCli`，因此 Node 22/23 也能启动；Node >= 24 可直接用 `dsh` 命令。

## 插件

插件是一个导出 `name` 与 `apply(ctx: Context)` 的 TypeScript 模块；通过 `ctx` 注册的东西在插件卸载时自动清理。

| 插件 | 说明 |
| --- | --- |
| `yishe-core` | 读取运行时配置（`YISHE_AGENT_NAME`、`YISHE_DESIGN_SERVER_URL`），后续挂载日志与公共服务 |
| `yishe-tools` | 通过 `ctx.tools.register(defineTool(...))` 注册业务工具，首个工具为 `yishe_agent_info` |

新增插件：在 `plugins/` 下建目录 → 写 `src/index.ts` → 在 `cordis.yml` 追加一条绝对路径。
（`cordis.yml` 里的插件路径是绝对路径，仓库位置变更后需要同步修改。）

## 环境变量

见 `.env.example`。当前读取：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `YISHE_AGENT_NAME` | `yishe-agent` | 运行时名称 |
| `YISHE_DESIGN_SERVER_URL` | `http://127.0.0.1:1520` | yishe 服务端地址，供后续业务工具调用 |
| `DEEPSEEK_API_KEY` | 空 | 也可在 Web UI 的设置里填写 |

## 后续规划

1. `plugins/memory` —— 持久记忆（用户画像、会话检索）
2. `plugins/skills` —— 技能自动生成 / 自改进 / 检索
3. `plugins/scheduler` —— cron 定时任务
4. `plugins/channels` —— Telegram / Discord / Webhook 通道
5. `plugins/bridge-hermes` —— 以 HTTP / MCP 侧车方式复用 Hermes 原生 Python 能力

## 上游版本

`dsh` 仍处于 developer preview，存在破坏性变更，升级前先看上游 CHANGELOG。
