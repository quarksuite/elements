export class ColorDictionary extends HTMLElement {
  constructor() {
    super();

    this.as = this.as;

    this.shadow = this.attachShadow({ mode: "open" });
  }

  #as = "";
  #dictionary = {};

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
<div part="category">
  ${tree(head.concat(key, "."), value)}
</div>
`;
          }

          if (typeof value === "object") {
            return tree(head.concat(key, "."), value);
          }

          return `<li part="token"><color-token part="color" exportparts="
swatch: color-swatch,
value: color-value,
code: color-code" as="${
            head.concat(
              key,
            )
          }" color="${value}" format="none"></color-token></li>`;
        })
        .join("\n");

    return `<ul part="group">${tree("", data)}</ul>`;
  }

  template() {
    const as = this.as || this.#as;
    const dictionary = this.dictionary || this.#dictionary;
    const tmpl = document.createElement("template");

    tmpl.innerHTML = `
${this.styles()}
    ${
      Object.keys(dictionary).length
        ? this.assemble(dictionary)
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
  --swatch-size: 10vh;
  --swatch-border-width: 0.25ex;
  --data-size: 1rem;

  --token-width: 32ch;

  --color-spacing: var(--spacing);
  --color-swatch-size: var(--swatch-size);
  --color-swatch-border-width: var(--swatch-border-width);
  --color-data-size: var(--data-size);

  display: block;
}

:host[hidden] {
  display: none;
}

[part="group"] {
  list-style: none;
  padding-left: 0;
}

[part="category"] {
  display: flex;
  flex-flow: row wrap;
  gap: var(--spacing);
  border: calc(var(--spacing) / 8) dashed currentcolor;
  margin-bottom: var(--spacing);
  padding: var(--spacing);
}

[part="token"] {
  flex: 1;
  flex-basis: var(--token-width);
}

[part="color"] {
  --spacing: var(--color-spacing);
  --swatch-size: var(--color-swatch-size);
  --swatch-border-width: var(--color-swatch-border-width);
  --data-size: var(--color-data-size);
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
