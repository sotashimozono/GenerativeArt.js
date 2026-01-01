const sketches = import.meta.glob(['../sketches/parody/*.js', '../sketches/works/*.js'], { eager: true });
import './styles/gallery.css';

const GITHUB_BASE_URL = 'https://github.com/sotashimozono/GenerativeArt.js/blob/main';
function getGithubUrl(path) {
  const relativePath = path.replace(/^\.\.\//, ''); 
  return `${GITHUB_BASE_URL}/${relativePath}`;
}

let currentWorkPath = null;
let currentCleanup = null;

const style = getComputedStyle(document.documentElement);
const thumbW = parseInt(style.getPropertyValue('--thumb-width')) || 300;
const thumbH = parseInt(style.getPropertyValue('--thumb-height')) || 200;

const initGallery = () => {
  const parodyGrid = document.getElementById('parodyGrid');
  const worksGrid = document.getElementById('worksGrid');

  Object.keys(sketches).forEach((path) => {
    const work = sketches[path];
    const targetGrid = path.includes('parody') ? parodyGrid : worksGrid;
    const authorTag = work.author ? `<p class="card-author">by ${work.author}</p>` : '';
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="thumbnail-wrapper">
        <canvas class="thumb-canvas"></canvas>
      </div>
      <div class="card-content">
        <h3 class="card-title">${work.title || 'Untitled'}</h3>
        ${authorTag}
      </div>
    `;

    const thumbCanvas = card.querySelector('.thumb-canvas');
    thumbCanvas.width = thumbW;
    thumbCanvas.height = thumbH;

    if (work.init) work.init(thumbCanvas);

    card.onclick = () => showDetail(path);
    targetGrid.appendChild(card);
  });
};

// main.js の showDetail 関数を以下のように修正
function showDetail(path) {
  const work = sketches[path]; //
  currentWorkPath = path;

  document.getElementById('galleryView').style.display = 'none';
  const detailView = document.getElementById('detailView');
  detailView.style.display = 'flex';

  if (currentCleanup) {
    currentCleanup();
    currentCleanup = null;
  }

  // 1. タイトル
  document.getElementById('infoTitle').textContent = work.title || 'Untitled';

  // 2. 著者 (author がある時だけ 'by ...' を表示)
  const authorEl = document.getElementById('authorName');
  if (authorEl) {
    authorEl.textContent = work.author ? `by ${work.author}` : '';
    authorEl.style.display = work.author ? 'block' : 'none';
  }

  // 3. 説明文 (description がある時だけ表示)
  const descEl = document.getElementById('infoDescription');
  if (work.description) {
    descEl.textContent = work.description;
    descEl.style.display = 'block';
  } else {
    descEl.style.display = 'none';
  }

  // 4. GitHub リンク (Source は常に表示)
  const sourceLinkEl = document.getElementById('sourceLink');
  if (sourceLinkEl) {
    const relativePath = path.replace(/^\.\.\//, '');
    sourceLinkEl.href = `${GITHUB_BASE_URL}/${relativePath}`;
  }

  // 5. 外部リンク (External Link の条件分岐)
  const infoLinkEl = document.getElementById('infoLink');
  if (infoLinkEl) {
    if (work.link) {
      infoLinkEl.href = work.link;
      infoLinkEl.style.display = 'inline-flex'; // 値があれば表示
      infoLinkEl.textContent = 'External Link';
    } else {
      infoLinkEl.style.display = 'none';
    }
  }

  requestAnimationFrame(() => {
    const canvas = document.getElementById('artCanvas');
    const container = canvas.parentElement;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    if (work.init) {
      currentCleanup = work.init(canvas);
    }
  });
}

document.getElementById('backBtn').onclick = () => {
  if (currentCleanup) {
    currentCleanup();
    currentCleanup = null;
  }
  document.getElementById('galleryView').style.display = 'block';
  document.getElementById('detailView').style.display = 'none';
};

initGallery();