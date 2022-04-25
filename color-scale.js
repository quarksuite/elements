class ColorScale extends HTMLElement {
  constructor() {
    super();

    this.as = this.as;
    this.colors = this.colors;
    this.format = this.format;

    this.shadow = this.attachShadow({ mode: "open" });
  }

  #as = "";
  #colors = "white | gray | black";
  #format = "hex";

  set as(value) {
    this.reflect("as", value);
  }

  get as() {
    return this.getAttribute("as");
  }

  set colors(value) {
    this.reflect("colors", value);
  }

  get colors() {
    return this.getAttribute("colors");
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
    return ["as", "colors", "format"];
  }

  // Assignment behavior
  assign(colors) {
    const as = this.as || this.#as;
    const delim = " | ";
    const targets = as && as.split(delim);

    return as.split(delim).length > 1
      ? targets.map((as, pos) => [as, colors.split(delim)[pos]])
      : colors
        .split(delim)
        .map((color, pos) => [as && [as, pos].join("."), color]);
  }

  template() {
    const colors = this.colors || this.#colors;
    const format = this.format || this.#format;
    const tmpl = document.createElement("template");

    tmpl.innerHTML = `
${this.styles()}
${
      this.assign(colors)
        .map(
          ([as, color]) =>
            `<color-token as="${as}" color="${color}" format="${format}" part="color" exportparts="
label: color-label,
swatch: color-swatch,
data: color-data,
value: color-value,
code: color-code,
actual: color-actual"></color-token>`,
        )
        .join("\n")
    }
`;

    return tmpl.content.cloneNode(true);
  }

  styles() {
    return `
<style>
:host {
  --spacing: 1ex;
  --swatch-size: 10vh;
  --swatch-border-width: 0.25ex;
  --data-size: 1rem;

  --color-spacing: var(--spacing);
  --color-swatch-size: var(--swatch-size);
  --color-swatch-border-width: var(--swatch-border-width);
  --color-data-size: var(--data-size);

  display: block;
}

:host[hidden] {
  display: none;
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

customElements.define("color-scale", ColorScale);
