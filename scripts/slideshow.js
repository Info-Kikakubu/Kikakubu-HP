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
  function showSlide(index) {
    images[current].classList.remove("is-active");
    images[current].setAttribute("aria-hidden", "true");
    current = (index + images.length) % images.length;
    images[current].classList.add("is-active");
    images[current].setAttribute("aria-hidden", "false");
    schedule(interval);
  }
  function advance() { showSlide(current + 1); }
  [["previous", "前の画像", "◀", -1], ["next", "次の画像", "▶", 1]].forEach(([name, text, icon, step]) => {
    const arrow = document.createElement("button");
    arrow.type = "button";
    arrow.className = "slideshow-arrow slideshow-" + name;
    arrow.textContent = icon;
    arrow.setAttribute("aria-label", text);
    arrow.title = text;
    arrow.addEventListener("click", () => showSlide(current + step));
    stage.append(arrow);
  });
  button.addEventListener("click", () => { paused = !paused; label(); schedule(); });
  document.addEventListener("visibilitychange", () => schedule());
  window.addEventListener("pagehide", () => clearTimeout(timer));
  window.addEventListener("pageshow", () => schedule());
  label();
  stage.append(button);
  // 削除済み・読込失敗の写真は切替対象から除外し、空のフレームを出しません。
  Promise.all(images.map(image => image.decode().then(() => image, () => null))).then(results => {
    const loaded = results.filter(Boolean);
    images.forEach(image => { if (!loaded.includes(image)) image.remove(); });
    images.splice(0, images.length, ...loaded);
    if (!images.length) {
      const message = document.createElement("p");
      message.textContent = "写真を読み込めませんでした。";
      message.setAttribute("role", "status");
      wrapper.replaceChildren(message);
      return;
    }
    current = 0;
    images.forEach((image, index) => {
      image.classList.toggle("is-active", index === 0);
      image.setAttribute("aria-hidden", String(index !== 0));
    });
    if (images.length === 1) {
      stage.querySelectorAll("button").forEach(control => control.remove());
      return;
    }
    ready = true;
    schedule();
  });
  return wrapper;
};
