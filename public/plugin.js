penpot.ui.open(
  'Color Scale Generator',
  'https://gcta.github.io/Penpot-Color-Scale/'
);

penpot.plugin.onMessage = async (message) => {
  if (message.type === 'generate-scale') {
    const color = message.color;

    // Funzione per convertire un hex in RGB normalizzato
    function hexToRgb01(hex) {
      const bigint = parseInt(hex.replace(/^#/, ""), 16);
      const r = ((bigint >> 16) & 255) / 255;
      const g = ((bigint >> 8) & 255) / 255;
      const b = (bigint & 255) / 255;
      return { r, g, b };
    }

    const grayScale = [
      0.9551, 0.8945, 0.8297, 0.7668, 0.6993,
      0.6334, 0.5624, 0.5068, 0.4495, 0.3904,
      0.3250, 0.2603, 0.1930
    ];

    const parsed = culori.oklch(culori.parse(color));
    const hue = parsed.h;
    const baseChroma = parsed.c;

    const nodes = [];

    for (let i = 0; i < grayScale.length; i++) {
      const targetL = grayScale[i];
      let chroma = baseChroma;

      while (chroma > 0) {
        const attempt = culori.oklch({ l: targetL, c: chroma, h: hue });
        const rgb = culori.rgb(attempt);
        if (rgb.r >= 0 && rgb.r <= 1 && rgb.g >= 0 && rgb.g <= 1 && rgb.b >= 0 && rgb.b <= 1) {
          const hex = culori.formatHex(rgb);
          const rgb01 = hexToRgb01(hex);

          const rect = penpot.createShape({
            shape: {
              type: "rectangle",
              corner_radius: 4
            },
            width: 60,
            height: 60,
            fill: {
              color: rgb01,
              alpha: 1,
              pattern: "solid"
            }
          });

          const text = penpot.createText({
            text: hex,
            font_size: 10,
            color: { r: 0, g: 0, b: 0 },
            alignment: "center",
            width: 60,
            height: 16
          });

          const group = penpot.groupNodes([rect, text], {
            x: i * 70,
            y: 0
          });

          nodes.push(group);
          break;
        }
        chroma -= 0.01;
      }
    }

    penpot.currentPage.append(...nodes);
  }
};
