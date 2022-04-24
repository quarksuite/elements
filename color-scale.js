class ColorScale extends HTMLElement {
  constructor() {
    super();

    this.as = this.as;
    this.colors = this.colors;
    this.format = this.format;

    this.shadow = this.attachShadow({ mode: "open" });
  }

  #as = "";
  #colors = "white gray black";
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
    const targets = as && as.split(" ");

    return as.split(" ").length > 1
      ? targets.map((as, pos) => [as, colors.split(" ")[pos]])
      : colors
          .split(" ")
          .map((color, pos) => [as && [as, pos].join("."), color]);
  }

  template() {
    const colors = this.colors || this.#colors;
    const format = this.format || this.#format;
    const tmpl = document.createElement("template");

    tmpl.innerHTML = `
${this.styles()}
${this.assign(colors)
  .map(
    ([as, color]) =>
      `<color-token as="${as}" color="${color}" format="${format}"></color-token>`
  )
  .join("\n")}
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

color-token {
  flex: 1;
  flex-basis: var(--color-token-width, 45ch);
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
