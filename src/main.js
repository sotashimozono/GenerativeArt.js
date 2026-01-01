const modules = import.meta.glob(['../skeches/parody/*.js', '../skeches/works/*.js'], { eager: true });
const skeches_parody = import.meta.glob(['../skeches/parody/*.js'], { eager: true });
const skeches_works = import.meta.glob(['../skeches/works/*.js'], { eager: true });


const galleryView = document.getElementById('galleryView');
const detailView = document.getElementById('detailView');
const cardGrid = document.getElementById('cardGrid');

import './styles/gallery.css';

// --- 一覧ページの生成 ---
const parodyGrid = document.getElementById('parodyGrid');
const worksGrid = document.getElementById('worksGrid');

// --- 一覧ページの生成 ---
Object.keys(modules).forEach((path) => {

const work = modules[path];

const targetGrid = path.includes('parody') ?

document.getElementById('parodyGrid') :

document.getElementById('worksGrid');



const card = document.createElement('div');

card.className = 'card';


// 1. カードの中に小さなキャンバスを配置

card.innerHTML = `

<div class="thumbnail-wrapper">

<canvas class="thumb-canvas"></canvas>

</div>

<div class="card-content">

<h3 class="card-title">${work.title || 'Untitled'}</h3>

<p class="card-author">by ${work.author || 'Anonymous'}</p>

</div>

`;


// 2. その小さなキャンバスに対して描画を実行

const thumbCanvas = card.querySelector('.thumb-canvas');


// サムネイル用にサイズを固定（CSSのサイズと合わせる）

thumbCanvas.width = 300;

thumbCanvas.height = 200;



if (work.init) {

// 作品の描画ロジックを実行！

// ※アニメーション作品の場合は、ここで「1回だけ描く」フラグを渡すなどの工夫が将来的に必要

work.init(thumbCanvas);

}

card.onclick = () => showDetail(path);

targetGrid.appendChild(card);

});;

// --- 詳細ページの表示 ---
function showDetail(path) {
  const work = modules[path];
  galleryView.style.display = 'none';
  detailView.style.display = 'flex';

  // メタデータの流し込み
  document.getElementById('infoTitle').textContent = work.title;
  document.getElementById('authorName').textContent = work.author;
  document.getElementById('infoDescription').textContent = work.description || 'No description available.';
  
  const linkEl = document.getElementById('infoLink');
  if (work.link) {
    linkEl.href = work.link;
    linkEl.style.display = 'inline';
  } else {
    linkEl.style.display = 'none';
  }

  // 描画開始
  const canvas = document.getElementById('artCanvas');
  if (work.init) work.init(canvas);
}

// 戻るボタン
document.getElementById('backBtn').onclick = () => {
  location.reload(); // 簡易的にリロードで一覧へ（本当はアニメーション停止処理が必要）
};