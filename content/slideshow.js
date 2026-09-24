// 画像の順番と表示時間を編集します。画像を追加したら items にも追記してください。
window.festivalContent = window.festivalContent || {};
window.festivalContent.slideshow = {
  interval: 6000,
  transition: 1000,
  items: [
    { src: "./assets/slideshow/demo1.jpg", alt: "スライド写真 1" },
    { src: "./assets/slideshow/demo2.jpg", alt: "スライド写真 2" },
    { src: "./assets/slideshow/demo3.jpg", alt: "スライド写真 3" },
    { src: "./assets/slideshow/demo4.jpg", alt: "スライド写真 4" }
  ]
};
