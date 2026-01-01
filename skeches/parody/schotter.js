export const title = "Schotter(1968)";
export const author = "Georg Nees";
export const link = "https://collections.vam.ac.uk/item/O221321/schotter-print-nees-georg/";

export function init(canvas) {
    // configurations
    const COLS = 12;
    const ROWS = 22;
    const SIZE = 28;
    const PADDING = 22;

    // initialize
    const ctx = canvas.getContext('2d');

    // set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // set drawing style
    ctx.fillStyle = '#e6e6e6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;

    const startX = (canvas.width - (COLS * SIZE)) / 2;
    const startY = (canvas.height - (ROWS * SIZE)) / 2;

    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
        
            const chaosFactor = y / ROWS;

            const offsetX = (Math.random() - 0.5) * SIZE * chaosFactor * 0.8;
            const offsetY = (Math.random() - 0.5) * SIZE * chaosFactor * 0.8;
            
            const angle = (Math.random() - 0.5) * Math.PI * 0.30 * chaosFactor;

            const posX = startX + x * SIZE;
            const posY = startY + y * SIZE;

            ctx.save();
            
            // 1. 描画の基準点を、四角形の中心に移動させる
            ctx.translate(posX + offsetX + SIZE / 2, posY + offsetY + SIZE / 2);
            
            ctx.rotate(angle);

            ctx.strokeRect(-SIZE / 2, -SIZE / 2, SIZE, SIZE);

            ctx.restore();
        }
    }
}
