function template(width, height) {
  const tmpl = document.createElement("template");

  tmpl.innerHTML = `
${styles(width, height)}
<div part="element"></div>
<div part="data">
  <span part="value width">width: <code part="code">"${width}"</code></span>
  <span part="value height">height: <code part="code">"${height}"</code></span>
</div>
`;

  return tmpl.content.cloneNode(true);
}

function styles(width, height) {
  return `
<style>
  :host {
    display: block;

    --spacing: 1ex;
    --element-color: currentcolor;
    --data-size: 1rem;
  }

  :host[hidden] {
    display: none;
  }

  [part="element"] {
    background-color: var(--element-color);
    width: ${width};
    height: ${height};
  }

  [part="data"] {
    font-size: var(--data-size);
    margin-top: var(--spacing);
  }

  [part~="value"] {
    display: block;
    margin-bottom: calc(var(--spacing) / 4);
  }
</style>
`;
}

export class DimsToken extends HTMLElement {
  constructor() {
    super();

    this.width = this.width || "100%";
    this.height = this.height || "1ex";

    this.shadow = this.attachShadow({ mode: "open" });
  }

  set width(value) {
    this.reflect("width", value);
  }

  get width() {
    return this.getAttribute("width");
  }

  set height(value) {
    this.reflect("height", value);
  }

  get height() {
    return this.getAttribute("height");
  }

  reflect(name, value) {
    if (value) {
      this.setAttribute(name, value);
    } else {
      this.removeAttribute(name);
    }
  }

  static get observedAttributes() {
    return ["width", "height"];
  }

  render() {
    const { width, height } = this;
    return this.shadow.append(template(width, height));
  }

  connectedCallback() {
    this.render();
  }
}

customElements.define("dims-token", DimsToken);
