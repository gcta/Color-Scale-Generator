console.log("Color Scale Plugin loaded");

window.addEventListener("message", async (event) => {
  const { type, data } = event.data.pluginMessage;
  if (type !== "generate-scale") return;

  const doc = await Penpot.currentDocument;
  const page = await doc.currentPage();
  const group = await doc.createGroup({ parentId: page.id });

  for (let i = 0; i < data.colors.length; i++) {
    const color = data.colors[i];
    await doc.createRect({
      parentId: group.id,
      x: i * 100,
      y: 0,
      width: 80,
      height: 80,
      fills: [{ type: "SOLID_COLOR", color }]
    });

    await doc.createText({
      parentId: group.id,
      x: i * 100,
      y: 90,
      text: data.hexCodes[i],
      fontSize: 14,
      fills: [{ type: "SOLID_COLOR", color: { r: 0, g: 0, b: 0 } }]
    });
  }
});