// 5秒静止してから1秒で切り替えます。画像の読み込み完了後に開始します。
window.createFestivalSlideshow = function (config) {
  const items = (config.items || []).filter(item => item.src);
  if (!items.length) return null;
  const wrapper = document.createElement("div");
  wrapper.className = "slideshow";
  wrapper.setAttribute("role", "region");
  wrapper.setAttribute("aria-label", "写真スライドショー");
  const stage = document.createElement("div");
  stage.className = "slideshow-stage";
  const duration = Math.max(0, Number(config.transition) || 1000);
  const interval = Math.max(duration + 1, Number(config.interval) || 6000);
  stage.style.setProperty("--slide-transition", duration + "ms");
  const images = items.map((item, i) => {
    const image = document.createElement("img");
    image.src = item.src;
    image.alt = item.alt || "スライド写真 " + (i + 1);
    image.className = "slideshow-image" + (i === 0 ? " is-active" : "");
    image.setAttribute("aria-hidden", String(i !== 0));
    stage.append(image);
    return image;
  });
  wrapper.append(stage);
  if (images.length < 2) return wrapper;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "slideshow-toggle";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let paused = reduced.matches;
  let ready = false;
  let current = 0;
  let timer;
  function label() {
    button.setAttribute("aria-label", paused ? "再生" : "一時停止");
    button.title = paused ? "再生" : "一時停止";
    button.setAttribute("data-paused", String(paused));
  }
  function schedule(delay = interval - duration) {
    clearTimeout(timer);
    if (!paused && !document.hidden && ready) timer = setTimeout(advance, delay);
  }
  function advance() {
    images[current].classList.remove("is-active");
    images[current].setAttribute("aria-hidden", "true");
    current = (current + 1) % images.length;
    images[current].classList.add("is-active");
    images[current].setAttribute("aria-hidden", "false");
    schedule(interval);
  }
  button.addEventListener("click", () => { paused = !paused; label(); schedule(); });
  document.addEventListener("visibilitychange", () => schedule());
  window.addEventListener("pagehide", () => clearTimeout(timer));
  window.addEventListener("pageshow", () => schedule());
  label();
  stage.append(button);
  Promise.all(images.map(image => image.decode().catch(() => {}))).then(() => {
    ready = true;
    schedule();
  });
  return wrapper;
};
