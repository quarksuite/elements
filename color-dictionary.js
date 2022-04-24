export class ColorDictionary extends HTMLElement {
  constructor() {
    super();

    this.as = this.as;

    this.shadow = this.attachShadow({ mode: "open" });
  }

  #as = "";

  set as(value) {
    this.reflect("as", value);
  }

  get as() {
    return this.getAttribute("as");
  }

  reflect(name, value) {
    if (value) {
      this.setAttribute(name, value);
    } else {
      this.removeAttribute(name);
    }
  }

  static get observedAttributes() {
    return ["as"];
  }

  // Data assembly
  assemble(data) {
    const tree = (head, node) =>
      Object.entries(node)
        .map(([key, value]) => {
          if (value.hasOwnProperty("bg")) {
            return `
<div class="category">
  ${tree(head.concat(key, "."), value)}
</div>
`;
          }

          if (typeof value === "object") {
            return tree(head.concat(key, "."), value);
          }

          return `<li class="token"><color-token as="${head.concat(
            key
          )}" color="${value}" format="none"></color-token></li>`;
        })
        .join("\n");

    return `<ul class="dict">${tree("", data)}</ul>`;
  }

  template() {
    const as = this.as || this.#as;
    const data = this.data || {};
    const tmpl = document.createElement("template");

    tmpl.innerHTML = `
${this.styles()}
    ${
      Object.keys(data).length
        ? this.assemble(data)
        : `<div class="pending">A color dictionary is not currently assigned to <code>"${as}"</code></div>`
    }
    `;

    return tmpl.content.cloneNode(true);
  }

  styles() {
    return `
<style>
  :host {
    --spacing: 2ex;
    display: block;
  }

  :host[hidden] {
    display: none;
  }

  .dict {
    list-style: none;
    padding: 0;
  }

  .category {
    display: flex;
    flex-flow: row wrap;
    gap: var(--spacing);
    border: calc(var(--spacing) / 8) var(--category-border-style, dashed) currentcolor;
    margin-bottom: var(--spacing);
    padding: var(--spacing);
  }

  .token {
    flex-basis: var(--token-width, 45ch);
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

customElements.define("color-dictionary", ColorDictionary);
