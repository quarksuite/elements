import {
  pipeline,
  preset,
} from "https://cdn.jsdelivr.net/gh/quarksuite/core@2.0.0-20/workflow.min.js";

import {
  accessibility,
  palette,
  tokens,
} from "https://cdn.jsdelivr.net/gh/quarksuite/core@2.0.0-20/color.min.js";

const uiA11y = preset(accessibility, { large: true });
const headingA11y = preset(accessibility, {});
const textA11y = preset(accessibility, { rating: "AAA" });

const material = preset(palette, { contrast: 95, accented: true });
const materialDark = preset(palette, {
  contrast: 90,
  accented: true,
  dark: true,
});

function paletteFactory(swatch) {
  const generator = (color) => [material(color), materialDark(color)];

  const assembler = ([light, dark]) => ({
    ui: pipeline(light, uiA11y, tokens),
    heading: pipeline(light, headingA11y, tokens),
    text: pipeline(light, textA11y, tokens),
    dark: {
      ui: pipeline(dark, uiA11y, tokens),
      heading: pipeline(dark, headingA11y, tokens),
      text: pipeline(dark, textA11y, tokens),
    },
  });

  return pipeline(swatch, generator, assembler);
}

export default paletteFactory;
