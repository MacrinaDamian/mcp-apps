# MCP Apps Development Plan

## Overview

This plan outlines a comprehensive approach to building a collection of MCP (Model Context Protocol) Apps - interactive user interfaces that render inside MCP-compatible hosts like Claude Desktop, ChatGPT, and other AI chat applications.

MCP Apps (defined in SEP-1865) enable servers to deliver rich, interactive UIs instead of just text responses, opening up possibilities for data visualization, complex forms, real-time interactions, and more.

---

## Key Concepts

### What are MCP Apps?

MCP Apps are HTML-based user interfaces served by MCP servers that:
- Render inline within AI chat conversations
- Communicate bidirectionally with the host via JSON-RPC over postMessage
- Run in sandboxed iframes for security
- Are pre-declared as resources, enabling caching and security review

### Core Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    MCP Host (Chat Client)               │
│  ┌───────────────────────────────────────────────────┐  │
│  │                  Sandboxed Iframe                 │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │              MCP App (HTML/JS)              │  │  │
│  │  │                                             │  │  │
│  │  │   postMessage ◄──► JSON-RPC ◄──► Server    │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Key Protocol Elements

| Element | Description |
|---------|-------------|
| `ui://` URI scheme | Identifies UI resources (e.g., `ui://my-server/dashboard`) |
| `text/html;profile=mcp-app` | Required MIME type for UI content |
| `_meta.ui` | Tool metadata linking tools to UI resources |
| CSP Domains | Security declarations for network/resource access |
| Visibility | Controls whether tools are callable by model, app, or both |

---

## Project Structure

```
mcp-apps/
├── packages/
│   ├── shared/                    # Shared utilities and types
│   │   ├── src/
│   │   │   ├── types.ts          # Common TypeScript interfaces
│   │   │   ├── mcp-bridge.ts     # postMessage communication helpers
│   │   │   └── theme.ts          # CSS variable theme utilities
│   │   └── package.json
│   │
│   ├── server-utils/              # MCP server helpers
│   │   ├── src/
│   │   │   ├── ui-resource.ts    # UI resource declaration helpers
│   │   │   ├── tool-ui-link.ts   # Tool-to-UI metadata helpers
│   │   │   └── csp-builder.ts    # CSP configuration builder
│   │   └── package.json
│   │
│   └── app-template/              # Starter template for new apps
│       ├── src/
│       │   ├── App.tsx
│       │   └── index.html
│       └── package.json
│
├── apps/                          # Individual MCP App implementations
│   ├── 01-hello-world/           # Beginner: Basic app structure
│   ├── 02-counter/               # Beginner: State and bidirectional communication
│   ├── 03-form-input/            # Beginner: Complex user input
│   ├── 04-chart-viewer/          # Intermediate: Data visualization
│   ├── 05-kanban-board/          # Intermediate: Interactive drag-and-drop
│   ├── 06-code-editor/           # Intermediate: Monaco/CodeMirror integration
│   ├── 07-file-browser/          # Advanced: Resource access patterns
│   ├── 08-realtime-dashboard/    # Advanced: WebSocket and live updates
│   ├── 09-3d-viewer/             # Advanced: Three.js integration
│   └── 10-multi-tool-workflow/   # Advanced: Multi-tool orchestration
│
├── servers/                       # MCP servers that host the apps
│   ├── demo-server/              # Combined server for all demo apps
│   └── standalone/               # Individual servers per app
│
├── docs/
│   ├── getting-started.md
│   ├── api-reference.md
│   ├── security-guide.md
│   └── deployment.md
│
├── tests/
│   ├── e2e/                      # End-to-end tests
│   └── unit/                     # Unit tests
│
├── package.json                   # Workspace root
├── tsconfig.json
└── README.md
```

---

## App Ideas: Progression Path

### Level 1: Beginner Apps

#### 1. Hello World App
**Purpose**: Understand basic MCP App structure and lifecycle

**Features**:
- Display a greeting message with host theme integration
- Show connection status
- Display basic server information

**Learning Goals**:
- UI resource declaration
- HTML document structure for MCP Apps
- CSS variable theming
- Basic postMessage communication

---

#### 2. Counter App
**Purpose**: Learn bidirectional communication

**Features**:
- Increment/decrement counter buttons
- Persist count via tool calls
- Display history of changes

**Learning Goals**:
- Sending requests from UI to host (tool calls)
- Receiving notifications from host
- State management patterns

---

#### 3. Form Input App
**Purpose**: Replace text-based input gathering with rich forms

**Features**:
- Multi-field form (text, select, checkbox, date)
- Validation and error display
- Submit data back to the server

