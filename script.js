import color from "./config/color.js";

// Functional DOM helpers
import { element, set } from "./dom.js";

const dict = {
  color: color("#7ea"),
};

set({ data: dict.color }, element("sample"));
