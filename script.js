import color from "./config/color.js";

// Functional DOM helpers
import { copy, element, set } from "./dom.js";

copy(
  element("seasons"),
  element("spring"),
  element("summer"),
  element("fall"),
  element("winter"),
);

set(
  {
    dictionary: {
      color: {
        spring: color(element("spring").color),
        summer: color(element("summer").color),
        fall: color(element("fall").color),
        winter: color(element("winter").color),
      },
    },
  },
  element("color"),
);
