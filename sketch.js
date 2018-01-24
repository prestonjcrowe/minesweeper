var gridSize = 20;
var cellSize = 20;
var grid = [];
var mines = [];
var startingMines = 50;
var tileColor;
var gameOver;
var f = false;

function setup() {
  createCanvas(windowWidth, windowWidth);
  const NUM_COLORS = [
                [99, 177, 240], [176, 214, 139],
  				[213, 96, 97], [174, 137, 213],
  				[253, 166, 87], [145, 203, 216],
  				[255, 255, 255], [137, 158, 156]];
  tileColor = color(47, 49, 48);

  gameOver = false;
  for (var n = 0; n < gridSize; n++) {
    grid[n] = [];
  }
  for (var i = 0; i < gridSize; i++) {
    for (var j = 0; j < gridSize; j++) {
      var myNewCell = {
        x: i,
        y: j,
        hidden: "true",
        state: 0,
        flagged: false,
        show: function() {
          fill(27, 29, 28);
          rect(cellSize * this.x, cellSize * this.y, cellSize, cellSize);
          textSize(15);
          fill(0);
          textAlign(CENTER, CENTER);
          if (this.state> 0) {
            var c = color(NUM_COLORS[this.state - 1][0], NUM_COLORS[this.state - 1][1], NUM_COLORS[this.state - 1][2]);
            fill(c);
          } 
          if (this.state != 0 && this.state != -9) {
            text(this.state, this.x * cellSize + cellSize / 2, this.y * cellSize + cellSize / 2);
          } else if (this.state == -9) {
            drawMine(this.x, this.y);
          }
          if (this.hidden) {
            fill(tileColor);
            rect(cellSize * this.x, cellSize * this.y, cellSize, cellSize);
          }
          if (this.flagged == true && this.hidden) {
            drawFlag(this.x, this.y);
          }
        },
        reveal: function() {
          this.hidden = false;
          if (this.state == 0) {
            for (var r = this.x - 1; r < this.x + 2; r++) {
              for (var t = this.y - 1; t < this.y + 2; t++) {
                if (r > -1 && r < gridSize &&
                  t > -1 && t < gridSize && grid[r][t].hidden) {
                  grid[r][t].reveal();
                }
              }
            }
          } else if (this.state == -9) {
            gameOver = true;
          }
        }
      }
      grid[i][j] = myNewCell;
    }
  }
  placeMines();
}

function draw() {
  for (var i = 0; i < gridSize; i++) {
    for (var j = 0; j < gridSize; j++) {
      grid[i][j].show();
    }
  }
};

var placeMines = function() {
  for (var p = 0; p < startingMines; p++) {
    var rand1 = Math.round(random(gridSize - 1));
    var rand2 = Math.round(random(gridSize - 1));
    //console.log("Mine " + p + " Location: " + rand1 + " , " + rand2 + ".");
    if (grid[rand1][rand2].state != -9) {
      grid[rand1][rand2].state = -9;
      mines[p] = grid[rand1][rand2];
      for (var r = rand1 - 1; r < rand1 + 2; r++) {
        for (var t = rand2 - 1; t < rand2 + 2; t++) {
          if (r > -1 && r < gridSize &&
            t > -1 && t < gridSize && grid[r][t].state != -9) {
            grid[r][t].state++;
          }
        }
      }
    } else {
      p--;
    }
  }
};

var revealAll = function() {
    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            grid[i][j].reveal();
        }
    }
}

var drawMine = function(x, y) {
    fill(244, 86, 66);
    rect(x * cellSize, y * cellSize, cellSize, cellSize);
};

var drawFlag = function(x, y) {
    fill(158, 229, 91);
    ellipse(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2,
        cellSize / 3, cellSize / 3);
};

var keyPressed = function() {
    if (keyCode === SHIFT) {
        f = true;
    }
    if (key === ' ') {
        setup();
    }
};

var keyReleased = function() {
  if (keyCode === SHIFT) {
    f = false;
  }
};

var mousePressed = function() {
    if (!gameOver) {
        var xpos = Math.floor(mouseX / cellSize);
        var ypos = Math.floor(mouseY / cellSize);
  
        if (f === true) {
            grid[xpos][ypos].flagged = !grid[xpos][ypos].flagged; 
        } else {
            if (!grid[xpos][ypos].flagged) {
                grid[xpos][ypos].reveal();
                if (mines.includes(grid[xpos][ypos])) {
                    gameOver = true;
                    //revealAll();
                }
            }
        }
    }
 };
