// agent.mts — Claude Agents SDK + Composio

import "dotenv/config";
import { Composio } from "@composio/core";
import { ClaudeAgentSDKProvider } from "@composio/claude-agent-sdk";
import { createSdkMcpServer, query } from "@anthropic-ai/claude-agent-sdk";

const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY,
  provider: new ClaudeAgentSDKProvider(),
});
const userId = "user_mb1g3o";

// Create a tool router session
const session = await composio.create(userId);
const tools = await session.tools();

const customServer = createSdkMcpServer({
  name: "composio",
  version: "1.0.0",
  tools,
});

for await (const content of query({
  prompt: "Star the composiohq/composio repo on GitHub",
  options: {
    mcpServers: { composio: customServer },
    permissionMode: "bypassPermissions",
  },
})) {
  if (content.type === "assistant") {
    console.log("Claude:", content.message);
  }
}
