import color from "./config/color.js";

// Functional DOM helpers
import { add, after, element, set } from "./dom.js";

const dict = {
  color: color("#7ea"),
};

after(element("updated"), add({ as: "created", color: "aqua" }, "color-token"));

set({ color: "chartreuse" }, element("updated"));

set({ data: dict.color }, element("sample"));
