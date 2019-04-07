const canvas    = document.getElementById('canvas');
const context   = canvas.getContext('2d');

var size_width = 0;
var size_height = 0;

let level;

function draw() {
    // Clear the canvas before redrawing
    //context.clearRect(0, 0, canvas.width, canvas.height);
    const player    = new Image(size_width, size_height);
    player.src      = 'img/player.jpeg'; 
    const grass     = new Image(size_width, size_height);
    grass.src       = 'img/grass.png'; 
    const block     = new Image(size_width, size_height);
    block.src       = 'img/block.png'; 

    // Draw the 2D maze
    for (let i = 0; i < level.blocks; ++i)
        for (let j = 0; j < level.blocks; ++j) {
            let tmp;
            if (level.map[i][j]) {
                tmp = block;
                context.fillStyle = 'rgb(0, 0, 0)';   
            } else {
                tmp = grass;
                context.fillStyle = 'rgb(200, 200, 200)';  
            }

            context.drawImage(tmp, i * size_width, j * size_height, size_width, size_height);
            // context.fillRect(i * size_width, j * size_height, size_width, size_height);
        }

    
    // Draw the goal position
    const goal  = new Image(size_width, size_height);

    if (level.goal.same_proj) {
        goal.src = 'img/goal.png';
    } else {
        if (level.map[level.goal.position[0]][level.goal.position[1]])
            goal.src = 'img/goal_bo.png';
        else
            goal.src = 'img/border.jpeg';
    }

    context.drawImage(goal, level.goal.position[0] * size_width, level.goal.position[1] * size_height, size_width, size_height);

    // Draw the player position
    // context.fillStyle = 'rgb(40, 0, 150)';
    context.drawImage(player, level.position[0] * size_width, level.position[1] * size_height, size_width, size_height);
    // context.fillRect(level.position[0] * size_width, level.position[1] * size_height, size_width, size_height);
    console.log("end draw()");
    requestAnimationFrame(draw);
}

function init(lvl) {
    level = lvl;
    size_width    = canvas.width  / level.blocks;
    size_height   = canvas.height / level.blocks;
}
