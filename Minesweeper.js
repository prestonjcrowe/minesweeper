const GRID_SIZE = 20;
const CELL_SIZE = 25;
const MINES = 50;

var grid;
var shiftHeld;

function setup() {
    createCanvas(GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);
    shiftHeld = false;
    grid = new Grid(GRID_SIZE, CELL_SIZE, MINES);
    grid.init();
}

function draw() {
    background(0);
    grid.draw();
}

function mousePressed() {
	grid.onClick(mouseX, mouseY, shiftHeld);
}

function keyPressed() {
    if (keyCode === SHIFT) {
        shiftHeld = true;
    }
    if (key === ' ') {
        setup();
    }
};

function keyReleased() {
  if (keyCode === SHIFT) {
    shiftHeld = false;
  }
};
