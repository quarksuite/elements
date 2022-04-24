import {
  adjust,
  convert,
} from "https://cdn.jsdelivr.net/gh/quarksuite/core@2.0.0-20/color.js";

class ColorToken extends HTMLElement {
  constructor() {
    super();

    this.as = this.as;
    this.color = this.color;
    this.format = this.format;

    this.shadow = this.attachShadow({ mode: "open" });
  }

  #as = " ";
  #color = "#808080";
  #format = "hex";

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
    const color = this.color || this.#color;
    const splitFormats = (this.format || this.#format).split(" ");

    return splitFormats
      .map((format) => {
        return `<span class="value ${
          this.color === convert(format, color) && "actual"
        }">${format}: <code>${convert(format, color)}</code></span>`;
      })
      .join("");
  }

  // Assignment
  assigned() {
    const as = this.as || this.#as;

    return `<span class="as">${as}</span>`;
  }

  template() {
    const as = this.as || this.#as;
    const color = this.color || this.#color;
    const format = this.format || this.#format;
    const tmpl = document.createElement("template");

    tmpl.innerHTML = `
${this.styles()}
${format !== "none" ? this.assigned() : ``}
  <div class="color" style="background: ${
      convert(
        "hex",
        color,
      )
    }; border: var(--color-border-width, 0.25ex) solid ${
      adjust(
        { lightness: -25 },
        color,
      )
    }"></div>
  <div class="data">
  ${
      format !== "none"
        ? this.formats()
        : `<span class="value" style="text-transform: lowercase;">${as} (<code>${this.color}</code>)</span>`
    }
</div>
`;

    return tmpl.content.cloneNode(true);
  }

  styles() {
    return `
<style>
  :host {
    --spacing: 1ex;
    display: flex;
    flex-flow: row wrap;
    gap: var(--spacing);
  }

  :host[hidden] {
    display: none;
  }

  span {
    text-transform: uppercase;
  }

  code {
    display: inline;
    font-family: var(--code-family, monospace);
    font-size: var(--code-font-size, 1rem);
    text-transform: lowercase;
  }

  .as {
    flex-basis: 100%;
  }

  .color {
    --color-size: 8vh;
    --color-radius: 100%;
    border-radius: var(--color-radius);
    min-width: var(--color-size);
    min-height: var(--color-size);
  }

  .data {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    gap: calc(var(--spacing) / 2);
    flex: 1;
    flex-basis: var(--data-width, 32ch);
    font-size: inherit;
  }

  .value.actual {
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
