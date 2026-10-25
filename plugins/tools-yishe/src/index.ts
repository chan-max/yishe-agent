import type { Context } from "@deepseek-ai/cordis";
import { defineTool } from "@deepseek-ai/dsh-tools";

export const name = "yishe-tools";
export const inject = ["tools"];

const VERSION = "0.1.0";

function readConfig() {
  return {
    agentName: process.env.YISHE_AGENT_NAME || "yishe-agent",
    designServerUrl: process.env.YISHE_DESIGN_SERVER_URL || "http://127.0.0.1:1520",
  };
}

export function apply(ctx: Context) {
  ctx.tools.register(
    defineTool({
      name: "yishe_agent_info",
      description:
        "Show Yishe Agent runtime information: agent name, version and the yishe design server endpoint.",
      parameters: {},
      output: {
        schema: { type: "string" },
        render: (_args, value) => [{ type: "text", text: value }],
      },
      async execute() {
        const { agentName, designServerUrl } = readConfig();
        return [
          `agent: ${agentName}`,
          `version: ${VERSION}`,
          `design server: ${designServerUrl}`,
        ].join("\n");
      },
    }),
  );
}
