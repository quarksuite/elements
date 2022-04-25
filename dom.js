export function add(properties, type) {
  const el = document.createElement(type);

  Object.entries(properties).forEach(([key, value]) => {
    el[key] = value;
  });

  return el;
}

export function before(target, el) {
  target.insertAdjacentHTML("beforebegin", el.outerHTML);
}

export function after(target, el) {
  target.insertAdjacentHTML("afterend", el.outerHTML);
}

export function element(identifier) {
  return document.querySelector(`[as="${identifier}"]`);
}

export function set(properties, el) {
  Object.entries(properties).forEach(([key, value]) => {
    if (el.hasAttribute(key)) {
      el.setAttribute(key, value);
    }

    el[key] = value;
  });

  el.shadowRoot.replaceChildren();
  el.replaceWith(el);
}

export function unset(properties, el) {
  properties.forEach((key) => {
    if (el.hasAttribute(key)) {
      el.removeAttribute(key);
    }

    delete el[key];
  });

  el.shadowRoot.replaceChildren();
  el.replaceWith(el);
}

export function remove(...els) {
  els.forEach((el) => el.remove());
}
