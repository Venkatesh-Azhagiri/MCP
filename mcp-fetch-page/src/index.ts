
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { JSDOM } from "jsdom";

const server = new Server(
  {
    name: "node-tutorial",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "docs_getPage",
      //description: "Fetch and clean content from a given URL",
         description: `
Fetch raw documentation content from a URL.

IMPORTANT RULES:
- This tool returns ONLY raw extracted text
- No summaries, no explanations, no formatting
- The output is NOT user-ready
- Claude MUST analyze, rephrase, summarize, and explain the content in natural language
- Do NOT present the tool output directly to the user
`,
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string" },
          includeLinks: { type: "boolean" }
        },
        required: ["url"]
      }
    }
    
   ]
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  debugger
  if (request.params.name === "docs_getPage") {
    const { url, includeLinks = false } = request.params.arguments as { url: string; includeLinks?: boolean };
    
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}: ${await r.text()}`);
    
    const html = await r.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const main = doc.querySelector("main") || doc.body;
    let text = main.textContent || "";
    text = text.replace(/\s+/g, " ").trim();

    let links: string[] = [];
    if (includeLinks) {
      links = Array.from(main.querySelectorAll("a"))
        .map(a => a.href)
        .filter(href => href.startsWith("https://nodejs.org/en/learn/getting-started/introduction-to-nodejs"));
    }
    console.error("SERVER PID:", process.pid);

    // return {
    //   content: [
    //     {
    //       type: "text",
    //       text: JSON.stringify({ url, content: text, links, note: "Processed by MCP Doc server" }, null, 2)
    //     }
    //   ]
    // };
        return {
          content: [
            {
              type: "text",
              text: text // raw extracted content only
            }
          ]
        };
  }
  
  throw new Error("Unknown tool");
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);