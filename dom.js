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

  update(el);
}

export function unset(properties, el) {
  properties.forEach((key) => {
    if (el.hasAttribute(key)) {
      el.removeAttribute(key);
    }

    delete el[key];
  });

  update(el);
}

export function move(target, ...els) {
  els.forEach((el) => target.append(el));

  update(target);

  Array.from(target.children).forEach((el) => update(element(el.as)));
}

export function copy(target, ...els) {
  els.forEach((el) => target.append(el.cloneNode(true)));

  update(target);

  Array.from(target.children).forEach((el) => update(element(el.as)));
}

export function update(...els) {
  els.forEach((el) => {
    el.shadowRoot.replaceChildren();
    el.replaceWith(el);
  });
}

export function remove(...els) {
  els.forEach((el) => el.remove());
}
