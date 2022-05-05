class ColorScale extends HTMLElement {
  constructor() {
    super();

    this.as = this.as;
    this.format = this.format;

    this.shadow = this.attachShadow({ mode: "open" });
  }

  #as = "color";
  #format = "hex rgb hsl";

  set as(value) {
    this.reflect("as", value);
  }

  get as() {
    return this.getAttribute("as");
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
    return ["as", "format"];
  }

  // Assignment behavior
  assign() {}

  template() {
    const as = this.as || this.#as;
    const tmpl = document.createElement("template");

    tmpl.innerHTML = `
<style>
${this.styles()}
</style>
<slot>No &lt;color-token&gt; elements slotted in <code>"${as}"</code></slot>
`;

    return tmpl.content.cloneNode(true);
  }

  styles() {
    return `
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

::slotted(color-token) {
  --spacing: var(--color-spacing);
  --swatch-size: var(--color-swatch-size);
  --swatch-border-width: var(--color-swatch-border-width);
  --data-size: var(--color-data-size);
}
`;
  }

  render() {
    return this.shadow.append(this.template());
  }

  connectedCallback() {
    const as = this.as || this.#as;
    const format = this.format || this.#format;

    this.render();

    const tokens = Array.from(
      this.shadowRoot.querySelector("slot").assignedElements(),
    );

    this.scale = [];

    tokens.forEach((el, pos) => {
      const assignment = [as, el.as ? el.as : pos];

      el.setAttribute("as", assignment.join("."));
      el.setAttribute("format", format);

      const [, identifier] = el.getAttribute("as").split(".");
      const [color] = Object.values(el.token);

      this.scale = [...this.scale, { [identifier]: color }];

      el.shadowRoot.replaceChildren();
      el.replaceWith(el);
    });

    this.scale = {
      [as]: {
        ...this.scale.reduce(
          (acc, token) => ({
            ...acc,
            ...token,
          }),
          {},
        ),
      },
    };
  }
}

customElements.define("color-scale", ColorScale);
