let vec_sum = (w, v) => w.map((e, i) => e + v[i]);

function vec_sum_coord(coordinates, position, increment){ 
    position[coordinates[0]] += increment[0];
    position[coordinates[1]] += increment[1];
}

function can_move(position, increment, maze) {
    let moved = vec_sum(position, increment);
    let limit = maze.length;

    // Check if trying to move out of the maze
    if (moved[0] >= limit || moved[1] >= limit || moved[0] < 0 || moved[1] < 0) 
        return false;

    // Check if trying to move to a blocked position
    if (maze[moved[0]][moved[1]] == 0) return true;
    
    return false;
}