**Learning Goals**:
- Complex data input patterns
- Form validation in MCP Apps
- Structured data return via tools

---

### Level 2: Intermediate Apps

#### 4. Chart Viewer App
**Purpose**: Data visualization replacing JSON dumps

**Features**:
- Render line, bar, pie charts
- Interactive tooltips and legends
- Export chart as image
- Support multiple data formats

**Libraries**: Chart.js, Recharts, or D3.js

**Learning Goals**:
- External library integration
- resourceDomains CSP configuration
- Dynamic data rendering

---

#### 5. Kanban Board App
**Purpose**: Interactive task management within chat

**Features**:
- Drag-and-drop task cards
- Create, edit, delete tasks
- Column management
- Real-time sync with server

**Libraries**: react-beautiful-dnd or dnd-kit

**Learning Goals**:
- Complex UI interactions
- Optimistic updates
- State synchronization patterns

---

#### 6. Code Editor App
**Purpose**: In-chat code editing with syntax highlighting

**Features**:
- Monaco Editor or CodeMirror integration
- Syntax highlighting for multiple languages
- Code formatting
- Diff view for changes

**Libraries**: Monaco Editor, CodeMirror

**Learning Goals**:
- Large library integration
- Blob content handling
- Performance optimization

---

### Level 3: Advanced Apps

#### 7. File Browser App
**Purpose**: Navigate and manage files/resources

**Features**:
- Tree view navigation
- File preview (images, text, JSON)
- Breadcrumb navigation
- Search and filter
- File operations (create, rename, delete)

**Learning Goals**:
- Resource access patterns
- Pagination and lazy loading
- Permission handling

---

#### 8. Realtime Dashboard App
**Purpose**: Live data monitoring

**Features**:
- WebSocket connection for live updates
- Multiple metric widgets
- Alerting and thresholds
- Historical data view

**Learning Goals**:
- connectDomains CSP for WebSocket
- Real-time data patterns
- Notification handling

---

#### 9. 3D Viewer App
**Purpose**: Interactive 3D model visualization

**Features**:
- Three.js scene rendering
- Model loading (GLTF, OBJ)
- Camera controls (orbit, zoom, pan)
- Lighting and material adjustments

**Libraries**: Three.js

**Learning Goals**:
- WebGL in sandboxed iframes
- Binary asset loading
- Performance in constrained environments

---

#### 10. Multi-Tool Workflow App
**Purpose**: Orchestrate multiple tools in a visual workflow

**Features**:
- Visual workflow builder
- Connect multiple MCP tools
- Conditional logic branches
- Execution visualization

**Learning Goals**:
- Tool visibility patterns (model vs app)
- Complex tool orchestration
- Error handling and recovery

---

## Implementation Guidelines

### 1. UI Resource Declaration

```typescript
// Server-side resource declaration
const uiResource = {
  uri: "ui://my-server/dashboard",
  name: "Dashboard",
  description: "Interactive dashboard for data visualization",
  mimeType: "text/html;profile=mcp-app",
  _meta: {
    ui: {
      // Security: Allowed external connections
      connectDomains: ["api.example.com"],
      resourceDomains: ["cdn.example.com"],
      frameDomains: [],
      baseUriDomains: [],

      // Permissions
      permissions: ["clipboard-write"],

      // Visual
      prefersBorder: true
    }
  }
};
```

### 2. Tool-UI Linking

```typescript
// Link a tool to a UI resource
const tool = {
  name: "show_dashboard",
  description: "Display the interactive dashboard",
  inputSchema: {
    type: "object",
    properties: {
      data: { type: "array" }
    }
  },
  _meta: {
    ui: {
      resourceUri: "ui://my-server/dashboard",
      visibility: ["model", "app"]  // Callable by both AI and app
    }
  }
};
```

### 3. HTML App Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My MCP App</title>
  <style>
    :root {
      /* Host provides these CSS variables */
      --mcp-background: var(--mcp-background, #ffffff);
      --mcp-foreground: var(--mcp-foreground, #000000);
      --mcp-primary: var(--mcp-primary, #0066cc);
      --mcp-border: var(--mcp-border, #e0e0e0);
    }

    body {
      margin: 0;
      padding: 16px;
      background: var(--mcp-background);
      color: var(--mcp-foreground);
      font-family: system-ui, sans-serif;
    }
  </style>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="./app.js"></script>
</body>
</html>
```

### 4. MCP Bridge Communication

```typescript
// app-bridge.ts - Communication with host
class MCPBridge {
  private messageId = 0;
  private pending = new Map<number, { resolve: Function; reject: Function }>();

  constructor() {
    window.addEventListener('message', this.handleMessage.bind(this));
  }

  // Send a tool call request to the host
  async callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    const id = ++this.messageId;

    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });

      window.parent.postMessage({
        jsonrpc: "2.0",
        id,
        method: "tools/call",
        params: { name, arguments: args }
      }, "*");
    });
  }

  // Handle incoming messages from host
  private handleMessage(event: MessageEvent) {
    const { id, result, error } = event.data;

    if (id && this.pending.has(id)) {
      const { resolve, reject } = this.pending.get(id)!;
      this.pending.delete(id);

      if (error) {
        reject(new Error(error.message));
      } else {
        resolve(result);
      }
    }
  }
}

