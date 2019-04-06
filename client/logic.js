function can_move(position, maze, increment) {
    let moved = position.map((e, i) => e + increment[i]);
    
    return moved;
}

console.log(can_move([1.1, 2], [1, 1]))