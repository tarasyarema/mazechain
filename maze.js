function build_maze(t, d, threshold){
    let rec = function(pos){
        if (pos === d) {
            return 1*(Math.random() > threshold);
        } else {
            let group = new Array(t);
            for (var i = 0; i < t; ++i)
                group[i] = rec(pos + 1);
            return group;
        }
    };
    return rec(0);
}

function get_value(maze, pos){
    let rec = function(sub_maze, sub_pos){
        if (sub_pos === pos.length - 1){
            return sub_maze[pos[sub_pos]];
        } else {
            return rec(sub_maze[pos[sub_pos]], sub_pos + 1);
        }
    };
    return rec(maze, 0);
}

function get_projection(maze, pos, dim_x, dim_y) {
    let t = maze.length;
    let matrix = new Array(t);
    let new_pos = pos.slice();
    for (let i = 0; i < t; ++i) {
        new_pos[dim_x] = i;
        matrix[i] = new Array(t);
        for (let j = 0; j < t; ++j) {
            new_pos[dim_y] = j;
            matrix[i][j] = get_value(maze, new_pos);
        }
    }
    return matrix;
}

function calc_threshold(t, d){
    return 0.75;
}

function build_game(t, d){
    let are_equal_arrays = function(arr1, arr2){
        if (arr1.length !== arr2.length) return false;
        for (var i = 0; i < arr1.length; ++i){
            if (arr1[i] !== arr2[i]){
                return false;
            }
        }
        return true;
    };
    let maze = build_maze(t, d, calc_threshold(t, d));
    let initial = new Array(d);
    let goal = new Array(d);
    var i;
    do {
        for (i = 0; i < d; ++i) {
            initial[i] = Math.floor(t * Math.random());
            goal[i] = Math.floor(t * Math.random());
        }
    } while (get_value(maze, initial) === 1 ||
             get_value(maze, goal) === 1 ||
             are_equal_arrays(initial, goal));

    return {
        't': t,
        'd': d,
        'maze': maze,
        'initial': initial,
        'goal': goal
    }
}

let t0 = 4;
let d0 = 3;
game = build_game(t0, d0);
console.log(game);
console.log(game.maze);