// 実行しない装飾用コード。本文や操作を妨げず、CSSだけでゆっくり流します。
(() => {
  "use strict";
  const layer = document.createElement("div");
  layer.className = "code-background";
  layer.setAttribute("aria-hidden", "true");
  const code = [
    "// DESAI / CREATIVE LAB",
    "const festival = createFestival();",
    "",
    "async function buildTown() {",
    "  const town = new Town();",
    "  await town.loadAssets();",
    "  for (const block of town.blocks) {",
    "    block.connectNeighbors();",
    "    block.render();",
    "  }",
    "  return town;",
    "}",
    "",
    "const interests = discover();",
    "const quest = new CampusQuest();",
    "quest.plan(interests);",
    "",
    "function update(deltaTime) {",
    "  world.simulate(deltaTime);",
    "  camera.follow(player);",
    "  renderer.draw(scene);",
    "}",
    "",
    "await buildTown();",
    "festival.on('play', update);",
    "console.log('Ready to explore!');",
    "// learn / create / share",
    ""
  ].join("\n");
  for (let index = 0; index < 3; index++) {
    const stream = document.createElement("div");
    stream.className = "code-stream";
    for (let copy = 0; copy < 2; copy++) {
      const text = document.createElement("pre");
      text.textContent = code + "\n";
      stream.append(text);
    }
    layer.append(stream);
  }
  document.body.prepend(layer);
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "code-motion-toggle";
  toggle.setAttribute("aria-pressed", "false");
  toggle.textContent = "背景の動きを停止";
  let paused = false;
  const sync = () => layer.classList.toggle("is-paused", paused || document.hidden);
  toggle.addEventListener("click", () => {
    paused = !paused;
    toggle.setAttribute("aria-pressed", String(paused));
    toggle.textContent = paused ? "背景の動きを再生" : "背景の動きを停止";
    sync();
  });
  document.addEventListener("visibilitychange", sync);
  sync();
  document.querySelector(".site-footer")?.append(toggle);
})();
