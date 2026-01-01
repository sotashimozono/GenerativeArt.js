/** @type {import('../../src/main.js').ArtWork} */
export const title = "Ripple Contours";
export const author = "";

export function init(canvas) {
  const ctx = canvas.getContext("2d");
  let animationId;

  // キャンバスのリサイズ
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener("resize", resize);
  resize();

  // 描画パラメータ
  const spacing = 8; // グリッドの間隔（小さいほど高精細）
  const threshold = 0.1; // 線の太さ（等高線に判定される幅）
  const zoom = 0.02; // 空間的なスケール

  function draw(time) {
    const t = time * 0.002; // 時間の進行

    // 背景をクリア（少しだけ透過させることで残像を作ることも可能）
    ctx.fillStyle = "#1a1a1a"; // シックな暗い背景
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#555"; // 線の色（落ち着いたグレー）
    ctx.lineWidth = 1;

    // グリッドを走査
    for (let x = 0; x < canvas.width; x += spacing) {
      for (let y = 0; y < canvas.height; y += spacing) {
        // 物理的な座標系に変換（中心を原点に）
        const dx = (x - canvas.width / 2) * zoom;
        const dy = (y - canvas.height / 2) * zoom;

        // スカラー場 f(x, y, t) の計算
        // ここを書き換えるだけで模様が激変します
        const r = Math.sqrt(dx * dx + dy * dy);
        const val =
          Math.sin(r - t) +
          Math.cos(dx * Math.sin(t * 0.1) + dy * Math.cos(t * 0.1));

        // 「等高線」の判定：
        // sin(val * 密度) が 1 に近い場所だけを描画する
        const contourDensity = 5.0;
        if (Math.abs(Math.sin(val * contourDensity)) > 1.0 - threshold) {
          ctx.beginPath();
          // 点ではなく小さな線を描くことで滑らかに見せる
          ctx.rect(x, y, 2, 2);
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(draw);
  }

  // アニメーション開始
  draw(0);

  // 作品が切り替わった時にアニメーションを止めるためのクリーンアップ関数
  // (main.js側で呼び出す仕組みを後で作ると良いです)
  return () => cancelAnimationFrame(animationId);
}
