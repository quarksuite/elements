function weight(style) {
  return new Map([
    ["thin", 100],
    ["extralight", 200],
    ["light", 300],
    ["regular", 400],
    ["medium", 500],
    ["semibold", 600],
    ["bold", 700],
    ["extrabold", 800],
    ["black", 900],
  ]).get(style);
}

function template(font, style, size, sentence) {
  const tmpl = document.createElement("template");

  tmpl.innerHTML = `
${styles(font, size, weight(style))}
<div part="content">${sentence}</div>
<div part="data">
  <span part="value stack">stack: <code part="code">"${font}"</code></span>
  <span part="value size">size: <code part="code">"${size}"</code></span>
  <span part="value style">weight: <code part="code">${
    weight(
      style,
    )
  }</code></span>
</div>
`;

  return tmpl.content.cloneNode(true);
}

function styles(font, size, style) {
  return `
<style>
  :host {
    display: block;

    --spacing: 1ex;
  }

  :host[hidden] {
    display: none;
  }

  [part="content"] {
    font-family: ${font};
    font-size: ${size};
    font-weight: ${style};
    line-height: 1.5;
  }

  [part="data"] {
    margin-top: var(--spacing);
  }

  [part~="value"] {
    display: block;
    margin-bottom: calc(var(--spacing) / 4);
  }
</style>
`;
}

export class TextToken extends HTMLElement {
  constructor() {
    super();
  }

  set font(value) {
    this.reflect("font", value);
  }

  get font() {
    return this.getAttribute("font");
  }

  set size(value) {
    this.reflect("size", value);
  }

  get size() {
    return this.getAttribute("size");
  }

  set style(value) {
    this.reflect("style", value);
  }

  get style() {
    return this.getAttribute("style");
  }

  set sentence(value) {
    this.reflect("sentence", value);
  }

  get sentence() {
    return this.getAttribute("sentence");
  }

  reflect(name, value) {
    if (value) {
      this.setAttribute(name, value);
    } else {
      this.removeAttribute(name);
    }
  }

  static get observedAttributes() {
    return ["font", "size", "style", "sentence"];
  }

  render() {
    const font = this.font || "sans-serif";
    const size = this.size || "1.5rem";
    const style = this.style || "regular";
    const sentence = this.sentence ||
      "A quart jar of oil mixed with zinc oxide makes a very bright paint.";

    return this.attachShadow({ mode: "open" }).append(
      template(font, style, size, sentence),
    );
  }

  connectedCallback() {
    this.render();
  }
}

customElements.define("text-token", TextToken);
