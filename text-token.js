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

function template(font, style, size, leading, measure) {
  const tmpl = document.createElement("template");

  tmpl.innerHTML = `
${styles(font, size, weight(style), leading, measure)}
<div part="content">A quart jar of oil mixed with zinc oxide makes a very bright paint.</div>
<div part="font">
  <span part="value stack">stack: <code part="code">"${font}"</code></span>
  <span part="value size">size: <code part="code">"${size}"</code></span>
  <span part="value weight">weight: <code part="code">${
    weight(
      style,
    )
  }</code></span>
</div>
<div part="typography">
  <span part="value leading">leading: <code part="code">${leading}</code></span>
  <span part="value measure">measure: <code part="code">"${measure}"</code></span>
</div>
`;

  return tmpl.content.cloneNode(true);
}

function styles(font, size, style, leading, measure) {
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
    line-height: ${leading};
    max-width: ${measure};
  }

  [part="font"], [part="typography"] {
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

  set stack(value) {
    this.reflect("stack", value);
  }

  get stack() {
    return this.getAttribute("stack");
  }

  set size(value) {
    this.reflect("size", value);
  }

  get size() {
    return this.getAttribute("size");
  }

  set weight(value) {
    this.reflect("weight", value);
  }

  get weight() {
    return this.getAttribute("weight");
  }

  set leading(value) {
    this.reflect("leading", value);
  }

  get leading() {
    return this.getAttribute("leading");
  }

  set measure(value) {
    this.reflect("measure", value);
  }

  get measure() {
    return this.getAttribute("measure");
  }

  reflect(name, value) {
    if (value) {
      this.setAttribute(name, value);
    } else {
      this.removeAttribute(name);
    }
  }

  static get observedAttributes() {
    return ["stack", "size", "weight", "leading", "measure"];
  }

  render() {
    const stack = this.stack || "sans-serif";
    const size = this.size || "1.5rem";
    const weight = this.weight || "regular";
    const leading = this.leading || 1.5;
    const measure = this.measure || "75ch";

    return this.attachShadow({ mode: "open" }).append(
      template(stack, weight, size, leading, measure),
    );
  }

  connectedCallback() {
    this.render();
  }
}

customElements.define("text-token", TextToken);