export const mcpBridge = new MCPBridge();
```

---

## Best Practices

### Security

1. **Minimize CSP domains**: Only declare domains you actually need
2. **Validate all input**: Treat data from postMessage as untrusted
3. **Use app-only visibility**: For sensitive tools, set visibility to `["app"]` only
4. **Avoid inline scripts**: Use separate JS files for CSP compliance
5. **Never store secrets**: Apps run client-side; use server-side tools for secrets

### Performance

1. **Keep bundles small**: Aim for < 500KB total
2. **Lazy load libraries**: Load heavy dependencies on demand
3. **Use efficient rendering**: Virtual lists for large datasets
4. **Cache aggressively**: Leverage browser caching for static assets
5. **Debounce communication**: Batch rapid postMessage calls

### User Experience

1. **Always provide text fallback**: Support text-only hosts
2. **Show loading states**: Apps may load slowly on some hosts
3. **Handle errors gracefully**: Display user-friendly error messages
4. **Respect host theme**: Use CSS variables, not hardcoded colors
5. **Support keyboard navigation**: Ensure accessibility

### Development

1. **Test in multiple hosts**: Claude Desktop, ChatGPT, VS Code, etc.
2. **Use TypeScript**: Catch errors early with strong typing
3. **Write E2E tests**: Test the full host-app communication flow
4. **Document CSP requirements**: Make security needs explicit
5. **Version your APIs**: Support backward compatibility

---

## Development Workflow

### Local Development

```bash
# 1. Clone and install dependencies
git clone <repo>
cd mcp-apps
npm install

# 2. Start development server
npm run dev

# 3. Run MCP server locally
npm run server

# 4. Configure your MCP client (e.g., Claude Desktop)
# Add to claude_desktop_config.json:
{
  "mcpServers": {
    "mcp-apps-demo": {
      "command": "node",
      "args": ["./servers/demo-server/dist/index.js"]
    }
  }
}
```

### Testing

```bash
# Unit tests
npm run test:unit

# E2E tests (requires running host)
npm run test:e2e

# Type checking
npm run typecheck
```

### Building for Production

```bash
# Build all apps
npm run build

# Build specific app
npm run build --workspace=apps/chart-viewer
```

---

## Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Set up monorepo structure with npm workspaces
- [ ] Create shared utilities package
- [ ] Build server utilities package
- [ ] Implement Hello World app
- [ ] Implement Counter app
- [ ] Implement Form Input app
- [ ] Set up basic documentation

### Phase 2: Intermediate Apps (Week 3-4)
- [ ] Implement Chart Viewer app
- [ ] Implement Kanban Board app
- [ ] Implement Code Editor app
- [ ] Add comprehensive tests
- [ ] Document security patterns

### Phase 3: Advanced Apps (Week 5-6)
- [ ] Implement File Browser app
- [ ] Implement Realtime Dashboard app
- [ ] Implement 3D Viewer app
- [ ] Implement Multi-Tool Workflow app

### Phase 4: Polish & Release (Week 7-8)
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Complete documentation
- [ ] Create deployment guides
- [ ] Publish packages

---

## Resources

- [MCP Apps Specification (SEP-1865)](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx)
- [Official MCP Apps SDK](https://github.com/modelcontextprotocol/ext-apps)
- [MCP Apps Blog Post](http://blog.modelcontextprotocol.io/posts/2025-11-21-mcp-apps/)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/specification/2025-11-25)
- [SEP-1865 Pull Request](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/1865)

---

## Next Steps

1. **Review this plan** and adjust based on your specific needs
2. **Prioritize apps** - which ones are most valuable for your use case?
3. **Set up the project structure** using the layout above
4. **Start with beginner apps** to build familiarity
5. **Iterate and expand** based on learnings

Ready to start building? Begin with the Hello World app to validate your setup, then progressively tackle more complex apps.
