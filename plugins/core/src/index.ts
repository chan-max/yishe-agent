import type { Context } from "@deepseek-ai/cordis";

export const name = "yishe-core";

export interface YisheAgentConfig {
  agentName: string;
  designServerUrl: string;
}

export const config: YisheAgentConfig = {
  agentName: process.env.YISHE_AGENT_NAME || "yishe-agent",
  designServerUrl: process.env.YISHE_DESIGN_SERVER_URL || "http://127.0.0.1:1520",
};

export function apply(_ctx: Context) {
  console.log(
    `[${name}] loaded (name=${config.agentName}, designServer=${config.designServerUrl})`,
  );
}
