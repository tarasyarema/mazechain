const canvas    = document.getElementById('canvas');
const context   = canvas.getContext('2d');

let view        = level.map;
let size_width  = canvas.width  / level.blocks;
let size_height = canvas.height / level.blocks;

function draw() {
    // Clear the canvas before redrawing
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the 2D maze
    for (let i = 0; i < level.blocks; ++i)
        for (let j = 0; j < level.blocks; ++j) {
            if (level.map[i][j])
                context.fillStyle = 'rgb(0, 0, 0)';   
            else
                context.fillStyle = 'rgb(200, 200, 200)';  

            context.fillRect(i * size_width, j * size_height, size_width, size_height);
        }

    // Draw the goal position
    if (level.goal.sameDim)
        context.fillStyle = 'rgb(200, 0, 0)';
    else
        context.fillStyle = 'rgb(255, 150, 150)';
    context.fillRect(level.goal.position[0] * size_width, level.goal.position[1] * size_height, 
        size_width, size_height);

    // Draw the player position
    context.fillStyle = 'rgb(40, 0, 150)';
    context.fillRect(level.position[0] * size_width, level.position[1] * size_height, size_width, size_height);
}


let now;
let delta;
let fps         = 60;
let then        = Date.now();
let interval    = 1000 / fps;

function loop() {
    requestAnimationFrame(loop);

    now     = Date.now();
    delta   = now - then;
     
    if (delta > interval) {
        then = now - (delta % interval);
        draw();
    }
}

loop();

