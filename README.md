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
npm install && npm run build && npm run serve
```

## Documentation

See [PLAN.md](./PLAN.md) for:
- Installation details
- Example prompts
- Generated architecture
- Best practices

## Resources

- [MCP Apps Extension](https://github.com/modelcontextprotocol/ext-apps)
- [Specification (SEP-1865)](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx)
- [MCP Protocol Docs](https://modelcontextprotocol.io)
