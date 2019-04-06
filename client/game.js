const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

console.log(level);
let coords = [0, 1];

let view        = level.view;
let size_width  = canvas.width / level.blocks;
let size_height = canvas.height / level.blocks;

let user = {
    position: level.initial
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < level.blocks; ++i)
        for (let j = 0; j < level.blocks; ++j) {
            if (!level.view[i][j])
                ctx.fillStyle = 'rgb(230, 0, 0)';   
            else
                ctx.fillStyle = 'rgb(100, 0, 0)';  
            ctx.fillRect(i * size_width, j * size_height, size_width, size_height);
        }
    ctx.fillStyle = 'rgb(200, 200, 200)';
    ctx.fillRect(user.position[0] * size_width, user.position[1] * size_height, size_width, size_height);
}

let fps = 60;
let now;
let then = Date.now();
let interval = 1000 / fps;
let delta;

function loop() {
    requestAnimationFrame(loop);
    now = Date.now();
    delta = now - then;
     
    if (delta > interval) {
        then = now - (delta % interval);
        draw();
    }
}

loop();

