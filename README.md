# mcp-apps

Build interactive UI applications that render inside MCP hosts using the `create-mcp-app` skill.

## Quick Start

### 1. Install the Skill

**Claude Code Plugin:**
```bash
/plugin marketplace add modelcontextprotocol/ext-apps
/plugin install mcp-apps@modelcontextprotocol-ext-apps
```

**Manual (Global):**
```bash
git clone https://github.com/modelcontextprotocol/ext-apps.git
cp -r ext-apps/plugins/mcp-apps/skills/create-mcp-app ~/.claude/skills/create-mcp-app
```

### 2. Create Your App

Ask your agent:
```
Create an MCP App that displays a color picker
```

### 3. Run Your App

```bash
cd apps/color-picker
npm install && npm run build && npm run serve
```

The server will start on `http://localhost:3001/mcp`

### 4. Test Locally in Browser

Open `apps/color-picker/test.html` in your browser to test the app locally:

```bash
open apps/color-picker/test.html
```

**Note:** Don't navigate to `http://localhost:3001/mcp` directly in your browser - it requires specific MCP protocol headers. Use the test page instead.

### 5. Configure Claude Desktop (Optional)

To use the app in Claude Desktop, add this to your config file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "color-picker": {
      "command": "node",
      "args": ["<absolute-path-to>/mcp-apps/apps/color-picker/dist/index.js"]
    }
  }
}
```

Then restart Claude Desktop and use the `pick-color` tool.

## Documentation

See [PLAN.md](./PLAN.md) for:
- Installation details
- Example prompts
- Generated architecture
- Best practices

## Troubleshooting

### "Not Acceptable: Client must accept text/event-stream"

This error is expected when accessing the MCP endpoint directly in a browser. The MCP server uses Server-Sent Events (SSE) and requires specific headers. Instead:
- Use the `test.html` page for browser testing
- Configure Claude Desktop or another MCP client

### Server Not Starting

Make sure you've built the project first:
```bash
npm run build
```

### Port Already in Use

If port 3001 is already in use, stop the existing process:
```bash
kill $(lsof -t -i:3001)
```

## Resources

- [MCP Apps Extension](https://github.com/modelcontextprotocol/ext-apps)
- [Specification (SEP-1865)](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx)
- [MCP Protocol Docs](https://modelcontextprotocol.io)
