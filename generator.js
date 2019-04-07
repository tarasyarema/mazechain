
let SIZE = 9;
let DIMS = 3;

function add(one, other) {
  var result = [];
  for(var i = 0; i < one.length; i++) {
    result[i] = one[i] + other[i];
  }
  return result;
};

function createWorld(dimension, size) {
  return  Array(Math.pow(size, dimension)).fill(0);
}

function possibleMovements(dimension) {
  function movements(size, value) {
    let array = new Array(size);
    for (let i = 0; i < size; ++i) {
      array[i] = new Array(size).fill(0);
      array[i][i] = value;
    }
    return array;
  }
  return [
    ...movements(dimension, 1),
    ...movements(dimension, -1)
  ];
}

let world = [];
let movements = [];

function toArrayCoordinate(array, size, dimensions) {
  let index = 0;
  for (let i = 1; i <= dimensions; ++i) {
    index += array[i - 1] * Math.pow(size, dimensions - i);
  }
  return index;
}

function validPos(pos) {
  for (var j = 0; j < pos.length; ++j) {
    if (pos[j] < 0 || pos[j] >= SIZE) {
      return false;
    }
  }
  const newIndex = toArrayCoordinate(pos, SIZE, DIMS);
  return !world[newIndex];
}

function canMove(pos) {
  for (var i = 0; i < movements.length; ++i) {
    const newPos = add(add(pos, movements[i]), movements[i]);
    if (validPos(newPos)) {
      return true;
    }
  }
  return false;
}

function randomMove() {
  return movements[Math.floor(Math.random() * (movements.length))];
}

function move(pos) {
  let firstStep = [];
  let secondStep = [];
  do {
    const move = randomMove();
    firstStep = add(pos, move);
    secondStep = add(firstStep, move);
  } while (!validPos(secondStep));

  if (secondStep.length > 0) {
    const firstIndex = toArrayCoordinate(firstStep, SIZE, DIMS);
    world[firstIndex] = 1;
    const secondIndex = toArrayCoordinate(secondStep, SIZE, DIMS);
    world[secondIndex] = 1;

    return secondStep;
  }
  return pos;
}

function isZero(x) {
  return x === 0;
}

function recBuildMaze(position) {
  if (canMove(position)) {
    let auxPos = [];
    do {
      auxPos = move(position);
      recBuildMaze(auxPos);
    } while (canMove(position));
  }
}

function build_maze(t, d){
  let g_pos = 0;
  let rec = function(pos){
    if (pos === d) {
      return world[g_pos++] ? 0 : 1;
    } else {
      let group = new Array(t);
      for (var i = 0; i < t; ++i)
        group[i] = rec(pos + 1);
      return group;
    }
  };
  return rec(0);
}

function createMaze(size, dims) {
  DIMS = dims;
  SIZE = size;
  world = createWorld(DIMS, SIZE);
  movements = possibleMovements(DIMS);
  recBuildMaze(new Array(DIMS).fill(0));
  return build_maze(SIZE, DIMS);
}

module.exports = { createMaze };
