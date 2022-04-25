class ColorScale extends HTMLElement {
  constructor() {
    super();

    this.as = this.as;
    this.format = this.format;

    this.shadow = this.attachShadow({ mode: "open" });
  }

  #as = "";
  #format = "hex";

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
    const tmpl = document.createElement("template");

    tmpl.innerHTML = `
<style>
${this.styles()}
</style>
<slot>No &lt;color-token&gt; elements slotted in "${this.as || ""}"</slot>
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

  render(...els) {
    return this.shadow.append(...els);
  }

  connectedCallback() {
    const slotted = Array.from(this.children);

    slotted.forEach((el) => {
      const root = el.shadowRoot;

      el.format = this.format;
      el.part = "color";
      el.setAttribute(
        "exportparts",
        `label: color-label, swatch: color-swatch, data: color-data, value: color-value, code: color-code, actual: color-actual`
      );

      el.style.setProperty("--spacing", "var(--color-spacing)");
      el.style.setProperty("--swatch-size", "var(--color-swatch-size)");
      el.style.setProperty(
        "--swatch-border-width",
        "var(--color-swatch-border-width)"
      );
      el.style.setProperty("--data-size", "var(--color-data-size)");

      while (root.firstChild && root.removeChild(root.firstChild));
    });

    this.render(this.template(), ...slotted);
  }
}

customElements.define("color-scale", ColorScale);
