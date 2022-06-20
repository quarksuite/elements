import { convert } from "https://cdn.jsdelivr.net/gh/quarksuite/core@2.0.2/color.js";

export class ColorToken extends HTMLElement {
  constructor() {
    super();

    this.color = this.color || "#808080";
    this.format = this.format || "hex rgb hsl";

    this.shadow = this.attachShadow({ mode: "open" });
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

  // Formatting
  formats() {
    const { color, format } = this;

    return format !== "none"
      ? format
        .split(" ")
        .map((format) => {
          return `<span part="value">${format}: <code part="code ${
            color === convert(format, color) && `actual`
          }">${convert(format, color)}</code></span>`;
        })
        .join("")
      : `<span part="value" style="text-transform: lowercase;">${as} <code part="code">${color}</code></span>`;
  }

  template() {
    const { color } = this;
    const tmpl = document.createElement("template");

    tmpl.innerHTML = `
${this.styles(color)}
<div part="swatch"></div>
<div part="data">
${this.formats()}
</div>
`;

    return tmpl.content.cloneNode(true);
  }

  styles(color) {
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

  [part="value"] {
    display: block;
    margin-bottom: calc(var(--spacing) / 4);
  }

  [part~="actual"] {
    font-weight: 700;
  }
</style>
`;
  }

  render() {
    return this.shadow.append(this.template());
  }

  connectedCallback() {
    this.render();
  }
}

customElements.define("color-token", ColorToken);
