// 本文と拡大ページで同じマップ情報を使用します。
(() => {
  const data = window.festivalContent?.access || {};
  const image = document.getElementById("map");
  if (data.image) {
    const url = new URL(data.image, document.baseURI);
    if (["http:", "https:", "file:"].includes(url.protocol)) image.src = url.href;
  }
  image.alt = data.imageAlt || "キャンパスマップ";
  document.getElementById("description").textContent = data.description || "";
  document.getElementById("credit").textContent = data.credit || "";
})();
