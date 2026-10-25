#!/usr/bin/env node
/**
 * dsh 启动器。
 *
 * 官方 `dsh` CLI 依赖 `import.meta.main`（Node >= 24 才提供）；在 Node 22/23 上该属性为
 * undefined，CLI 会直接静默退出。这里改为直接调用 dsh 导出的 `runCli`，参数解析与官方一致。
 * Node >= 24 时也可以直接使用 `dsh` 命令。
 */
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const require = createRequire(join(root, "package.json"));
const { runCli } = await import(require.resolve("@deepseek-ai/dsh/lib/bin.js"));

await runCli();
