var gridSize = 20;
var cellSize = 20;
var grid = [];
var mines = [];
var startingMines = 35;
var textHues = [198, 96, 0, 240, 0, 330, 26, 0]; // for 8: s:31, b:50
var tileColor;
var gameOver;
var f = false;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB);
  tileColor = color(0, 0, 80);
  gameOver = true;
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
        flagged: "false",
        show: function() {
          fill(0, 0, 50);
          rect(cellSize * this.x, cellSize * this.y, cellSize, cellSize);
          textSize(15);
          fill(0);
          textAlign(CENTER, CENTER);
          if (this.state != 8) {
            fill(textHues[this.state - 1], 100, 100);
          } else {
            fill(textHues[this.state - 1], 30, 50);
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
                //println("x: " + r + ", y: " + t);
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
    console.log("Mine " + p + " Location: " + rand1 + " , " + rand2 + ".");
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

var drawMine = function(x, y) {
  fill(0, 0, 0);
  line(cellSize / 2 + (cellSize * x), cellSize / 2 + (cellSize * y) - (cellSize / 2.5), cellSize / 2 + (cellSize * x), cellSize / 2 + (cellSize * y) + (cellSize / 2.5));
  line(cellSize / 2 + (cellSize * x) - (cellSize / 2.5), cellSize / 2 + (cellSize * y), cellSize / 2 + (cellSize * x) + (cellSize / 2.5), cellSize / 2 + (cellSize * y));
  ellipse(cellSize / 2 + (cellSize * x), cellSize / 2 + (cellSize * y), cellSize - 10, cellSize - 10);
  fill(0, 0, 100);
  ellipse(cellSize / 2 + (cellSize * x) - 3, cellSize / 2 + (cellSize * y) - 3, 3, 3);
};

var drawFlag = function(x, y) {
  strokeWeight(3);
  line(cellSize / 2 + (cellSize * x), cellSize / 2 + (cellSize * y) - (cellSize / 2.5), cellSize / 2 + (cellSize * x), cellSize / 2 + (cellSize * y) + (cellSize / 2.5));
  strokeWeight(1);
  fill(0, 100, 100);
  triangle(cellSize / 2 + (cellSize * x), cellSize / 2 + (cellSize * y) - (cellSize / 2.5), cellSize / 2 + (cellSize * x), cellSize / 2 + (cellSize * y), cellSize / 2 + (cellSize * x) + (cellSize / 4), cellSize / 2 + (cellSize * y) - (cellSize / 4));

};

var keyPressed = function() {
  if (key == 'f' || key == 'F') {
    var xpos = Math.floor(mouseX / cellSize);
    var ypos = Math.floor(mouseY / cellSize);
    println(xpos + " " + ypos);
    f = true;
    if(grid[xpos][ypos].flagged == false){
      grid[xpos][ypos].flagged = true;
    }
    else {
      grid[xpos][ypos].flagged = false;
    }
  }
};

var keyReleased = function() {
  if (key == 'f' || key == 'F') {
    f = false;
  }
};

var mousePressed = function() {
  var xpos = Math.floor(mouseX / cellSize);
  var ypos = Math.floor(mouseY / cellSize);
  
  println(xpos + " " + ypos);
  
  if (!f) {
    if (grid[xpos][ypos].flagged) {
      grid[xpos][ypos].reveal();
    }
    println("revealed");
  } else if (f) {
    if(!grid[xpos][ypos].flagged){
      grid[xpos][ypos].flagged = false;
    }
    println("flagthisshit");
  }
};