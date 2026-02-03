/**
 * Color Picker MCP App
 * Interactive color picker that communicates with the MCP host.
 */
import {
  App,
  applyDocumentTheme,
  applyHostFonts,
  applyHostStyleVariables,
  type McpUiHostContext,
} from "@modelcontextprotocol/ext-apps";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import "./global.css";
import "./mcp-app.css";

// DOM Elements
const mainEl = document.querySelector(".main") as HTMLElement;
const previewInner = document.getElementById("preview-inner") as HTMLElement;
const colorInput = document.getElementById("color-input") as HTMLInputElement;
const hexInput = document.getElementById("hex-input") as HTMLInputElement;
const rSlider = document.getElementById("r-slider") as HTMLInputElement;
const gSlider = document.getElementById("g-slider") as HTMLInputElement;
const bSlider = document.getElementById("b-slider") as HTMLInputElement;
const rValue = document.getElementById("r-value") as HTMLElement;
const gValue = document.getElementById("g-value") as HTMLElement;
const bValue = document.getElementById("b-value") as HTMLElement;
const rgbDisplay = document.getElementById("rgb-display") as HTMLElement;
const hslDisplay = document.getElementById("hsl-display") as HTMLElement;
const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement;
const statusEl = document.getElementById("status") as HTMLElement;

// Current color state
let currentColor = {
  hex: "#3b82f6",
  rgb: { r: 59, g: 130, b: 246 },
  hsl: { h: 217, s: 91, l: 60 },
};

// Color conversion utilities
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

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
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

// Update UI with current color
function updateUI() {
  const { hex, rgb, hsl } = currentColor;

  previewInner.style.backgroundColor = hex;
  colorInput.value = hex;
  hexInput.value = hex;

  rSlider.value = String(rgb.r);
  gSlider.value = String(rgb.g);
  bSlider.value = String(rgb.b);

  rValue.textContent = String(rgb.r);
  gValue.textContent = String(rgb.g);
  bValue.textContent = String(rgb.b);

  rgbDisplay.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  hslDisplay.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

// Set color from hex value
function setColorFromHex(hex: string) {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return;

  currentColor.hex = hex.toLowerCase();
  currentColor.rgb = hexToRgb(hex);
  currentColor.hsl = rgbToHsl(currentColor.rgb.r, currentColor.rgb.g, currentColor.rgb.b);
  updateUI();
}

// Set color from RGB values
function setColorFromRgb(r: number, g: number, b: number) {
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  currentColor.rgb = { r, g, b };
  currentColor.hex = rgbToHex(r, g, b);
  currentColor.hsl = rgbToHsl(r, g, b);
  updateUI();
}

// Handle host context changes (theme, styles, safe area)
function handleHostContextChanged(ctx: McpUiHostContext) {
  if (ctx.theme) {
    applyDocumentTheme(ctx.theme);
  }
  if (ctx.styles?.variables) {
    applyHostStyleVariables(ctx.styles.variables);
  }
  if (ctx.styles?.css?.fonts) {
    applyHostFonts(ctx.styles.css.fonts);
  }
  if (ctx.safeAreaInsets) {
    mainEl.style.paddingTop = `${ctx.safeAreaInsets.top}px`;
    mainEl.style.paddingRight = `${ctx.safeAreaInsets.right}px`;
    mainEl.style.paddingBottom = `${ctx.safeAreaInsets.bottom}px`;
    mainEl.style.paddingLeft = `${ctx.safeAreaInsets.left}px`;
  }
}

// Extract initial color from tool result
function extractInitialColor(result: CallToolResult): string | null {
  const content = result.structuredContent as { hex?: string } | undefined;
  return content?.hex ?? null;
}

// 1. Create app instance
const app = new App({ name: "Color Picker", version: "1.0.0" });

// 2. Register handlers BEFORE connecting
app.onteardown = async () => {
  console.info("Color Picker app is being torn down");
  return {};
};

app.ontoolinput = (params) => {
  console.info("Received tool input:", params);
  // Set initial color if provided
  const args = params.arguments as { initialColor?: string } | undefined;
  if (args?.initialColor) {
    setColorFromHex(args.initialColor);
  }
};

app.ontoolresult = (result) => {
  console.info("Received tool result:", result);
  const hex = extractInitialColor(result);
  if (hex) {
    setColorFromHex(hex);
  }
};

app.ontoolcancelled = (params) => {
  console.info("Tool cancelled:", params.reason);
};

app.onerror = console.error;

app.onhostcontextchanged = handleHostContextChanged;

// Event listeners for color inputs
colorInput.addEventListener("input", () => {
  setColorFromHex(colorInput.value);
});

hexInput.addEventListener("input", () => {
  const value = hexInput.value;
  if (/^#[0-9a-f]{6}$/i.test(value)) {
    setColorFromHex(value);
  }
});

hexInput.addEventListener("blur", () => {
  // Normalize the hex input on blur
  hexInput.value = currentColor.hex;
});

rSlider.addEventListener("input", () => {
  setColorFromRgb(parseInt(rSlider.value), currentColor.rgb.g, currentColor.rgb.b);
});

gSlider.addEventListener("input", () => {
  setColorFromRgb(currentColor.rgb.r, parseInt(gSlider.value), currentColor.rgb.b);
});

bSlider.addEventListener("input", () => {
  setColorFromRgb(currentColor.rgb.r, currentColor.rgb.g, parseInt(bSlider.value));
});

// Submit button handler
submitBtn.addEventListener("click", async () => {
  try {
    statusEl.textContent = "Submitting color...";
    statusEl.className = "status";

    const result = await app.callServerTool({
      name: "submit-color",
      arguments: currentColor,
    });

    console.info("Submit result:", result);
    statusEl.textContent = `Color ${currentColor.hex} selected!`;
    statusEl.className = "status success";

    // Send a message to the host with the selected color
    await app.sendMessage({
      role: "user",
      content: [
        {
          type: "text",
          text: `I selected the color ${currentColor.hex} (RGB: ${currentColor.rgb.r}, ${currentColor.rgb.g}, ${currentColor.rgb.b})`,
        },
      ],
    });
  } catch (e) {
    console.error("Submit error:", e);
    statusEl.textContent = "Failed to submit color";
    statusEl.className = "status";
  }
});

// 3. Connect to host
app.connect().then(() => {
  const ctx = app.getHostContext();
  if (ctx) {
    handleHostContextChanged(ctx);
  }
  updateUI();
});
