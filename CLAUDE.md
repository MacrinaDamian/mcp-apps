# Claude Context: MCP Apps Project

## Project Overview

This repository demonstrates **MCP Apps** - interactive UI applications that render inside Model Context Protocol (MCP) hosts. It showcases how to build rich, interactive tools that integrate seamlessly with AI assistants like Claude.

## Purpose

1. **Example Implementation**: Provides a working color-picker app as a reference
2. **Documentation**: Shows the architecture and patterns for building MCP Apps
3. **Development Guide**: Demonstrates the `create-mcp-app` skill workflow

## Repository Structure

```
mcp-apps/
├── README.md              # Quick start guide
├── PLAN.md                # Detailed architecture and best practices
├── CLAUDE.md              # This file - context for AI assistants
└── apps/
    └── color-picker/      # Example MCP App
        ├── main.ts        # Server entry point (stdio/HTTP transport)
        ├── server.ts      # MCP server with tools and resources
        ├── test.html      # Browser-based testing page
        ├── src/
        │   └── mcp-app.ts # UI application code
        ├── mcp-app.html   # UI HTML template
        └── dist/          # Built artifacts (generated)
```

## Key Concepts

### MCP Apps Architecture

**Three-Layer Model:**

1. **MCP Server** (`server.ts`)
   - Exposes tools via MCP protocol
   - Serves UI resources with `ui://` URIs
   - Links tools to UI resources via `_meta.ui`
   - Handles tool invocations and returns structured data

2. **Transport Layer** (`main.ts`)
   - Supports stdio (for local MCP clients)
   - Supports HTTP/SSE (for remote/web clients)
   - Manages server lifecycle and connections

3. **UI Application** (`mcp-app.ts`)
   - Runs in sandboxed iframe
   - Communicates via postMessage JSON-RPC
   - Applies host theme/styles dynamically
   - Calls server tools and handles responses

### Communication Flow

```
User asks Claude → Claude invokes MCP tool →
MCP Server responds with UI resource →
Host renders UI in iframe →
User interacts with UI →
UI calls server tool →
Server processes and returns data →
Result shown to user in conversation
```

## Working with This Project

### Development Workflow

1. **Install dependencies:**
   ```bash
   cd apps/color-picker
   npm install
   ```

2. **Build the app:**
   ```bash
   npm run build
   ```
   This creates:
   - `dist/mcp-app.html` - Bundled UI (single file)
   - `dist/server.js` - MCP server implementation
   - `dist/index.js` - Executable entry point

3. **Test locally:**
   - Start server: `npm run serve`
   - Open `test.html` in browser
   - Or configure Claude Desktop to use the app

### File Modification Guide

**To change the UI:**
- Edit `src/mcp-app.ts` (TypeScript app logic)
- Edit `mcp-app.html` (HTML structure)
- Edit CSS files in `src/` (styling)
- Rebuild: `npm run build`

**To add/modify tools:**
- Edit `server.ts`
- Use `registerAppTool()` to define tools
- Use `registerAppResource()` to serve UI resources
- Rebuild: `npm run build`

**To change transport:**
- Edit `main.ts`
- Switch between stdio and HTTP transports
- Modify port or host configuration

### Testing Considerations

**Browser Testing (test.html):**
- Simulates MCP client behavior
- Good for UI development and debugging
- Limited to HTTP transport

**MCP Client Testing (Claude Desktop):**
- Full integration testing
- Tests stdio transport
- Real-world usage scenario

**Important:** The MCP endpoint (`http://localhost:3001/mcp`) cannot be accessed directly in a browser's address bar - it requires MCP protocol headers. Always use `test.html` for browser testing.

## Code Patterns and Best Practices

### Security

```typescript
// ✅ Tool visibility control
_meta: { ui: { resourceUri, visibility: ["app"] } }

// ✅ Input validation
inputSchema: {
  initialColor: z.string().optional().describe("Initial color (hex format)")
}
```

### Theming

```typescript
// ✅ Apply host theme
applyDocumentTheme(ctx.theme);
applyHostStyleVariables(ctx.styles.variables);
applyHostFonts(ctx.styles.css.fonts);
```

```css
/* ✅ Use CSS variables */
background: var(--mcp-background);
color: var(--mcp-foreground);
border: 1px solid var(--mcp-border);
```

### Communication

```typescript
// ✅ Tool invocation from UI
await app.callServerTool({
  name: "submit-color",
  arguments: currentColor
});

// ✅ Send message to host
await app.sendMessage({
  role: "user",
  content: [{ type: "text", text: "Selected color" }]
});
```

### Error Handling

```typescript
// ✅ Graceful error handling
try {
  await app.callServerTool({ name: "tool-name", arguments: {} });
} catch (e) {
  console.error("Tool error:", e);
  statusEl.textContent = "Operation failed";
}
```

## Common Tasks for AI Assistants

### Creating a New MCP App

1. Use the `create-mcp-app` skill (if installed)
2. Or copy the color-picker structure
3. Modify tools and UI for the new use case
4. Update package.json name and description

### Debugging Issues

**UI not loading:**
- Check `dist/mcp-app.html` exists (run build)
- Verify resource URI matches in server.ts
- Check browser console for errors

**Tool not working:**
- Verify tool name matches in UI and server
- Check input schema validation
- Review server logs for errors

**Theme not applying:**
- Ensure CSS variables are used
- Check `onhostcontextchanged` handler
- Verify theme helper functions are called

### Extending Functionality

**Add a new tool:**
```typescript
registerAppTool(server, "tool-name", {
  title: "Tool Title",
  description: "What the tool does",
  inputSchema: { /* zod schema */ },
  outputSchema: { /* zod schema */ },
  _meta: { ui: { resourceUri } }
}, async (args) => {
  // Implementation
  return { content: [...], structuredContent: {...} };
});
```

**Add UI controls:**
1. Add HTML elements to `mcp-app.html`
2. Add event listeners in `mcp-app.ts`
3. Update state management
4. Call appropriate tools when needed

## Dependencies

**Core MCP:**
- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `@modelcontextprotocol/ext-apps` - MCP Apps extension APIs

**Server:**
- `express` - HTTP server
- `cors` - CORS middleware
- `zod` - Schema validation

**Build:**
- `typescript` - Type checking
- `vite` - UI bundling
- `esbuild` - Server bundling

## Resources and References

- [MCP Apps Extension](https://github.com/modelcontextprotocol/ext-apps)
- [MCP Apps Specification (SEP-1865)](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx)
- [Model Context Protocol](https://modelcontextprotocol.io)

## Tips for AI Assistants

1. **Read before modifying** - Always read existing code before suggesting changes
2. **Preserve patterns** - Follow existing code patterns and conventions
3. **Test changes** - Suggest running `npm run build` after modifications
4. **Explain thoroughly** - Users may be new to MCP Apps architecture
5. **Reference files** - Use `[file:line]` syntax for clickable references
6. **Consider security** - Validate inputs, use proper CSP, sandbox appropriately
