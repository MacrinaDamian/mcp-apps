import { registerAppResource, registerAppTool, RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult, ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

// Works both from source (server.ts) and compiled (dist/server.js)
const DIST_DIR = import.meta.filename.endsWith(".ts")
  ? path.join(import.meta.dirname, "dist")
  : import.meta.dirname;

/**
 * Creates a new MCP server instance with the color picker tool and resource.
 */
export function createServer(): McpServer {
  const server = new McpServer({
    name: "Color Picker MCP App",
    version: "1.0.0",
  });

  const resourceUri = "ui://color-picker/mcp-app.html";

  // Register the color picker tool
  registerAppTool(server,
    "pick-color",
    {
      title: "Pick Color",
      description: "Opens an interactive color picker. Returns the selected color in multiple formats (hex, RGB, HSL).",
      inputSchema: {
        initialColor: z.string().optional().describe("Initial color (hex format, e.g., #ff0000). Defaults to #3b82f6."),
      },
      outputSchema: {
        hex: z.string(),
        rgb: z.object({
          r: z.number(),
          g: z.number(),
          b: z.number(),
        }),
        hsl: z.object({
          h: z.number(),
          s: z.number(),
          l: z.number(),
        }),
      },
      _meta: { ui: { resourceUri } },
    },
    async (args: { initialColor?: string }): Promise<CallToolResult> => {
      const initialColor = args.initialColor ?? "#3b82f6";

      // Parse the initial color to provide a default response
      const hex = initialColor.startsWith("#") ? initialColor : `#${initialColor}`;
      const rgb = hexToRgb(hex);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

      return {
        content: [{ type: "text", text: `Color picker initialized with ${hex}` }],
        structuredContent: { hex, rgb, hsl },
      };
    },
  );

  // Register a tool for the UI to submit selected colors (app-only visibility)
  registerAppTool(server,
    "submit-color",
    {
      title: "Submit Color",
      description: "Submit the selected color from the color picker UI.",
      inputSchema: {
        hex: z.string(),
        rgb: z.object({
          r: z.number(),
          g: z.number(),
          b: z.number(),
        }),
        hsl: z.object({
          h: z.number(),
          s: z.number(),
          l: z.number(),
        }),
      },
      outputSchema: {
        success: z.boolean(),
        hex: z.string(),
        rgb: z.object({ r: z.number(), g: z.number(), b: z.number() }),
        hsl: z.object({ h: z.number(), s: z.number(), l: z.number() }),
      },
      _meta: { ui: { resourceUri, visibility: ["app"] } }, // Only callable by the app
    },
    async (args: {
      hex: string;
      rgb: { r: number; g: number; b: number };
      hsl: { h: number; s: number; l: number };
    }): Promise<CallToolResult> => {
      const { hex, rgb, hsl } = args;

      return {
        content: [
          { type: "text", text: `Selected color: ${hex} | RGB(${rgb.r}, ${rgb.g}, ${rgb.b}) | HSL(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
        ],
        structuredContent: { success: true, hex, rgb, hsl },
      };
    },
  );

  // Register the HTML resource
  registerAppResource(server,
    resourceUri,
    resourceUri,
    { mimeType: RESOURCE_MIME_TYPE },
    async (): Promise<ReadResourceResult> => {
      const html = await fs.readFile(path.join(DIST_DIR, "mcp-app.html"), "utf-8");
      return {
        contents: [
          { uri: resourceUri, mimeType: RESOURCE_MIME_TYPE, text: html },
        ],
      };
    },
  );

  return server;
}

// Helper functions for color conversion
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}
