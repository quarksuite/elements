import {
  pipeline,
  preset,
} from "https://cdn.jsdelivr.net/gh/quarksuite/core@2.0.0-20/workflow.min.js";

import {
  accessibility,
  convert,
  harmony,
  output,
  palette,
  tokens,
} from "https://cdn.jsdelivr.net/gh/quarksuite/core@2.0.0-20/color.min.js";

const scheme = preset(harmony, { configuration: "triadic" });

const uiA11y = preset(accessibility, { large: true });
const headingA11y = preset(accessibility, {});
const textA11y = preset(accessibility, { rating: "AAA" });

const material = preset(palette, { contrast: 90, accented: true });
const materialDark = preset(palette, {
  contrast: 95,
  accented: true,
  dark: true,
});

function paletteFactory(swatch) {
  const generator = (data) =>
    data.map((color) => [material(color), materialDark(color)]);

  const assembler = (data) =>
    data.reduce(
      (acc, [light, dark], pos) => ({
        ...acc,
        [["main", "accent", "highlight", "spot"][pos]]: {
          ui: pipeline(light, uiA11y, tokens),
          heading: pipeline(light, headingA11y, tokens),
          text: pipeline(light, textA11y, tokens),
          dark: {
            ui: pipeline(dark, uiA11y, tokens),
            heading: pipeline(dark, headingA11y, tokens),
            text: pipeline(dark, textA11y, tokens),
          },
        },
      }),
      {},
    );

  return pipeline(swatch, scheme, generator, assembler);
}

export default paletteFactory;
