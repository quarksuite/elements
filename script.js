import color from "./config/color.js";

// Functional DOM helpers
import { element, set } from "./dom.js";

set(
  {
    dictionary: {
      color: {
        spring: color(element("seasons.0").color),
        summer: color(element("seasons.1").color),
        fall: color(element("seasons.2").color),
        winter: color(element("seasons.3").color),
      },
    },
  },
  element("color"),
);
