import {
  pipeline,
  preset,
} from "https://cdn.jsdelivr.net/gh/quarksuite/core@2.0.0-26/workflow.min.js";

import {
  accessibility,
  palette,
  tokens,
} from "https://cdn.jsdelivr.net/gh/quarksuite/core@2.0.0-26/color.min.js";

const uiA11y = preset(accessibility, { large: true });
const headingA11y = preset(accessibility, {});
const textA11y = preset(accessibility, { rating: "AAA" });

const material = preset(palette, { contrast: 95, accents: true });
const materialUI = preset(palette, {
  contrast: 95,
  accents: true,
  states: true,
});
const materialDark = preset(palette, {
  contrast: 90,
  accents: true,
  dark: true,
});
const materialDarkUI = preset(palette, {
  contrast: 90,
  accents: true,
  states: true,
  dark: true,
});

function paletteFactory(swatch) {
  const assembler = (color) => ({
    ui: pipeline(materialUI(color), uiA11y, tokens),
    heading: pipeline(material(color), headingA11y, tokens),
    text: pipeline(material(color), textA11y, tokens),
    dark: {
      ui: pipeline(materialDarkUI(color), uiA11y, tokens),
      heading: pipeline(materialDark(color), headingA11y, tokens),
      text: pipeline(materialDark(color), textA11y, tokens),
    },
  });

  return assembler(swatch);
}

export default paletteFactory;
