import color from "./config/color.js";

const dict = {
  color: color("#7ea"),
};

const uiDict = document.querySelector("color-dictionary[as]");

uiDict.data = { color: dict.color };

uiDict.shadowRoot.textContent = "";
uiDict.parentNode.replaceChild(uiDict, uiDict);
