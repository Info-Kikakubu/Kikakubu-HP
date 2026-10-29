// 装飾用コードを入力し、全文選択・削除して繰り返します。
(() => {
  "use strict";
  const layer = document.createElement("div");
  layer.className = "code-background";
  layer.setAttribute("aria-hidden", "true");
  const source = [
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
    "// learn / create / share"
  ];
  const editors = Array.from({ length: 3 }, () => {
    const stream = document.createElement("pre");
    stream.className = "code-stream";
    const text = document.createElement("span");
    text.className = "code-text";
    stream.append(text);
    layer.append(stream);
    return { stream, text, content: "" };
  });
  document.body.prepend(layer);
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "code-motion-toggle";
  toggle.setAttribute("aria-pressed", "false");
  toggle.textContent = "背景の動きを停止";
  document.querySelector(".site-footer")?.append(toggle);

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let paused = false;
  let timer = null;
  let resizeTimer = null;
  let phase = "typing";
  let position = 0;
  let length = 0;
  let delay = 32;
  const render = () => {
    layer.dataset.phase = reduced.matches ? "static" : phase;
    layer.classList.toggle("is-selected", !reduced.matches && phase === "selected");
    editors.forEach(editor => {
      editor.text.textContent = reduced.matches ? editor.content : editor.content.slice(0, position);
    });
  };
  function schedule() {
    clearTimeout(timer);
    timer = null;
    const stopped = paused || document.hidden || reduced.matches;
    layer.classList.toggle("is-paused", stopped);
    if (!stopped) timer = setTimeout(tick, delay);
  }
  function tick() {
    if (phase === "typing") {
      position++;
      if (position >= length) {
        phase = "holding";
        delay = 1800;
      } else {
        const newline = editors.some(editor => editor.content[position - 1] === "\n");
        delay = newline ? 160 : 32;
      }
    } else if (phase === "holding") {
      phase = "selected";
      delay = 1000;
    } else if (phase === "selected") {
      position = 0;
      phase = "cleared";
      delay = 700;
    } else {
      phase = "typing";
      delay = 32;
    }
    render();
    schedule();
  }
  function reset() {
    clearTimeout(timer);
    // 折り返しも行数に含め、画面の高さに収まる量だけ入力します。
    editors.forEach((editor, index) => {
      const style = getComputedStyle(editor.stream);
      const fontSize = parseFloat(style.fontSize);
      const lineHeight = parseFloat(style.lineHeight);
      const width = editor.stream.clientWidth || layer.clientWidth;
      const columns = Math.max(12, Math.floor((width - 24) / (fontSize * .65)));
      const rows = Math.max(4, Math.floor((layer.clientHeight - 32) / lineHeight));
      const lines = [];
      let cursor = index * 4;
      while (lines.length < rows) {
        const line = source[cursor++ % source.length];
        if (!line.length) lines.push("");
        else for (let offset = 0; offset < line.length; offset += columns) {
          lines.push(line.slice(offset, offset + columns));
        }
      }
      editor.content = lines.slice(0, rows).join("\n");
    });
    length = Math.max(...editors.map(editor => editor.content.length));
    position = 0;
    phase = "typing";
    delay = 32;
    render();
    schedule();
  }
  toggle.addEventListener("click", () => {
    paused = !paused;
    toggle.setAttribute("aria-pressed", String(paused));
    toggle.textContent = paused ? "背景の動きを再生" : "背景の動きを停止";
    schedule();
  });
  document.addEventListener("visibilitychange", schedule);
  reduced.addEventListener("change", reset);
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(reset, 150);
  });
  reset();
})();
