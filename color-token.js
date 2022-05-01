import { convert } from "https://cdn.jsdelivr.net/gh/quarksuite/core@2.0.0-26/color.js";

class ColorToken extends HTMLElement {
  constructor() {
    super();

    this.as = this.as;
    this.color = this.color;
    this.format = this.format;

    this.shadow = this.attachShadow({ mode: "open" });
  }

  #as = "unassigned";
  #color = "#808080";
  #format = "hex rgb hsl";

  set as(value) {
    this.reflect("as", value);
  }

  get as() {
    return this.getAttribute("as");
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
    return ["as", "color", "format"];
  }

  // Formatting
  formats() {
    const as = this.as || this.#as;
    const color = this.color || this.#color;
    const format = this.format || this.#format;

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

  // Assignment
  assigned() {
    const as = this.as || this.#as;
    const color = this.color || this.#color;
    const format = this.format || this.#format;

    this.token = { [as]: color };

    return format !== "none" ? `<span part="label">${as}</span>` : ``;
  }

  template() {
    const color = this.color || this.#color;
    const tmpl = document.createElement("template");

    tmpl.innerHTML = `
${this.styles(color)}
${this.assigned()}
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
    --swatch-border-width: 0.25ex;
    --data-size: 1rem;
  }

  :host[hidden] {
    display: none;
  }

  [part="label"] {
    display: block;
    margin-bottom: var(--spacing);
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
