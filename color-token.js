import { convert } from "https://cdn.jsdelivr.net/gh/quarksuite/core@2.0.2/color.js";

// Formatting
function formats(color, format) {
  return format !== "none"
    ? format
      .split(" ")
      .map((format) => {
        return `<span part="value ${format}">${format}: <code part="code ${
          color === convert(format, color) && `actual`
        }">${convert(format, color)}</code></span>`;
      })
      .join("")
    : `<span part="value" style="text-transform: lowercase;">${as} <code part="code">${color}</code></span>`;
}

// Template
function template(color, format) {
  const tmpl = document.createElement("template");

  tmpl.innerHTML = `
${styles(color)}
<div part="swatch"></div>
<div part="data">
${formats(color, format)}
</div>
`;

  return tmpl.content.cloneNode(true);
}

// Styles
function styles(color) {
  return `
<style>
  :host {
    display: block;

    --spacing: 1ex;
    --swatch-size: 10vh;
    --data-size: 1rem;
  }

  :host[hidden] {
    display: none;
  }

  [part="swatch"] {
    background: ${convert("hex", color)};
    min-width: var(--swatch-size);
    min-height: var(--swatch-size);
  }

  [part="data"] {
    font-size: var(--data-size);
    margin-top: calc(var(--spacing) / 2);
  }

  [part~="value"] {
    display: block;
    margin-bottom: calc(var(--spacing) / 4);
  }

  [part~="actual"] {
    font-weight: 700;
  }
</style>
`;
}

export class ColorToken extends HTMLElement {
  constructor() {
    super();
  }

  set color(value) {
    this.reflect("color", value);
  }

  get color() {
    return this.getAttribute("color");
  }

  set format(value) {
    this.reflect("format", value);
  }

  get format() {
    return this.getAttribute("format");
  }

  reflect(name, value) {
    if (value) {
      this.setAttribute(name, value);
    } else {
      this.removeAttribute(name);
    }
  }

  static get observedAttributes() {
    return ["color", "format"];
  }

  render() {
    const color = this.color || "#808080";
    const format = this.format || "hex rgb hsl";

    return this.attachShadow({ mode: "open" }).append(template(color, format));
  }

  connectedCallback() {
    this.render();
  }
}

customElements.define("color-token", ColorToken);
